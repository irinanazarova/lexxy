import { defineExtension } from "lexical"
import { createLinkMatcherWithRegExp, registerAutoLink } from "@lexical/link"
import LexxyExtension from "./lexxy_extension"
import { AUTOLINK_URL_REGEXP, normalizeUrl } from "../helpers/string_helper"

// Turns URLs into links as you type. The transform fires when a separator
// (space, newline, punctuation) follows the URL, so "ruby.evilmartians.com "
// links on space. Bare hosts (no scheme) match only for curated TLDs and get
// https:// guessed via normalizeUrl, so the visible text stays as typed while
// the href gets a scheme.
export class AutolinkExtension extends LexxyExtension {
  get enabled() {
    return this.editorElement.supportsRichText
  }

  get lexicalExtension() {
    return defineExtension({
      name: "lexxy/autolink",
      register: (editor) => registerAutoLink(editor, {
        matchers: [ createLinkMatcherWithRegExp(AUTOLINK_URL_REGEXP, normalizeUrl) ],
        changeHandlers: [],
        excludeParents: []
      })
    })
  }
}

export default AutolinkExtension
