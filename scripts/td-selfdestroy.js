/*
 * TokenDistributer selfdestroy script
 */

const hre = require("hardhat");
let addressTokenDistributer = "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const td = await hre.ethers.getContractAt(
    "TokenDistributer",
    addressTokenDistributer
  );

  const approveTx = await td.byebye(owner.address);
  await approveTx.wait();
  console.log("destoried");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
