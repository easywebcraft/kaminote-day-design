/* 最初の演出（トップだけ・2026-10-17）。day-intro.css とセット
   約3.8秒見せてから開く。押す・キー・ホイール・タッチで飛ばせる。終わったら 'dy-intro-end' を知らせる */
(function () {
  var root = document.documentElement;
  var loader = document.querySelector('.dy-loader');
  // 演出が終わってから、FVのコピー・写真・芽・吹き出しを動かし始める
  // （穴が開き始めたときに動かすと、演出の後ろで登場がほぼ終わってしまうため・2026-10-17）
  function done() {
    root.classList.remove('dy-intro', 'dy-hold');
    if (loader) loader.remove();
    window.dispatchEvent(new Event('dy-intro-open'));
    window.dispatchEvent(new Event('dy-intro-end'));
  }
  if (!loader || !root.classList.contains('dy-intro')) { if (loader) loader.remove(); return; }

  // クレヨン5色の粒（行き先は手のまわりにちらす）
  var dots = loader.querySelector('.dy-dots');
  var C = ['#f7c948', '#8ec9dd', '#f4a493', '#8ecfa5', '#f2b6c8', '#f7c948', '#8ec9dd'];
  var P = [[-150, -70], [140, -86], [-120, 62], [158, 48], [0, -112], [-188, 6], [192, -18]];
  // 手のマークの大きさ（PCで190px）に合わせて広がりを縮める（スマホで画面の端から出ないように）
  var k = Math.min(1, loader.querySelector('.dy-mark').getBoundingClientRect().width / 190 || 1);
  P.forEach(function (p, i) {
    var d = document.createElement('i');
    d.style.cssText = '--x:' + Math.round(p[0] * k) + 'px;--y:' + Math.round(p[1] * k) + 'px;--c:' + C[i] + ';--k:' + i + ';--s:' + (i % 3 ? 10 : 14) + 'px';
    dots.appendChild(d);
  });

  var opened = false;
  function open() {
    if (opened) return;
    opened = true;
    loader.classList.add('is-out');
    setTimeout(done, 1750);                // 穴が開ききったら（0.4秒待って1.35秒）終える
  }
  var timer = setTimeout(open, 3800);
  ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { clearTimeout(timer); open(); }, { once: true, passive: true });
  });
})();
