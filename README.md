# abi-to-ts

Regenerate the smart contract compiled json file into a ts file in order to prompt for ABI methods and parameter types.

**Note:** Known to work when using wagmi as a development tool.

## Installation

```bash
npm i -g abi-to-ts
# or
pnpm add -g abi-to-ts
# or
yarn global add abi-to-ts
```

## Usage

```sh
Usage: abi-to-ts [options]

Options:
  -i, --input-dir  <path> (optional) Entry directory, defaults to ./contracts
  -o, --output-dir <path> (optional) Output directory, defaults to ./src/constants/contracts
  --networkId <networkId> (optional) Specify network ID
  --only-abi              (optional) Export abi only
  --only-address          (optional) If '--networkId' is specified, the address will be exported, otherwise the networks will be exported
  -h, --help              display help for command
```
