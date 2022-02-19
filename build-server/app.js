"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _userService = _interopRequireDefault(require("./services/userService"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _orderService = _interopRequireDefault(require("./services/orderService"));

var _candleService = _interopRequireDefault(require("./services/candleService"));

var _telegramService = _interopRequireDefault(require("./services/telegramService"));

var _alertingService = _interopRequireDefault(require("./services/alertingService"));

var _alerter = _interopRequireDefault(require("./alerter/alerter"));

var _marketDetails = _interopRequireDefault(require("./services/marketDetails"));

var _lodash = _interopRequireDefault(require("lodash"));

_dotenv["default"].config();

var app = (0, _express["default"])();
var port = process.env.PORT || 3000;
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.get('/', function (req, res) {
  res.send('Hello World!' + new Date());
});
app.get('/candle/:marketPair', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var candles;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _candleService["default"].fetchCandles(req.params.marketPair);

          case 2:
            candles = _context.sent;
            res.send(candles);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.get('/data/:marketPair', /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var investingMarket, data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            investingMarket = _lodash["default"].find(_marketDetails["default"], {
              pair: req.params.marketPair
            });
            _context2.next = 3;
            return _candleService["default"].getMarketData(investingMarket);

          case 3:
            data = _context2.sent;
            res.send(data);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
app.get('/marketData/:currency', /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _alerter["default"].getMarketChanges(req.params.currency);

          case 2:
            data = _context3.sent;
            res.send(data);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()); // app.get('/user', async (req, res) => {
//     const user = await userService.getUser();
//     res.send(user);
// })

app.get('/user/balances', /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var balances;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _userService["default"].getBalances();

          case 2:
            balances = _context4.sent;
            res.send(balances);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()); // app.post('/user/order', async (req, res) => {
//     const body = req.body;
//     const recentCandle = await candleService.fetchCandles(body.marketPair, 1);
//     const lastClose = recentCandle[0].close;
//     const order = await orderService.order(body.marketPair, lastClose, body.amount);
//     res.send(order);
// })

app.post('/telegram/message', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var response;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _telegramService["default"].postMessage(req.body.message);

          case 2:
            response = _context5.sent;
            res.send(response);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
app.get('/telegram/alert/:baseCurrency', /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var baseCurrency;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            baseCurrency = req.params.baseCurrency || "INR";

            _alerter["default"].alert(baseCurrency);

            res.send("Alert Sent");

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
app.listen(port, function () {
  console.log("Example app listening at http://localhost:".concat(port));
});

_alertingService["default"].run();

_alertingService["default"].runBTC();

_alertingService["default"].runUSDT();