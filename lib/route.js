'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _meta = require('./meta');

var _meta2 = _interopRequireDefault(_meta);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
/*eslint-disable*/


var route = function route(path, options) {
    _meta2.default.route = true;
    return function withRoute(Component) {
        (0, _utils.warning)('[ route ] method is deprecated and will be removed at next version.');
        return function (_React$Component) {
            _inherits(RouterWrapper, _React$Component);

            function RouterWrapper() {
                _classCallCheck(this, RouterWrapper);

                return _possibleConstructorReturn(this, (RouterWrapper.__proto__ || Object.getPrototypeOf(RouterWrapper)).apply(this, arguments));
            }

            _createClass(RouterWrapper, [{
                key: 'renderPath',
                value: function renderPath(path) {
                    return path.map(function (item) {
                        return _react2.default.createElement(_reactRouterDom.Route, _extends({}, options, { path: item, component: Component }));
                    });
                }
            }, {
                key: 'render',
                value: function render() {
                    if (Array.isArray(path)) {
                        return _react2.default.createElement(
                            'div',
                            null,
                            this.renderPath(path)
                        );
                    }
                    return _react2.default.createElement(_reactRouterDom.Route, _extends({}, options, { path: path, component: Component }));
                }
            }]);

            return RouterWrapper;
        }(_react2.default.Component);
    };
};

exports.default = route;
module.exports = exports['default'];