#!/usr/bin/env node

"use strict";

const { exit, versions } = require("node:process");
const { error } = require("node:console");

const currentNodeVersion = versions.node;
const semver = currentNodeVersion.split(".");
const major = semver[0];

if (major < 14) {
  error(
    "You are running Node " +
      currentNodeVersion +
      ".\n" +
      "abi-to-ts requires Node 14 or higher. \n" +
      "Please update your version of Node."
  );
  exit(1);
}

const { init } = require("./abiToTs");

init();
