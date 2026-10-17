/* トップのFVの動きを足す（2026-10-17・トップだけで読む）。top-fv-motion.css とセット。day-fv-fx.js のあとに読む */
(function () {
  var hero = document.querySelector('.hero:not(.is-sub)');
  if (!hero) return;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- B 色紙：写真の範囲の中だけで舞わせる（文字に重ならないように） ----------
  var photo = hero.querySelector('.hero-photo');
  if (photo && !reduce) {
    var box = document.createElement('div');
    box.className = 'tf-paper';
    box.setAttribute('aria-hidden', 'true');
    var C = ['#f7c948', '#8ec9dd', '#f4a493', '#8ecfa5', '#f2b6c8', '#f7c948', '#8ec9dd', '#f4a493'];
    var n = innerWidth < 700 ? 5 : 8;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i');
      if (i % 3 === 2) p.className = 'is-tri';
      var t = 13 + (i * 7) % 9;                 // 13〜21秒で1回落ちる
      // 写真の左側は文字の段の下にかかるので、舞う範囲は右寄り（34〜96%）に
      p.style.cssText = '--x:' + (34 + (i * 37) % 62) + '%;--w:' + (9 + (i * 5) % 8) + 'px;--c:' + C[i] +
        ';--t:' + t + 's;--d:' + (-(i * 2.3)).toFixed(1) + 's';   // 負の遅れで、最初から画面のあちこちに散らばる
      box.appendChild(p);
    }
    photo.appendChild(box);                     // 写真の上、吹き出し（z-index 2）の下
  }

  // ---------- C 「できた」に花丸 ----------
  var h1 = hero.querySelector('h1');
  var g = h1 && h1.querySelector('.g');
  if (!g) return;
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'tf-maru');
  svg.setAttribute('aria-hidden', 'true');
  var path = document.createElementNS(NS, 'path');
  path.setAttribute('pathLength', '1');
  svg.appendChild(path);
  h1.appendChild(svg);

  // 花びらのある外まわり1周 → 内側へうず巻き1周半（手描きの花丸）
  function maru(w, h) {
    var cx = w / 2, cy = h / 2, d = '', steps = 220;
    for (var k = 0; k <= steps; k++) {
      var u = k / steps, th = -Math.PI / 2 + u * Math.PI * 2 * 2.5, rx, ry;
      if (u < 0.4) {                               // 外まわり：花びら12枚
        var bump = 1 + 0.07 * Math.sin(th * 12);
        rx = (w / 2) * bump; ry = (h / 2) * bump;
      } else {                                     // 内側へうず巻き
        var s = 1 - (u - 0.4) / 0.6 * 0.55;
        rx = (w / 2) * 0.86 * s; ry = (h / 2) * 0.86 * s;
      }
      var x = cx + rx * Math.cos(th), y = cy + ry * Math.sin(th);
      d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    return d;
  }

  // 「できた」の3文字の位置を測って、そのまわりに置く（言語を切り替えて「できた」がないときは出さない）
  function place() {
    var tw = document.createTreeWalker(g, NodeFilter.SHOW_TEXT), node, hit = null;
    while ((node = tw.nextNode())) { var i = node.data.indexOf('できた'); if (i >= 0) { hit = [node, i]; break; } }
    if (!hit) { svg.style.display = 'none'; return; }
    var r = document.createRange();
    r.setStart(hit[0], hit[1]); r.setEnd(hit[0], hit[1] + 3);
    var b = r.getBoundingClientRect(), hb = h1.getBoundingClientRect();
    var w = b.width * 1.32, hh = b.height * 1.18;
    svg.style.display = '';
    svg.style.left = (b.left - hb.left - (w - b.width) / 2) + 'px';
    svg.style.top = (b.top - hb.top - (hh - b.height) / 2) + 'px';
    svg.setAttribute('width', w.toFixed(0));
    svg.setAttribute('height', hh.toFixed(0));
    svg.setAttribute('viewBox', '0 0 ' + w.toFixed(1) + ' ' + hh.toFixed(1));
    path.setAttribute('d', maru(w, hh));
  }
  place();
  addEventListener('resize', place);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  if (window.MutationObserver) new MutationObserver(place).observe(g, { childList: true, characterData: true, subtree: true });

  // 芽が伸びて波線が引かれたあと（約3.6秒後）に描く。最初の演出があるときは、終わってから
  function draw() { setTimeout(function () { place(); svg.classList.add('is-draw'); }, reduce ? 0 : 3600); }
  if (root.classList.contains('dy-hold')) addEventListener('dy-intro-open', draw, { once: true });
  else draw();
})();
