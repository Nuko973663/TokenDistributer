// SPDX-License-Identifier: MIT
// TokenDistributerMulti v0.1
// 複数トークン対応版
// ERC721のNFT（membersCardAddress_）を持っているアドレスからclaimが呼ばれたときに
// ERC1155のNFT（nftAddress_、tokenId_）をそのアドレスに送る

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract TokenMarketV1 is Context {
    enum TokenStandard { ERC721, ERC1155 }
    struct Token {
        address tokenAddress;
        uint256 tokenId;
        TokenStandard tokenType;
        address tokenOwner;
        uint256 price;
        uint256 stock;
    }
    // Enumerable Map等を使う
    mapping( address => mapping( uint256 => mapping( address => Token) )) private _stock;
    address private _owner;
    address private _addressCoin;
    IERC20 private _coin;

    constructor(address addressCoin_) {
        _owner = _msgSender();
        _coin = IERC20(addressCoin_);
    }

    function buy(address tokenAddress_, uint256 tokenId_, address owner_) external {
        Token memory token = _stock[tokenAddress_][tokenId_][owner_];
        uint256 stock = token.stock;
        require(stock > 0, "Out of stock");
        if(token.tokenType == TokenStandard.ERC1155){
            IERC1155 nft = IERC1155(tokenAddress_);
            if(_coin.transferFrom( _msgSender(), token.tokenOwner, token.price)){
                nft.safeTransferFrom( token.tokenOwner, _msgSender(), tokenId_, 1, "");
                _stock[tokenAddress_][tokenId_][owner_].stock = stock - 1;
            }
        }else{
            IERC721 nft = IERC721(tokenAddress_);
            if(_coin.transferFrom( _msgSender(), token.tokenOwner, token.price)){
                nft.safeTransferFrom( token.tokenOwner, _msgSender(), tokenId_);
                _stock[tokenAddress_][tokenId_][owner_].stock = stock - 1;
            }
        }

        emit Sold(tokenAddress_, tokenId_, owner_);
    }

    function sell(address tokenAddress_, uint256 tokenId_, uint256 price_, uint256 count_) external {
        Token memory token;
        token.tokenAddress = tokenAddress_;
        token.tokenId = tokenId_;
        token.tokenOwner = _msgSender();
        token.price = price_;
        token.tokenType = (count_ == 0)?TokenStandard.ERC721:TokenStandard.ERC1155;
        token.stock = (count_ == 0)?1:count_;
        _stock[tokenAddress_][tokenId_][token.tokenOwner] = token;

        emit Sell( tokenAddress_, tokenId_, price_, count_);
    }

    function getPrice(address tokenAddress_, uint256 tokenId_, address owner_) public view returns (uint256){
        return(_stock[tokenAddress_][tokenId_][owner_].price);
    }

    function getStock(address tokenAddress_, uint256 tokenId_, address owner_) public view returns (uint256){
        return(_stock[tokenAddress_][tokenId_][owner_].stock);
    }

    function getTokenStandard(address tokenAddress_, uint256 tokenId_, address owner_) public view returns (string memory){
        return(_stock[tokenAddress_][tokenId_][owner_].tokenType==TokenStandard.ERC721?"ERC721":"ERC1155");
    }

    event Sold(address indexed tokenAddress_, uint256 tokenId_, address indexed owner_);
    event Sell(address indexed tokenAddress_, uint256 tokenId_, uint256 price_, uint256 count_);
}