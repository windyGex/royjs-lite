'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable no-use-before-define */


var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrap(key, value, ret) {
    if (!(value && value.$proxy)) {
        if ((0, _utils.isPlainObject)(value)) {
            value = observable(value, ret);
            value.on('get', function (args) {
                var currentKey = key + '.' + args.key;
                ret.trigger('get', {
                    key: currentKey
                });
            });
            value.on('change', function (args) {
                var currentKey = key + '.' + args.key;
                ret.trigger('change', _extends({}, args, {
                    key: currentKey
                }));
            });
        } else if (Array.isArray(value)) {
            value = observable(value, ret);
            value.on('change', function (args) {
                var mixArgs = _extends({}, args);
                if (!args.key) {
                    mixArgs.key = key;
                } else {
                    mixArgs.key = key + '.' + args.key;
                }
                ret.trigger('change', mixArgs);
            });
        }
    }
    return value;
}

function rawJSON(target) {
    if (Array.isArray(target)) {
        return target.map(function (item) {
            if (item && item.toJSON) {
                return item.toJSON();
            }
            return item;
        });
    }
    var ret = {};
    Object.keys(target).forEach(function (key) {
        var value = target[key];
        if (value && value.toJSON) {
            ret[key] = value.toJSON();
        } else {
            ret[key] = value;
        }
    });
    return ret;
}

var objectProcess = {
    get: function get(options) {
        var target = options.target,
            events = options.events;

        return function getValue(path) {
            var slient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!path) {
                return null;
            }

            if (typeof path !== 'string') {
                return target[path];
            }
            // 避免使用.作为key的尴尬, 优先直接获取值
            var val = target[path];
            if (val == null) {
                var key = void 0;
                var field = path.split('.');
                if (field.length) {
                    key = field[0];
                    // lists[1].name
                    if (key.indexOf('[') >= 0) {
                        key = key.match(/(.*)\[(.*)\]/);
                        if (key) {
                            try {
                                val = target[key[1]][key[2]];
                            } catch (e) {
                                throw new Error('state ' + key[1] + ' is undefined!');
                            }
                        }
                    } else {
                        val = target[field[0]];
                    }
                    if (val) {
                        for (var i = 1; i < field.length; i++) {
                            val = val[field[i]];
                            /* eslint-disable */
                            if (val == null) {
                                break;
                            }
                        }
                    }
                }
            }

            if (!slient) {
                events.trigger('get', {
                    key: path
                });
            }
            return val;
        };
    },
    set: function set(options) {
        var events = options.events,
            target = options.target;

        var _set = function _set(object, path, value) {
            var keyNames = path.split('.'),
                keyName = keyNames[0],
                oldObject = object;

            object = object.get(keyName);
            if (typeof object == 'undefined') {
                object = wrap(keyName, {}, target.$proxy);
                oldObject[keyName] = object;
            }
            if ((0, _utils.isPlainObject)(object)) {
                keyNames.splice(0, 1);
                return object.set(keyNames.join('.'), value);
            }
        };
        return function setValue(path, value) {
            var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if ((0, _utils.isPlainObject)(path)) {
                Object.keys(path).forEach(function (key) {
                    var val = path[key];
                    setValue(key, val, value);
                });
                return;
            }
            var nested = void 0,
                getValue = objectProcess.get(options),
                currentValue = getValue(path, true);

            value = wrap(path, value, target.$proxy);
            if (path.indexOf('.') > 0) {
                nested = true;
            }
            if (nested) {
                _set(target.$proxy, path, value);
            } else if (path.indexOf('[') >= 0) {
                var key = path.match(/(.*)\[(.*)\]/);
                if (key) {
                    target[key[1]].splice(key[2], 1, value);
                    return;
                } else {
                    throw new Error('Not right key' + path);
                }
            } else {
                target[path] = value;
            }
            if ((currentValue !== value || config.forceUpdate) && !nested) {
                events.trigger('change', {
                    key: path
                });
            }
        };
    },
    on: function on(options) {
        return function on() {
            var events = options.events;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return events.on.apply(events, args);
        };
    },
    off: function off(options) {
        return function off() {
            var events = options.events;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return events.off.apply(events, args);
        };
    },
    trigger: function trigger(options) {
        return function trigger() {
            var events = options.events;

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return events.trigger.apply(events, args);
        };
    },
    toJSON: function toJSON(options) {
        return function toJSON() {
            var target = options.target;
            return rawJSON(target);
        };
    },
    reset: function reset(options) {
        var target = options.target;

        return function () {
            Object.keys(target).forEach(function (key) {
                target.$proxy.set(key, undefined);
            });
        };
    }
};

var arrayProcess = {};

['on', 'off', 'trigger'].forEach(function (method) {
    arrayProcess[method] = objectProcess[method];
});

['pop', 'shift', 'push', 'unshift', 'sort', 'reverse', 'splice'].forEach(function (method) {
    arrayProcess[method] = function (options) {
        var target = options.target,
            events = options.events;

        return function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            // todo: 这里利用了新增项会调用set方法的特性，没有对新增项进行observable包裹
            var ret = Array.prototype[method].apply(target.$proxy, args);
            target.$proxy.trigger('change', {});
            return ret;
        };
    };
});

var whiteList = ['_reactFragment', 'constructor'];

var observable = function observable(object) {
    if (object.$proxy) {
        return object;
    }

    var proxy = function proxy(object, parent) {
        var events = new _events2.default();
        var returnProxy = void 0;
        var handler = {
            get: function get(target, key) {
                if (key === '$raw') {
                    return rawJSON(target);
                }
                if (Array.isArray(target) && arrayProcess.hasOwnProperty(key)) {
                    return arrayProcess[key]({
                        target: target,
                        key: key,
                        events: events
                    });
                }
                if (objectProcess.hasOwnProperty(key)) {
                    return objectProcess[key]({
                        target: target,
                        key: key,
                        events: events
                    });
                }
                if (Array.isArray(target) || whiteList.indexOf(key) > -1 || typeof key === 'string' && key.charAt(0) === '_') {
                    return Reflect.get(target, key);
                }
                var getValue = objectProcess.get({
                    target: target,
                    key: key,
                    events: events
                });
                return getValue(key);
            },
            set: function set(target, key, value) {
                if (Array.isArray(target)) {
                    if ((0, _utils.isPlainObject)(value)) {
                        value = observable(value);
                        value.on('change', function (args) {
                            // todo: 待优化，现在任何item的更新都会触发针对list的更新
                            target.$proxy.trigger('change', {});
                        });
                    }
                    var _ret = Reflect.set(target, key, value);
                    return true;
                }
                objectProcess.set({
                    target: target,
                    events: events
                })(key, value);
                return true;
            }
        };
        returnProxy = new Proxy(object, handler);
        if (!object.$proxy) {
            Object.defineProperty(object, '$proxy', {
                get: function get() {
                    return returnProxy;
                }
            });
        }
        return returnProxy;
    };
    var ret = proxy(object);
    if ((0, _utils.isPlainObject)(object)) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                object[key] = wrap(key, object[key], ret);
            }
        }
    } else if (Array.isArray(object)) {
        object.forEach(function (item, index) {
            object[index] = wrap(index, object[index], ret);
        });
    }
    return ret;
};

exports.default = observable;
module.exports = exports['default'];