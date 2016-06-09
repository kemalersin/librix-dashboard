(function ($) {
  'use strict';

  function updateHeatmap(event) {
    var map = event.chart;

    if (map.dataGenerated)
      return;

    if (map.dataProvider.areas.length === 0) {
      setTimeout(updateHeatmap, 100);
      return;
    }

    for (var i = 0; i < map.dataProvider.areas.length; i++) {
      map.dataProvider.areas[i].value = Math.round(Math.random() * 10000);
    }

    map.dataGenerated = true;
    map.validateNow();

    $('.amcharts-chart-div a').remove();
  }

  $('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: 51
  });

  window.sr = ScrollReveal();

  sr.reveal('.sr-contact', {
    duration: 600,
    scale: 0.3,
    distance: '0px'
  }, 300);

  $('a.page-scroll').bind('click', function(e) {
    var $anchor = $(this);

    e.preventDefault();

    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - $('.navbar-fixed-top').height())
    }, 1250, 'easeInOutExpo');
  });

  AmCharts.makeChart("map", {
    "type": "map",
    "autoDisplay": true,
    "theme": "light",
    "colorSteps": 10,

    "dataProvider": {
      "map": "turkeyHigh",
      "getAreasFromMap": true
    },

    "valueLegend": {
      "right": 10,
      "minValue": "Hiç Yok",
      "maxValue": "Çok Fazla",
      "color": "#fff"
    },

    "areasSettings": {
      "autoZoom": true,
      "balloonText": "[[title]]:<strong>[[value]]</strong> ([[percent]]%)"
    },

    "listeners": [{ "event": "init", "method": updateHeatmap }]
  });
})(jQuery);
