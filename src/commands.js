const { join } = require("path");
const { program } = require("commander");

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
  .option("--hasNetworks", "(optional) Skip json with empty networks")
  .option("--onlyAbi", "(optional) Export abi only")
  .option(
    "--onlyAddress",
    "(optional) If '--networkId' is specified, the address will be exported, otherwise the networks will be exported"
  )
  .parse(process.argv);

const options = program.opts();
const currentDir = process.cwd();

if (options.onlyAbi && options.onlyAddress) {
  throw new Error(
    "Cannot use '--onlyAbi' and '--onlyAddress' at the same time"
  );
}

module.exports = {
  inputDir: join(currentDir, options.inputDir ?? "contracts"),
  outputDir: join(currentDir, options.outputDir ?? "src/constants/contracts"),
  networkId: options.networkId,
  hasNetworks: options.hasNetworks,
  onlyAbi: options.onlyAbi,
  onlyAddress: options.onlyAddress,
};
