# Overview
Using an agent driven by the GAME architecture, which provides Agent, Worker, and Function, each with configurable parameters.

For now, we define the following functions: posting tweets, searching tweets, and replying to tweets. These functions execute tasks by configuring different parameters, enabling the agent to handle various social media interactions flexibly.

## Game-node
Agent (a.k.a. [high level planner](https://whitepaper.virtuals.io/developer-documents/game-framework/game-overview#high-level-planner-hlp-context))
- Takes in a <b>Goal</b>
  - Drives the agents behaviour through the high level plan which influences the thinking and creation of tasks that would contribute towards this goal
- Takes in a <b>Description</b>
  - Combination of what was previously known as World Info + Agent Description
  - This include a description of the "world" the agent lives in, and the personality and background of the agent

Worker (a.k.a. [low-level planner](https://whitepaper.virtuals.io/developer-documents/game-framework/game-overview#low-level-planner-llp-context)) 
- Takes in a <b>Description</b>
  - Used to control which workers are called by the agent, based on the high-level plan and tasks created to contribute to the goal

Function
- Takes in a <b>Description</b>
  - Used to control which functions are called by the workers, based on each worker's low-level plan
  - This can be any executable
