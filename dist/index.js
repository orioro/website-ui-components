'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('@orioro/website-ui-components/src/system');
var dialog = _interopDefault(require('@orioro/website-ui-components/components/dialog'));
var tabs = _interopDefault(require('@orioro/website-ui-components/components/tabs'));
var trigger = _interopDefault(require('@orioro/website-ui-components/components/trigger'));
var scrollTarget = _interopDefault(require('@orioro/website-ui-components/components/scroll-target'));

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var createSystem = function createSystem() {
  var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'component';
  var components = arguments.length > 1 ? arguments[1] : undefined;
  return componentSystem(namespace, [dialog(), tabs(), trigger(), scrollTarget()].concat(_toConsumableArray(components)));
};

exports.default = createSystem;
