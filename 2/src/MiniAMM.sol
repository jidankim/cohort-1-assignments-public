// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import {IMiniAMM, IMiniAMMEvents} from "./IMiniAMM.sol";
import {MiniAMMLP} from "./MiniAMMLP.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Add as many variables or functions as you would like
// for the implementation. The goal is to pass `forge test`.
contract MiniAMM is IMiniAMM, IMiniAMMEvents, MiniAMMLP {
    uint256 public k = 0;
    uint256 public xReserve = 0;
    uint256 public yReserve = 0;

    address public tokenX;
    address public tokenY;

    // implement constructor
    constructor(address _tokenX, address _tokenY) MiniAMMLP(_tokenX, _tokenY) {
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

    // Helper function to calculate square root
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    // add parameters and implement function.
    // this function will determine the 'k'.
    function _addLiquidityFirstTime(uint256 xAmountIn, uint256 yAmountIn) internal returns (uint256 lpMinted) {
        IERC20(tokenX).transferFrom(msg.sender, address(this), xAmountIn);
        IERC20(tokenY).transferFrom(msg.sender, address(this), yAmountIn);

        // mint lp tokens
        lpMinted = sqrt(xAmountIn * yAmountIn);
        _mintLP(msg.sender, lpMinted);

        // set reserves and k
        k = xAmountIn * yAmountIn;
        xReserve = xAmountIn;
        yReserve = yAmountIn;

        return lpMinted;
    }

    // add parameters and implement function.
    // this function will increase the 'k'
    // because it is transferring liquidity from users to this contract.
    function _addLiquidityNotFirstTime(uint256 xAmountIn, uint256 yAmountIn) internal returns (uint256 lpMinted) {
        IERC20(tokenX).transferFrom(msg.sender, address(this), xAmountIn);
        IERC20(tokenY).transferFrom(msg.sender, address(this), yAmountIn);

        // mint lp tokens
        lpMinted = xAmountIn * totalSupply() / xReserve;
        _mintLP(msg.sender, lpMinted);

        // update reserves and increased k
        xReserve += xAmountIn;
        yReserve += yAmountIn;
        k = xReserve * yReserve;

        return lpMinted;
    }

    // complete the function. Should transfer LP token to the user.
    function addLiquidity(uint256 xAmountIn, uint256 yAmountIn) external returns (uint256 lpMinted) {
        require(xAmountIn > 0 && yAmountIn > 0, "Amounts must be greater than 0");
        if (k == 0) {
            // add params
            lpMinted = _addLiquidityFirstTime(xAmountIn, yAmountIn);
        } else {
            // add params
            lpMinted = _addLiquidityNotFirstTime(xAmountIn, yAmountIn);
        }

        emit AddLiquidity(xAmountIn, yAmountIn);
        return lpMinted;
    }

    // Remove liquidity by burning LP tokens
    function removeLiquidity(uint256 lpAmount) external returns (uint256 xAmount, uint256 yAmount) {
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

            emit Swap(xAmountIn, 0, 0, yOut);
        } else if (xAmountIn == 0) {
            // k = x * y = (x - xOut) * (y + ySwap)
            // xOut = x - k/(y + ySwap)
            uint256 xOut = xReserve - (k / (yReserve + yAmountIn));
            IERC20(tokenY).transferFrom(msg.sender, address(this), yAmountIn);
            IERC20(tokenX).transfer(msg.sender, xOut); // from contract's balance

            xReserve -= xOut;
            yReserve += yAmountIn;

            emit Swap(0, yAmountIn, xOut, 0);
        }
    }
}
