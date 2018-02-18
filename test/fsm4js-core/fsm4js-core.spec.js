
describe("fsm4js", function () {

	describe("#fsm()", function () {
		it("should return the builder", function () {
			var fsm = FSM4JS.fsm();
			expect(fsm).to.be.a("object");
			expect(Object.prototype.toString.call(fsm._states)).to.equal("[object Array]");
		});
	});

});