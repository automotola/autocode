// Generated by CoffeeScript 1.10.0
(function() {
  var cson, fs, init, load, loadSrc, path, setNestedPropertyValue, skeemas, xml, yaml;

  cson = require('season');

  fs = require('fs');

  path = require('path');

  skeemas = require('skeemas');

  xml = require('xml-to-jsobj');

  yaml = require('js-yaml');

  setNestedPropertyValue = function(obj, fields, val) {
    var cur, last;
    fields = fields.split('.');
    cur = obj;
    last = fields.pop();
    fields.forEach(function(field) {
      cur[field] = {};
      return cur = cur[field];
    });
    cur[last] = val;
    return obj;
  };

  init = function(project_path, validate) {
    var autocode_config, autocode_path, config, config_schema;
    if (validate == null) {
      validate = true;
    }
    project_path = project_path || this.path;
    if (!project_path) {
      throw new Error('project_path for Autocode config is required');
    }
    config = load(project_path);
    if (!config) {
      return false;
    }
    autocode_path = path.resolve(__dirname + "/../..");
    if (validate === false) {
      autocode_config = yaml.safeLoad(fs.readFileSync(autocode_path + "/.autocode/config.yml"));
      return autocode_config.exports.ConfigSchema.schema;
    } else {
      config_schema = this.load(autocode_path, false);
    }
    validate = skeemas.validate(config, config_schema);
    if (!validate.valid) {
      console.log("Configuration failed validation:");
      console.log(validate.errors);
      throw new Error("Invalid Configuration for path: " + project_path);
    }
    if (!config.host) {
      config.host = 'github.com';
    }
    this.config = config;
    this.path = project_path;
    return config;
  };

  load = function(project_path) {
    var config, ext, file, i, len, ref;
    ref = ['yml', 'yaml', 'cson', 'json', 'xml'];
    for (i = 0, len = ref.length; i < len; i++) {
      ext = ref[i];
      file = project_path + "/.autocode/config." + ext;
      if (fs.existsSync(file)) {
        config = fs.readFileSync(file);
        config = (function() {
          switch (ext) {
            case 'yml':
            case 'yaml':
              return yaml.safeLoad(config);
            case 'cson':
              return cson.readFileSync(file);
            case 'json':
              return JSON.parse(config);
            case 'xml':
              return xml.parseFromString(config);
          }
        })();
        break;
      }
    }
    return config;
  };

  loadSrc = function(file) {
    var ext, src;
    if (fs.existsSync(file)) {
      src = fs.readFileSync(file);
      ext = file.split('.');
      ext = ext[ext.length - 1];
      src = (function() {
        switch (ext) {
          case 'yml':
          case 'yaml':
            return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
          case 'cson':
            return cson.readFileSync(file);
          case 'json':
            return JSON.parse(fs.readFileSync(file, 'utf8'));
          case 'xml':
            return xml.parseFromString(fs.readFileSync(file, 'utf8'));
        }
      })();
    }
    return src;
  };

  module.exports = init;

}).call(this);
