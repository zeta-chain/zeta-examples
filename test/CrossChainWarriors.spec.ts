import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployCrossChainWarriors } from "../lib/CrossChainWarriors.helpers";
import { CrossChainWarriors } from "../typechain";

describe("CrossChainWarriors tests", () => {
  let crossChainWarriorsContract: CrossChainWarriors;
  let useEvenCrossChainWarriorsContract: CrossChainWarriors;
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let account1: SignerWithAddress;

  beforeEach(async () => {
    crossChainWarriorsContract = await deployCrossChainWarriors({
      customUseEven: false,
    });
    useEvenCrossChainWarriorsContract = await deployCrossChainWarriors({
      customUseEven: true,
    });

    accounts = await ethers.getSigners();
    [deployer, account1] = accounts;
  });

  describe("constructor", () => {
    it("Should set the tokenIds counter to 1 when useEven is false", async () => {
      expect(await crossChainWarriorsContract.tokenIds()).to.equal(1);
    });

    it("Should set the tokenIds counter to 2 when useEven is true", async () => {
      expect(await useEvenCrossChainWarriorsContract.tokenIds()).to.equal(2);
    });
  });

  describe("mint", () => {
    it("Should increment tokenIds by two", async () => {
      expect(await crossChainWarriorsContract.tokenIds()).to.equal(1);

      await (await crossChainWarriorsContract.mint(account1.address)).wait();

      expect(await crossChainWarriorsContract.tokenIds()).to.equal(3);
    });
  });
});
