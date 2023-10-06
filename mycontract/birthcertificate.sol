// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BirthCertificate {

  uint256 dateOfBirth; 
  address owner;

  constructor() {
    owner = msg.sender;
  }

  function assign(uint256 date_) public { 
    dateOfBirth = date_;
  }
}