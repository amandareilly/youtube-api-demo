$.templates('result', `
<div class="result-container">
  <a href="https://www.youtube.com/watch?v={{:id.videoId}}" class="result-link" target="_blank" data-channel="{{:snippet.channelId}}" data-channel-name="{{:snippet.channelTitle}}" data-id="{{:id.videoId}}">
    <figure>
      <img src="{{:snippet.thumbnails.medium.url}}" alt="{{:snippet.title}} id="{{:id.videoId}}" class="result-thumb">
      <figcaption>{{:snippet.title}}</figcaption>
    </figure>
  </a>
</div>
`);
