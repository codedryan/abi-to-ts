# abi-to-ts

Create typescript file from contract json.

**Note:** Currently available for wagmi.

## Installation

```bash
npm install -g abi-to-ts
# or
pnpm add -g abi-to-ts
# or
yarn global add abi-to-ts
```

## Usage

```sh
Usage: abi-to-ts [options]

Create typescript file from contract json.

Options:
  -V, --version              output the version number
  -r, --read-dir <path>      read directory (default: "./contracts")
  -w, --write-dir <path>     write directory (default: "./src/constants/contracts")
  -n, --network-id <number>  network ID [none]
                             read only files with this network ID
  --networks                 only read files where "networks" is not empty
  -h, --help                 display help for command
```
