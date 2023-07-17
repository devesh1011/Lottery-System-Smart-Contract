// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

contract Lottery {
    address public manager;
    address payable[] public participants;
    address payable public winner;

    constructor() {
        manager = msg.sender; // global variable
    }

    receive() external payable {
        require(msg.value == 2 ether);
        participants.push(payable(msg.sender));
    }

    function getBalance() public view returns (uint256) {
        require(msg.sender == manager);
        return address(this).balance;
    }

    function getRandom() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        participants.length
                    )
                )
            );
    }

    function selectWinner() public returns (address) {
        require(msg.sender == manager);
        require(participants.length >= 3);

        uint256 randomNum = getRandom();
        uint256 indexVal = randomNum % participants.length;

        winner = participants[indexVal];
        winner.transfer(getBalance());

        participants = new address payable[](0);

        return winner;
    }

    function allParticipants() public view returns (address payable[] memory) {
        return participants;
    }
}
