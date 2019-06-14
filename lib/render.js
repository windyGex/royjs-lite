'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = render;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = require('react-router-dom');

var _meta = require('./meta');

var _meta2 = _interopRequireDefault(_meta);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(element, container) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    (0, _utils.warning)('[ render ] method is deprecated and will be removed at next version.');
    var root = typeof container === 'string' ? document.querySelector(container) : container;
    if (_meta2.default.route) {
        var Router = options.browser ? _reactRouterDom.BrowserRouter : _reactRouterDom.HashRouter;
        return _reactDom2.default.render(_react2.default.createElement(
            Router,
            null,
            _react2.default.createElement(
                _reactRouterDom.Switch,
                null,
                element
            )
        ), root);
    }
    return _reactDom2.default.render(element, container);
} /* eslint-disable no-unused-vars */
module.exports = exports['default'];