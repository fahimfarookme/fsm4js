
describe("fsm4js._builder", function () {

	describe("#init()", function () {
		it("should return the builder", function () {
			expect(new FSM4JS._builder().init()).to.be.a("object");
		});

		it("should update the _initState", function () {
			var builder = new FSM4JS._builder();
			expect(builder.init("init-state")._initState.state).to.equal("init-state");
			expect(builder.init(null, "init-data")._initState.data).to.equal("init-data");
		});
	});

	describe("#states()", function () {
		it("should return the builder when arguments passed", function () {
			expect(new FSM4JS._builder().states("state1")).to.be.a("object");
		});

		it("should append states array for string argument", function () {
			expect(new FSM4JS._builder().states("state1")._states).to.have.lengthOf(1);
		});

		it("should append states array for array argument", function () {
			expect(new FSM4JS._builder().states(["state1", "state2"])._states).to.have.lengthOf(2);
		});

		it("should return the states when no argument passed", function () {
			var states = new FSM4JS._builder().states(["state1", "state2"]).states();
			expect(Object.prototype.toString.call(states)).to.equal("[object Array]");
			expect(states).to.have.lengthOf(2);
		});
	});

	describe("#events()", function () {
		it("should return the builder when arguments passed", function () {
			expect(new FSM4JS._builder().events("event1")).to.be.a("object");
		});

		it("should append events array for string argument", function () {
			expect(new FSM4JS._builder().events("event1")._events).to.have.lengthOf(1);
		});

		it("should append events array for array argument", function () {
			expect(new FSM4JS._builder().events(["events1", "event2"])._events).to.have.lengthOf(2);
		});

		it("should return the states when no argument passed", function () {
			var events = new FSM4JS._builder().events(["event1", "event2"]).events();
			expect(Object.prototype.toString.call(events)).to.equal("[object Array]");
			expect(events).to.have.lengthOf(2);
		});
	});

	describe("#transitions()", function () {
		it("should return the recorded transitions when no arguments passes", function () {
			var transitions = new FSM4JS._builder().transitions();
			expect(typeof transitions).to.equal("object");
		});

		it("should record transitions if a transition object is passed", function () {
			var fsm = new FSM4JS._builder().events(["event1"]).states(["state1", "state2"]).transitions({
				from: "state1",
				event: "event1",
				to: "state2"
			});
			var from = fsm.transitions()["state1"];
			expect(typeof from).to.equal("object");
			expect(from["event1"]).to.equal("state2");
		});

		it("should record transitions if a transition array is passed", function () {
			var fsm = new FSM4JS._builder().events(["event1", "event2"]).states(["state1", "state2", "state3"]).transitions([
				{from: "state1", event: "event1", to:"state2"},
				{from: "state1", event: "event2", to:"state3"}
			]);
			var from = fsm.transitions()["state1"];
			expect(typeof from).to.equal("object");
			expect(from["event1"]).to.equal("state2");
			expect(from["event2"]).to.equal("state3");
		});

		it("should reject invalid transitions", function () {
			var fsm = new FSM4JS._builder().events(["event1"]).states(["state1", "state2"]);

			var trns = {
				from: 500,
				event: "event1"
			};
			expect(fsm.transitions.bind(fsm, trns)).to.throw("Invalid transition - " + trns);

			trns = {
				from: "state1",
				event: []
			};
			expect(fsm.transitions.bind(fsm, trns)).to.throw("Invalid transition - " + trns);

			trns = {
				from: "state3",
				event: "event1"
			};
			expect(fsm.transitions.bind(fsm, trns)).to.throw("Invalid transition - " + trns);

			trns = {
				from: "state1",
				event: "event3"
			};
			expect(fsm.transitions.bind(fsm, trns)).to.throw("Invalid transition - " + trns);
		});
	});
		
	describe("#current()", function () {
		it("should throw error if not started", function () {
			expect(new FSM4JS._builder().current.bind()).to.throw();
		});

		it("should return the current state if the FSM is started", function () {
			var fsm = new FSM4JS._builder().events(["event1", "event2"]).states(["state1", "state2", "state3"]).transitions([
				{from: "state1", event: "event1", to:"state2"},
				{from: "state2", event: "event2", to:"state3"},
				{from: "state3", event: "event1", to:"state1"}
			]).init("state1").start();

			fsm.event1();
			expect(fsm.current().state).to.be.equal("state2");

			fsm.event2();
			expect(fsm.current().state).to.be.equal("state3");

			fsm.event1("data");
			expect(fsm.current().data).to.be.equal("data");
		});
	});
		
	describe("#on()", function () {
		it("should throw error if invalid state is passed", function () {
			var fsm = new FSM4JS._builder().states(["state1"]);
			expect(fsm.on.bind(fsm, "state2")).to.throw("Invalid state - state2")
		});

		it("should throw error if invalid enter function is passed", function () {
			var fsm = new FSM4JS._builder().states(["state1"]);
			expect(fsm.on.bind(fsm, "state1", "string fn")).to.throw("Invalid lifecycle { enter, exit } - string fn");
		});

		it("should update the state map if valid state and enter functions passed", function () {
			var fsm = new FSM4JS._builder().states(["state1"])
				.on("state1", {
					enter: function () {}
				});
			expect(typeof fsm._stateMap["state1"]).to.be.equal("object");
			expect(typeof fsm._stateMap["state1"]["enter"]).to.be.equal("function");
		});
	});

	describe("#start()", function () {
		it("should call init if a state is passed", function () {
			var fsm = new FSM4JS._builder().states(["state1", "state2"]).init("state1");
			var spyInit = sinon.spy(fsm, "init");
			fsm.start(null, "state2");

			expect(spyInit.callCount).to.be.equal(1);
			expect(fsm._initState.state).to.be.equal("state2");
		});

		it("should update _initState.data if having init state and valid state and data are passed", function () {
			var fsm = new FSM4JS._builder().states(["state1", "state2"]).init("state1");
			fsm.start("data", "state2");
			expect(fsm._initState.data).to.be.equal("data");
		});

		it("should throw error if no init state set", function () {
			var fsm = new FSM4JS._builder().states(["state1"]);
			expect(fsm.start.bind(fsm)).to.throw("No init state set");
		});

		it("should throw error if the init state is invalid", function () {
			var fsm = new FSM4JS._builder().states(["state1"]).init("state2");
			expect(fsm.start.bind(fsm)).to.throw("Invalid init state");
		});

		it("should transition to init state if having init state and no state is passed", function () {
			var fsm = new FSM4JS._builder().states(["state1", "state2"]).init("state1");
			var spyExit = sinon.spy(fsm, "_exitCurrentState");
			var spyEnter = sinon.spy(fsm, "_enterNextState");
			fsm.start();

			expect(spyExit.callCount).to.be.equal(1);
			expect(spyEnter.callCount).to.be.equal(1);
			expect(fsm._previousState).to.be.null;
			expect(fsm._currentState.state).to.be.equal("state1");
		});

		it("should transition to start state if having init state and valid state is passed", function () {
			var fsm = new FSM4JS._builder().states(["state1", "state2"]).init("state1");
			var spyExit = sinon.spy(fsm, "_exitCurrentState");
			var spyEnter = sinon.spy(fsm, "_enterNextState");
			fsm.start(null, "state2");

			expect(spyExit.callCount).to.be.equal(1);
			expect(spyEnter.callCount).to.be.equal(1);
			expect(fsm._previousState).to.be.null;
			expect(fsm._currentState.state).to.be.equal("state2");
		});
	});

	describe("#transitionTo()", function () {
		it("should throw error if invalid state is passed", function () {
			var fsm = new FSM4JS._builder().states(["state1", "state2"]);
			expect(fsm.transitionTo.bind(fsm, "state3")).to.throw("Invalid state");
		});

		it("should transition to given state if a valid state is passed", function () {
			var fsm = new FSM4JS._builder().states(["state1", "state2"]).init("state1").start();
			var spyExit = sinon.spy(fsm, "_exitCurrentState");
			var spyEnter = sinon.spy(fsm, "_enterNextState");
			fsm.transitionTo("state2");

			expect(spyExit.callCount).to.be.equal(1);
			expect(spyEnter.callCount).to.be.equal(1);
			expect(fsm._previousState.state).to.be.equal("state1");
			expect(fsm._currentState.state).to.be.equal("state2");
		});
	});

	describe("#beforeEnter()", function () {
		it("should throw error if invalid function is passed", function () {
			var fsm = new FSM4JS._builder();
			expect(fsm.beforeEnter.bind(fsm, "string")).to.throw("Invalid function for beforeEnter");
		});

		it("should record the callback if valid function is passed", function () {
			var fsm = new FSM4JS._builder().beforeEnter(function () {
			}, {prop: "context"});
			expect(typeof fsm._beforeEnter.fn).to.be.equal("function");
			expect(fsm._beforeEnter.context.prop).to.be.equal("context");
		});
	});

	describe("#afterExit()", function () {
		it("should throw error if invalid function is passed", function () {
			var fsm = new FSM4JS._builder();
			expect(fsm.afterExit.bind(fsm, "string")).to.throw("Invalid function for afterExit");
		});

		it("should record the callback if valid function is passed", function () {
			var fsm = new FSM4JS._builder().afterExit(function () {
			}, {prop: "context"});
			expect(typeof fsm._afterExit.fn).to.be.equal("function");
			expect(fsm._afterExit.context.prop).to.be.equal("context");
		});
	})
	
});