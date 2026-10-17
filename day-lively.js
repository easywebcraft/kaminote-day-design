/* 放デイをにぎやかに（2026-10-17・全ページ）。day-lively.css とセット。day-motion.js のあとに読む */
(function () {
  var motion = document.documentElement.classList.contains('tm-on') && 'IntersectionObserver' in window;

  // C 本文の写真（左右に並ぶ段・3枚組）を包んで形を付け、後ろに色の丸を2つ置く
  //   縦長はアーチ、ほかは「丸みのある形」と「葉っぱの形」を交互に。3枚組は1枚目が葉っぱ、残りは丸
  //   写真そのものの現れ方は day-motion.js のまま
  var DOTS = [['is-y', 'is-s'], ['is-c', 'is-ring'], ['is-p', 'is-y'], ['is-g', 'is-c'], ['is-s', 'is-p']];
  var phs = [], n = 0, alt = 0;
  document.querySelectorAll('.dw-split > figure.dw-photo, .dw-stack > figure.dw-photo').forEach(function (fig) {
    var w = document.createElement('div');
    var inStack = fig.parentElement.classList.contains('dw-stack');
    var grid = inStack && fig.parentElement.classList.contains('is-grid');
    var first = !inStack || fig === fig.parentElement.firstElementChild;
    // 3枚組（横に並ぶ）の小さい2枚は丸、縦に並ぶときの2枚目からは角を丸めるだけ（丸にすると大きくなりすぎる）
    var shape = inStack ? (first ? 'is-leaf' : grid ? 'is-round' : 'is-soft') : fig.classList.contains('is-tall') ? 'is-arch' : (alt++ % 2 ? 'is-leaf' : 'is-blob');
    w.className = 'lv-ph ' + shape;
    fig.parentNode.insertBefore(w, fig);
    w.appendChild(fig);
    var sec = w.closest('section');
    if (sec) sec.classList.add('lv-clip');
    if (!first) return;
    DOTS[n++ % DOTS.length].forEach(function (c) {
      var d = document.createElement('span');
      d.className = 'lv-dot ' + c;
      d.setAttribute('aria-hidden', 'true');
      w.appendChild(d);
    });
    phs.push(w);
  });

  // E ことばの帯（多言語の段の上）。とぎれず流れるよう、同じ並びをくり返す
  document.querySelectorAll('[data-lv-marquee]').forEach(function (multi) {
    var words = ['こんにちは', 'Hello', 'Kumusta', 'Olá', 'Maayong adlaw'];
    var lang = ['ja', 'en', 'tl', 'pt', 'ceb'];
    var m = document.createElement('div');
    m.className = 'lv-marquee';
    m.setAttribute('aria-hidden', 'true');
    var t = document.createElement('div');
    t.className = 'lv-track';
    for (var r = 0; r < 4; r++) {
      words.forEach(function (wd, i) {
        var s = document.createElement('span');
        s.lang = lang[i];
        s.textContent = wd;
        t.appendChild(s);
        t.appendChild(document.createElement('i'));
      });
    }
    m.appendChild(t);
    multi.insertBefore(m, multi.firstChild);
  });

  // G 一日の流れの点に順番をつける
  document.querySelectorAll('.dw-tl').forEach(function (tl) {
    tl.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--i', i); });
  });

  if (!motion) return;

  // G・H 画面に入ったら線をのばす（1回だけ）
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('lv-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -18% 0px' });
  document.querySelectorAll('.dw-tl, .dw-steps').forEach(function (el) { io.observe(el); });

  // J スクロールに合わせて、色の丸を少しずらす（奥行き）
  var ticking = false;
  function para() {
    ticking = false;
    var vh = window.innerHeight;
    phs.forEach(function (w) {
      var b = w.getBoundingClientRect();
      if (b.bottom < -100 || b.top > vh + 100) return;
      var k = ((b.top + b.height / 2) - vh / 2) / vh;  // 画面の真ん中で0
      w.querySelectorAll('.lv-dot').forEach(function (d, i) { d.style.setProperty('--py', (k * (i ? -28 : 40)).toFixed(1)); });
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(para); } }, { passive: true });
  para();
})();
