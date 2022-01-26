"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _alerter = _interopRequireDefault(require("../alerter/alerter"));

var scheduleJob = function scheduleJob(min, currency) {
  return _nodeSchedule["default"].scheduleJob("".concat(min, " * * * *"), /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Exec at ".concat(new Date(), " for ").concat(currency));

            _alerter["default"].alert(currency);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
};

var run = function run() {
  [0, 15, 30, 45].forEach(function (time) {
    return scheduleJob(time, 'INR');
  });
  console.log('Scheduled a alerting job for INR');
};

var runBTC = function runBTC() {
  [5, 20, 35, 50].forEach(function (time) {
    return scheduleJob(time, 'BTC');
  });
  console.log('Scheduled a alerting job for BTC');
};

var runUSDT = function runUSDT() {
  [10, 25, 40, 55].forEach(function (time) {
    return scheduleJob(time, 'USDT');
  });
  console.log('Scheduled a alerting job for USDT');
};

var _default = {
  run: run,
  runBTC: runBTC,
  runUSDT: runUSDT
};
exports["default"] = _default;