"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var LAST_MARKET_JSON = "./lastMarket.json";

var storeLastMarket = function storeLastMarket(markets) {
  _fs["default"].writeFileSync(LAST_MARKET_JSON, JSON.stringify(markets));
};

var readLastMarket = function readLastMarket(markets) {
  if (_fs["default"].existsSync(LAST_MARKET_JSON)) {
    return JSON.parse(_fs["default"].readFileSync(LAST_MARKET_JSON, JSON.stringify(markets), "utf8"));
  }

  return [];
};

var _default = {
  storeLastMarket: storeLastMarket,
  readLastMarket: readLastMarket
};
exports["default"] = _default;