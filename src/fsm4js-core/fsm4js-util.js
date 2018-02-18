"use strict";

/**
 * The utility functions used elsewhere.
 *
 * @author Fahim Farook
 */
(function (fsm4js) {

	fsm4js._util = {
		throwError: function (msg) {
			throw new Error(msg);
		},

		isArray: function (obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},

		isString: function (obj) {
			return typeof obj === "string";
		},

		isFunction: function (obj) {
			return typeof obj === "function";
		},

		safeGet: function (obj, prop) {
			return obj && obj[prop];
		}
	};

})(FSM4JS);
