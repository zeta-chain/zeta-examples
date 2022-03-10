// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../CrossChainWarriors.sol";

contract CrossChainWarriorsMock is CrossChainWarriors {
    constructor(address _zetaMpiAddress, bool useEven) CrossChainWarriors(_zetaMpiAddress, useEven) {}

    function mintId(address to, uint256 tokenId) external {
        return _mintId(to, tokenId);
    }
}
