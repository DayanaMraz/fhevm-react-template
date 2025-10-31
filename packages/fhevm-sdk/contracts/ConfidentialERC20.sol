// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TFHE.sol";

/**
 * @title ConfidentialERC20
 * @notice Example confidential token using FHEVM
 * @dev Demonstrates encrypted balance transfers
 */
contract ConfidentialERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;

    mapping(address => euint64) private balances;
    mapping(address => mapping(address => euint64)) private allowances;

    event Transfer(address indexed from, address indexed to);
    event Approval(address indexed owner, address indexed spender);
    event Mint(address indexed to, uint64 amount);

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        decimals = 6;
    }

    /**
     * @notice Mint encrypted tokens to an address
     */
    function mint(uint64 amount) public {
        balances[msg.sender] = TFHE.add(balances[msg.sender], TFHE.asEuint64(amount));
        TFHE.allow(balances[msg.sender], msg.sender);
        emit Mint(msg.sender, amount);
    }

    /**
     * @notice Transfer encrypted amount to recipient
     * @param to Recipient address
     * @param encryptedAmount Encrypted amount to transfer
     */
    function transfer(address to, einput encryptedAmount, bytes calldata inputProof) public returns (bool) {
        euint64 amount = TFHE.asEuint64(encryptedAmount, inputProof);
        _transfer(msg.sender, to, amount);
        return true;
    }

    /**
     * @notice Get encrypted balance (only owner can decrypt)
     */
    function balanceOf(address account) public view returns (euint64) {
        return balances[account];
    }

    /**
     * @notice Internal transfer function
     */
    function _transfer(address from, address to, euint64 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");

        // Subtract from sender
        balances[from] = TFHE.sub(balances[from], amount);

        // Add to recipient
        balances[to] = TFHE.add(balances[to], amount);

        // Grant view permissions
        TFHE.allow(balances[from], from);
        TFHE.allow(balances[to], to);

        emit Transfer(from, to);
    }
}
