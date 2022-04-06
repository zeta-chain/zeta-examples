import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployMultiChainValueMock, deployZetaMPIMock } from "../lib/MultiChainValue.helpers";
import { MultiChainValueMock, ZetaMPIMock } from "../typechain";

describe("MultiChainValue tests", () => {
  let multiChainValueContractA: MultiChainValueMock;
  const chainAId = 1;

  let multiChainValueContractB: MultiChainValueMock;
  const chainBId = 2;

  let zetaMPIMockContract: ZetaMPIMock;

  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let account1: SignerWithAddress;
  let deployerAddress: string;
  let account1Address: string;

  beforeEach(async () => {
    zetaMPIMockContract = await deployZetaMPIMock();
    multiChainValueContractA = await deployMultiChainValueMock({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    multiChainValueContractB = await deployMultiChainValueMock({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });

    await multiChainValueContractA.addAvailableChainId(chainBId);
    await multiChainValueContractB.addAvailableChainId(chainAId);

    accounts = await ethers.getSigners();
    [deployer, account1] = accounts;
    deployerAddress = deployer.address;
    account1Address = account1.address;
  });

  describe("addAvailableChainId", () => {
    it("Should prevent enabling a chainId that's already enabled", async () => {
      await (await multiChainValueContractA.addAvailableChainId(1)).wait();

      await expect(multiChainValueContractA.addAvailableChainId(1)).to.be.revertedWith(
        "MultiChainValue: destinationChainId already enabled"
      );
    });

    it("Should enable the provided chainId", async () => {
      await (await multiChainValueContractA.addAvailableChainId(1)).wait();

      expect(await multiChainValueContractA.availableChainIds(1)).to.equal(true);
    });
  });

  describe("removeAvailableChainId", () => {
    it("Should prevent disabling a chainId that's already disabled", async () => {
      await expect(multiChainValueContractA.removeAvailableChainId(1)).to.be.revertedWith(
        "MultiChainValue: destinationChainId not available"
      );
    });

    it("Should disable the provided chainId", async () => {
      await (await multiChainValueContractA.addAvailableChainId(1)).wait();
      expect(await multiChainValueContractA.availableChainIds(1)).to.equal(true);

      await (await multiChainValueContractA.removeAvailableChainId(1)).wait();
      expect(await multiChainValueContractA.availableChainIds(1)).to.equal(false);
    });
  });

  describe("send", () => {
    it("Should prevent sending value to a disabled chainId", async () => {
      await expect(multiChainValueContractA.send(1, account1Address, 100_000)).to.be.revertedWith(
        "MultiChainValue: destinationChainId not available"
      );
    });

    it("Should prevent sending 0 value", async () => {
      await (await multiChainValueContractA.addAvailableChainId(1)).wait();

      await expect(multiChainValueContractA.send(1, account1Address, 0)).to.be.revertedWith(
        "MultiChainValue: zetaAmount should be greater than 0"
      );
    });

    it("Should prevent sending if the account has no Zeta balance", async () => {
      await (await multiChainValueContractA.addAvailableChainId(1)).wait();

      /**
       * @todo (lucas): implement after merging zeta-examples and zeta-contracts
       */
    });

    it("Should prevent sending value to an invalid address", async () => {
      await (await multiChainValueContractA.addAvailableChainId(1)).wait();

      /**
       * @todo (lucas): create utility to validate addresses
       */
    });

    describe("Given a valid input", () => {
      it("Should send value", async () => {
        await (await multiChainValueContractA.addAvailableChainId(1)).wait();

        await multiChainValueContractA.send(1, account1Address, 100_000);

        /**
         * @todo (lucas): improve ZetaMPIMock to emulate actual functionality
         */
      });
    });
  });
});
