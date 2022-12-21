(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("/UIPlugin", ["exports", "jquery"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("jquery"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.UIPlugin = mod.exports;
  }
})(this, function (_exports, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getPluginAPI = getPluginAPI;
  _exports.getPlugin = getPlugin;
  _exports.getDefaults = getDefaults;
  _exports.pluginFactory = pluginFactory;
  _exports.default = _exports.UIPlugin = void 0;
  _jquery = babelHelpers.interopRequireDefault(_jquery);
  var plugins = {};
  var apis = {};

  var UIPlugin =
  /*#__PURE__*/
  function () {
    function UIPlugin($el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      babelHelpers.classCallCheck(this, UIPlugin);
      this.name = this.getName();
      this.$el = $el;
      this.options = options;
      this.isRendered = false;
    }

    babelHelpers.createClass(UIPlugin, [{
      key: "getName",
      value: function getName() {
        return 'uiplugin';
      }
    }, {
      key: "render",
      value: function render() {
        if (_jquery.default.fn[this.name]) {
          this.$el[this.name](this.options);
        } else {
          return false;
        }
      }
    }, {
      key: "initialize",
      value: function initialize() {
        if (this.isRendered) {
          return false;
        }

        this.render();
        this.isRendered = true;
      }
    }], [{
      key: "getDefaults",
      value: function getDefaults() {
        return {};
      }
    }, {
      key: "register",
      value: function register(name, obj) {
        if (typeof obj === 'undefined') {
          return;
        }

        plugins[name] = obj;

        if (typeof obj.api !== 'undefined') {
          UIPlugin.registerApi(name, obj);
        }
      }
    }, {
      key: "registerApi",
      value: function registerApi(name, obj) {
        var api = obj.api();

        if (typeof api === 'string') {
          var _api = obj.api().split('|');

          var event = "".concat(_api[0], ".uiplugin.").concat(name);
          var func = _api[1] || 'render';

          var callback = function callback(e) {
            var $el = (0, _jquery.default)(this);
            var plugin = $el.data('pluginInstance');

            if (!plugin) {
              plugin = new obj($el, _jquery.default.extend(true, {}, getDefaults(name), $el.data()));
              plugin.initialize();
              $el.data('pluginInstance', plugin);
            }

            plugin[func](e);
          };

          apis[name] = function (selector, context) {
            if (context) {
              (0, _jquery.default)(context).off(event);
              (0, _jquery.default)(context).on(event, selector, callback);
            } else {
              (0, _jquery.default)(selector).on(event, callback);
            }
          };
        } else if (typeof api === 'function') {
          apis[name] = api;
        }
      }
    }]);
    return UIPlugin;
  }();

  _exports.UIPlugin = UIPlugin;

  function getPluginAPI(name) {
    if (typeof name === 'undefined') {
      return apis;
    }

    return apis[name];
  }

  function getPlugin(name) {
    if (typeof plugins[name] !== 'undefined') {
      return plugins[name];
    }

    console.warn("UIPlugin:".concat(name, " has no warpped class."));
    return false;
  }

  function getDefaults(name) {
    var PluginClass = getPlugin(name);

    if (PluginClass) {
      return PluginClass.getDefaults();
    }

    return {};
  }

  function pluginFactory(name, $el) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var PluginClass = getPlugin(name);

    if (PluginClass && typeof PluginClass.api === 'undefined') {
      return new PluginClass($el, _jquery.default.extend(true, {}, getDefaults(name), options));
    } else if (_jquery.default.fn[name]) {
      var plugin = new UIPlugin($el, options);

      plugin.getName = function () {
        return name;
      };

      plugin.name = name;
      return plugin;
    } else if (typeof PluginClass.api !== 'undefined') {
      // console.log('UIPlugin:' + name + ' use api render.');
      return false;
    }

    console.warn("UIPlugin:".concat(name, " script is not loaded."));
    return false;
  }

  var _default = UIPlugin;
  _exports.default = _default;
});