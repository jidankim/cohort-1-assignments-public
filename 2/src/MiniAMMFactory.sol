// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {IMiniAMMFactory} from "./IMiniAMMFactory.sol";
import {MiniAMM} from "./MiniAMM.sol";

// Add as many variables or functions as you would like
// for the implementation. The goal is to pass `forge test`.
contract MiniAMMFactory is IMiniAMMFactory {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256 pairNumber);
    
    constructor() {}

    // implement
    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }
    
    // implement
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(getPair[tokenA][tokenB] == address(0), "Pair exists");
        require(getPair[tokenB][tokenB] == address(0), "Pair exists");
        require(tokenA != tokenB, "Identical addresses");
        require(tokenA != address(0), "Zero address");
        require(tokenB != address(0), "Zero address");

        MiniAMM pairContract = new MiniAMM(tokenA, tokenB);
        address tokenX = pairContract.tokenX();
        address tokenY = pairContract.tokenY();

        address pair = address(pairContract);
        allPairs.push(pair);
        getPair[tokenX][tokenY] = pair;
        getPair[tokenY][tokenX] = pair;

        emit PairCreated(tokenX, tokenY, pair, allPairs.length);

        return pair;
    }
}
