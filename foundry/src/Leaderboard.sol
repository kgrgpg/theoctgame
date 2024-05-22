// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Leaderboard {
    struct Player {
        address playerAddress;
        uint score;
    }

    Player[] public players;

    function addPlayer(address _playerAddress, uint _score) public {
        players.push(Player(_playerAddress, _score));
    }

    function getPlayers() public view returns (Player[] memory) {
        return players;
    }
}
