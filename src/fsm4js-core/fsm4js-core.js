"use strict";

/**
 * FSM4JS - A declarative Finite State Machine library for JavaScript.
 *
 * The intended usage;
 *
 * var myFsm = FSM4JS.fsm()
 *      .events(["Event1", "Event2"])
 *      .states(["State1", "State2"])
 *      .init("State1")
 *      .transitions([
 *          { from: "State1", event: "Event1", to: "State2" },
 *          { from: "State2", event: "Event2"  to: "State2" },
 *      ])
 *      .on("State1", {
 *          enter: function(){ ... },
 *          exit: function(){ ...}
 *      })
 *      .start();
 *
 * @author Fahim Farook
 */

if (typeof FSM4JS === "undefined") {

    /**
     * The FSM4JS global namespace object.  If FSM4JS is already defined, the
     * existing FSM4JS object will not be overridden so that defined
     * namespaces are preserved.
     */
    var FSM4JS = {};
}

(function (fsm4js) {


    fsm4js.version = "@@VERSION";

    /**
     * Creates a new Finite State Machine.
     *
     * @returns {fsm4js._builder}
     */
    fsm4js.fsm = function () {
        var parent = Object.create(fsm4js._builder.prototype);
        return this._builder.apply(parent, arguments) || parent;
    }

})(FSM4JS);
