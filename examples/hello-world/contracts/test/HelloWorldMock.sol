// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../HelloWorld.sol";

contract HelloWorldMock is HelloWorld {
    constructor(address _zetaMpiAddress) HelloWorld(_zetaMpiAddress) {}

    function increment(address messageFrom) external {
        return HelloWorld._increment(messageFrom);
    }
}
