"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var setValues = function setValues(store, actions) {
    actions.setValues = function (state, payload, options) {
        store.transaction(function () {
            state.set(payload, options);
        });
    };
};

exports.default = setValues;
module.exports = exports["default"];