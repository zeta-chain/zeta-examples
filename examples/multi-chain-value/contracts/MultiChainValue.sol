// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@zetachain/contracts/ZetaInterfaces.sol";

contract MultiChainValue is Ownable {
    address public zetaMpi;
    ZetaMPI internal _zeta;

    mapping(uint256 => bool) public availableChainIds;

    constructor(address _zetaMpiInput) {
        zetaMpi = _zetaMpiInput;
        _zeta = ZetaMPI(_zetaMpiInput);
    }

    function addAvailableChainId(uint256 destinationChainId) external onlyOwner {
        require(!availableChainIds[destinationChainId], "MultiChainValue: destinationChainId already enabled");

        availableChainIds[destinationChainId] = true;
    }

    function removeAvailableChainId(uint256 destinationChainId) external onlyOwner {
        require(availableChainIds[destinationChainId], "MultiChainValue: destinationChainId not available");

        delete availableChainIds[destinationChainId];
    }

    function send(
        uint256 destinationChainId,
        bytes calldata destinationAddress,
        uint256 zetaAmount
    ) external {
        require(availableChainIds[destinationChainId], "MultiChainValue: destinationChainId not available");
        require(zetaAmount != 0, "MultiChainValue: zetaAmount should be greater than 0");

        _zeta.send(
            ZetaInterfaces.SendInput({
                destinationChainId: destinationChainId,
                destinationAddress: destinationAddress,
                gasLimit: 2500000,
                message: abi.encode(),
                zetaAmount: zetaAmount,
                zetaParams: abi.encode("")
            })
        );
    }
}
