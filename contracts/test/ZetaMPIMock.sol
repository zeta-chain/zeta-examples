// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../shared/ZetaMPI.sol";
import "../shared/CrossChainWarriors.sol";

contract ZetaMPIMock is ZetaMPI {
    function callUponZetaMessage(
        bytes memory sender,
        uint16 srcChainID,
        address destContract,
        uint256 zetaAmount,
        bytes calldata message
    ) public {
        return CrossChainWarriors(destContract).uponZetaMessage(sender, srcChainID, destContract, zetaAmount, message);
    }

    function callZetaMessageRevert(
        bytes memory sender,
        uint16, // srcChainID
        address, // destContract
        uint256 zetaAmount,
        uint256 gasLimit,
        bytes calldata message
    ) public {
        address _sender = abi.decode(sender, (address));

        return
            CrossChainWarriors(_sender).zetaMessageRevert(
                _sender,
                "1", // @todo (lucas): unmock
                "", // @todo (lucas): unmock
                zetaAmount,
                gasLimit,
                message,
                "123"
            );
    }

    function zetaMessageSend(
        uint16 destChainID,
        bytes memory destContract,
        uint256 zetaAmount,
        uint256, // gasLimit
        bytes calldata message,
        bytes calldata // zetaParams
    ) external {
        uint16 srcChainID = destChainID == 2 ? 1 : 2;
        address dest = abi.decode(destContract, (address));

        return callUponZetaMessage(abi.encode(msg.sender), srcChainID, dest, zetaAmount, message);
    }
}
