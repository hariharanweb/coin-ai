"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _lodash = _interopRequireDefault(require("lodash"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var fetchCandles = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(marketPair) {
    var limit,
        response,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            limit = _args.length > 1 && _args[1] !== undefined ? _args[1] : 180;
            _context.next = 3;
            return _axios["default"].get("https://public.coindcx.com/market_data/candles?pair=".concat(marketPair, "&interval=1m&limit=").concat(limit))["catch"](function (error) {
              if (error.response) {
                console.log(error.response.data);
                return {
                  data: []
                };
              }
            });

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response.data.map(function (candle, index) {
              return _objectSpread(_objectSpread({}, candle), {}, {
                index: index,
                date: new Date(candle.time).toTimeString()
              });
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchCandles(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getMarketData = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(investingMarket) {
    var candles, meanByParameter, volume, tenPercent, recent, old, recentValueMean, recentVolumeMean, oldValueMean, oldVolumeMean, changeValuePercent, changeVolumePercent, recentCandleValue, recentCandleVolume, lastCandleDeviationPercent;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return fetchCandles(investingMarket.pair);

          case 2:
            candles = _context2.sent;

            if (!(candles.length === 0)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", null);

          case 5:
            meanByParameter = 'close';
            volume = 'volume';
            tenPercent = Math.round(candles.length * 0.1);
            recent = candles.slice(0, tenPercent);
            old = candles.slice(tenPercent);
            recentValueMean = _lodash["default"].meanBy(recent, meanByParameter);
            recentVolumeMean = _lodash["default"].meanBy(recent, volume);
            oldValueMean = _lodash["default"].meanBy(old, meanByParameter);
            oldVolumeMean = _lodash["default"].meanBy(old, volume);
            changeValuePercent = (recentValueMean - oldValueMean) * 100 / oldValueMean;
            changeVolumePercent = (recentVolumeMean - oldVolumeMean) * 100 / oldVolumeMean;
            recentCandleValue = candles[0][meanByParameter];
            recentCandleVolume = candles[0][volume];
            lastCandleDeviationPercent = (recentCandleValue - recentValueMean) * 100 / recentValueMean;
            return _context2.abrupt("return", {
              marketPair: investingMarket.pair,
              symbol: investingMarket.symbol,
              recentMean: recentValueMean,
              oldMean: oldValueMean,
              changePercent: changeValuePercent,
              changeVolumePercent: changeVolumePercent,
              recentCandleVolume: recentCandleVolume,
              recentCandleValue: recentCandleValue,
              lastCandleDeviationPercent: lastCandleDeviationPercent,
              currency: investingMarket.target_currency_short_name,
              url: "https://coindcx.com/trade/".concat(investingMarket.symbol)
            });

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getMarketData(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = {
  fetchCandles: fetchCandles,
  getMarketData: getMarketData
};
exports["default"] = _default;