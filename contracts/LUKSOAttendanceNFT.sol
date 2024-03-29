// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

// modules
import {
    LSP8IdentifiableDigitalAsset as LSP8
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

// libraries
import {
    LSP2Utils
} from "@lukso/lsp-smart-contracts/contracts/LSP2ERC725YJSONSchema/LSP2Utils.sol";

// constants
import {
    _INTERFACEID_LSP0
} from "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0Constants.sol";

import {
    _LSP4_TOKEN_TYPE_NFT,
    _LSP4_METADATA_KEY,
    _LSP4_METADATA_KEY,
    _LSP4_CREATORS_ARRAY_KEY,
    _LSP4_CREATORS_MAP_KEY_PREFIX
} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

import {
    _LSP8_TOKENID_FORMAT_UNIQUE_ID
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";

contract LUKSOAttendanceNFT is
    LSP8(
        "My LUKSO Attendance NFT", // Name
        "LYXLAN", // Symbol (Please find a better one, we are not talking about "Local Area Network"!
        msg.sender, // deployer of the contract is the owner
        _LSP4_TOKEN_TYPE_NFT, // each token on the contract represent an NFT
        _LSP8_TOKENID_FORMAT_UNIQUE_ID // each tokenId will be represented as a unique ID
    )
{
    using LSP2Utils for *;

    /// @notice Replace the address below with your UP address here to define yourself as the creator.
    /// @dev For people who do not have a UP, simply leave this address for demo purpose (it is my UP address).
    address constant PROOF_OF_ATTENDANCE_NFT_CREATOR =
        0xc2C200D3E2635BDF4F1fF607d215Ec97F0C122AE;

    /// @notice Replace with the Verifiable URI for the design of your Proof of Attendance NFT.
    /// @dev Or leave it as it is to keep the default one from `./scripts/img/5-nft-icon-minimal.webp`.
    bytes constant VERIFIABLE_URI =
        hex"00006f357c6a0020b48d38f93eaa084033fc5970bf96e559c33c4cdc07d889ab00b4d63f9590739d697066733a2f2f516d656f477138483675394a454165366d344d684e356a6a536d6f4e4a3832795a4d443344516b76784138584b65";

    constructor() {
        _setData(_LSP4_METADATA_KEY, VERIFIABLE_URI);

        // There is only one creator: yourself!

        // Set the LSP4 Creator Array length to 1
        _setData(
            _LSP4_CREATORS_ARRAY_KEY,
            abi.encodePacked(bytes16(uint128(1)))
        );

        // Set your UP address under the LSP4_CREATORS[] at index 0
        bytes32 lsp4CreatorArrayAtIndex = _LSP4_CREATORS_ARRAY_KEY
            .generateArrayElementKeyAtIndex(0);

        _setData(
            lsp4CreatorArrayAtIndex,
            abi.encodePacked(PROOF_OF_ATTENDANCE_NFT_CREATOR)
        );

        bytes32 lsp4CreatorMapKey = _LSP4_CREATORS_MAP_KEY_PREFIX
            .generateMappingKey(bytes20(PROOF_OF_ATTENDANCE_NFT_CREATOR));

        _setData(
            lsp4CreatorMapKey,
            abi.encodePacked(_INTERFACEID_LSP0, uint128(0))
        );
    }

    /// @dev The tokenId for the NFT of each user is constructed as the hash of the user address who claimed it.
    /// The hashed address is packed encoded (not zero left padded) so that we can easily re-calculate the tokenId
    /// by simply copy pasting the 20 bytes address in hashing tool like keccak256 online
    // https://emn178.github.io/online-tools/keccak_256.html
    function claim() external {
        bytes32 tokenId = keccak256(abi.encodePacked(msg.sender));
        _mint(msg.sender, tokenId, true, "");

        // set the same metadata for the tokenId than the LSP4Metadata
        bytes memory lsp4MetadataValue = _getData(_LSP4_METADATA_KEY);
        _setDataForTokenId(tokenId, _LSP4_METADATA_KEY, lsp4MetadataValue);
    }

    function _transfer(
        address /* from */,
        address /* to */,
        bytes32 /* tokenId */,
        bool /* force */,
        bytes memory /* data */
    ) internal pure override {
        revert("This NFT is non-transferrable");
    }
}
