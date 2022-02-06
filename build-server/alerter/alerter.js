"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _lodash = _interopRequireDefault(require("lodash"));

var _candleService = _interopRequireDefault(require("../services/candleService"));

var _marketDetails = _interopRequireDefault(require("../services/marketDetails"));

var _telegramService = _interopRequireDefault(require("../services/telegramService"));

var _userService = _interopRequireDefault(require("../services/userService"));

_dotenv["default"].config();

var BULL_THRESHOLD_TO_NOTIFY = process.env.BULL_THRESHOLD_TO_NOTIFY;

var getMarketChanges = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var baseCurrency,
        investingMarkets,
        responses,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            baseCurrency = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : "INR";
            investingMarkets = _marketDetails["default"].filter(function (marketDetail) {
              return marketDetail.base_currency_short_name === baseCurrency;
            });
            responses = investingMarkets.map( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(investingMarket) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _candleService["default"].getMarketData(investingMarket);

                      case 2:
                        return _context.abrupt("return", _context.sent);

                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }());
            _context2.next = 5;
            return Promise.all(responses).then(function (marketChanges) {
              var filtered = _lodash["default"].filter(marketChanges, function (marketChange) {
                return marketChange !== null;
              });

              return _lodash["default"].sortBy(filtered, 'changePercent').reverse();
            });

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getMarketChanges() {
    return _ref.apply(this, arguments);
  };
}();

var checkLastMarket = function checkLastMarket(marketChange, lastMarkets) {
  var lastMarket = lastMarkets[marketChange.symbol];

  if (lastMarket) {
    var changeFromLast = marketChange.changePercent - lastMarket.changePercent;
    return changeFromLast > 0.5 || changeFromLast < -0.5;
  } else return true;
};

var formatNumber = function formatNumber(num) {
  if (num < 0) {
    return "-(".concat(num.toPrecision(2) * -1, ")");
  }

  return num.toPrecision(2);
};

var alert = function alert() {
  var baseCurrency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "INR";
  return Promise.all([getMarketChanges(baseCurrency), _userService["default"].getBalances()]).then(function (values) {
    var marketChanges = values[0];
    var balances = values[1];
    var lastMarkets = [];
    lastMarkets = _lodash["default"].keyBy(lastMarkets, function (lastMarket) {
      return lastMarket.symbol;
    });
    var bearInvestments = marketChanges.filter(function (marketChange) {
      var balanceFound = _lodash["default"].find(balances, function (balance) {
        return balance.currency === marketChange.currency;
      });

      return balanceFound && marketChange.changePercent < -3.5 && marketChange.recentCandleValue * balanceFound.balance > 20;
    });
    var filtered = marketChanges.filter(function (marketChange) {
      return marketChange.changePercent > BULL_THRESHOLD_TO_NOTIFY && marketChange.lastCandleDeviationPercent > -0.5 && checkLastMarket(marketChange, lastMarkets);
    });
    filtered = filtered.concat(bearInvestments);

    if (filtered.length > 0) {
      // fileService.storeLastMarket(filtered);
      var message = "<b>Markets Now for ".concat(baseCurrency, "\n</b>");
      message = message + "___________________\n\n";
      message = message + filtered.map(function (marketChange) {
        return "<a href=\"".concat(marketChange.url, "\">").concat(marketChange.symbol, "</a>") + " - M ".concat(formatNumber(marketChange.changePercent), " ") + " - V ".concat(formatNumber(marketChange.changeVolumePercent), "\n");
      }).join("");
      message = message + '\n<a href="http://go.coindcx.com">Open App</a>\n';
      message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/INR">INR Alerts</a>\n';
      message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/BTC">BTC Alerts</a>\n';
      message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/USDT">USDT Alerts</a>\n';
      console.log(message);

      _telegramService["default"].postMessage(message);
    }
  });
};

var _default = {
  alert: alert
};
exports["default"] = _default;