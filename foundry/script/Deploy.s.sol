// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Leaderboard.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        Leaderboard leaderboard = new Leaderboard();
        console.log("Leaderboard deployed to:", address(leaderboard));
        vm.stopBroadcast();
    }
}
