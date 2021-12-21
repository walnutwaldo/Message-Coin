// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "hardhat/console.sol";

contract MessageCoin is ERC20, Ownable {

    using SafeMath for uint;

    uint public cost;

    event Message(address indexed from, address indexed to, uint indexed timestamp, string message);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable() {
        _mint(msg.sender, 10 ** 12);
        cost = 1 ether / (10 ** 4);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function mint(uint amt) external payable {
        require(amt > 0, "Must mint a positive number of message tokens");
        require(msg.value >= amt * cost, "Insufficient payment");
        require(msg.value < (amt + 1) * cost, "Payment and number of message tokens requested do not match. Make sure you are using the right price.");
        _mint(msg.sender, amt);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner() payable {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setCost(uint newCost) public onlyOwner() {
        cost = newCost;
    }

    function destroy() public onlyOwner() {
        selfdestruct(payable(msg.sender));
    }

    // @notice The message should already be encrypted with the other person's public key
    // if you don't want it to be publicly visible
    function sendMessage(address to, string memory message) public {
        require(address(msg.sender).balance > 0, "Insufficient message balance");
        _transfer(_msgSender(), to, 1);
        emit Message(address(msg.sender), to, block.timestamp, message);
    }

    receive() external payable {
        uint newTokens = msg.value / cost;
        if (newTokens > 0) {
            _mint(msg.sender, newTokens);
        }
    }

}
