'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

var _hooks = require('./hooks');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Store: _store2.default,
    Provider: _provider2.default,
    useStore: _hooks.useStore,
    useDispatch: _hooks.useDispatch
};
module.exports = exports['default'];