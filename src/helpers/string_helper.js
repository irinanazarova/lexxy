export function dasherize(value) {
  return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`)
}

// Curated set of TLDs we treat as bare-domain links (no scheme). Deliberately
// narrow: it leaves out code/file-ish suffixes (rb, ru, js, py, go, rs, sh, ex)
// so tokens like "Node.js" or "config.ru" stay plain text.
const AUTOLINK_TLDS = [
  "com", "org", "net", "io", "dev", "app", "co", "ai", "info", "biz",
  "xyz", "tech", "cloud", "gov", "edu", "me", "tv", "blog", "site",
  "online", "store", "page", "wiki", "news",
  "uk", "de", "fr", "nl", "eu", "us", "ca", "au", "jp", "in", "br",
  "es", "it", "se", "no", "fi", "dk", "ch", "at"
]

const BARE_DOMAIN = `(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:${AUTOLINK_TLDS.join("|")})(?![a-z0-9-])`

// A whole string that is a linkable URL: explicit scheme, www. host, or a bare
// host whose TLD is curated. Used for paste.
const AUTOLINKABLE_URL = new RegExp(`^(?:[a-z0-9]+://|www\\.)[^\\s]+$|^${BARE_DOMAIN}(?:[/?#][^\\s]*)?$`, "i")

// A URL found anywhere in a run of text, for as-you-type autolinking.
export const AUTOLINK_URL_REGEXP = new RegExp(`https?://[^\\s]+|www\\.[^\\s]+|${BARE_DOMAIN}(?:[/?#][^\\s]*)?`, "i")

export function isAutolinkableURL(string) {
  return AUTOLINKABLE_URL.test(string)
}

// Guesses a scheme for a schemeless URL so a bare host like
// "ruby.evilmartians.com" becomes "https://ruby.evilmartians.com". Leaves
// existing schemes, protocol-relative URLs, mailto:/tel:, paths and anchors alone.
export function normalizeUrl(string) {
  const trimmed = string.trim()
  if (!trimmed) return trimmed
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed
  if (/^[/#?]/.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function isPath(string) {
  return /^\/.*$/.test(string)
}

export function normalizeFilteredText(string) {
  return string
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove diacritics
}

export function filterMatchPosition(text, potentialMatch) {
  const normalizedText = normalizeFilteredText(text)
  const normalizedMatch = normalizeFilteredText(potentialMatch)

  if (!normalizedMatch) return 0

  const match = normalizedText.match(new RegExp(`(?<![\\p{L}\\p{N}])${escapeForRegExp(normalizedMatch)}`, "u"))
  return match ? match.index : -1
}

export function upcaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function escapeForRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Parses a value that may arrive as a boolean or as a string (e.g. from DOM
// getAttribute) into a proper boolean. Ensures "false" doesn't evaluate as truthy.
export function parseBoolean(value) {
  if (typeof value === "string") return value === "true"
  return Boolean(value)
}
