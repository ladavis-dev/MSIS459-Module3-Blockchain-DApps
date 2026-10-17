
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TodoList {

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    uint256 public taskCount;

    mapping(uint256 => Task) public tasks;

    event TaskCreated(
        uint256 id,
        string content,
        bool completed
    );

    event TaskCompleted(
        uint256 id,
        bool completed
    );

    function createTask(string memory _content) public {
        require(
            bytes(_content).length > 0,
            "Task content cannot be empty"
        );

        taskCount++;

        tasks[taskCount] = Task(
            taskCount,
            _content,
            false
        );

        emit TaskCreated(
            taskCount,
            _content,
            false
        );
    }

    function toggleCompleted(uint256 _id) public {
        require(
            _id > 0 && _id <= taskCount,
            "Task does not exist"
        );

        Task storage task = tasks[_id];

        task.completed = !task.completed;

        emit TaskCompleted(
            _id,
            task.completed
        );
    }

    function getTask(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            bool
        )
    {
        require(
            _id > 0 && _id <= taskCount,
            "Task does not exist"
        );

        Task memory task = tasks[_id];

        return (
            task.id,
            task.content,
            task.completed
        );
    }
}
