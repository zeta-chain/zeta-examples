// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./ZetaMPI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrossChainCounter is Ownable {
    bytes32 public constant CROSS_CHAIN_INCREMENT_MESSAGE = keccak256("CROSS_CHAIN_INCREMENT");

    address internal _zetaMpiAddress;

    bytes internal _crossChainAddress;
    uint16 internal _crossChainID;

    mapping(address => uint256) public counter;

    constructor(address _zetaMpiInputAddress) {
        _zetaMpiAddress = _zetaMpiInputAddress;
    }

    function setCrossChainAddress(bytes calldata _ccAddress) public onlyOwner {
        _crossChainAddress = _ccAddress;
    }

    function setCrossChainID(uint16 _ccId) public onlyOwner {
        _crossChainID = _ccId;
    }

    function crossChainCount() external {
        require(_crossChainAddress.length != 0, "Cross-chain address is not set");
        require(_crossChainID != 0, "Cross-chain ID is not set");

        ZetaMPI(_zetaMpiAddress).zetaMessageSend(
            _crossChainID,
            _crossChainAddress,
            0,
            2500000,
            abi.encode(CROSS_CHAIN_INCREMENT_MESSAGE, msg.sender),
            abi.encode("")
        );
    }

    function uponZetaMessage(
        bytes calldata srcContract,
        uint16, // srcChainID
        address, // destContract
        uint256, // zetaAmount
        bytes calldata message
    ) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
        require(keccak256(srcContract) == keccak256(_crossChainAddress), "Cross-chain address doesn't match");

        (bytes32 messageType, address messageFrom) = abi.decode(message, (bytes32, address));

        require(messageType == CROSS_CHAIN_INCREMENT_MESSAGE, "Invalid message type");

        counter[messageFrom]++;
    }

    function zetaMessageRevert(
        address, // sender,
        string calldata, // destChainID,
        string calldata, // destContract,
        uint256, // zetaRefundAmount,
        uint256, // gasLimit,
        bytes calldata message,
        bytes32 // messageID
    ) external {
        require(msg.sender == _zetaMpiAddress, "This function can only be called by the Zeta MPI contract");
        /**
         * @custom:todo (lucas) add cross-chain address check
         */

        (bytes32 messageType, address messageFrom) = abi.decode(message, (bytes32, address));

        require(messageType == CROSS_CHAIN_INCREMENT_MESSAGE, "Invalid message type");
        require(counter[messageFrom] > 0, "Decrement overflow");

        counter[messageFrom]--;
    }
}
