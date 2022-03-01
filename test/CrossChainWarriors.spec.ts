import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  deployCrossChainWarriorsMock,
  deployZetaMPIMock,
} from "../lib/CrossChainWarriors.helpers";
import { CrossChainWarriorsMock, ZetaMPIMock } from "../typechain";
import { getMintTokenId } from "./test.helpers";

describe("CrossChainWarriors tests", () => {
  let zetaMPIMockContract: ZetaMPIMock;
  let crossChainWarriorsContract: CrossChainWarriorsMock;
  let useEvenCrossChainWarriorsContract: CrossChainWarriorsMock;
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let account1: SignerWithAddress;
  let deployerAddress: string;
  let account1Address: string;

  beforeEach(async () => {
    zetaMPIMockContract = await deployZetaMPIMock();
    crossChainWarriorsContract = await deployCrossChainWarriorsMock({
      customUseEven: false,
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    useEvenCrossChainWarriorsContract = await deployCrossChainWarriorsMock({
      customUseEven: true,
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });

    accounts = await ethers.getSigners();
    [deployer, account1] = accounts;
    deployerAddress = deployer.address;
    account1Address = account1.address;
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

      await (await crossChainWarriorsContract.mint(account1Address)).wait();

      expect(await crossChainWarriorsContract.tokenIds()).to.equal(3);
    });

    it("Should create a new NFT owned by the input address", async () => {
      const result = await (
        await crossChainWarriorsContract.mint(account1Address)
      ).wait();

      const tokenId = getMintTokenId(result);

      expect(await crossChainWarriorsContract.ownerOf(tokenId)).to.equal(
        account1Address
      );
    });
  });

  describe("mintId", () => {
    it("Should mint an NFT with the given input id owned by the input address", async () => {
      const id = 10;

      await (
        await crossChainWarriorsContract.mintId(account1Address, id)
      ).wait();

      expect(await crossChainWarriorsContract.ownerOf(id)).to.equal(
        account1Address
      );
    });
  });

  describe("crossChainTransfer", () => {
    it("Should revert if the caller is not the NFT owner nor approved", async () => {
      const id = 10;

      await (
        await crossChainWarriorsContract.mintId(account1Address, id)
      ).wait();

      /**
       * The caller is the contract deployer and the NFT owner is account1
       */
      expect(
        crossChainWarriorsContract.crossChainTransfer(account1Address, id)
      ).to.be.revertedWith("Transfer caller is not owner nor approved");
    });

    it("Should burn the tokenId", async () => {
      const id = 10;

      await (
        await crossChainWarriorsContract.mintId(deployerAddress, id)
      ).wait();

      expect(await crossChainWarriorsContract.ownerOf(id)).to.equal(
        deployerAddress
      );

      await (
        await crossChainWarriorsContract.crossChainTransfer(account1Address, id)
      ).wait();

      expect(crossChainWarriorsContract.ownerOf(id)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });
  });
});
