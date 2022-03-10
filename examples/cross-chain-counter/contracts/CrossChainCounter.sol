// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./ZetaMPI.sol";

contract CrossChainCounter {
    address internal _zetaMpiAddress;
    ZetaMPI internal _zetaMpi;

    mapping(address => uint256) public counter;

    constructor(address _zetaMpiInputAddress) {
        _zetaMpiAddress = _zetaMpiInputAddress;
        _zetaMpi = ZetaMPI(_zetaMpiInputAddress);
    }

    function increment() public {
        counter[msg.sender]++;
    }
}
