(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("/UIComponent", ["exports", "jquery"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("jquery"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.UIComponent = mod.exports;
  }
})(this, function (_exports, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _jquery = babelHelpers.interopRequireDefault(_jquery);

  if (typeof Object.assign === 'undefined') {
    Object.assign = _jquery.default.extend;
  }

  var UIComponent =
  /*#__PURE__*/
  function () {
    function UIComponent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      babelHelpers.classCallCheck(this, UIComponent);
      this.$el = options.$el ? options.$el : (0, _jquery.default)(document);
      this.el = this.$el[0];
      delete options.$el;
      this.options = options;
      this.isProcessed = false;
    }

    babelHelpers.createClass(UIComponent, [{
      key: "initialize",
      value: function initialize() {// Initialize the UIComponent
      }
    }, {
      key: "process",
      value: function process() {// Bind the Event on the UIComponent
      }
    }, {
      key: "run",
      value: function run() {
        // run UIComponent
        if (!this.isProcessed) {
          this.initialize();
          this.process();
        }

        this.isProcessed = true;
      }
    }, {
      key: "triggerResize",
      value: function triggerResize() {
        if (document.createEvent) {
          var ev = document.createEvent('Event');
          ev.initEvent('resize', true, true);
          window.dispatchEvent(ev);
        } else {
          element = document.documentElement;
          var event = document.createEventObject();
          element.fireEvent('onresize', event);
        }
      }
    }]);
    return UIComponent;
  }();

  var _default = UIComponent;
  _exports.default = _default;
});