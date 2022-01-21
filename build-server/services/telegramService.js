"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var TELEGRAM_BOT_KEY = process.env.TELEGRAM_BOT_KEY;
var TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

var postMessage = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(message) {
    var response;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios["default"].post("https://api.telegram.org/bot".concat(TELEGRAM_BOT_KEY, "/sendMessage"), "chat_id=".concat(TELEGRAM_GROUP_ID, "&text=").concat(message, "&parse_mode=html"));

          case 2:
            response = _context.sent;
            return _context.abrupt("return", response.data);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function postMessage(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = {
  postMessage: postMessage
};
exports["default"] = _default;