"use strict";

const { argv, cwd, exit } = require("node:process");
const {
  rmSync,
  existsSync,
  readdirSync,
  writeFileSync,
  mkdirSync,
} = require("node:fs");
const { join, extname } = require("node:path");
const { error, log } = require("node:console");
const { Command } = require("commander");
const { parseAbi, formatAbi } = require("abitype");
const { getAddress } = require("viem");

const packageJson = require("./package.json");

function init() {
  const program = new Command(packageJson.name)
    .description("Create typescript file from contract json.")
    .version(packageJson.version)
    .option("-r, --read-dir <path>", "read directory", "./contracts")
    .option(
      "-w, --write-dir <path>",
      "write directory",
      "./src/constants/contracts"
    )
    .option(
      "-n, --network-id <number>",
      "network ID [none] \n" + "read only files with this network ID"
    )
    .option("--networks", 'only read files where "networks" is not empty')
    .parse(argv);

  const options = program.opts();
  const originalDirectory = cwd();

  const readDirPath = join(originalDirectory, options.readDir),
    writeDirPath = join(originalDirectory, options.writeDir);

  if (!existsSync(readDirPath)) {
    error("Read directory does not exist");
    exit(1);
  }

  if (existsSync(writeDirPath)) {
    rmSync(writeDirPath, { recursive: true });
    mkdirSync(writeDirPath, { recursive: true });
  } else {
    mkdirSync(writeDirPath, { recursive: true });
  }

  const fileNames = readdirSync(readDirPath);
  log("\x1b[32mWrite file:\x1b[0m");
  for (let i = 0; i < fileNames.length; i++) {
    if (extname(fileNames[i]) !== ".json") continue;

    const jsonData = require(join(readDirPath, fileNames[i]));
    const sourceAbi = jsonData.abi ?? [];
    const sourceNetworks = jsonData.networks ?? {};
    const networksId = Object.keys(sourceNetworks);

    if (options.networks && networksId.length === 0) continue;
    if (options.networkId && !networksId.includes(options.networkId)) continue;

    const writePath = join(writeDirPath, fileNames[i].replace(".json", ".ts"));
    const abi = parseAbi(formatAbi(sourceAbi));
    const networks = networksId.reduce((prev, cur) => {
      prev[cur] = { address: getAddress(sourceNetworks[cur].address) };
      return prev;
    }, {});

    let data = { networks, abi };

    if (options.networkId) {
      data = { address: networks[options.networkId].address, abi };
    } else if (networksId.length === 1) {
      data = { address: networks[networksId[0]].address, abi };
    } else if (networksId.length === 0) {
      data = { abi };
    }

    writeFileSync(
      writePath,
      `export default ${JSON.stringify(data, null, "\t")} as const;`
    );
    log("  ", join(options.writeDir, fileNames[i].replace(".json", ".ts")));
  }

  log("\x1b[32mSuccess!\x1b[0m");
}

module.exports = { init };
