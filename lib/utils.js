'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var checkType = function checkType(item) {
    return Object.prototype.toString.call(item).replace(/\[object\s(.*)\]/, function (all, matched) {
        return matched;
    });
};

var isPlainObject = exports.isPlainObject = function isPlainObject(item) {
    return checkType(item) === 'Object';
};
var isArray = exports.isArray = function isArray(item) {
    return checkType(item) === 'Array';
};

var throttle = exports.throttle = function throttle(target, key, descriptor) {
    var fn = target[key];
    var limit = 300;
    var wait = false;
    descriptor.value = function () {
        if (!wait) {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            fn.apply(this, args);
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    };
};

var warning = exports.warning = function warning(msg) {
    console.error(msg);
};