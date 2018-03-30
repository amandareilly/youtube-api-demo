//loading of jsrender templates
function lazyGetTemplate(name) {
  // If the named remote template is not yet loaded and compiled
  // as a named template, fetch it. In either case, return a promise
  // (already resolved, if the template has already been loaded)
  let deferred = $.Deferred();
  const myPath = window.location.href.split('/')[0];
  let url = myPath + name + '.js';
  if ($.templates[name]) {
    deferred.resolve();
  } else {
    $.getScript(url)
      .then(function() {
        if ($.templates[name]) {
          deferred.resolve();
        } else {
          alert('Script: \'' + name + '.js\' failed to load');
          deferred.reject();
        }
      });
  }
  return deferred.promise();
}
//fix issue with previous and next buttons
$.ajaxSetup({
  cache: true
});

//main function
function mainHandler() {
  const search = checkUrlSearch();
  if (search) {
    urlSearch(search);
  } else {
    $('#ytsearch').focus();
  }

  $('#search').submit(processSearch);
  $('.page-prev').off('click').click(previousPage);
  $('.page-next').off('click').click(nextPage);
  $('.result-page-container').on('click', 'a', renderLightbox);
  $('#lightbox').on('click', closeLightbox);
}
//process search submission
function processSearch(e) {
  e.preventDefault();
  $('body').data('page', 1);
  const searchString = $('#ytsearch').val();
  ytApiCall(searchString);
}

//check for query string in address bar
function checkUrlSearch() {
  let url = window.location.href;
  console.log(url);
  return url.split('?')[1];
}
//search from address bar
//using query string
function urlSearch(searchString) {
  $('body').data('page', 1);
  ytApiCall(searchString);
}

function previousPage(e) {
  e.preventDefault();
  $('.page-prev').blur();
  const page = $('body').data('page') - 1;
  $('body').data('page', page);
  const data = $('.page-prev').data();
  ytApiCall(data.search, data.pageToken);
}

function nextPage(e) {
  e.preventDefault();
  $('.page-next').blur();
  const page = $('body').data('page') + 1;
  $('body').data('page', page);
  const data = $('.page-next').data();
  ytApiCall(data.search, data.pageToken);
}

//api call
function ytApiCall(searchString, pt = null) {
  const YT_API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';

  const PARAMS = {
    part: 'snippet',
    maxResults: 15,
    q: searchString,
    type: 'video',
    videoEmbeddable: true,
    key: 'AIzaSyAemav5PKalrDEZB2GroOOBPrXipwqSEKo'
  };
  if (pt) {
    PARAMS.pageToken = pt;
  }
  $.getJSON(YT_API_ENDPOINT, PARAMS, handleReturnedData);
}

function handleReturnedData(data) {
  if (data.items.length === 0) {
    $('main').removeClass('hidden');
    $('.result-page-container').html('<h2>Sorry, no results found!</h2>');
    $('.page-nav').addClass('hidden');
    $('.result-header').addClass('hidden');
  } else {
    $.when(lazyGetTemplate('result')).done(function() {
      const html = $.templates.result.render(data.items);
      let searchTerm = $('#ytsearch').val();
      if (!searchTerm) {
        searchTerm = checkUrlSearch();
      }
      console.log(history.state);
      history.pushState(window.location.href, '', window.location.href + '/?' + encodeURI(decodeURI(searchTerm)));
      console.log(history.state);
      const nextPageToken = data.nextPageToken;
      const prevPageToken = data.prevPageToken;
      $('.result-page-container').html(html);
      $('.search-term').text(decodeURI(searchTerm));
      $('#ytsearch').val('');
      $('main').removeClass('hidden');
      $('main').addClass('resultpage');
      $('header').removeClass('fullpage');
      $('header').addClass('resultpage');
      $('.page-nav').removeClass('hidden');
      $('.result-header').removeClass('hidden');
      $('.current-page').text($('body').data('page'));
      if (data.pageInfo.totalResults < 500) {
        $('.num-pages').text(Math.ceil(data.pageInfo.totalResults / 15));
      } else {
        $('.num-pages').text('33');
      }
      if (!prevPageToken) {
        $('.page-prev').addClass('hidden');
      } else {
        $('.page-prev').data({pageToken: prevPageToken, search: searchTerm});
        $('.page-prev').removeClass('hidden');
      }
      if (!nextPageToken) {
        $('.page-next').addClass('hidden');
      } else {
        $('.page-next').data({pageToken: nextPageToken, search: searchTerm});
        $('.page-next').removeClass('hidden');
      }
      if ($('body').data('page') === 32) {

        $('.page-next').addClass('hidden');
      }
    });
  }
}
function renderLightbox(e) {
  e.preventDefault();
  $.when(lazyGetTemplate('lightboxTemplate')).done(function() {
    const data = {
      'videoId': e.currentTarget.getAttribute('data-id'),
      'channelId': e.currentTarget.getAttribute('data-channel'),
      'channelName': e.currentTarget.getAttribute('data-channel-name'),
      'originUrl': window.location.href
    };
    const html = $.templates.lightboxTemplate.render(data);
    $('#content').html(html);
    $('#lightbox').removeClass('hidden');
  });
}

function closeLightbox(e) {
  $('#lightbox').addClass('hidden');
  $('#content').empty();
}

$(mainHandler);
