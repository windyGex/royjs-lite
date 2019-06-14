'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var devtools = function devtools(store) {
    var tool = void 0;
    store.subscribe(function (obj) {
        if (window.hasOwnProperty('__REDUX_DEVTOOLS_EXTENSION__') && !tool) {
            tool = window.__REDUX_DEVTOOLS_EXTENSION__.connect();
            tool.subscribe(function (message) {
                if (message.type === 'DISPATCH' && message.state) {
                    store.set(JSON.parse(message.state));
                }
            });
        }
        tool && tool.send(obj.type, obj.state.toJSON());
    });
};

exports.default = devtools;
module.exports = exports['default'];