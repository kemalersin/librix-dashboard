var express = require('express'),
  jsonfile = require('jsonfile'),
  config = require('../../config/config'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Librix Dashboard'
  });
});

router.get('/institutions', function (req, res, next) {
  jsonfile.readFile(config.root + '/data/institutions.json', function(err, obj) {
    res.send({
      data: obj
    });
  })
});
