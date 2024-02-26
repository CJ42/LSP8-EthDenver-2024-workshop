# LUKSO LSP8 🎨 - Proof of Attendance NFT Workshop - Eth Denver 2024 🦄

![NFTs icons list image](./scripts/img/nfts-images.jpeg)

## Pre-requisite

We will deploying our contract using Remix an the LUKSO Browser Extension.

1. [Install the LUKSO Browser Extension](https://docs.lukso.tech/install-up-browser-extension/).
2. Create a Universal Profile on Testnet.
3. Activate the LUKSO Browser Extension in your browser, and **:warning: make sure you have de-activated Metamask.**
4. Open the smart contract in [Remix](https://remix.ethereum.org/#url=https://github.com/CJ42/LSP8-EthDenver-2024-workshop/blob/main/contracts/LUKSOAttendanceNFT.sol)

You are all set and ready!

## Setup

It is recommended to open the Solidity contract for the workshop directly on Remix using the link below. This will save you the hassle of 1) installing the dependencies, 2) building the artifacts, and 3) connect the repository to Remix, and do all the job for you while you can enjoy a cup of coffee! 😃 ☕️

[⚒️ 1. Open in Remix](https://remix.ethereum.org/#url=https://github.com/CJ42/LSP8-EthDenver-2024-workshop/blob/main/contracts/LUKSOAttendanceNFT.sol)

[🎨 2. Pick some Metadata for your NFT (`VerifiableURI` field)](./scripts/README.md)

[🖥️ 3. Visit the dApp UI for this workshop](https://lsp8-eth-denver-workshop-ui.vercel.app/)

---

## Create the basis of the contract

Create the contract and call it `MyLUKSOPOAP`.

We will then inherit from LSP8 to implement the basic functionalities.

The contract takes different parameters on deployment. To start, we will write them inlined in the inheritance declaration.

---

```solidity
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import { LSP8IdentifiableDigitalAsset } from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

contract MyLUKSOPoap is
  LSP8IdentifiableDigitalAsset(
    "My LUKSO POAP",
    "LYXPOAP",
    msg.sender, // deployer of the contract is the owner
    1,
    2
  )
{}
```

We will then import the constants from the `@lukso/lsp-smart-contracts` package for more meaningful values.

```solidity
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

// modules
import { LSP8IdentifiableDigitalAsset } from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

// constants
import { _LSP4_TOKEN_TYPE_NFT } from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import { _LSP8_TOKENID_FORMAT_ADDRESS } from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";

contract MyLUKSOPoap is
  LSP8IdentifiableDigitalAsset(
    "My LUKSO POAP",
    "LYXPOAP",
    msg.sender, // deployer of the contract is the owner
    _LSP4_TOKEN_TYPE_NFT, // each token on the contract represent an NFT
    _LSP8_TOKENID_FORMAT_ADDRESS // each tokenId will be represented by the address of the user that claimed the POAP
  )
{}
```

## Deployment and setting yourself as creator.

We will setup 2 things when we deploy our POAP here:

1. The metadata of the POAP, this includes images, etc... So that it can be visible on UI interfaces like _wallet.universalprofile.cloud_ or the LUKSO blockscout explorer.

2. The LSP4Creators[] list and its associated map, so that we can set ourselves as the creator and get it verified as LSP12 Issued Assets.

I have uploaded some sample metadata on ipfs so tht you can retrieve them and you don't have to do it yourself. Pick from the list below.

- poap code:
  - icon image: `QmR1kiBSKecNCU7TuBXuDCHxvujfYV4rcEXZMmDVWa4Xo9`
  - background image: `QmVcEqknTxp9aLXQvByvxrrFtgpR2UtvXvJzp2nQDLkDgj`
  - metadata: `QmcCqW4JBsRJuDJHzLMzGzxZZxeEMCqXqNhWBimzfqbgta`

If you don't have a UP yet and haven't installed the UP Browser Extnsion yet, you can use my UP address below as a creator for example purpose and see how it will display as a LSP4Creator.

```solidity
/// @notice Replace the address below with your UP address here to define yourself as the creator.
/// @dev For people who do not have a UP, simply leave this address for demo purpose (it is my UP address).
address constant WORKSHOP_CREATOR = 0x9fc7e5095A054dfA3c6b237E0e5d686638394248;
```

## Setup the basics functionalities

We will now setup the following core logic to make our LSP8 an NFT that proves you attended this workshop. To do so, we will set the following functionalities:

- enable users to claim their POAP themselves.
- make the POAP of each user non-transferable.

We will represent the POAP claimed by each user as a unique tokenId constructed as the hash of the abi-encoded address of the user that claimed (`bytes32`, left padded with `00`).

```solidity
function claim() external {
  bytes32 tokenId = bytes32(uint256(uint160(msg.sender)));
  _mint(msg.sender, tokenId, true, "");
}
```

We will then overwrite the internal `_transfer` function to make each POAP non-transferrable and tied to the user once it has been claimed.

```solidity
function _transfer(
  address /* from */,
  address /* to */,
  bytes32 /* tokenId */,
  bool /* force */,
  bytes memory /* data */
) internal pure override {
  revert("This NFT is non-transferrable");
}
```

## Deploying our LSP8 contract

Go to Remix IDE and ensure you have deactivated Metamask.

We will deploy the LSP8 contract.

Select the Metadata you want by taking one of the [`VerifiableURI` from the icon you like](./scripts/README.md), and replace the value under the `constant VERIFIABLE_URI` field in the Solidity code.

```solidity
/// @notice Replace with the Verifiable URI for the design of your Proof of Attendance NFT.
/// @dev Or leave it as it is to keep the default one from `./scripts/img/5-nft-icon-minimal.webp`.
bytes constant VERIFIABLE_URI = hex"00006f357c6a0020b48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d697066733a2f2f516d656f477138483675394a454165366d344d684e356a6a536d6f4e4a3832795a4d443344516b76784138584b65";
```

> **Note:** this value is already pre-filled for you with the minimal NFT icon. But feel free to replace it with the image you like.

## Verifying our deployed POAP contract

You can then verify the deployed contract on LUKSO Testnet by running the following command:

```bash
npx hardhat verify <lsp8-poap-contract-address> --constructor-args ./scripts/constructor-args.js --network luksoTestnet
```

## Expanding, moving forward

You can then instead inherit the contract from `LSP8IdentifiableDigitalAssetInitAbstract` and implement an `initialize(...)` function. You can then deploy this base implementation contract once and have users of your application deploy their own as proxies. This way, you can implement the proxy pattern which will make it cheaper for your user to deploy their own POAP contract.
