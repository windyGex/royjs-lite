'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// inject(listStore)
// inject(listStore, true)
// inject('listStore', listStore)
// inject({
// listStore,
// noticeStore
// })
var inject = function inject(key, value) {
    var length = arguments.length;
    var defaultProps = {},
        pure = false;
    if (length === 1) {
        if (key.primaryKey) {
            defaultProps = {
                store: key
            };
        } else {
            (0, _utils.warning)('inject multiple store will be removed at next version, using connect and Provider instead of it.');
            defaultProps = key;
        }
    } else if (length === 2) {
        if (value === true || value === false) {
            pure = value;
            defaultProps = {
                store: key
            };
        } else {
            defaultProps[key] = value;
        }
    }
    return function withStore(Component) {
        var _Component$prototype = Component.prototype,
            render = _Component$prototype.render,
            componentDidMount = _Component$prototype.componentDidMount;

        var StoreWrapper = function (_React$Component) {
            _inherits(StoreWrapper, _React$Component);

            function StoreWrapper(props, context) {
                _classCallCheck(this, StoreWrapper);

                var _this = _possibleConstructorReturn(this, (StoreWrapper.__proto__ || Object.getPrototypeOf(StoreWrapper)).call(this, props, context));

                _this._deps = {};
                _this._change = function (obj) {
                    obj = (0, _utils.isArray)(obj) ? obj : [obj];
                    var matched = void 0;

                    var _loop = function _loop(index) {
                        var item = obj[index];
                        var match = Object.keys(_this._deps).some(function (dep) {
                            return item.key.indexOf(dep) === 0;
                        });
                        if (match) {
                            matched = true;
                        }
                    };

                    for (var index = 0; index < obj.length; index++) {
                        _loop(index);
                    }
                    if (matched) {
                        _this.forceUpdate();
                    }
                };
                _this._get = function (data) {
                    _this._deps[data.key] = true;
                };
                Object.keys(defaultProps).forEach(function (key) {
                    var store = defaultProps[key];
                    _this[key] = store;
                    _this[key].on('change', _this._change);
                    _this[key].history = _this[key].history || _this.props.history;
                    if (_this[key].name) {
                        _this.context.store && _this.context.store.mount(_this[key].name, _this[key]);
                    }
                    if (!Component.prototype._hasSet) {
                        Object.defineProperty(Component.prototype, key, {
                            get: function get() {
                                (0, _utils.warning)('Using this.props.state instead of this.store.state\nand using this.props.dispatch instead of this.store.dispatch');
                                return store;
                            }
                        });
                    }
                });
                Component.prototype._hasSet = true;

                // 劫持组件原型，收集依赖信息
                var that = _this;
                Component.prototype.render = function () {
                    that.beforeRender();

                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var ret = render.apply(this, args);
                    that.afterRender();
                    return ret;
                };

                if (typeof componentDidMount === 'function') {
                    Component.prototype.componentDidMount = function () {
                        that.beforeRender();
                        componentDidMount.apply(this);
                        that.afterRender();
                    };
                }

                if (pure) {
                    _this.shouldComponentUpdate = function (nextProps, nextState) {
                        if (this.state !== nextState) {
                            return true;
                        }
                        return !(0, _shallowequal2.default)(this.props, nextProps);
                    };
                }
                return _this;
            }

            _createClass(StoreWrapper, [{
                key: 'getChildContext',
                value: function getChildContext() {
                    return {
                        injectStore: this.store
                    };
                }
            }, {
                key: 'beforeRender',
                value: function beforeRender() {
                    var _this2 = this;

                    Object.keys(defaultProps).forEach(function (key) {
                        _this2[key].on('get', _this2._get);
                    });
                }
            }, {
                key: 'afterRender',
                value: function afterRender() {
                    var _this3 = this;

                    Object.keys(defaultProps).forEach(function (key) {
                        _this3[key].off('get', _this3._get);
                    });
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    var _this4 = this;

                    Object.keys(defaultProps).forEach(function (key) {
                        _this4[key].off('change', _this4._change);
                        _this4[key].off('get', _this4._get);
                    });
                    // 还原组件原型，避免多次实例化导致的嵌套
                    Component.prototype.render = render;
                    if (componentDidMount) {
                        Component.prototype.componentDidMount = componentDidMount;
                    }
                }
            }, {
                key: 'componentDidMount',
                value: function componentDidMount() {
                    var node = _reactDom2.default.findDOMNode(this);
                    if (node) {
                        node._instance = this;
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    var ret = {};
                    Object.keys(defaultProps).forEach(function (key) {
                        var store = defaultProps[key];
                        if (key === 'store') {
                            ret = {
                                dispatch: store.dispatch,
                                state: store.state
                            };
                        } else {
                            var _ret2;

                            ret = (_ret2 = {}, _defineProperty(_ret2, key + 'Dispatch', store.dispatch), _defineProperty(_ret2, key + 'State', store.state), _ret2);
                        }
                    });
                    return _react2.default.createElement(Component, _extends({}, this.props, ret));
                }
            }]);

            return StoreWrapper;
        }(_react2.default.Component);

        StoreWrapper.contextTypes = {
            store: _propTypes2.default.any
        };
        StoreWrapper.childContextTypes = {
            injectStore: _propTypes2.default.any
        };

        return StoreWrapper;
    };
};

exports.default = inject;
module.exports = exports['default'];