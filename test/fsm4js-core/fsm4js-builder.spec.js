
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

});