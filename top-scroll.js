/* トップの中身の段に動きを足す（2026-10-18・トップだけ）。top-scroll.css とセット。day-motion.js のあとに読む */
(function () {
  if (!document.documentElement.classList.contains('tm-on') || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-on'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -15% 0px' });
  function watch(el) { io.observe(el); }

  // 1 線のアイコンを描く（同じ並びの中で順番にずらす）
  document.querySelectorAll('.tv main .tv-ic, main.tv .tv-ic').forEach(function (ic) {
    if (ic.closest('.tv-btn, .tv-link')) return;
    ic.classList.add('ts-draw');
    ic.querySelectorAll('svg *').forEach(function (p) { if (/^(path|circle|rect|line|polyline|polygon|ellipse)$/i.test(p.tagName)) p.setAttribute('pathLength', '1'); });
    var card = ic.closest('li, .tv-col, .tv-area, .tv-ocard');
    if (card && card.parentElement) ic.style.setProperty('--d', Array.prototype.indexOf.call(card.parentElement.children, card) % 6);
    watch(ic);
  });

  // 3 時間割
  document.querySelectorAll('.tv-tl').forEach(function (tl) {
    tl.classList.add('ts-tl');
    tl.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--i', i); });
    watch(tl);
  });

  // 4 言語の丸
  document.querySelectorAll('.tv-langs').forEach(function (ul) {
    ul.classList.add('ts-pop');
    ul.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--i', i); });
    watch(ul);
  });

  // 6 事業所のロゴ
  document.querySelectorAll('.tv-ologo').forEach(function (img, i) { img.classList.add('ts-hop'); img.style.setProperty('--d', i); watch(img); });

  // 5 段の背景にただよう色の丸（3つの特徴・5つの領域・2つの事業所）
  var C = ['#f7c948', '#8ec9dd', '#f4a493', '#8ecfa5', '#f2b6c8'];
  ['features', 'areas', 'offices'].forEach(function (id, k) {
    var sec = document.getElementById(id);
    if (!sec) return;
    sec.classList.add('ts-host');
    var box = document.createElement('div');
    box.className = 'ts-bubbles';
    box.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 5; i++) {
      var b = document.createElement('i');
      var n = i + k * 5;
      // 文字やアイコンの後ろに重ならないよう、段の左右の端（0〜9% と 88〜97%）に寄せる
      var edge = i % 2 ? 88 + (n * 7) % 9 : (n * 5) % 9;
      b.style.cssText = '--x:' + edge + '%;--y:' + ((n * 37 + 8) % 78) + '%;--s:' + (44 + (n * 29) % 70) + 'px;--c:' + C[n % 5] +
        ';--t:' + (9 + n % 6) + 's;--d:' + (-(n * 1.7)).toFixed(1) + 's;--dx:' + ((n % 2 ? 1 : -1) * (20 + n % 4 * 8)) + 'px;--dy:' + ((n % 3 ? -1 : 1) * (16 + n % 5 * 6)) + 'px';
      box.appendChild(b);
    }
    sec.insertBefore(box, sec.firstChild);
  });

  // 2 写真の奥行き
  var pars = [];
  document.querySelectorAll('.tv-area-ph, .tv-dcard figure, .tv-ocard figure, .dw-cta-photo').forEach(function (f) { f.classList.add('ts-par'); pars.push(f); });
  var ticking = false;
  function move() {
    ticking = false;
    var vh = innerHeight;
    pars.forEach(function (f) {
      var r = f.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var k = (r.top + r.height / 2 - vh / 2) / vh;      // 画面の真ん中で0
      f.style.setProperty('--py', (k * -24).toFixed(1));
    });
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
  addEventListener('resize', move);
  move();
})();
