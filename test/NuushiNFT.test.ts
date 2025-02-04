import { expect } from "chai";
import hre from "hardhat";
import { Signer } from "ethers";
import { NuushiNFT } from "../typechain-types";

describe("NuushiNFT", function () {
  let NuushiNFT: NuushiNFT;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    const NuushiNFTFactory = await hre.ethers.getContractFactory("NuushiNFT");
    NuushiNFT = await NuushiNFTFactory.deploy("https://example.com/");
  });

  it("Should deploy the contract", async function () {
    expect(await NuushiNFT.name()).to.equal("Introducing NUU$HI");
    expect(await NuushiNFT.symbol()).to.equal("NUUSHI");
  });

  it("Should mint NFTs within the sale period", async function () {
    await hre.ethers.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await NuushiNFT.connect(addr1).mint(1, {
      value: hre.ethers.parseEther("0.000777"),
    });
    expect(await NuushiNFT.totalSupply()).to.equal(1);
  });

  it("Should not mint NFTs after the sale period", async function () {
    await hre.ethers.provider.send("evm_increaseTime", [
      2 * 7 * 24 * 60 * 60 + 1,
    ]); // Increase time by 2 weeks + 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await expect(
      NuushiNFT.connect(addr1).mint(1, {
        value: hre.ethers.parseEther("0.000777"),
      })
    ).to.be.revertedWith("Sale has ended");
  });

  it("Should not mint NFTs exceeding the maximum supply", async function () {
    await hre.ethers.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await expect(
      NuushiNFT.connect(addr1).mint(1000000, {
        value: hre.ethers.parseEther("777"),
      })
    ).to.be.revertedWith("Exceeds MAX_SUPPLY");
  });

  it("Should not mint NFTs with insufficient ETH", async function () {
    await hre.ethers.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await expect(
      NuushiNFT.connect(addr1).mint(1, {
        value: hre.ethers.parseEther("0.0001"),
      })
    ).to.be.revertedWith("Insufficient ETH sent");
  });

  it("Should allow the owner to set the base URI", async function () {
    await NuushiNFT.connect(owner).setBaseURI("https://newexample.com/");
    await hre.ethers.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await NuushiNFT.connect(addr1).mint(1, {
      value: hre.ethers.parseEther("0.000777"),
    });
    expect(await NuushiNFT.tokenURI(1)).to.equal("https://newexample.com/");
  });

  it("Should allow the owner to withdraw the contract balance", async function () {
    await hre.ethers.provider.send("evm_increaseTime", [1]); // Increase time by 1 second
    await hre.ethers.provider.send("evm_mine", []);
    await NuushiNFT.connect(addr1).mint(1, {
      value: hre.ethers.parseEther("0.000777"),
    });
    const initialBalance = await hre.ethers.provider.getBalance(
      await owner.getAddress()
    );
    await NuushiNFT.connect(owner).withdraw();
    const finalBalance = await hre.ethers.provider.getBalance(
      await owner.getAddress()
    );
    expect(finalBalance).to.be.above(initialBalance);
  });
});
