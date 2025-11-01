#!/usr/bin/env node
import fs from "node:fs";
import { bundle, transform } from "lightningcss";
import { PurgeCSS } from "purgecss";

import type { CustomProperty, Declaration, FontFaceRule } from "lightningcss";

const index = "../index.html";

async function main() {
  const { code: bundled } = bundle({
    filename: "input.css",
  });

  const [{ css: purged }] = await new PurgeCSS().purge({
    content: ["../index.html"],
    css: [{ raw: new TextDecoder().decode(bundled) }],
    fontFace: true,
    keyframes: true,
    variables: true,
  });

  const { code: readable } = transform({
    filename: "",
    code: new TextEncoder().encode(purged),
    minify: false,
    visitor: {
      Rule: {
        "font-face": (rule) => font(rule.value),
      },
      Declaration: {
        custom,
        position,
      },
    },
  });
  fs.writeFileSync("readable.css", readable);

  const { code: minified } = transform({
    filename: "",
    code: readable,
    minify: true,
  });
  let html = fs.readFileSync(index, "utf8");
  html = html.replace(/<style>.*?<\/style>/, `<style>${minified}</style>`);
  fs.writeFileSync(index, html);
}

// delete any float: center
const custom = (rule: CustomProperty) => {
  if (
    rule.name === "float" &&
    rule.value[0].type === "token" &&
    rule.value[0].value.type === "ident" &&
    rule.value[0].value.value === "center"
  ) return [];
};

// delete any position: center
const position = (declaration: Declaration) => {
  if (
    declaration.property === "unparsed" &&
    declaration.value.propertyId.property === "position" &&
    declaration.value.value[0].type === "token" &&
    declaration.value.value[0].value.type === "ident" &&
    declaration.value.value[0].value.value === "center"
  ) return [];
};

const font = (rule: FontFaceRule) => {
  const properties = rule.properties;
  const url = properties
    .find((i) => i.type == "source")
    ?.value
    .find((i) => i.type === "url")
    ?.value.url.url || "";
  if (url.startsWith("../fonts/")) return [];
};

await main();
