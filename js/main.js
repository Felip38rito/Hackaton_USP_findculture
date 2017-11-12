function parser(teste){
  var date = new Date(teste);
  return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}

$(document).ready(function(){
  $.getJSON('dados_busca.json', function(dados) {
    $("input.autocomplete").autocomplete({
      data: dados,
      onAutocomplete: function (val) {
        $('#tela_listagem').modal('open');

        // $.getJSON('https://api.catracalivre.com.br/select/?q=post_type=event+AND+'+val+'&[[[FILTROS]]]&rows=[[[No_DE_RESULTADOS]]]&wt=json')
        var url = 'https://api.catracalivre.com.br/select/?q=post_type:event+AND+' + val + '&rows=10&wt=json';
        $.getJSON(url, function(data){
          // console.log(data.response.docs);
          $.get('template_item_busca.html', function(template){
            _.templateSettings = {
              interpolate: /\{\{(.+?)\}\}/g
            };

            var final = _.template(template);
            // console.log(data);
            // console.log(template);
            // console.log(final(data.response.docs[0]));
            $('.modal-content ul.collection').html('');
            $('.modal-content h4').text(val);
            data.response.docs.map(function(value, key){
              try {
                var l = $(final(value));
                l.find('a.modal-trigger').bind('click', function(){
                  localStorage.setItem("currentPost", $(this).data('post-id'))
                  $(document).trigger('load_page');
                })
                $('.modal-content ul.collection').append(l);
              } catch(e) {
                // console.log(e);
              }
            });
          });
        });
      }
    });
  });
  

  $('.modal').modal({
    inDuration: 500,
    outDuration: 500,
    ready: function(modal, trigger) {
      // console.log(modal, trigger)
      
    }
  });

  $(document).bind('load_page', function(data){
    var post = localStorage.getItem('currentPost');
    $.getJSON('https://api.catracalivre.com.br/select/?q=post_id:'+post+'&wt=json', function(data){
      $.get('template_detalhe.html', function (template) {
        _.templateSettings = {
          interpolate: /\{\{(.+?)\}\}/g
        };

        var final = _.template(template);

        $('#tela_interna').html( final( data.response.docs[0] ) );
      });      
    });

    // console.log();
  });

  navigator.geolocation.getCurrentPosition(function(position){
    localStorage.setItem('latitude', position.coords.latitude);
    localStorage.setItem('longitude', position.coords.longitude);
  });

  $('.row.buttons .btn-large.red').bind('click', function () {
    var latitude = localStorage.getItem('latitude');
    var longitude = localStorage.getItem('longitude');
    console.log(latitude, longitude);
    $.getJSON('https://api.catracalivre.com.br/select/?q=post_type=event&fq={!geofilt%20pt=' + latitude + ',' + longitude + '%20sfield=place_geolocation%20d=5}&wt=json', function (data) {
      // console.log(data);

      $.get('template_item_busca.html', function (template) {
        _.templateSettings = {
          interpolate: /\{\{(.+?)\}\}/g
        };

        var final = _.template(template);
        // console.log(data);
        // console.log(template);
        // console.log(final(data.response.docs[0]));
        $('.modal-content ul.collection').html('');
        $('.modal-content h4').text("Eventos próximos");
        data.response.docs.map(function (value, key) {
          try {
            var l = $(final(value));
            l.find('a.modal-trigger').bind('click', function () {
              localStorage.setItem("currentPost", $(this).data('post-id'))
              $(document).trigger('load_page');
            })
            $('.modal-content ul.collection').append(l);
          } catch (e) {
            // console.log(e);
          }
        });
      });
    });

  });

  $('.row.buttons .btn-large.green').bind('click', function () {
    // var latitude = localStorage.getItem('latitude');
    // var longitude = localStorage.getItem('longitude');
    // console.log(latitude, longitude);
    $.getJSON('https://api.catracalivre.com.br/select/?q=post_type:event&fq=event_price_numeric:0&wt=json', function (data) {
      // console.log(data);

      $.get('template_item_busca.html', function (template) {
        _.templateSettings = {
          interpolate: /\{\{(.+?)\}\}/g
        };

        var final = _.template(template);
        // console.log(data);
        // console.log(template);
        // console.log(final(data.response.docs[0]));
        $('.modal-content ul.collection').html('');
        $('.modal-content h4').text("Eventos gratuitos");
        data.response.docs.map(function (value, key) {
          try {
            var l = $(final(value));
            l.find('a.modal-trigger').bind('click', function () {
              localStorage.setItem("currentPost", $(this).data('post-id'))
              $(document).trigger('load_page');
            })
            $('.modal-content ul.collection').append(l);
          } catch (e) {
            // console.log(e);
          }
        });
      });
    });

  });

  
});