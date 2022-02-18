"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _lodash = _interopRequireDefault(require("lodash"));

var _candleService = _interopRequireDefault(require("../services/candleService"));

var _marketDetails = _interopRequireDefault(require("../services/marketDetails"));

var _telegramService = _interopRequireDefault(require("../services/telegramService"));

var _userService = _interopRequireDefault(require("../services/userService"));

var _process$env$BULL_VOL;

_dotenv["default"].config();

var BULL_THRESHOLD_TO_NOTIFY = process.env.BULL_THRESHOLD_TO_NOTIFY;
var BULL_VOLUME_THRESHOLD_TO_NOTIFY = (_process$env$BULL_VOL = process.env.BULL_VOLUME_THRESHOLD_TO_NOTIFY) !== null && _process$env$BULL_VOL !== void 0 ? _process$env$BULL_VOL : 20;
var DOLLAR = "\uD83D\uDCB0";
var BOX = "\uD83D\uDCE6";

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

              return filtered;
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

var formatBigNum = function formatBigNum(n) {
  if (n < 1e3) return Math.floor(n);
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

var formatNumber = function formatNumber(num) {
  if (num < 0) {
    return "(".concat(num.toPrecision(2) * -1, ")");
  } else if (num > 100) {
    console.log(num);
    return formatBigNum(num);
  }

  return num.toPrecision(2);
};

function addLinks(message) {
  message = message + '\n<a href="http://go.coindcx.com">Open App</a>';
  message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/INR">Send <b>INR Alerts</b></a>';
  message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/BTC">Send <b>BTC Alerts</b></a>';
  return message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/USDT">Send <b>USDT Alerts</b></a>';
}

var getMessageToSend = function getMessageToSend(message, data, type) {
  message = message + "\n------By ".concat(type, "----\n\n");
  message = message + data.map(function (marketChange) {
    return "<a href=\"".concat(marketChange.url, "\">").concat(marketChange.symbol, "</a>") + " - ".concat(DOLLAR, " ").concat(formatNumber(marketChange.changePercent), "% ") + " - ".concat(BOX, " ").concat(formatNumber(marketChange.changeVolumePercent), "%\n");
  }).join("");
  return message;
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

    var filteredByValue = _lodash["default"].sortBy(marketChanges, 'changePercent').reverse().filter(function (marketChange) {
      return marketChange.changePercent > BULL_THRESHOLD_TO_NOTIFY && marketChange.lastCandleDeviationPercent > -0.5 && checkLastMarket(marketChange, lastMarkets);
    }).slice(0, 5);

    var filteredByVolume = _lodash["default"].sortBy(marketChanges, 'changeVolumePercent').reverse().filter(function (marketChange) {
      return marketChange.changeVolumePercent > BULL_VOLUME_THRESHOLD_TO_NOTIFY;
    }).slice(0, 3);

    filteredByValue = filteredByValue.concat(bearInvestments);
    var message = "<b>Markets Now for ".concat(baseCurrency, "\n</b>");

    if (filteredByValue.length > 0 || filteredByVolume.length > 0) {
      if (filteredByValue.length > 0) {
        console.log('Getting messages by Value');
        message = getMessageToSend(message, filteredByValue, 'Value');
      }

      if (filteredByVolume.length > 0) {
        console.log('Getting messages by Volume');
        message = getMessageToSend(message, filteredByVolume, 'Volume');
      }

      message = addLinks(message);
      console.log(message);

      _telegramService["default"].postMessage(message);
    }
  });
};

var _default = {
  alert: alert
};
exports["default"] = _default;