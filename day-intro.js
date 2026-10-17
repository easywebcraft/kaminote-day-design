/* 最初の演出（トップだけ・2026-10-17）。day-intro.css とセット
   約3.8秒見せてから開く。押す・キー・ホイール・タッチで飛ばせる。終わったら 'dy-intro-end' を知らせる */
(function () {
  var root = document.documentElement;
  var loader = document.querySelector('.dy-loader');
  // FVのコピー・写真・芽・吹き出しを動かし始める。幕が半分ほど透けたところで
  // （幕の後ろで始めると登場が見えずに終わり、幕が消えきってからだと、からっぽの間ができるため・2026-10-17）
  var released = false;
  function release() {
    if (released) return;
    released = true;
    root.classList.remove('dy-hold');
    window.dispatchEvent(new Event('dy-intro-open'));
  }
  function done() {
    release();
    root.classList.remove('dy-intro');   // ヘッダーの本物のロゴが、移ってきた手のマークと入れかわる
    if (loader) loader.remove();
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
    // 手のマークを、ヘッダーのロゴの位置と大きさへ移す（同じ絵なので、そのまま重なる）
    var mark = loader.querySelector('.dy-mark');
    var target = document.querySelector('.head .brand .mark');
    if (mark && target && mark.animate) {
      var a = mark.getBoundingClientRect(), b = target.getBoundingClientRect();
      if (a.width && b.width) {
        var s = b.width / a.width;
        var dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
        mark.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }],
          { duration: 1000, delay: 250, easing: 'cubic-bezier(.65, 0, .25, 1)', fill: 'forwards' });
      }
    }
    setTimeout(release, 750);              // 幕が半分ほど透けたところ
    setTimeout(done, 1300);                // 手のマークがロゴの位置に着いたら終える
  }
  var timer = setTimeout(open, 2400);      // 2026-10-17 短くした（前は 3800）
  ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function () { clearTimeout(timer); open(); }, { once: true, passive: true });
  });
})();
