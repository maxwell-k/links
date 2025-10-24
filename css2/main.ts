import fs from "node:fs";
import { bundle, transform } from "lightningcss";
import { PurgeCSS } from "purgecss";

import type { CustomProperty, Declaration } from "lightningcss";

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
  fs.writeFileSync("style.css", minified);
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

await main();
