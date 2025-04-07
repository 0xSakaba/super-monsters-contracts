import { expect } from "chai";
import hre from "hardhat";
import { Signer } from "ethers";
import { SuperMonsters } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("SuperMonsters", function () {
  let SuperMonsters: SuperMonsters;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    const SuperMonstersFactory = await hre.ethers.getContractFactory(
      "SuperMonsters"
    );
    SuperMonsters = await SuperMonstersFactory.deploy("https://example.com/");
  });

  it("Should deploy the contract", async function () {
    expect(await SuperMonsters.name()).to.equal("Super Monsters");
    expect(await SuperMonsters.symbol()).to.equal("SMT");
  });

  it("Should not allow minting before the sale period", async function () {
    const startTimestamp = 1744070400;

    expect(
      (await time.latest()) < startTimestamp,
      "Config incorrect, the block time is too high"
    ).to.be.true;

    await expect(
      SuperMonsters.connect(addr1).mint(1, {
        value: hre.ethers.parseEther("0.0021"),
      })
    ).to.be.revertedWith("Sale has not started");
  });

  it("Should mint NFTs within the sale period", async function () {
    const newTimestamp = 1744070400;
    await hre.ethers.provider.send("evm_setNextBlockTimestamp", [newTimestamp]);
    await hre.ethers.provider.send("evm_mine", []);
    await SuperMonsters.connect(addr1).mint(1, {
      value: hre.ethers.parseEther("0.0021"),
    });
    expect(await SuperMonsters.totalSupply()).to.equal(1);
  });

  it("Should not mint NFTs exceeding the maximum supply", async function () {
    await expect(
      SuperMonsters.connect(addr1).mint(100_001, {
        value: hre.ethers.parseEther("210.0021"),
      })
    ).to.be.revertedWith("Exceeds MAX_SUPPLY");
  });

  it("Should not mint NFTs with insufficient ETH", async function () {
    await expect(
      SuperMonsters.connect(addr1).mint(1, {
        value: hre.ethers.parseEther("0.0001"),
      })
    ).to.be.revertedWith("Insufficient ETH sent");
  });

  it("Should allow the owner to set the base URI", async function () {
    await SuperMonsters.connect(owner).setBaseURI("https://newexample.com/");

    await SuperMonsters.connect(addr1).mint(1, {
      value: hre.ethers.parseEther("0.0021"),
    });
    expect(await SuperMonsters.tokenURI(1)).to.equal("https://newexample.com/");
  });

  it("Should allow the owner to withdraw the contract balance", async function () {
    await SuperMonsters.connect(addr1).mint(1, {
      value: hre.ethers.parseEther("0.0021"),
    });
    const initialBalance = await hre.ethers.provider.getBalance(
      await owner.getAddress()
    );
    await SuperMonsters.connect(owner).withdraw();
    const finalBalance = await hre.ethers.provider.getBalance(
      await owner.getAddress()
    );
    expect(finalBalance).to.be.above(initialBalance);
  });

  it("Should not mint NFTs after the sale period", async function () {
    const newTimestamp = 1744243201;

    await hre.ethers.provider.send("evm_setNextBlockTimestamp", [newTimestamp]);
    await hre.ethers.provider.send("evm_mine", []);

    await expect(
      SuperMonsters.connect(addr1).mint(1, {
        value: hre.ethers.parseEther("0.0021"),
      })
    ).to.be.revertedWith("Sale has ended");
  });
});
