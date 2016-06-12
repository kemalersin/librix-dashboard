(function ($) {
  'use strict';

  var charts = {};
  var chartConfig = {};

  var scroll = function (el, reset) {
    if (reset) {
      slider.unslider('animate:first');
      dtInstitutions.rows().deselect();
    }

    $('html, body').stop().animate({
      scrollTop: ($(el).offset().top - $('.navbar-fixed-top').height())
    }, 1250, 'easeInOutExpo');
  }

  var chartRender = function (event) {
    $('.amcharts-chart-div a').remove();
  }

  var mapClick = function (event) {
    scroll('#institutions', true);
    dtInstitutions.columns(1).search(event.mapObject.title).draw();
  }

  var mapHomeClick = function (event) {
    scroll('#institutions', true);
    dtInstitutions.columns(1).search('').draw();
  }

  var slider = $('#institutions').unslider({
    arrows: false,
    autoplay: false,
    keys: false,
    nav: false
  });

  slider.on('unslider.change', function(event, index, slide) {
    if (index === 2) {
      setTimeout(function () {
        $('img.lazy.collapse').fadeIn('slow');
      }, 500);
    }
  });

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

  $('a.page-scroll').click(function(event) {
    event.preventDefault();
    scroll($(this).attr('href'));
  });

  $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
    $('.navbar-collapse > ul > li.active').removeClass('active');
    $(this).parent('li').addClass('active');
    $('.navbar-toggle:visible').click();
  });

  $(document).on('click', 'a.slide-back', function (event) {
    var $this = $(this);

    event.preventDefault();
    slider.unslider('prev');

    if ($this.hasClass('to-institutions')) {
      dtInstitutions.rows().deselect();
    }
    else if ($this.hasClass('to-activities')) {
      dtActivities.rows().deselect();
    }
  }).on('click', '.thumb', function () {
    $('.thumb.selected').removeClass('selected');

    $(this).addClass('selected');

    $('.main-img').find('img').hide()
      .attr('src', this.src).fadeIn(1000);
  });

  var dtActivities,
    dtInstitutions = $('#institutions-table').DataTable({
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

  dtInstitutions.on('select', function (e, dt, type, indexes) {
    $.map(dt.rows({ selected: true }).data(), function (data) {
      var isNew = typeof dtActivities === 'undefined';

      if (!isNew) {
        dtActivities.destroy();
      }

      dtActivities = $('#activities-table').DataTable({
        ajax: '/activities/' + data['Kod'],
        pageLength: dt.page.len(),
        destroy: true,
        processing: true,
        scrollX: true,
        select: {
          style: 'single',
          blurable: true,
          info: false,
          className: 'row-selected'
        },
        dom: '<"row"<"dt-info col-sm-6"><"col-sm-6 hidden-xs"f>>rt<"row"<"col-sm-6"i><"col-sm-6"p>>',
        columns: [
          { data: 'BaslangicTarihi', width: '15%', type: 'date' },
          { data: 'BitisTarihi', width: '15%', type: 'date' },
          { data: 'Konu', width: '45%' },
          { data: 'IlgiliKisi', width: '20%' },
          { data: 'Tamamlandi', width: '15%' }
        ],
        columnDefs: [{
          targets: [0, 1],
          render: function (data, type, full, meta) {
            return moment(data).format('DD.MM.Y');
          }
        }, {
          targets: 4,
          render: function (data, type, full, meta) {
            return (data === true) ?
              '<i class="fa fa-check-square-o text-success"></i> Tamamlandı' :
              '<i class="fa fa-square-o text-danger"></i> Tamamlanmadı';
          }
        }],
        order: [[ 0, 'asc' ]],
        language: {
          url: '/js/datatables/Turkish.json'
        }
      });

      dtActivities.one('draw', function () {
        $('.container.activities').find('.dt-info').html(
          '<a href class="slide-back to-institutions"><i class="fa fa-chevron-left" aria-hidden="true"></i></a> ' +
          '<span class="text-primary"><strong>' + data['Tanim'] + ' Etkinlikleri</strong></span>'
        );

        slider.unslider('next');
      });

      if (isNew) {
        dtActivities.on('select', function (e, dt, type, indexes) {
          $.map(dt.rows({ selected: true }).data(), function (data) {
            $.get('/activity/' + data['Id'], function (data) {
              var $activity = $('.container.activity'),
                $images = $activity.find('.images'),
                $info = $activity.find('.info');

              var begDate = data['BaslangicTarihi'],
                endDate = data['BitisTarihi'],
                days = moment(endDate).diff(begDate, 'd');

              if (days === 0) {
                days++;
              }

              $activity.find('.subject').text(data['Konu']);

              $activity.find('.date span').text(
                moment(begDate).format('DD.MM.Y') +
                ' (' + days + ' gün)'
              );

              $activity.find('.summary').html('<strong>' + data['Ozet'] + '</strong>');
              $activity.find('.description').html('<div class="text">' + data['Aciklama'] + '</div>');

              $activity.find('.text').mCustomScrollbar({
                theme: 'inset-dark',
                scrollButtons: { enable: true },
                advanced: { updateOnContentResize: true }
              });

              $images.find('.thumbnails').html('');

              if (typeof data['Gorseller'] === 'undefined' || data['Gorseller'].length === 0) {
                $images.hide();

                $info.removeClass('col-sm-6')
                  .addClass('col-sm-12');
              }
              else {
                $images.show();

                $info.removeClass('col-sm-12')
                  .addClass('col-sm-6');

                $images.find('.main-img').html('<img class="lazy collapse" src="' + data['Gorseller'][0] + '" />');

                if (data['Gorseller'].length > 1) {
                  $images.find('.row:first-child').height(365);
                  $images.find('.row:last-child').show();

                  data['Gorseller'].forEach(function (src) {
                    $images.find('.thumbnails').append('<img class="lazy thumb collapse" src="' + src + '" />');
                  });

                  $images.find('.thumb:first-child').addClass('selected');
                }
                else {
                  $images.find('.row:first-child').height(436);
                  $images.find('.row:last-child').hide();
                }
              }

              slider.unslider('next');
            });
          });
        });
      }
    });
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
      method: chartRender
    }, {
      event: 'clickMapObject',
      method: mapClick
    }, {
      event: 'homeButtonClicked',
      method: mapHomeClick
    }]
  });

  chartConfig.chart1 = {
    theme: 'light',
    type: 'serial',
    startDuration: 2,
    dataLoader: {
      url: '/charts/top-10-counties',
      format: 'json'
    },
    valueAxes: [{
      position: 'left',
      title: 'Etkinlikler',
      titleColor: '#193b2b',
      titleFontSize: 14
    }],
    graphs: [{
      balloonText: '[[category]]: <b>[[value]]</b>',
      fillColorsField: 'color',
      fillAlphas: 1,
      lineAlpha: 0.1,
      type: 'column',
      valueField: 'activities'
    }],
    depth3D: 20,
    angle: 30,
    chartCursor: {
      categoryBalloonEnabled: false,
      cursorAlpha: 0,
      zoomable: false
    },
    categoryField: 'county',
    categoryAxis: {
      gridPosition: 'start',
      labelRotation: 45
    },
    export: {
      enabled: true
    },
    listeners: [{
      event: 'rendered',
      method: chartRender
    }]
  };

  chartConfig.chart2 = {
    theme: 'light',
    type: 'serial',
    startDuration: 2,
    dataLoader: {
      url: '/charts/top-10-institutions',
      format: 'json'
    },
    valueAxes: [{
      position: 'left',
      title: 'Etkinlikler',
      titleColor: '#451c32',
      titleFontSize: 14
    }],
    graphs: [{
      balloonText: '[[category]]: <b>[[value]]</b>',
      fillColors: '#e4c2d2',
      fillAlphas: 1,
      lineAlpha: 0.1,
      type: 'column',
      valueField: 'activities'
    }],
    depth3D: 20,
    angle: 30,
    rotate: true,
    categoryField: 'institute',
    categoryAxis: {
      color: '#e4c2d2',
      gridPosition: 'start',
      fillAlpha: 0.05,
      position: 'right'
    },
    export: {
      enabled: true
    },
    listeners: [{
      event: 'rendered',
      method: chartRender
    }]
  };

  chartConfig.chart3 = {
    type: 'serial',
    theme: 'light',
    marginRight: 40,
    marginLeft: 40,
    autoMarginOffset: 20,
    dataLoader: {
      url: '/charts/activities-by-month',
      format: 'json'
    },
    synchronizeGrid: true,
    valueAxes: [{
      id: 'v1',
      axisAlpha: 0,
      position: 'left',
      ignoreAxisWidth: true
    }, {
      id: 'v2',
      axisAlpha: 1,
      position: 'right',
      title: 'Tamamlananlar',
      titleColor: '#3d4715',
      titleFontSize: 14
    }],
    balloon: {
      borderThickness: 1,
      shadowAlpha: 0
    },
    graphs: [{
      id: 'g1',
      valueAxis: 'v1',
      balloon: {
        drop: true,
        adjustBorderColor: false,
        color: '#ffffff'
      },
      bullet: 'round',
      bulletBorderAlpha: 1,
      bulletColor: '#2bc792',
      bulletSize: 5,
      hideBulletsCount: 50,
      lineThickness: 2,
      lineColor: '#c9ed4c',
      title: 'red line',
      useLineColorForBulletBorder: true,
      valueField: 'activities',
      balloonText: '<span style="font-size:18px;">[[value]]</span>'
    },{
      id: 'g2',
      valueAxis: 'v2',
      balloon: {
        drop: true,
        adjustBorderColor: false,
        color: '#ffffff'
      },
      bullet: 'square',
      bulletBorderAlpha: 1,
      bulletColor: '#2bc792',
      bulletSize: 5,
      hideBulletsCount: 50,
      lineThickness: 2,
      lineColor: '#FCD202',
      title: 'red line',
      useLineColorForBulletBorder: true,
      valueField: 'completed',
      balloonText: '<span style="font-size:18px;">[[value]]</span>'
    }],
    chartCursor: {
      valueLineEnabled: true,
      valueLineBalloonEnabled: true,
      cursorAlpha: 1,
      cursorColor: '#258cbb',
      limitToGraph: 'g1',
      valueLineAlpha: 0.2,
    },
    categoryField: 'month',
    categoryAxis: {
      dashLength: 1,
      minorGridEnabled: true
    },
    export: {
      enabled: true
    },
    listeners: [{
      event: 'rendered',
      method: chartRender
    }]
  };



  $('#charts').unslider().on('unslider.change', function(event, index, slide) {
    setTimeout(function () {
      var chart = 'chart' + (parseInt(index) + 1);

      if (typeof charts[chart] === 'undefined') {
        charts[chart] = AmCharts.makeChart(chart, chartConfig[chart]);
      }
    }, 750);
  });

  $(window).scroll(function() {
    if (typeof charts['chart1'] == 'undefined') {
      var hT = $('#chart1').offset().top,
        hH = $('#chart1').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();

      if (wS > (hT + hH - wH)) {
        charts['chart1'] = AmCharts.makeChart('chart1', chartConfig['chart1']);
      }
    }
  });
})(jQuery);
