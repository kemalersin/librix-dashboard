var _ = require('lodash'),
  express = require('express'),
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
  });
});

router.get('/mapdata', function (req, res, next) {
  jsonfile.readFile(config.root + '/data/activities.json', function(err, obj) {
    var data = _.chain(obj).groupBy(function (activity) {
      return activity['Il'];
    }).toPairs().transform(function (result, value) {
      result.push({
        id: value[0],
        value: _.size(value[1])
      });
    }, []).value();

    res.send({
      map: 'turkeyHigh',
      areas: data
    });
  });
});
