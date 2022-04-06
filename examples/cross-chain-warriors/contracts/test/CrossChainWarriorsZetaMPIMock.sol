// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@zetachain/contracts/ZetaInterfaces.sol";

import "../CrossChainWarriors.sol";

contract CrossChainWarriorsZetaMPIMock is ZetaMPI {
    function callOnZetaMessage(
        bytes memory originSenderAddress,
        uint256 originChainId,
        address destinationAddress,
        uint256 zetaAmount,
        bytes calldata message
    ) public {
        return
            CrossChainWarriors(destinationAddress).onZetaMessage(
                ZetaInterfaces.ZetaMessage({
                    originSenderAddress: originSenderAddress,
                    originChainId: originChainId,
                    destinationAddress: destinationAddress,
                    zetaAmount: zetaAmount,
                    message: message
                })
            );
    }

    function callOnZetaRevert(
        address originSenderAddress,
        uint256 destinationChainId,
        bytes calldata destinationAddress,
        uint256 zetaAmount,
        uint256, // gasLimit
        bytes calldata message
    ) public {
        return
            CrossChainWarriors(originSenderAddress).onZetaRevert(
                ZetaInterfaces.ZetaRevert({
                    originSenderAddress: originSenderAddress,
                    destinationAddress: destinationAddress,
                    destinationChainId: destinationChainId,
                    zetaAmount: zetaAmount,
                    message: message
                })
            );
    }

    function send(ZetaInterfaces.SendInput calldata _input) external {
        uint256 originChainId = _input.destinationChainId == 2 ? 1 : 2;
        address dest = abi.decode(_input.destinationAddress, (address));

        return callOnZetaMessage(abi.encode(msg.sender), originChainId, dest, _input.zetaAmount, _input.message);
    }
}
