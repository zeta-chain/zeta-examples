import { ContractReceipt } from "ethers";

export const getMintTokenId = (mintTx: ContractReceipt) =>
  mintTx.events?.[0].args?.tokenId;
