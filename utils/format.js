"use strict";

function formatNetworks(networks) {
  return Object.keys(networks ?? {}).reduce((prev, cur) => {
    prev[cur] = { address: networks[cur].address };

    return prev;
  }, {});
}

function formatAbi(json) {
  return (json.abi ?? []).map((abiItem) => {
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

module.exports = { formatNetworks, formatAbi };
