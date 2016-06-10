(function ($) {
  'use strict';

  var mapRender = function (e) {
    $('.amcharts-chart-div a').remove();
  }

  var mapClick = function (e) {
    dataTable.columns(1).search(e.mapObject.title).draw();
  }

  var mapHomeClick = function (e) {
    dataTable.columns(1).search('').draw();
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

  var dataTable = $('#institutions-table').DataTable({
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
      url: '/js/datatables/Turkish.json'
    }
  });

  AmCharts.makeChart('map', {
    type: 'map',
    autoDisplay: true,
    theme: 'light',
    colorSteps: 10,

    dataProvider: {
      map: 'turkeyHigh',
      getAreasFromMap: true
    },

    valueLegend: {
      right: 10,
      minValue: 'Hiç Yok',
      maxValue: 'Çok Fazla',
      color: '#fff'
    },

    areasSettings: {
      autoZoom: false,
      selectable: true,
      balloonText: '[[title]]:<strong>[[value]]</strong> ([[percent]]%)'
    },

    dataLoader: {
      url: '/mapdata',
      format: 'json'
    },

    listeners: [{
      event: 'rendered',
      method: mapRender
    }, {
      event: 'clickMapObject',
      method: mapClick
    }, {
      event: 'homeButtonClicked',
      method: mapHomeClick
    }]
  });
})(jQuery);
