/**
 * @module config - Access to configuration variables
 *
 * @method get  - fetch a particular configuration variable.
 * @method list - list all features that are available.
 */
var config = (function() {
  var config;
  var ready = false;

  $.ajax({
    url: "config.json",
    dataType: "JSON",
    success: function(data) {
      config = data;
      ready = true;
    }
  });

  return {
    get: function(name) {
      if (!ready) {
        throw new Error("config not ready yet");
      }
      return config[name];
    },

    list: function() {
      return Object.keys(config);
    }
  }
})();
