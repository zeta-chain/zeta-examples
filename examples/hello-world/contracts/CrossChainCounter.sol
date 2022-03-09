// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract CrossChainCounter {
  uint256 public counter;

  function increment() public {
    counter++;
  }
}
