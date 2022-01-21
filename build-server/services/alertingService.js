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

var run = function run() {
  var job = _nodeSchedule["default"].scheduleJob('*/15 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Exec at ".concat(new Date()), _alerter["default"]);

            _alerter["default"].alert();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));

  console.log('Scheduled a alerting job');
};

var runBTC = function runBTC() {
  var job = _nodeSchedule["default"].scheduleJob('*/15 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Exec at ".concat(new Date()), _alerter["default"]);

            _alerter["default"].alert("BTC");

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));

  console.log('Scheduled a alerting job');
};

var runUSDT = function runUSDT() {
  var job = _nodeSchedule["default"].scheduleJob('*/15 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("Exec at ".concat(new Date()), _alerter["default"]);

            _alerter["default"].alert("USDT");

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));

  console.log('Scheduled a alerting job');
};

var _default = {
  run: run,
  runBTC: runBTC,
  runUSDT: runUSDT
};
exports["default"] = _default;