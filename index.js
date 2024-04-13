#!/usr/bin/env node

"use strict";

const fs = require("fs");
const { join, extname } = require("path");

const { program } = require("commander");
const { mkdir, rmdir } = require("./dir");

program
  .name("abi-to-ts")
  .option(
    "-i, --input-dir <path>",
    "(optional) Entry directory, defaults to ./contracts"
  )
  .option(
    "-o, --output-dir <path>",
    "(optional) Output directory, defaults to ./src/constants/contracts"
  )
  .option("--networkId <networkId>", "(optional) Specify network ID")
  .option("--only-abi", "(optional) Export abi only")
  .option(
    "--only-address",
    "(optional) If '--networkId' is specified, the address will be exported, otherwise the networks will be exported"
  )
  .parse(process.argv);

const options = program.opts();
const currentDir = process.cwd();

if (options.onlyAbi && options.onlyAddress) {
  throw new Error(
    "Cannot use '--only-abi' and '--only-address' at the same time"
  );
}

let inputDir = `${join(currentDir, "contracts")}`,
  outputDir = `${join(currentDir, "src/constants/contracts")}`,
  networkId;

if (options.inputDir) {
  inputDir = `${join(currentDir, options.inputDir)}`;
}

if (options.outputDir) {
  outputDir = `${join(currentDir, options.outputDir)}`;
}

if (options.networkId) {
  networkId = options.networkId;
}

try {
  fs.readdirSync(outputDir);
  rmdir(outputDir);
  throw new Error();
} catch (error) {
  mkdir(outputDir);
}

const dir = fs.readdirSync(inputDir);

for (let i = 0; i < dir.length; i++) {
  if (extname(dir[i]) !== ".json") continue;

  const jsonData = require(`${inputDir}/${dir[i]}`);
  const jsonName = dir[i].slice(0, dir[i].indexOf("."));
  const networksId = Object.keys(jsonData.networks);

  const abi = formatAbi(jsonData);

  if (options.onlyAbi) {
    fs.writeFileSync(
      `${outputDir}/${jsonName}.ts`,
      `export default ${JSON.stringify(abi, null, "\t")} as const;`
    );
    continue;
  }

  if (networksId.length === 0) continue;

  const networks = formatNetworks(jsonData.networks);

  if (options.onlyAddress) {
    if (!options.networkId) {
      fs.writeFileSync(
        `${outputDir}/${jsonName}.ts`,
        `export default ${JSON.stringify(networks, null, "\t")} as const;`
      );
    } else if (networks[options.networkId]) {
      fs.writeFileSync(
        `${outputDir}/${jsonName}.ts`,
        `export default '${networks[options.networkId].address}';`
      );
    }

    continue;
  }

  if (!options.networkId) {
    fs.writeFileSync(
      `${outputDir}/${jsonName}.ts`,
      `export const networks = ${JSON.stringify(
        networks,
        null,
        "\t"
      )} as const;\n\nexport const abi = ${JSON.stringify(
        abi,
        null,
        "\t"
      )} as const;`
    );
  } else if (networks[options.networkId]) {
    const address = networks[options.networkId].address;

    fs.writeFileSync(
      `${outputDir}/${jsonName}.ts`,
      `export default ${JSON.stringify({ address, abi }, null, "\t")} as const;`
    );
  }
}

function formatNetworks(networks) {
  return Object.keys(networks).reduce((prev, cur) => {
    prev[cur] = { address: networks[cur].address };

    return prev;
  }, {});
}

function formatAbi(json) {
  return json.abi.map((abiItem) => {
    if (abiItem.inputs) {
      for (let i = 0; i < abiItem.inputs.length; i++) {
        if (abiItem.inputs[i].internalType) {
          delete abiItem.inputs[i].internalType;
        }
      }
    }

    if (abiItem.outputs) {
      for (let i = 0; i < abiItem.outputs.length; i++) {
        if (abiItem.outputs[i].internalType) {
          delete abiItem.outputs[i].internalType;
        }
      }
    }

    return abiItem;
  });
}

console.log("json to ts success!");
