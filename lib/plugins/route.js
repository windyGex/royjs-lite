'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var route = function route(store, actions) {
    ['push', 'replace', 'go', 'goBack', 'goForward'].forEach(function (method) {
        actions['router.' + method] = function (state, payload) {
            var history = store.history;

            history && history[method](payload);
        };
    });
};

exports.default = route;
module.exports = exports['default'];