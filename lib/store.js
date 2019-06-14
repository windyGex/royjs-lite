'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get = exports.create = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _proxy = require('./proxy');

var _proxy2 = _interopRequireDefault(_proxy);

var _setValues = require('./plugins/set-values');

var _setValues2 = _interopRequireDefault(_setValues);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var globalStore = void 0;

var Store = function (_Events) {
    _inherits(Store, _Events);

    // state
    // actions

    // mount({})
    // mount(name, {})
    // mount(target, name, store)
    function Store() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Store);

        var _this = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this, params, options));

        _initialiseProps.call(_this);

        var name = params.name,
            state = params.state,
            _params$actions = params.actions,
            actions = _params$actions === undefined ? {} : _params$actions;
        var _options$strict = options.strict,
            strict = _options$strict === undefined ? false : _options$strict,
            _options$plugins = options.plugins,
            plugins = _options$plugins === undefined ? [] : _options$plugins;

        state = _extends({}, _this.state, state);
        _this.model = (0, _proxy2.default)(state);
        _this.model.on('get', function (args) {
            _this.trigger('get', args);
        });
        _this.model.on('change', function () {
            var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            try {
                _this._startBatch();
                if (_this.inBatch > 1) {
                    _this.pendingUnobservations.push(args);
                } else {
                    _this.trigger('change', args);
                }
            } finally {
                _this._endBatch();
            }
        });
        _this.inBatch = 0;
        _this.pendingUnobservations = [];
        _this.actions = {};
        _this.strict = strict;
        _this.allowModelSet = !strict;
        _this.state = _this.model;
        _this.url = options.url;
        _this.name = name;
        _this.primaryKey = options.primaryKey || 'id';
        plugins.unshift(_setValues2.default);
        plugins.forEach(function (plugin) {
            if (typeof plugin === 'function') {
                plugin(_this, actions);
            }
        });
        _this._wrapActions(actions, _this.model);
        if (!globalStore) {
            globalStore = _this;
        }
        return _this;
    }
    // create({})
    // create(name, {})
    // create(store, name, params);


    _createClass(Store, [{
        key: 'get',
        value: function get(key) {
            return this.model.get(key);
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.model.set(key, value, options);
        }
    }, {
        key: '_startBatch',
        value: function _startBatch() {
            this.inBatch++;
        }
    }, {
        key: '_endBatch',
        value: function _endBatch() {
            // 最外层事务结束时，才开始执行
            if (--this.inBatch === 0) {
                // 发布所有state待定的改变
                this._runPendingObservations();
            }
        }
    }, {
        key: '_runPendingObservations',
        value: function _runPendingObservations() {
            if (this.pendingUnobservations.length) {
                this.trigger('change', this.pendingUnobservations.slice());
                this.pendingUnobservations = [];
            }
        }
    }, {
        key: '_wrapActions',
        value: function _wrapActions(actions, state, prefix) {
            var _this2 = this;

            Object.keys(actions).forEach(function (type) {
                var actionType = prefix ? prefix + '.' + type : type;
                var that = _this2;
                var action = actions[type];
                function actionPayload(payload, options) {
                    var ret = action.call(that, state, payload, _extends({
                        state: that.state,
                        dispatch: that.dispatch
                    }, options));
                    that.trigger('actions', {
                        type: actionType,
                        payload: payload,
                        state: that.model
                    });
                    return ret;
                }
                if (!action._set) {
                    _this2.actions[actionType] = actionPayload;
                    actionPayload._set = true;
                } else {
                    _this2.actions[actionType] = action;
                }
            });
        }
    }, {
        key: 'subscribe',
        value: function subscribe(callback) {
            this.on('actions', function (_ref) {
                var type = _ref.type,
                    payload = _ref.payload,
                    state = _ref.state;

                callback({
                    type: type,
                    payload: payload,
                    state: state
                });
            });
        }
    }, {
        key: 'create',
        value: function create(name, params) {
            return Store.create(this, name, params);
        }
    }, {
        key: 'mount',
        value: function mount(name, store) {
            return Store.mount(this, name, store);
        }
    }]);

    return Store;
}(_events2.default);

Store.create = function (store, name, params) {
    if (arguments.length === 1) {
        params = store;
        store = globalStore;
        name = params.name;
    } else if (arguments.length === 2) {
        params = name;
        name = store;
        store = globalStore;
    }
    var _params = params,
        state = _params.state,
        actions = _params.actions;

    if (!globalStore) {
        console.warn('The store has not been initialized yet!');
    }
    var stateKeys = Object.keys(state);
    if (stateKeys.length === 0) {
        store.set(name, {});
    } else {
        stateKeys.forEach(function (key) {
            store.set(name + '.' + key, state[key]);
        });
    }
    store._wrapActions(actions, store.get(name), name);
    return store.get(name);
};

Store.mount = function (target, name, store) {
    if (arguments.length === 1) {
        store = target;
        target = globalStore;
        name = store.name;
    } else if (arguments.length === 2) {
        store = name;
        name = target;
        target = globalStore;
    }
    var _store = store,
        state = _store.state,
        actions = _store.actions;

    store.on('change', function (args) {
        args = (0, _utils.isArray)(args) ? args : [args];
        target.transaction(function () {
            for (var i = 0; i < args.length; i++) {
                var item = args[i];
                var value = store.get(item.key);
                target.set(name + '.' + item.key, value);
            }
        });
    });
    store.on('get', function (args) {
        var obj = _extends({}, args);
        obj.key = name + '.' + obj.key;
        target.trigger('get', obj);
    });
    store.on('actions', function (args) {
        target.trigger('actions', args);
    });
    return Store.create(target, name, {
        state: state.toJSON(),
        actions: actions
    });
};

Store.get = function () {
    return globalStore;
};

var _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.transaction = function (fn) {
        _this3._startBatch();
        try {
            return fn.apply(_this3);
        } finally {
            _this3._endBatch();
        }
    };

    this.dispatch = function (type, payload, options) {
        var action = _this3.actions[type];
        if (!action || typeof action !== 'function') {
            throw new Error('Cant find ' + type + ' action');
        }
        _this3.allowModelSet = true;
        var ret = action(payload, options);
        if (_this3.strict) {
            _this3.allowModelSet = false;
        }
        return ret;
    };
};

exports.default = Store;
var create = exports.create = Store.create;

var get = exports.get = Store.get;