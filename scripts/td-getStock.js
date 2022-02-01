/*
 * TokenDistributer Get Number of Stock script
 */

const hre = require("hardhat");
let addressTokenDistributer = "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

async function main() {
  const td = await hre.ethers.getContractAt(
    "TokenDistributer",
    addressTokenDistributer
  );

  console.log(await td.getStock());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
