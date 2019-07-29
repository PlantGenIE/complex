/**
 * @module config - Access to configuration variables
 *
 * @method ready - returns a promise that is resolved when the
 *                 ajax request is finished.
 * @method get   - fetch a particular configuration variable.
 * @method list  - list all features that are available.
 */
var config = (function() {
  var config;
  var ready = false;

  var configPromise = $.ajax({
    url: "config.json",
    dataType: "JSON",
    success: function(data) {
      config = data;
    }
  });

  return {
    ready: function() {
      return configPromise.then(function() {
        ready = true;
      });
    },

    get: function(name) {
      if (!ready) {
        throw new Error('config not ready yet');
      }
      return config[name];
    },

    list: function() {
      if (!ready) {
        throw new Error('config not ready yet');
      }
      return Object.keys(config);
    }
  }
})();
