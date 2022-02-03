const { expect } = require("chai");
const { ethers } = require("hardhat");

const getAccount = async () => {
  const accounts = await hre.ethers.getSigners();
  return accounts;
};

describe("Test for TokenMarket", function () {
  it("TokenMarket", async function () {
    const accounts = await getAccount();

    /*
     * Deploy and mint ERC20 and ERC1155
     */
    const JPYC = await ethers.getContractFactory("JPYC");
    const jpyt = await JPYC.deploy();
    await jpyt.deployed();
    let tx = await jpyt.transfer(accounts[1].address, 1000);
    await tx.wait();
    expect(await jpyt.balanceOf(accounts[1].address)).to.equal(1000);

    const T1155 = await ethers.getContractFactory("T1155");
    const t1155 = await T1155.deploy();
    await t1155.deployed();

    expect(await t1155.uri(0)).to.equal("https://nuko.sh/0.json");

    /*
     * Deploy TokenMarket
     */
    const TokenMarketV1 = await ethers.getContractFactory("TokenMarketV1");
    const market = await TokenMarketV1.deploy(jpyt.address);
    await market.deployed();

    await t1155.setApprovalForAll(market.address, true);
    expect(await t1155.isApprovedForAll(accounts[0].address, market.address)).to
      .be.true;
    tx = await jpyt.connect(accounts[1]).approve(market.address, 10000);
    await tx.wait();
    expect(await jpyt.allowance(accounts[1].address, market.address)).to.equal(
      10000
    );

    /*
     * Sell and Buy
     */
    await market.sell(t1155.address, 0, 10, 2);

    console.log(
      "A[0] JPYC",
      parseInt(await jpyt.balanceOf(accounts[0].address)),
      "Balance of ERC1155: ",
      parseInt(await t1155.balanceOf(accounts[0].address, 0))
    );
    console.log(
      "  A[1] JPYC",
      parseInt(await jpyt.balanceOf(accounts[1].address)),
      "Balance of ERC1155: ",
      parseInt(await t1155.balanceOf(accounts[1].address, 0))
    );

    for (let i = 0; i < 2; i++) {
      await market
        .connect(accounts[1])
        .buy(t1155.address, 0, accounts[0].address);

      console.log(
        "A[0] JPYC",
        parseInt(await jpyt.balanceOf(accounts[0].address)),
        "Balance of ERC1155: ",
        parseInt(await t1155.balanceOf(accounts[0].address, 0))
      );
      console.log(
        "  A[1] JPYC",
        parseInt(await jpyt.balanceOf(accounts[1].address)),
        "Balance of ERC1155: ",
        parseInt(await t1155.balanceOf(accounts[1].address, 0))
      );
    }
  });
});
