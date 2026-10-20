(() => {
  'use strict';
  const videos = globalThis.GALLERY_VIDEOS;
  const player = document.querySelector('#player');
  const list = document.querySelector('#video-list');
  const status = document.querySelector('#playback-status');
  let current = 0;
  const buttons = videos.map((video, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'video-option';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-label', `${video.label}, ${video.duration} Minuten`);
    const thumb = document.createElement('span');
    thumb.className = 'thumbnail';
    const img = document.createElement('img');
    img.src = video.poster;
    img.alt = '';
    img.loading = 'lazy';
    thumb.append(img);
    const copy = document.createElement('span');
    copy.className = 'option-copy';
    for (const [tag, value] of [['strong', video.label], ['span', video.topics], ['small', `${video.duration} min`]]) {
      const node = document.createElement(tag);
      node.textContent = value;
      copy.append(node);
    }
    button.append(thumb, copy);
    button.addEventListener('click', () => select(index));
    list.append(button);
    return button;
  });
  function select(index, play = true) {
    if (index < 0 || index >= videos.length) return;
    const video = videos[index];
    player.pause();
    current = index;
    status.hidden = true;
    player.poster = video.poster;
    player.src = video.file;
    player.setAttribute('aria-label', video.title);
    document.querySelector('#video-title').textContent = video.title;
    document.querySelector('#video-description').textContent = video.description;
    document.querySelector('#video-position').textContent = `Video ${index + 1} von ${videos.length} · ${video.duration} min`;
    const download = document.querySelector('#download');
    download.href = video.file;
    download.download = video.download;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    document.querySelector('#previous').disabled = index === 0;
    document.querySelector('#next').disabled = index === videos.length - 1;
    // Auch die direkte Dateivorschau auf dem Mac soll benutzbar bleiben.
    try { history.replaceState(null, '', `#${video.id}`); } catch (_) { /* file:// */ }
    player.load();
    if (play) player.play().catch(error => {
      if (current !== index || player.error || error.name === 'AbortError') return;
      status.textContent = 'Tippe im Videobild auf die Wiedergabetaste, um das Video zu starten.';
      status.hidden = false;
    });
  }
  document.querySelector('#previous').addEventListener('click', () => select(current - 1));
  document.querySelector('#next').addEventListener('click', () => select(current + 1));
  player.addEventListener('playing', () => { status.hidden = true; });
  player.addEventListener('error', () => {
    status.textContent = 'Das Video konnte nicht geladen werden. Prüfe deine Verbindung und wähle das Video danach erneut.';
    status.hidden = false;
  });
  const initial = videos.findIndex(video => `#${video.id}` === location.hash);
  if (initial > 0) select(initial, false);

})();
