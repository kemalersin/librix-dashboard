var _ = require('lodash'),
  express = require('express'),
  jsonfile = require('jsonfile'),
  config = require('../../config/config'),
  router = express.Router();

const chartColors = [
  '#FF0F00', '#FF9E01', '#FCD202', '#F8FF01', '#B0DE09',
  '#04D215', '#0D8ECF', '#0D52D1', '#2A0CD0', '#8A0CCF'];

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
    var data = _.chain(obj)
      .groupBy(function (activity) {
        return activity['IlKodu'];
      })
      .toPairs().transform(function (result, value) {
        result.push({
          id: value[0],
          value: _.size(value[1])
        });
      }, [])
      .value();

    res.send({
      map: 'turkeyHigh',
      areas: data
    });
  });
});

router.get('/activities/:institute', function (req, res, next) {
  jsonfile.readFile(config.root + '/data/activities/' + req.params['institute'] + '.json', function(err, obj) {
    var data = _.transform(obj, function (result, value) {
        result.push(_.pick(value, [
          'Id',
          'BaslangicTarihi',
          'BitisTarihi',
          'Konu',
          'IlgiliKisi',
          'Tamamlandi'
        ]));
      }, []);

    res.send({
      data: data
    });
  });
});

router.get('/activity/:institute/:id', function (req, res, next) {
  jsonfile.readFile(config.root + '/data/activities/' + req.params['institute'] + '.json' , function(err, obj) {
    var data = _.chain(obj)
      .filter({'Id': _.parseInt(req.params['id'])})
      .head();

    res.send(data);
  });
});

router.get('/charts/top-10-counties', function (req, res, next) {
  jsonfile.readFile(config.root + '/data/charts/top-10-counties.json', function(err, obj) {
    var data = _.chain(obj)
      .transform(function (result, value, key) {
        result.push({
          county: value['county'],
          activities: value['activities'],
          color: chartColors[key]
        });
      }, [])
      .value();

    res.send(data);
  });
});

router.get('/charts/top-10-institutions', function (req, res, next) {
  jsonfile.readFile(config.root + '/data/charts/top-10-institutions.json', function(err, obj) {
    res.send(obj);
  });
});

router.get('/charts/activities-by-month', function (req, res, next) {
  jsonfile.readFile(config.root + '/data/charts/activities-by-month.json', function(err, obj) {
    res.send(obj);
  });
});
