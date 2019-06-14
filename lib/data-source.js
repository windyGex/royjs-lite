'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function DataSource(props) {
    var _this = this;

    Object.keys(props).forEach(function (key) {
        _this[key] = props[key];
    });
}
DataSource.prototype = {
    url: '',
    request: function request() {
        console.error('需要首先引入[@royjs/core/request]才能正常工作');
    },
    get: function get(id, params) {
        return this.request.get(this.url + '/' + id, params);
    },
    patch: function patch(id, params) {
        return this.request.patch(this.url + '/' + id, params);
    },
    put: function put(id, params) {
        return this.request.put(this.url + '/' + id, params);
    },
    post: function post(params) {
        return this.request.post(this.url, params);
    },
    find: function find(params) {
        return this.request.get(this.url, params);
    },
    remove: function remove(id) {
        return this.request.delete(this.url + '/' + id);
    }
};
exports.default = DataSource;
module.exports = exports['default'];