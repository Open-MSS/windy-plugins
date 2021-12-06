"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * This is main plugin loading function
 * Feel free to write your own compiler
 */
W.loadPlugin(
/* Mounting options */
{
  "name": "windy-plugin-mscolab",
  "version": "0.2.7",
  "author": "May Bär",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Marilyth/windy-plugins"
  },
  "description": "Windy plugin system enables anyone, with basic knowledge of Javascript to enhance Windy with new functionality (default desc).",
  "displayName": "Hello world",
  "hook": "menu"
},
/* HTML */
'',
/* CSS */
'',
/* Constructor */
function () {
  var map = W.require('map');

  console.log('I am being mounted');
  var popup = null;

  this.onopen = function () {
    console.log('I am being opened');
    var center = map.getCenter();

    if (popup) {
      popup.setLatLng(center);
    } else {
      popup = L.popup().setLatLng(center).setContent('Hello World').openOn(map);
    }
  };

  this.onclose = function () {
    console.log('I am being closed');

    if (popup) {
      map.removeLayer(popup);
      popup = null;
    }
  };
});