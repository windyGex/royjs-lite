'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable no-cond-assign */

function Events() {}

Events.prototype = {
    on: function on(type, callback) {
        var cache = void 0;
        if (!callback) return this;
        if (!this.__events) {
            Object.defineProperty(this, '__events', {
                value: {}
            });
        }
        cache = this.__events;
        (cache[type] || (cache[type] = [])).push(callback);
        return this;
    },
    off: function off(type, callback) {
        var cache = this.__events;
        if (cache && cache[type]) {
            var index = cache[type].indexOf(callback);
            if (index !== -1) {
                cache[type].splice(index, 1);
            }
        }
        return this;
    },
    trigger: function trigger(type, evt) {
        var cache = this.__events;
        if (cache && cache[type]) {
            cache[type].forEach(function (callback) {
                return callback(evt);
            });
        }
    }
};

// Mix `Events` to object instance or Class function.
Events.mixTo = function (receiver) {
    receiver = typeof receiver === 'function' ? receiver.prototype : receiver;
    var proto = Events.prototype;
    for (var p in proto) {
        if (proto.hasOwnProperty(p)) {
            Object.defineProperty(receiver, p, {
                value: proto[p]
            });
        }
    }
};

exports.default = Events;
module.exports = exports['default'];