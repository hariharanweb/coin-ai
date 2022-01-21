"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _apiUtils = _interopRequireDefault(require("./apiUtils"));

var _axios = _interopRequireDefault(require("axios"));

var _marketDetails = _interopRequireDefault(require("./marketDetails"));

var _lodash = _interopRequireDefault(require("lodash"));

var order = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(marketPair, marketPrice, amount) {
    var marketDetail, quantity, market, body, headers, response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            marketDetail = _lodash["default"].find(_marketDetails["default"], function (marketDetail) {
              return marketDetail.pair === marketPair;
            });
            console.log(amount, marketPrice);
            quantity = toFixed(amount / marketPrice, marketDetail.target_currency_precision);
            market = marketDetail.symbol;
            body = {
              "side": "buy",
              "order_type": "market_order",
              "market": market,
              "total_quantity": quantity,
              "timestamp": Math.floor(Date.now())
            };
            headers = _apiUtils["default"].getHeaders(body);
            console.log(JSON.stringify(body), headers, marketDetail);
            _context.next = 9;
            return _axios["default"].post('https://api.coindcx.com/exchange/v1/orders/create', body, {
              headers: headers
            })["catch"](function (error) {
              console.log(error.response.data);
              return error;
            });

          case 9:
            response = _context.sent;
            return _context.abrupt("return", response.data);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function order(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var toFixed = function toFixed(num, fixed) {
  console.log(num, fixed);
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
};

var _default = {
  order: order
};
exports["default"] = _default;