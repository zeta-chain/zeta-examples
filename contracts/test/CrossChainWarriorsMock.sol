// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../shared/CrossChainWarriors.sol";

contract CrossChainWarriorsMock is CrossChainWarriors {
    constructor(
        address _zetaMpiAddress,
        address _zetaTokenAddress,
        bool useEven
    ) CrossChainWarriors(_zetaMpiAddress, _zetaTokenAddress, useEven) {}

    function mintId(address to, uint256 tokenId) external {
        return _mintId(to, tokenId);
    }
}
