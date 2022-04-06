// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@zetachain/contracts/ZetaInterfaces.sol";
import "@zetachain/contracts/ZetaReceiver.sol";

contract CrossChainCounter is Ownable, ZetaReceiver {
    bytes32 public constant CROSS_CHAIN_INCREMENT_MESSAGE = keccak256("CROSS_CHAIN_INCREMENT");

    address internal _zetaMpiAddress;
    ZetaMPI internal _zeta;

    uint256 internal immutable _currentChainId;
    uint256 internal _crossChainId;
    bytes internal _crossChainAddress;

    mapping(address => uint256) public counter;

    constructor(address _zetaMpiInputAddress) {
        _currentChainId = block.chainid;

        _zetaMpiAddress = _zetaMpiInputAddress;
        _zeta = ZetaMPI(_zetaMpiInputAddress);
    }

    function setCrossChainAddress(bytes calldata _ccAddress) public onlyOwner {
        _crossChainAddress = _ccAddress;
    }

    function setCrossChainId(uint256 _ccId) public onlyOwner {
        _crossChainId = _ccId;
    }

    function crossChainCount() external {
        require(_crossChainAddress.length != 0, "Cross-chain address is not set");
        require(_crossChainId != 0, "Cross-chain id is not set");

        _zeta.send(
            ZetaInterfaces.SendInput({
                destinationChainId: _crossChainId,
                destinationAddress: _crossChainAddress,
                gasLimit: 2500000,
                message: abi.encode(CROSS_CHAIN_INCREMENT_MESSAGE, msg.sender),
                zetaAmount: 0,
                zetaParams: abi.encode("")
            })
        );
    }

    function onZetaMessage(ZetaInterfaces.ZetaMessage calldata _zetaMessage) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
        require(
            keccak256(_zetaMessage.originSenderAddress) == keccak256(_crossChainAddress),
            "Cross-chain address doesn't match"
        );
        require(_zetaMessage.originChainId == _crossChainId, "Cross-chain id doesn't match");

        (bytes32 messageType, address messageFrom) = abi.decode(_zetaMessage.message, (bytes32, address));

        require(messageType == CROSS_CHAIN_INCREMENT_MESSAGE, "Invalid message type");

        counter[messageFrom]++;
    }

    function onZetaRevert(ZetaInterfaces.ZetaRevert calldata _zetaRevert) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
        require(_zetaRevert.originSenderAddress == address(this), "Invalid originSenderAddress");
        require(_zetaRevert.originChainId == _currentChainId, "Invalid originChainId");

        (bytes32 messageType, address messageFrom) = abi.decode(_zetaRevert.message, (bytes32, address));

        require(messageType == CROSS_CHAIN_INCREMENT_MESSAGE, "Invalid message type");
        require(counter[messageFrom] > 0, "Decrement overflow");

        counter[messageFrom]--;
    }
}
