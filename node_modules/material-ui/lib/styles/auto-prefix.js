'use strict';

var isBrowser = typeof window !== 'undefined';
var Modernizr = isBrowser ? require('../utils/modernizr.custom') : undefined;

module.exports = {

  all: function all(styles) {
    var prefixedStyle = {};
    for (var key in styles) {
      prefixedStyle[this.single(key)] = styles[key];
    }
    return prefixedStyle;
  },

  set: function set(style, key, value) {
    style[this.single(key)] = value;
  },

  single: function single(key) {
    if (isBrowser) {
      // Windows 7 Firefox has an issue with the implementation of Modernizr.prefixed
      // and is capturing 'false' as the CSS property name instead of the non-prefixed version.
      var prefKey = Modernizr.prefixed(key);
      return prefKey === false ? key : prefKey;
    } else {
      return key;
    }
  },

  singleHyphened: function singleHyphened(key) {
    var str = this.single(key);

    return !str ? key : str.replace(/([A-Z])/g, function (str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  }

};