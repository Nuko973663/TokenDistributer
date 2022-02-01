# Token Distributer

ERC721 の NFT（membersCardAddress*）を持っているアドレスから claim が呼ばれたときに ERC1155 の NFT（nftAddress*、tokenId\_）をそのアドレスに送る

## 使い方

1. Token Distributer を Deploy
   ```
   TokenDistributer.deploy( addressNFTtoDistribute, tokenId, addressNftMembers );
   ```
2. TokenDistributer のコントラクトアドレスあてに ERC1155 の NFT を送付する
3. コントラクトアドレス addressNftMembers の ERC721 を保有するアドレスから claim()を呼ぶ

## 使用例

See [JPYC 1st anniversary AirDrop
for members of Unofficial Club JPYC
by Izuru_eth](https://nuko973663.github.io/UnofficialClubJPYCminter/1stanniversary.html) ([Source code](https://github.com/Nuko973663/UnofficialClubJPYCminter))

## 注意点

現時点のコードでは byebye 関数を呼ぶことで selfdestruct することができますが、コントラクトが保有する NFT を戻す処理をしていません。そのうち書きます。

メンバーズカードを ERC721 ではなく ERC1155 にしたい場合は下のコードのように編集するとよいでしょう。これもそのうち書きます。

```
IERC1155 public _members;
uint256 public _tokenIdOfMembersCard;

constructor(address nftAddress_, uint256 tokenId_, address membersCardAddress_, uint256 tokenIdOfMembersCard_) {
    _owner = _msgSender();
    _nft = IERC1155(nftAddress_);
    _members = IERC1155(membersCardAddress_);
    _tokenIdOfMembersCard = tokenIdOfMembersCard_;


    function _isClaimable(address owner_) private view returns (bool){
    return (
        (_members.balanceOf(owner_, _tokenIdOfMembersCard)>0) &&
        (_claimed[owner_]==false) &&
        (_nft.balanceOf(owner_, _tokenId)==0) &&
        (_nft.balanceOf(address(this), _tokenId)>0)
        );
}
```

## Author

Nuko (@nuko973663)
