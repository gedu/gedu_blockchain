// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.9.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract GeduToken is ERC20 {
    string private tokenName = "Teddy Gedu";
    string private symbol = "GEDU";
    uint256 private INITIAL_SUPPLY = 10000 * (10**decimals());

    constructor() ERC20(tokenName, symbol) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
