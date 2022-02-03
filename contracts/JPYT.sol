//SPDX-License-Identifier: Unlicense
// Test Token
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//Solity 0.7 or 0.8
contract JPYC is ERC20 {
    constructor() ERC20("Test token for Unofficial Club JPYC", "JPYC") {
        _mint(msg.sender, 2000);
    }
}