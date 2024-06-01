#!/usr/bin/env node

"use strict";

const fs = require("fs");

const options = require("./src/commands");
const abiToTs = require("./src/abiToTs");
const { mkdir, rmdir } = require("./utils/dir");

try {
  fs.readdirSync(options.outputDir);
  rmdir(options.outputDir);
  throw new Error();
} catch (error) {
  mkdir(options.outputDir);
}

abiToTs(options);

console.log("json to ts success!");
