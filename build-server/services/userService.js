"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _apiUtils = _interopRequireDefault(require("./apiUtils"));

var _lodash = _interopRequireDefault(require("lodash"));

var getUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var body, headers, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = {
              timestamp: Math.floor(Date.now())
            };
            headers = _apiUtils["default"].getHeaders(body);
            _context.next = 4;
            return _axios["default"].post('https://api.coindcx.com/exchange/v1/users/info', body, {
              headers: headers
            });

          case 4:
            response = _context.sent;
            return _context.abrupt("return", response.data);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getUser() {
    return _ref.apply(this, arguments);
  };
}();

var getBalances = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var body, headers, response;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = {
              timestamp: Math.floor(Date.now())
            };
            headers = _apiUtils["default"].getHeaders(body);
            _context2.next = 4;
            return _axios["default"].post('https://api.coindcx.com/exchange/v1/users/balances', body, {
              headers: headers
            });

          case 4:
            response = _context2.sent;
            return _context2.abrupt("return", _lodash["default"].filter(response.data, function (balance) {
              return balance.balance > 0;
            }));

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getBalances() {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  getUser: getUser,
  getBalances: getBalances
};
exports["default"] = _default;