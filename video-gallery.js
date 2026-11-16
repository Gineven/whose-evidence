/* One source video keeps the scene, close-ups and subgraphs on the same clock. */
(() => {
  'use strict';
  const root = document.getElementById('video-demos');
  if (!root) return;
  const cases = [
    {slug:'red-bus', title:'Red articulated bus', observations:56, duration:16.75},
    {slug:'bridge-bus', title:'Yellow-blue bus on a busy bridge', observations:66, duration:19.2916666667},
    {slug:'white-coach', title:'White coach at a busy junction', observations:100, duration:23.7083333333}
  ];
  const get = id => document.getElementById('demo-' + id);
  const video = get('source'), main = get('main-canvas'), zoom = get('zoom-canvas'), graph = get('graph-canvas');
  const graphDetail = get('graphs');
  const detail = get('zoom'), play = get('play'), big = get('big-play'), seek = get('seek'), clock = get('clock'), status = get('status');
  const slices = [[main,0,832], [zoom,832,360], [graph,1192,280]];
  const remembered = new Map();
  let index = -1, current, poster, epoch = 0, paintSerial = 0;
  const fmt = value => { const t = Math.max(0, value || 0); return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2,'0')}`; };

  function updateClock() {
    const duration = Number.isFinite(video.duration) ? video.duration : current.duration;
    seek.max = duration || 1;
    seek.value = video.currentTime || 0;
    seek.setAttribute('aria-valuetext', `${fmt(video.currentTime)} of ${fmt(duration)}`);
    clock.textContent = `${fmt(video.currentTime)} / ${fmt(duration)}`;
  }
  function paint() {
    const source = video.readyState >= 2 ? video : poster;
    if (!source || (source === poster && (!poster.complete || !poster.naturalWidth))) return;
    paintSerial++;
    for (const [canvas,y,h] of slices) {
      if ((canvas === zoom && !detail.open) || (canvas === graph && !graphDetail.open)) continue;
      canvas.getContext('2d', {alpha:false}).drawImage(source,0,y,1280,h,0,0,1280,h);
      canvas.dataset.time = source === video ? video.currentTime.toFixed(5) : 'poster';
      canvas.dataset.paint = String(paintSerial);
      canvas.dataset.case = current.slug;
    }
    updateClock();
  }
  function reflectPlayback() {
    const playing = !video.paused;
    play.innerHTML = playing ? 'Ⅱ <span>Pause</span>' : '▶ <span>Play</span>';
    play.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    root.querySelector('.demo-main').classList.toggle('playing',playing);
    if (!playing) paint();
  }
  async function togglePlayback() {
    if (!video.paused) { video.pause(); return; }
    try { await video.play(); status.textContent = ''; }
    catch { status.textContent = 'Playback could not start. Please try again or download the video below.'; }
  }
  function selectCase(nextIndex) {
    const next = (nextIndex + cases.length) % cases.length;
    if (next === index) return;
    if (current) remembered.set(current.slug, {time:video.currentTime || 0, open:detail.open});
    video.pause();
    index = next; current = cases[index]; epoch++;
    const selectedEpoch = epoch;
    get('number').textContent = `${String(index + 1).padStart(2,'0')} / 03`;
    get('title').textContent = current.title;
    get('info').textContent = `${current.observations} observations · 64 candidates / observation`;
    get('download').href = `assets/videos/${current.slug}.mp4?v=20261116e`;
    root.querySelectorAll('[data-demo]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.demo) === index)));
    detail.open = remembered.get(current.slug)?.open || false;
    for (const [canvas] of slices) { const ctx = canvas.getContext('2d', {alpha:false}); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
    poster = new Image();
    poster.onload = () => { if (epoch === selectedEpoch) paint(); };
    poster.src = `assets/images/${current.slug}-poster.jpg?v=20261116e`;
    video.poster = poster.src;
    video.src = `assets/videos/${current.slug}.mp4?v=20261116e`;
    video.load();
    video.playbackRate = Number(get('speed').value);
    status.textContent = 'Loading video…';
    updateClock(); reflectPlayback();
  }

  get('prev').addEventListener('click', () => selectCase(index - 1));
  get('next').addEventListener('click', () => selectCase(index + 1));
  root.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => selectCase(Number(button.dataset.demo))));
  root.querySelector('.demo-navigation').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); selectCase(index + (event.key === 'ArrowLeft' ? -1 : 1)); }
  });
  play.addEventListener('click',togglePlayback); big.addEventListener('click',togglePlayback);
  root.querySelector('.demo-main').addEventListener('click', event => { if (!event.target.closest('button')) togglePlayback(); });
  root.querySelector('.demo-main').addEventListener('keydown', event => {
    if (['Space','Enter'].includes(event.code) && event.target === event.currentTarget) { event.preventDefault(); togglePlayback(); }
  });
  seek.addEventListener('input', () => { if (video.readyState >= 1) video.currentTime = Number(seek.value); updateClock(); });
  get('speed').addEventListener('change', event => { video.playbackRate = Number(event.target.value); });
  detail.addEventListener('toggle',paint);
  graphDetail.addEventListener('toggle',paint);
  video.addEventListener('loadedmetadata', () => {
    const saved = remembered.get(current.slug);
    if (saved?.time) video.currentTime = Math.min(saved.time,video.duration - .05);
    updateClock();
  });
  for (const name of ['loadeddata','seeked','timeupdate']) video.addEventListener(name, () => { status.textContent = ''; paint(); });
  for (const name of ['play','pause','ended']) video.addEventListener(name,reflectPlayback);
  video.addEventListener('error', () => { status.textContent = 'The video could not be loaded. Please try Download video.'; });
  if ('requestVideoFrameCallback' in video) {
    const nextFrame = () => { paint(); video.requestVideoFrameCallback(nextFrame); };
    video.requestVideoFrameCallback(nextFrame);
  } else {
    const nextFrame = () => { if (!video.paused) paint(); requestAnimationFrame(nextFrame); };
    requestAnimationFrame(nextFrame);
  }
  get('fullscreen').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await get('viewer').requestFullscreen(); }
    catch { status.textContent = 'Fullscreen is unavailable in this browser. You can open the downloaded video instead.'; }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  const intro = document.getElementById('project-intro');
  const introShell = document.getElementById('intro-shell');
  const closeIntro = document.getElementById('intro-close');
  const reopenIntro = document.getElementById('intro-reopen');
  let introScrollTimer;
  function setIntroOpen(open) {
    clearTimeout(introScrollTimer);
    reopenIntro.hidden = open;
    closeIntro.setAttribute('aria-expanded', String(open));
    reopenIntro.setAttribute('aria-expanded', String(open));
    if (!open) reopenIntro.focus({preventScroll:true});
    intro.inert = !open;
    intro.setAttribute('aria-hidden', String(!open));
    introShell.classList.toggle('is-collapsed', !open);
    if (open) closeIntro.focus({preventScroll:true});
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    introScrollTimer = setTimeout(() => {
      (open ? introShell : root).scrollIntoView({block:'start', behavior:reducedMotion ? 'instant' : 'smooth'});
    }, reducedMotion ? 0 : 330);
  }
  closeIntro.hidden = false;
  closeIntro.addEventListener('click', () => setIntroOpen(false));
  reopenIntro.addEventListener('click', () => setIntroOpen(true));
  document.querySelectorAll('a[href="#video-demos"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    setIntroOpen(false);
  }));
  document.querySelector('.wordmark').addEventListener('click', event => {
    if (introShell.classList.contains('is-collapsed')) { event.preventDefault(); setIntroOpen(true); }
  });
  selectCase(0);
})();
