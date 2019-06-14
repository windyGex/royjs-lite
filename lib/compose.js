'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = compose;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _inject = require('./inject');

var _inject2 = _interopRequireDefault(_inject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};

function compose(_ref) {
    var name = _ref.name,
        view = _ref.view,
        components = _ref.components,
        state = _ref.state,
        actions = _ref.actions,
        container = _ref.container,
        _ref$init = _ref.init,
        init = _ref$init === undefined ? noop : _ref$init,
        _ref$mounted = _ref.mounted,
        mounted = _ref$mounted === undefined ? noop : _ref$mounted,
        _ref$beforeUpdate = _ref.beforeUpdate,
        beforeUpdate = _ref$beforeUpdate === undefined ? noop : _ref$beforeUpdate,
        _ref$updated = _ref.updated,
        updated = _ref$updated === undefined ? noop : _ref$updated,
        _ref$beforeDestroy = _ref.beforeDestroy,
        beforeDestroy = _ref$beforeDestroy === undefined ? noop : _ref$beforeDestroy;

    var store = new _store2.default({
        name: name,
        state: state,
        actions: actions
    });

    var ComposeComponent = function (_React$Component) {
        _inherits(ComposeComponent, _React$Component);

        function ComposeComponent() {
            var _ref2;

            _classCallCheck(this, ComposeComponent);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var _this = _possibleConstructorReturn(this, (_ref2 = ComposeComponent.__proto__ || Object.getPrototypeOf(ComposeComponent)).call.apply(_ref2, [this].concat(args)));

            init.apply(_this, args);
            return _this;
        }

        _createClass(ComposeComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                mounted.apply(this, args);
            }
        }, {
            key: 'componentWillUpdate',
            value: function componentWillUpdate() {
                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                beforeUpdate.apply(this, args);
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate() {
                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                updated.apply(this, args);
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    args[_key5] = arguments[_key5];
                }

                beforeDestroy.apply(this, args);
            }
        }, {
            key: 'render',
            value: function render() {
                return view.call(this, {
                    createElement: _react2.default.createElement,
                    components: components
                });
            }
        }]);

        return ComposeComponent;
    }(_react2.default.Component);

    var StoreComponent = (0, _inject2.default)(store)(ComposeComponent);
    if (container) {
        return _reactDom2.default.render(_react2.default.createElement(StoreComponent, null), document.querySelector(container));
    }
    return StoreComponent;
}
module.exports = exports['default'];