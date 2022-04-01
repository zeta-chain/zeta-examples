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

  const encoder = new ethers.utils.AbiCoder();

  beforeEach(async () => {
    zetaMPIMockContract = await deployZetaMPIMock();
    multiChainValueContractA = await deployMultiChainValueMock({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });
    multiChainValueContractB = await deployMultiChainValueMock({
      zetaMPIMockAddress: zetaMPIMockContract.address,
    });

    await multiChainValueContractA.setCrossChainID(chainBId);
    await multiChainValueContractB.setCrossChainID(chainAId);
    await multiChainValueContractA.setCrossChainAddress(encoder.encode(["address"], [multiChainValueContractB.address]));
    await multiChainValueContractB.setCrossChainAddress(encoder.encode(["address"], [multiChainValueContractA.address]));

    accounts = await ethers.getSigners();
    [deployer, account1] = accounts;
    deployerAddress = deployer.address;
    account1Address = account1.address;
  });

  describe("someFunction", () => {
    it("Should work", async () => {
      expect(true).to.equal(true);
    });
  });
});
