## Introduction

This repo is for an npm package that can perform certain graph calculations
for a weighted directed graph.

## Requirements

`node v10 +`

## Installation

`npm install eko-route-calculator`


## Initialization

The library exposes a RouteService class
RouteService can be initialized with an object that represents the graph or as an array of arrays which represent the edges.<br>
eg; If the graph is has the following edges AB1, AC4, AD10, BE3, CD4, CF2, DE1, EB3, EA2, FD1 <br>

RouteService can be initialised as follows 


```
1. Using a static method which takes an array of arrays of edges in the following form ( RECOMMENDED)<br>
const routeService = RouteService.FromArray([
    ['A', 'B', 1],
    ['A', 'C', 4],
    ['A', 'D', 10],
    ['B', 'E', 3],
    ['C', 'D', 4],
    ['C', 'F', 2],
    ['D', 'E', 1],
    ['E', 'B', 3],
    ['E', 'A', 2],
    ['F', 'D', 1]
])

2. Or by directly injecting an Object which represents the routes.
const  routeService = new RouteService({
    'A': {'B': 1, 'C':4, 'D': 10},
    'B': {'E': 3},
    'C': {'D': 4, 'F':2},
    'D': {'E': 1},
    'E': {'B': 3, 'A': 2},
    'F': {'D': 1},
})
```

## Methods

1. addEdge(from, to, distance) <br>
    Adds a new edge to the graph <br>
    eg: routeService.addEdge('B', 'C', 10) adds another route from B to C with a distance of 10

2. costOfRoute(route) <br>
    Calculates the cost of a  given route <br>
    eg: routeService.costOfRoute('A-B-C') Calculates the cost from A to B to C
    Return -1 if no route such route exists
    
3.  numberOfPossibleRoutes(start, end, maxStops) <br>
    Calculates the number  of possible routes from start to end with an optional param to specify the maximum number  of stops between the two points <br>
    eg: routeService.numberOfPossibleRoutes('A', 'C', 2) Calculates the number of routes from A to C with a max of 2 stops
    Return -1 if no route such route exists
    
4. cheapestRoute(start, end) <br>
    Calculates the cost of cheapest route between start and end<br>
    eg: routeService.cheapestRoute('A, 'C') Calculates the cheapest route cost from A to C
    Return -1 if no route such route exists
    
5. getGraphAsArray() <br>
    Returns the current graph as as array of arrays. Similar to the input to RouteService.FromArray().
    This is done to facilitate saving the graph for later use from the client.
   

## TODO

Add a method to calculate the number of possible routes, using the same route at most twice, which is under a given cost.
It will be a  permutation of the costs of the paths returned by numberOfPossibleRoutes() method.

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


