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

  let crossChainWarriorsContractChainA: CrossChainWarriorsMock;
  const chainAID = 1;

  let crossChainWarriorsContractChainB: CrossChainWarriorsMock;
  const chainBID = 2;

  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let account1: SignerWithAddress;
  let deployerAddress: string;
  let account1Address: string;
  const encoder = new ethers.utils.AbiCoder();

  beforeEach(async () => {
    zetaMPIMockContract = await deployZetaMPIMock();

    crossChainWarriorsContractChainA = await deployCrossChainWarriorsMock({
      customUseEven: false,
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    await crossChainWarriorsContractChainA.setCrossChainID(chainBID);

    crossChainWarriorsContractChainB = await deployCrossChainWarriorsMock({
      customUseEven: true,
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    await crossChainWarriorsContractChainB.setCrossChainID(chainAID);
    await crossChainWarriorsContractChainB.setCrossChainAddress(
      crossChainWarriorsContractChainA.address
    );

    await crossChainWarriorsContractChainA.setCrossChainAddress(
      crossChainWarriorsContractChainB.address
    );

    accounts = await ethers.getSigners();
    [deployer, account1] = accounts;
    deployerAddress = deployer.address;
    account1Address = account1.address;
  });

  describe("constructor", () => {
    it("Should set the tokenIds counter to 1 when useEven is false", async () => {
      expect(await crossChainWarriorsContractChainA.tokenIds()).to.equal(1);
    });

    it("Should set the tokenIds counter to 2 when useEven is true", async () => {
      expect(await crossChainWarriorsContractChainB.tokenIds()).to.equal(2);
    });
  });

  describe("mint", () => {
    it("Should increment tokenIds by two", async () => {
      expect(await crossChainWarriorsContractChainA.tokenIds()).to.equal(1);

      await (
        await crossChainWarriorsContractChainA.mint(account1Address)
      ).wait();

      expect(await crossChainWarriorsContractChainA.tokenIds()).to.equal(3);
    });

    it("Should create a new NFT owned by the input address", async () => {
      const result = await (
        await crossChainWarriorsContractChainA.mint(account1Address)
      ).wait();

      const tokenId = getMintTokenId(result);

      expect(await crossChainWarriorsContractChainA.ownerOf(tokenId)).to.equal(
        account1Address
      );
    });
  });

  describe("mintId", () => {
    it("Should mint an NFT with the given input id owned by the input address", async () => {
      const id = 10;

      await (
        await crossChainWarriorsContractChainA.mintId(account1Address, id)
      ).wait();

      expect(await crossChainWarriorsContractChainA.ownerOf(id)).to.equal(
        account1Address
      );
    });
  });

  describe("crossChainTransfer", () => {
    it("Should revert if the caller is not the NFT owner nor approved", async () => {
      const id = 10;

      await (
        await crossChainWarriorsContractChainA.mintId(account1Address, id)
      ).wait();

      /**
       * The caller is the contract deployer and the NFT owner is account1
       */
      expect(
        crossChainWarriorsContractChainA.crossChainTransfer(account1Address, id)
      ).to.be.revertedWith("Transfer caller is not owner nor approved");
    });

    it("Should burn the tokenId", async () => {
      const id = 10;

      await (
        await crossChainWarriorsContractChainA.mintId(deployerAddress, id)
      ).wait();

      expect(await crossChainWarriorsContractChainA.ownerOf(id)).to.equal(
        deployerAddress
      );

      await (
        await crossChainWarriorsContractChainA.crossChainTransfer(
          account1Address,
          id
        )
      ).wait();

      expect(crossChainWarriorsContractChainA.ownerOf(id)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });

    it("Should mint tokenId in the destination chain", async () => {
      const id = 10;

      await (
        await crossChainWarriorsContractChainA.mintId(deployerAddress, id)
      ).wait();

      await (
        await crossChainWarriorsContractChainA.crossChainTransfer(
          account1Address,
          id
        )
      ).wait();

      expect(await crossChainWarriorsContractChainB.ownerOf(id)).to.equal(
        account1Address
      );
    });
  });

  describe("uponZetaMessage", () => {
    it("Should revert if the caller is not the Zeta MPI contract", async () => {
      await expect(
        crossChainWarriorsContractChainA.uponZetaMessage(
          encoder.encode(
            ["address"],
            [crossChainWarriorsContractChainA.address]
          ),
          1,
          crossChainWarriorsContractChainB.address,
          0,
          encoder.encode(["address"], [deployerAddress])
        )
      ).to.be.revertedWith(
        "This function can only be called by the Zeta MPI contract"
      );
    });

    it("Should revert if the cross-chain address doesn't match with the stored one", async () => {
      await expect(
        zetaMPIMockContract.callUponZetaMessage(
          encoder.encode(["address"], [deployerAddress]),
          1,
          crossChainWarriorsContractChainB.address,
          0,
          encoder.encode(["address"], [zetaMPIMockContract.address])
        )
      ).to.be.revertedWith("Cross-chain address doesn't match");
    });

    it("Should revert if the cross-chain id doesn't match with the stored one", async () => {
      await expect(
        zetaMPIMockContract.callUponZetaMessage(
          encoder.encode(
            ["address"],
            [crossChainWarriorsContractChainA.address]
          ),
          2,
          crossChainWarriorsContractChainB.address,
          0,
          encoder.encode(["address"], [zetaMPIMockContract.address])
        )
      ).to.be.revertedWith("Cross-chain id doesn't match");
    });

    it("Should revert if the message type doesn't match with CROSS_CHAIN_TRANSFER_MESSAGE", async () => {
      const messageType =
        await crossChainWarriorsContractChainA.CROSS_CHAIN_TRANSFER_MESSAGE();

      const invalidMessageType = messageType.replace("9", "8");

      await expect(
        zetaMPIMockContract.callUponZetaMessage(
          encoder.encode(
            ["address"],
            [crossChainWarriorsContractChainA.address]
          ),
          1,
          crossChainWarriorsContractChainB.address,
          0,
          encoder.encode(
            ["bytes32", "uint256 ", "address"],
            [invalidMessageType, 1, deployerAddress]
          )
        )
      ).to.be.revertedWith("Invalid message type");
    });

    it("Should revert if the token already exists", async () => {
      const messageType =
        await crossChainWarriorsContractChainA.CROSS_CHAIN_TRANSFER_MESSAGE();

      await crossChainWarriorsContractChainB.mintId(deployerAddress, 1);

      await expect(
        zetaMPIMockContract.callUponZetaMessage(
          encoder.encode(
            ["address"],
            [crossChainWarriorsContractChainA.address]
          ),
          1,
          crossChainWarriorsContractChainB.address,
          0,
          encoder.encode(
            ["bytes32", "uint256 ", "address"],
            [messageType, 1, deployerAddress]
          )
        )
      ).to.be.revertedWith("ERC721: token already minted");
    });

    describe("Given a valid input", () => {
      it("Should mint a new token in the destination chain", async () => {
        const messageType =
          await crossChainWarriorsContractChainA.CROSS_CHAIN_TRANSFER_MESSAGE();

        await zetaMPIMockContract.callUponZetaMessage(
          encoder.encode(
            ["address"],
            [crossChainWarriorsContractChainA.address]
          ),
          1,
          crossChainWarriorsContractChainB.address,
          0,
          encoder.encode(
            ["bytes32", "uint256 ", "address"],
            [messageType, 1, deployerAddress]
          )
        );

        expect(await crossChainWarriorsContractChainB.ownerOf(1)).to.equal(
          deployerAddress
        );
      });
    });
  });
});
