"use strict";
const path = require("path");
const { writeFileSync, readdirSync } = require("fs");

const { formatAbi, formatNetworks } = require("../utils/format");

module.exports = (options) => {
  const { inputDir, outputDir, hasNetworks, onlyAbi, onlyAddress, networkId } =
    options;
  const dir = readdirSync(inputDir);

  for (let i = 0; i < dir.length; i++) {
    if (path.extname(dir[i]) !== ".json") continue;

    const jsonData = require(`${inputDir}/${dir[i]}`);
    const networksId = Object.keys(jsonData.networks ?? {});

    if ((hasNetworks || onlyAddress) && networksId.length === 0) continue;
    if (networkId && !networksId.includes(networkId)) continue;

    const abi = formatAbi(jsonData);
    const networks = formatNetworks(jsonData.networks);
    const basename = path.basename(dir[i], ".json");
    const outputPath = `${outputDir}/${basename}.ts`;
    let data = {};

    if (onlyAbi) {
      data.abi = abi;
    } else if (onlyAddress) {
      if (networkId) {
        data.address = networks[networkId].address;
      } else {
        data.networks = networks;
      }
    } else if (networkId) {
      data = { address: networks[networkId].address, abi };
    } else {
      data.abi = abi;

      if (networksId.length === 1) {
        data.address = networks[networksId[0]].address;
      } else {
        data.networks = networks;
      }
    }

    writeFileSync(
      outputPath,
      `export default ${JSON.stringify(data, null, "\t")} as const;`
    );
  }
};
