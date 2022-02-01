/*
 * TokenDistributer Deploy script
 */

const hre = require("hardhat");

let addressUnofficialClubJPYC = "0xE130471E1E1562457fce78F30F2954B083b07A52";
let addressNFTtoDistribute = "0x2953399124f0cbb46d2cbacd8a89cf0599974963";
let tokenId =
  "34355006534946191232878297026566121950334585784809893429063215830498843558088";

async function main() {
  // Get Contract of Members card
  const nftMembers = await hre.ethers.getContractAt(
    "FoCNftCert",
    addressUnofficialClubJPYC
  );

  // Deploy token Distributer
  const TokenDistributer = await ethers.getContractFactory("TokenDistributer");
  const td = await TokenDistributer.deploy(
    addressNFTtoDistribute,
    tokenId,
    nftMembers.address,
    { gasPrice: 50000000000 }
  );
  await td.deployed();

  console.log("Token Distributer deployed to", td.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
