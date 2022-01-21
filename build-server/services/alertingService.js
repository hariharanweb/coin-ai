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
  var job = _nodeSchedule["default"].scheduleJob('*/10 * * * *', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
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

var _default = {
  run: run
};
exports["default"] = _default;