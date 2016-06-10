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

  $('a.page-scroll').click(function(e) {
    var $anchor = $(this);

    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top - $('.navbar-fixed-top').height())
    }, 1250, 'easeInOutExpo');

    e.preventDefault();
  });

  $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
    $('.navbar-collapse > ul > li.active').removeClass('active');
    $(this).parent('li').addClass('active');
    $('.navbar-toggle:visible').click();
  });

  $('#institutions-table').DataTable({
    ajax: '/institutions',
    pageLength: 25,
    processing: true,
    scrollX: true,
    select: {
      style: 'single',
      blurable: true,
      info: false,
      className: 'row-selected'
    },
    columns: [
      { data: 'Kod', width: '10%' },
      { data: 'Il', width: '10%' },
      { data: 'Ilce', width: '10%' },
      { data: 'Tanim', width: '30%' },
      { data: 'ToplamEtkinlik', width: '13%', type: 'html-num', className: 'text-center' },
      { data: 'GerceklesenEtkinlik', width: '14%', type: 'html-num', className: 'text-center' },
      { data: 'KalanEtkinlik', width: '13%', type: 'html-num', className: 'text-center' }
    ],
    order: [[ 1, 'asc' ], [ 2, 'asc' ]],
    columnDefs: [
      {
        targets: [1],
        orderData: [1, 2]
      }
    ],
    language: {
      url: "/js/datatables/Turkish.json"
    }
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
