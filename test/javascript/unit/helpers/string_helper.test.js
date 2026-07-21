import { expect, test } from "vitest"
import { AUTOLINK_URL_REGEXP, filterMatchPosition, isAutolinkableURL, normalizeUrl } from "src/helpers/string_helper"

test("matches a Cyrillic surname", () => {
  const name = "Андрій Ковальчук"
  expect(filterMatchPosition(name, "Ковальчук")).toBe(name.indexOf("Ковальчук"))
})

test("matches a Cyrillic first name", () => {
  expect(filterMatchPosition("Андрій Ковальчук", "Андрій")).toBe(0)
})

test("matches a Latin surname", () => {
  const name = "Jason Fried"
  expect(filterMatchPosition(name, "Fried")).toBe(name.indexOf("Fried"))
})

test("matches across a hyphenated name", () => {
  const name = "Jean-Pierre Dupont"
  expect(filterMatchPosition(name, "Pierre")).toBe(name.indexOf("Pierre"))
})

test("does not match mid-word", () => {
  expect(filterMatchPosition("Ковальчук", "вальчук")).toBe(-1)
  expect(filterMatchPosition("Fried", "ried")).toBe(-1)
})

test("returns 0 for an empty query", () => {
  expect(filterMatchPosition("Андрій Ковальчук", "")).toBe(0)
})

test("isAutolinkableURL matches schemes, www, and bare curated-TLD hosts", () => {
  expect(isAutolinkableURL("https://ruby.evilmartians.com")).toBe(true)
  expect(isAutolinkableURL("www.evilmartians.com")).toBe(true)
  expect(isAutolinkableURL("ruby.evilmartians.com")).toBe(true)
  expect(isAutolinkableURL("evilmartians.com/blog?x=1")).toBe(true)
})

test("isAutolinkableURL leaves code/file-ish tokens alone", () => {
  expect(isAutolinkableURL("Node.js")).toBe(false)
  expect(isAutolinkableURL("config.ru")).toBe(false)
  expect(isAutolinkableURL("file.py")).toBe(false)
  expect(isAutolinkableURL("v2.0")).toBe(false)
  expect(isAutolinkableURL("hello")).toBe(false)
})

test("normalizeUrl guesses https:// for schemeless hosts only", () => {
  expect(normalizeUrl("ruby.evilmartians.com")).toBe("https://ruby.evilmartians.com")
  expect(normalizeUrl("www.evilmartians.com")).toBe("https://www.evilmartians.com")
  expect(normalizeUrl("https://ruby.evilmartians.com")).toBe("https://ruby.evilmartians.com")
  expect(normalizeUrl("mailto:hi@evilmartians.com")).toBe("mailto:hi@evilmartians.com")
  expect(normalizeUrl("//cdn.example.com")).toBe("https://cdn.example.com")
  expect(normalizeUrl("/relative/path")).toBe("/relative/path")
})

test("AUTOLINK_URL_REGEXP finds a bare host inside a sentence", () => {
  expect("Based on ruby.evilmartians.com today".match(AUTOLINK_URL_REGEXP)[0]).toBe("ruby.evilmartians.com")
  expect("Uses Node.js today".match(AUTOLINK_URL_REGEXP)).toBe(null)
})
