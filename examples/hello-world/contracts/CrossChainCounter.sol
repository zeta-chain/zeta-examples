// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract CrossChainCounter {
  mapping (address => uint256) public counter;

  function increment() public {
    counter[msg.sender]++;
  }
}
