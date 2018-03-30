$.templates('lightboxTemplate', `
<iframe id="player" type="text/html" width="560" height="315"
  src="https://www.youtube.com/embed/{{:videoId}}?enablejsapi=1&origin={{:originUrl}}&autoplay=1" frameborder="0"></iframe>
<div class="lightbox-footer">
  <a href="https://www.youtube.com/watch?v={{:videoId}}" class="yt-link" target="_blank">View this video on YouTube.com</a>
  <a href="https://www.youtube.com/channel/{{:channelId}}" class="yt-channel-link" target="_blank">See more from the channel "{{:channelName}}" on YouTube.com</a>
</div>
`);
