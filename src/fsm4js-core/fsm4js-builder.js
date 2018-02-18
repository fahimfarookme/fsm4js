"use strict";

/**
 * The Finite State Machine builder.
 *
 * @author Fahim Farook
 */
(function (fsm4js) {

	// private members - static
	var throwError = function (msg) {
			throw new Error(msg);
		},

		isArray = function (obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},

		isString = function (obj) {
			return typeof obj === "string";
		},

		isFunction = function (obj) {
			return typeof obj === "function";
		},

		isValidTransition = function (event, eventArr, stateArr) {
			return event &&
				isString(event.event) &&
				isString(event.from) &&
				eventArr.indexOf(event.event) !== -1 &&
				stateArr.indexOf(event.from) !== -1;
		},

		isValidState = function (state, stateArr) {
			return isString(state) && stateArr.indexOf(state) !== -1;
		},

		isValidLifecycle = function (lifecycle) {
			return lifecycle && isFunction(lifecycle.enter);
		},

		safeGet = function (obj, prop) {
			return obj && obj[prop];
		};


	// constructor
	var builder = function () {
		this._initState = null;
		this._currentState = null;
		this._previousState = null;
		this._states = [];
		this._stateMap = {};
		this._events = [];
		this._transitions = {};
		this._afterExit = {};
		this._beforeEnter = {};
	};

	// prototype
	builder.prototype = {
		constructor: builder,

		init: function (state, data) {
			this._initState = {
				state: state,
				data: data
			};
			return this;
		},

		states: function (states) {
			if (arguments.length === 0) {
				return this._states;
			}

			if (isArray(states) && states.length > 0) {
				this._states = this._states.concat(states);
			} else { // object
				this._states.push(states);
			}

			return this;
		},

		current: function () {
			!this._currentState && throwError("No current state since FSM is not yet started.");
			return this._currentState;
		},

		events: function (events) {
			if (arguments.length === 0) {
				return this._events;
			}

			if (isArray(events) && events.length > 0) {
				this._events = this._events.concat(events);
			} else { // object
				this._events.push(events);
			}

			return this;
		},

		transitions: function (trns) {
			if (arguments.length === 0) {
				return this._transitions;
			}

			if (isArray(trns) && trns.length > 0) {
				for (var i = 0, len = trns.length; i < len; i++) {
					this._addTransition(trns[i]);
				}
			} else { // object
				this._addTransition(trns);
			}

			return this;
		},

		on: function (state, lifecycle) {
			!isValidState(state, this._states) && throwError("Invalid state - " + state);
			!isValidLifecycle(lifecycle) && throwError("Invalid lifecycle { enter, exit } - " + lifecycle);
			this._stateMap[state] = lifecycle;

			return this;
		},

		start: function (data, state) { // state is optional
			state && this.init(state);

			!this._initState && throwError("No init state set.");
			!isValidState(this._initState.state, this._states) && throwError("Invalid init state - ", this._initState.state);

			// set data again if no state param provided.
			this._initState.data = data;

			this._exitCurrentState(); // same FSM can be started many times
			this._enterNextState(null, this._initState.state, this._initState.data);

			return this;
		},

		transitionTo: function (state, data) {
			!isValidState(state, this._states) && throwError("Invalid state - " + state);
			this._exitCurrentState();
			this._enterNextState(null, state, data);

			return this;
		},

		beforeEnter: function (fn, context) {
			!isFunction(fn) && throwError("Invalid function for beforeEnter");

			this._beforeEnter = {
				fn: fn,
				context: context
			};

			return this;
		},

		afterExit: function (fn, context) {
			!isFunction(fn) && throwError("Invalid function for afterExit");

			this._afterExit = {
				fn: fn,
				context: context
			};

			return this;
		},

		_addTransition: function (trns) {
			// trnas ==> { event:'', from:'', to:'' }
			// tr-map[from-state][event] => to
			!isValidTransition(trns, this._events, this._states) && throwError("Invalid transition - " + trns);

			this._transitions[trns.from] = this._transitions[trns.from] || {};
			this._transitions[trns.from][trns.event] = trns.to || this._transitions[trns.from][trns.event] || {};

			this._createEvent(trns.event);
		},

		_createEvent: function (event) {
			// fsm.event() ==> initiate state transition from current state
			var self = this;
			this[event] = function (data) {
				self._transition(event, data);
			}
		},

		_transition: function (event, data) {
			this._exitCurrentState(event);
			var next = this._findNextState(event);
			if (next) { // if next state exists
				this._enterNextState(event, next, data)
			}
		},

		_exitCurrentState: function (event) {
			if (!this._currentState) {
				return;
			}

			// cache current state
			this._previousState = {
				state: this._currentState.state,
				data: this._currentState.data
			};

			var options = {
				from: this._previousState,
				event: event
			};
			this._beforeEnter.fn && this._beforeEnter.fn.call(this._beforeEnter._context, options);

			// exit previous state
			var exit = safeGet(this._stateMap[this._previousState.state], "exit");
			exit && exit(options);
			// exit(from, event)

		},

		_findNextState: function (event) {
			// find next state
			// { s1: { e1: "s1", e2: "s2" }, ... }
			var from = this._transitions[this._previousState.state];
			!from && throwError("From state not defined - " + this._previousState.state);
			return from[event]; // null for init/ start
		},

		_enterNextState: function (event, state, data) { // event = bcz of what event entering?
			// cache next state
			this._currentState = {
				state: state,
				data: data
			};

			var options = {
				from: this._previousState,
				event: event,
				to: this._currentState
			};

			// enter next state
			var enter = safeGet(this._stateMap[this._currentState.state], "enter");
			enter && enter(options);
			// enter(from, event, to)

			this._afterExit.fn && this._afterExit.fn.call(this._afterExit.context, options);
		}
	};

	fsm4js._builder = builder;

})(FSM4JS);
