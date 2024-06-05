"use strict";

const { getAddress } = require("viem");
const { parseAbi, formatAbi: formatAbiT } = require("abitype");

function formatNetworks(networks) {
  return Object.keys(networks ?? {}).reduce((prev, cur) => {
    prev[cur] = { address: getAddress(networks[cur].address) };

    return prev;
  }, {});
}

function formatAbi(json) {
  return parseAbi(formatAbiT(json.abi ?? []));
}

module.exports = { formatNetworks, formatAbi };
