"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var getHeaders = function getHeaders(body) {
  var COIN_DCX_KEY = process.env.COIN_DCX_KEY;
  var COIN_DCX_SECRET = process.env.COIN_DCX_SECRET;
  var payload = new Buffer.from(JSON.stringify(body)).toString();

  var signature = _crypto["default"].createHmac('sha256', COIN_DCX_SECRET).update(payload).digest('hex');

  return {
    'X-AUTH-APIKEY': COIN_DCX_KEY,
    'X-AUTH-SIGNATURE': signature,
    'Content-Type': 'application/json'
  };
};

var _default = {
  getHeaders: getHeaders
};
exports["default"] = _default;