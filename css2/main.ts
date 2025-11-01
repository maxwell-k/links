import fs from "node:fs";
import { bundle, transform } from "lightningcss";
import { PurgeCSS } from "purgecss";

import type { CustomProperty, Declaration, FontFaceRule } from "lightningcss";

const ignored_font_faces = { family: "Open Sans", weights: [600, 800] };

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
  fs.writeFileSync("main.css", minified);
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
  const family = properties.find((i) => i.type === "font-family");
  if (!family?.value.includes(ignored_font_faces.family)) return;
  const weight = properties
    .find((i) => i.type === "font-weight")
    ?.value
    .find((i) => i.type === "absolute")
    ?.value;
  if (weight?.type !== "weight") return;
  if (ignored_font_faces.weights.includes(weight.value)) return [];
};

await main();
