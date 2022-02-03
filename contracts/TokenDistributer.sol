// SPDX-License-Identifier: MIT
// TokenDistributer v0.1
// ERC721のNFT（membersCardAddress_）を持っているアドレスからclaimが呼ばれたときに
// ERC1155のNFT（nftAddress_、tokenId_）をそのアドレスに送る

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract TokenDistributer is Context, ERC1155Holder {
    IERC721 public _members;
    IERC1155 public _nft;
    uint256 public _tokenId;
    address public _owner;
    mapping(address => bool) private _claimed;

    constructor(address nftAddress_, uint256 tokenId_, address membersCardAddress_) {
        _owner = _msgSender();
        _nft = IERC1155(nftAddress_);
        _members = IERC721(membersCardAddress_);
        _tokenId = tokenId_;
    }

    function isClaimable(address owner_) external view returns (bool){
        return _isClaimable(owner_);
    }

    function claim()  external {
        require(_isClaimable(_msgSender()),"Do not meet conditions to claim");
        _nft.safeTransferFrom( address(this), _msgSender(), _tokenId, 1, "");
        _claimed[_msgSender()]=true;
    }

    function setNftToDistribute(address nftAddress_, uint256 tokenId_)  external {
        require(
            _owner == _msgSender(),
            "Must have admin role to"
        );
        _nft = IERC1155(nftAddress_);
        _tokenId = tokenId_;
    }

    function getStock() external view returns (uint256){
        return (_nft.balanceOf(address(this), _tokenId));
    }

    function setMembersCardAddress(address membersCardAddress_)  external {
        require(
            _owner == _msgSender(),
            "Must have admin role"
        );
        _members = IERC721(membersCardAddress_);
    }
        
    function byebye(address payable owner_) external{
        require(
            _owner == _msgSender(),
            "Must have admin role"
        );
        // Send stock tokens back to owner address before selfdestructing
        _nft.safeTransferFrom( address(this), _msgSender(), _tokenId, _nft.balanceOf(address(this), _tokenId), "");
        selfdestruct(owner_);
    }

    function _isClaimable(address user_) private view returns (bool){ 
        return (
            (_members.balanceOf(user_)>0) &&
            (_claimed[user_]==false) &&
            (_nft.balanceOf(user_, _tokenId)==0) &&
            (_nft.balanceOf(address(this), _tokenId)>0)
            );
    }


}