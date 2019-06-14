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

var _store2 = require('./store');

var _store3 = _interopRequireDefault(_store2);

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var normalizer = function normalizer(mapStateToProps, context, dispatch) {
    var ret = {};
    if ((0, _utils.isArray)(mapStateToProps)) {
        mapStateToProps.forEach(function (key) {
            if (typeof key === 'string') {
                ret[key] = context.get(key);
            } else {
                Object.keys(key).forEach(function (k) {
                    ret[k] = context.get(key[k]);
                });
            }
        });
    } else if (typeof mapStateToProps === 'function') {
        ret = mapStateToProps(context);
    } else if ((0, _utils.isPlainObject)(mapStateToProps)) {
        var _mapStateToProps$stat = mapStateToProps.state,
            state = _mapStateToProps$stat === undefined ? [] : _mapStateToProps$stat,
            _mapStateToProps$acti = mapStateToProps.actions,
            actions = _mapStateToProps$acti === undefined ? [] : _mapStateToProps$acti;

        ret = normalizer(state, context);
        actions.forEach(function (action) {
            if (typeof action === 'string') {
                ret[action] = function (payload) {
                    dispatch(action, payload);
                };
            } else {
                Object.keys(action).forEach(function (k) {
                    ret[k] = function (payload) {
                        dispatch(action[k], payload);
                    };
                });
            }
        });
    }
    return ret;
};

// connect([], config) -> state
// connect({}, config) -> state, action
// connect(() => {}, config) -> state
var connect = function connect() {
    var mapStateToProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (state) {
        return state;
    };
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return function withStore(Component) {
        var StoreWrapper = function (_React$Component) {
            _inherits(StoreWrapper, _React$Component);

            function StoreWrapper(props, context) {
                _classCallCheck(this, StoreWrapper);

                var _this = _possibleConstructorReturn(this, (StoreWrapper.__proto__ || Object.getPrototypeOf(StoreWrapper)).call(this, props, context));

                _this._deps = {};
                _this._change = function (obj) {
                    var matched = void 0;
                    obj = (0, _utils.isArray)(obj) ? obj : [obj];

                    var _loop = function _loop(index) {
                        var item = obj[index];
                        var match = Object.keys(_this._deps).some(function (dep) {
                            return item.key.indexOf(dep) === 0;
                        });
                        if (match) {
                            matched = match;
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
                _this.store = context.store || _store3.default.get();
                if (config.inject) {
                    if (context.injectStore) {
                        _this.store = context.injectStore;
                    } else {
                        if (_this.store === context.store) {
                            (0, _utils.warning)('Royjs is using Provider store to connect because the inject store is undefined');
                        } else {
                            (0, _utils.warning)('Royjs is using the first initialized store to connect because the inject store is undefined');
                        }
                    }
                }
                _this.store.on('change', _this._change);
                _this.store.history = _this.store.history || _this.props.history;

                if (config === true || config.pure) {
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
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this.store.off('change', this._change);
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
                key: 'beforeRender',
                value: function beforeRender() {
                    this.store.on('get', this._get);
                }
            }, {
                key: 'afterRender',
                value: function afterRender() {
                    this.store.off('get', this._get);
                }
            }, {
                key: 'render',
                value: function render() {
                    this.beforeRender();
                    var _store = this.store,
                        dispatch = _store.dispatch,
                        state = _store.state;

                    var props = normalizer(mapStateToProps, state, dispatch);
                    var ret = _react2.default.createElement(Component, _extends({}, this.props, props, { dispatch: dispatch }));
                    this.afterRender();
                    return ret;
                }
            }]);

            return StoreWrapper;
        }(_react2.default.Component);

        StoreWrapper.contextTypes = {
            store: _propTypes2.default.any,
            injectStore: _propTypes2.default.any
        };

        return StoreWrapper;
    };
};

exports.default = connect;
module.exports = exports['default'];