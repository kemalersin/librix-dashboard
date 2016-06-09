var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'librix-dashboard'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/librix-dashboard-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'librix-dashboard'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/librix-dashboard-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'librix-dashboard'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/librix-dashboard-production'
  }
};

module.exports = config[env];
