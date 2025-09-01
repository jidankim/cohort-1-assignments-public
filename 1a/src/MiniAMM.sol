// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {IMiniAMM, IMiniAMMEvents} from "./IMiniAMM.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Add as many variables or functions as you would like
// for the implementation. The goal is to pass `forge test`.
contract MiniAMM is IMiniAMM, IMiniAMMEvents {
    uint256 public k = 0;
    uint256 public xReserve = 0;
    uint256 public yReserve = 0;

    address public tokenX;
    address public tokenY;

    // implement constructor
    constructor(address _tokenX, address _tokenY) {
        require(_tokenX != address(0), "tokenX cannot be zero address");
        require(_tokenY != address(0), "tokenY cannot be zero address");
        require(_tokenX != _tokenY, "Tokens must be different");

        if (_tokenX < _tokenY) {
            tokenX = _tokenX;
            tokenY = _tokenY;
        } else {
            tokenX = _tokenY;
            tokenY = _tokenX;
        }
    }

    // add parameters and implement function.
    // this function will determine the initial 'k'.
    function _addLiquidityFirstTime(uint256 xAmountIn, uint256 yAmountIn) internal {
        IERC20(tokenX).transferFrom(msg.sender, address(this), xAmountIn);
        IERC20(tokenY).transferFrom(msg.sender, address(this), yAmountIn);

        // set reserves and k
        k = xAmountIn * yAmountIn;
        xReserve = xAmountIn;
        yReserve = yAmountIn;
    }

    // add parameters and implement function.
    // this function will increase the 'k'
    // because it is transferring liquidity from users to this contract.
    function _addLiquidityNotFirstTime(uint256 xAmountIn, uint256 yAmountIn) internal {
        IERC20(tokenX).transferFrom(msg.sender, address(this), xAmountIn);
        IERC20(tokenY).transferFrom(msg.sender, address(this), yAmountIn);

        // update reserves and increased k
        xReserve += xAmountIn;
        yReserve += yAmountIn;
        k = xReserve * yReserve;
    }

    // complete the function
    function addLiquidity(uint256 xAmountIn, uint256 yAmountIn) external {
        require(xAmountIn > 0 && yAmountIn > 0, "Amounts must be greater than 0");
        if (k == 0) {
            // add params
            _addLiquidityFirstTime(xAmountIn, yAmountIn);
        } else {
            // add params
            _addLiquidityNotFirstTime(xAmountIn, yAmountIn);
        }

        emit AddLiquidity(xAmountIn, yAmountIn);
    }

    // complete the function
    function swap(uint256 xAmountIn, uint256 yAmountIn) external {
        require(k != 0, "No liquidity in pool");
        require(xAmountIn > 0 || yAmountIn > 0, "Must swap at least one token");
        require(xAmountIn == 0 || yAmountIn == 0, "Can only swap one direction at a time");
        require(xAmountIn <= xReserve && yAmountIn <= yReserve, "Insufficient liquidity"); // one of them must be 0, just check liquidity of the other input
        if (yAmountIn == 0) {
            // k = x * y = (x + xSwap) * (y - yOut)
            // yOut = y - k/(x + xSwap)
            uint256 yOut = yReserve - (k / (xReserve + xAmountIn));
            IERC20(tokenX).transferFrom(msg.sender, address(this), xAmountIn);
            IERC20(tokenY).transfer(msg.sender, yOut); // from contract's balance

            xReserve += xAmountIn;
            yReserve -= yOut;

            emit Swap(xAmountIn, yOut);
        } else if (xAmountIn == 0) {
            // k = x * y = (x - xOut) * (y + ySwap)
            // xOut = x - k/(y + ySwap)
            uint256 xOut = xReserve - (k / (yReserve + yAmountIn));
            IERC20(tokenY).transferFrom(msg.sender, address(this), yAmountIn);
            IERC20(tokenX).transfer(msg.sender, xOut); // from contract's balance

            xReserve -= xOut;
            yReserve += yAmountIn;

            emit Swap(xOut, yAmountIn);
        }
    }
}
