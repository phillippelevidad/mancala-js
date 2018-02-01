# Mancala Board Game
A simple implementation of this [wonderful board game](https://en.wikipedia.org/wiki/Mancala).

## Motivation
I built this as a DDD exercise.

DDD is a new topic to me, but one that has caught my atention because of the way it approaches complex problems.

If I were to write this game before learning about DDD, I'm sure I was going to make a mess of my code, introducing a complex chain of method calls that could only lead to bugs difficult to find and to solve.

With DDD, it is a lot easier to write short methods that adhere to the Single Responsibility principle, and to add functionality without changing working code through the use of a PubSub system. The real challenge in DDD is understanding and modeling the problem you aim to solve, rather than worrying about software infrastructure.

And I'm finding that DDD can be very simple to implement, as opposed to a lot of people say on the Internet. You just need to be concious about which suggestions of the methodology to follow and which not to, according to the size of the problem and complexity of the solution.

## Organization
Thanks to DDD, I've managed to organize the project "classes" in a way that all the game logic (my business rules, in this case) take place without ever knowing that they're running in a web-browser. The **DomAdapter** class is an infrastructure implementation that captures all business events and translates them to the UI in a very decoupled manner.

### Aggregates

 - **Game (root)**: controls the rules and maitains the state of the game, determining whose turn it is, if the game has finished, etc.
   - **Mancala**: represents the board itself
     - **Hole**: represents the holes in the board, keeping track of their seed count
   - **Player**: represents each player

### Events

 - GameEnded
 - HoleInfosUpdated
 - HolePicked
 - HoleVisited
 - PlayerTurnSet
 - SeedDistributionCompleted
  
 ### Infra
 
 - DomAdapter
 - EventHub
  
 ### Presentation
  
 - App
 - Index.html
 - Style.css
