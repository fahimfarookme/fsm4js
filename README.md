[![Build Status](https://travis-ci.org/fahimfarookme/fsm4js.svg?branch=master)](https://travis-ci.org/fahimfarookme/fsm4js)
[![codecov](https://codecov.io/gh/fahimfarookme/fsm4js/branch/master/graph/badge.svg)](https://codecov.io/gh/fahimfarookme/fsm4js)

# A declarative Finite State Machine for JavaScript

A Finite State Machine which 
- is declarative
- supports programmatic state transitions
- makes states stateful by allowing events to _pass data_ and states to _store data_
- provides hooks to get notified about state transitions


## [Consider a Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html)

![alt text](https://martinfowler.com/bliki/images/circuitBreaker/state.png)

The above state machine could be modeled as follows (thresholds are omitted for the sake of simplicity).

```javascript
var fsm = FSM4JS.fsm()
  .events(["success", "fail", "timeout"])
  .states(["closed", "open", "halfopen"])
  .init("closed")
  .transitions([
    {from: "closed",   event: "success", to: "closed"  },
    {from: "closed",   event: "fail",    to: "open"    },
    {from: "open",     event: "timeout", to: "halfopen"},
    {from: "halfopen", event: "success", to: "closed"  },
    {from: "halfopen", event: "fail",    to: "open"    }
  ])
  .on("open", {
    enter: function () {
      // timeout logic
    }
  })
  .start();
```

You can find a demo of the same [here](https://github.com/fahimfarookme/fsm4js/blob/master/demo/index.html).

## Install
FSM4JS is available for both node and browser.

- Browser
```
bower install fsm4js
```

- Node
```
npm install fsm4js
```

## Create a Finite State Machine
Use the `fsm()` factory method to create a new Finite State Machine.
```javascript
var fsm = FSM4JS.fsm();
```
FSM4JS exposes fluent APIs so that the entire Finite State Machine can be built in a single statement.


## Fire events with data
The events declared under `.events(["success", "fail", "timeout"])` could be programmatically fired as follows.
```javascript
fsm.success( data );
fsm.fail( data );
fsm.timeout( data );
```

## Programetic state transitions
```javascript
fsm.transitionTo( new_state, data );
```

## Get the state of the current state
The `current` method returns the current state in the form of `{ state: 'state name', data: { ... } }`
```javascript
fsm.current();
```

## Execute code upon entering and exiting a state
```javascript
fsm.on("open", {
    enter: function (options) {
      // options.from    -> entering 'open' state from which state?
      // options.event   -> what event caused to enter into this state
      // options.to.data -> data being passed to this - i.e. open - state
    },
    
    exit: function (options) {
      // options.from    -> exiting from what state i.e. open
      // options.event   -> what event caused to exit from this state
    }
  )
```

## Hooks around state transitions
Get some code executed before entering or after exiting any state
```javascript
fsm.beforeEnter(function(options) {
  // options.from    -> going to enter some state from 'from' state
  // options.event   -> what event caused the state transition
})
```
```javascript
fsm.afterExit(function(options) {
  // options.from    -> going to exit from 'from' state
  // options.event   -> what event caused the state transition
  // options.to.data -> data being passed during state transition
})
```








