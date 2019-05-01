"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = connect;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function createFunctionFromClass(ComponentClass) {
  function FunctionalComponent() {
    return Reflect.construct(ComponentClass, arguments, this.constructor);
  }

  Reflect.setPrototypeOf(FunctionalComponent.prototype, ComponentClass.prototype);
  Reflect.setPrototypeOf(FunctionalComponent, ComponentClass);
  return FunctionalComponent;
}

function getWrappedComponent(ComponentClass, db) {
  var Component = createFunctionFromClass(ComponentClass);

  function WrappedComponent() {
    Component.call(this);
    this.data = {};
    db.components.push(this);
    this.onDbChange(); //.catch(console.log)
  }

  WrappedComponent.prototype = new Component();
  WrappedComponent.prototype.constructor = WrappedComponent;

  WrappedComponent.prototype.onDbChange =
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(change) {
      var shouldRender;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(change && this.onChangeShouldUpdate)) {
                _context.next = 6;
                break;
              }

              _context.next = 3;
              return this.onChangeShouldUpdate(change);

            case 3:
              shouldRender = _context.sent;

              if (shouldRender) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return");

            case 6:
              if (this.getData) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return");

            case 8:
              _context.next = 10;
              return this.getData();

            case 10:
              this.data = _context.sent;
              this.setState({
                state: this.state
              });

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  return WrappedComponent;
}

function decorateDb(db) {
  if (db.components) return;
  db.components = [];
  db.changes({
    since: 'now',
    live: true,
    include_docs: true
  }).on('change', function (change) {
    db.components.forEach(
    /*#__PURE__*/
    function () {
      var _ref2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(component) {
        var doc, revs, rev;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                doc = change.doc;
                change.isInsert = doc._rev.substring(0, 2) === '1-';

                if (change.isInsert) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 5;
                return db.get(doc._id, {
                  revs_info: true,
                  revs: true
                });

              case 5:
                revs = _context2.sent;
                rev = revs._revs_info[1].rev;
                _context2.next = 9;
                return db.get(doc._id, {
                  rev: rev
                });

              case 9:
                change.previousDoc = _context2.sent;

              case 10:
                change.affects = function (selector) {
                  var isAffected = Object.keys(selector).some(function (property) {
                    var value = selector[property]; // TODO: support for $ mango operators

                    if ((0, _typeof2["default"])(value) === 'object') return true;
                    if (change.doc[property] === value) return true;
                    if (change.previousDoc && change.previousDoc[property] === value) return true;
                  });
                  return isAffected;
                };

                component.onDbChange(change);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  }).on('error', function (err) {
    console.log('changes error:', err);
  });
}

function connect(db) {
  decorateDb(db);
  return function (Component) {
    return getWrappedComponent(Component, db);
  };
}

module.exports = exports.default;
