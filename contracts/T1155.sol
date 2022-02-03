// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract T1155 is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenCounter;

    // わかりやすく数字を文字列で表している
    uint256 public constant TUNA = 0;
    uint256 public constant SALMON = 1;

    string baseMetadataURIPrefix;
    string baseMetadataURISuffix;

    // コントラクトデプロイ時に１度だけ呼ばれる
    constructor() ERC1155("") {
        baseMetadataURIPrefix = "https://nuko.sh/";
        baseMetadataURISuffix = ".json";

        _mint(msg.sender, TUNA, 100, "");
        _mint(msg.sender, SALMON, 10, "");
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return string(abi.encodePacked(
            baseMetadataURIPrefix,
            Strings.toString(_id),
            baseMetadataURISuffix
        ));
    }

    function mint(uint256 _tokenId, uint256 _amount) public { 
        _mint(msg.sender, _tokenId, _amount, "");
    }

    function mintBatch(uint256[] memory _tokenIds, uint256[] memory _amounts) public { 
        _mintBatch(msg.sender, _tokenIds, _amounts, "");
    }

    function setBaseMetadataURI(string memory _prefix, string memory _suffix) public { 
        baseMetadataURIPrefix = _prefix;
        baseMetadataURISuffix = _suffix;
    }
}