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
  })
});