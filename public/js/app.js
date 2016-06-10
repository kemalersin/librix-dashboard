(function ($) {
  'use strict';

  var scroll = function (el, reset) {
    if (reset) {
      slider.unslider('animate:first');
      dtInstitutions.rows().deselect();
    }

    $('html, body').stop().animate({
      scrollTop: ($(el).offset().top - $('.navbar-fixed-top').height())
    }, 1250, 'easeInOutExpo');
  }

  var mapRender = function (e) {
    $('.amcharts-chart-div a').remove();
  }

  var mapClick = function (e) {
    scroll('#institutions', true);
    dtInstitutions.columns(1).search(e.mapObject.title).draw();
  }

  var mapHomeClick = function (e) {
    scroll('#institutions', true);
    dtInstitutions.columns(1).search('').draw();
  }

  var initBack = function () {
    $('a.slide-back').one('click', function (e) {
      e.preventDefault();
      slider.unslider('prev');

      if ($(this).hasClass('to-institutions')) {
        dtInstitutions.rows().deselect();
      }
    });
  }

  var slider = $('#institutions').unslider({
    arrows: false,
    autoplay: false,
    keys: false,
    nav: false
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

  $('a.page-scroll').click(function(e) {
    e.preventDefault();
    scroll($(this).attr('href'));
  });

  $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
    $('.navbar-collapse > ul > li.active').removeClass('active');
    $(this).parent('li').addClass('active');
    $('.navbar-toggle:visible').click();
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
        "columnDefs": [{
          "targets": [0, 1],
          "render": function (data, type, full, meta) {
            return moment(data).format('DD.MM.Y');
          }
        }, {
          "targets": 4,
          "render": function (data, type, full, meta) {
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
        $('.dt-info').html(
          '<a href class="slide-back to-institutions"><i class="fa fa-chevron-left" aria-hidden="true"></i></a> ' +
          '<span class="text-primary"><strong>' + data['Tanim'] + ' Etkinlileri</strong></span>'
        );

        initBack();
        slider.unslider('next');
      });

      if (isNew) {
        dtActivities.on('select', function (e, dt, type, indexes) {
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
