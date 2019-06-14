'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StoreContext = undefined;
exports.default = Provider;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StoreContext = exports.StoreContext = _react2.default.createContext(null);

function Provider(props) {
    return _react2.default.createElement(
        StoreContext.Provider,
        {
            value: props.store },
        props.children
    );
}