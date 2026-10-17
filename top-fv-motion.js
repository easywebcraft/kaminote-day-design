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

  // ---------- コピーの動き：見出しの文字を1文字ずつ（英語などは1単語ずつ）に分ける ----------
  // 言語の切り替えで文字が書きかわったら、分け直す（花丸はやめた・2026-10-17）
  var h1 = hero.querySelector('h1');
  if (!h1 || reduce) return;
  var busy = false;
  function split() {
    if (busy) return;
    busy = true;
    var nodes = [], tw = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.parentNode.closest('.tf-ch, .tf-w, .fx-sprout, svg') || !n.data.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    }), n;
    while ((n = tw.nextNode())) nodes.push(n);
    var i = 0, j = 0;
    nodes.forEach(function (t) {
      var inG = !!t.parentNode.closest('.g');
      var ja = /[\u3000-\u30ff\u4e00-\u9fff]/.test(t.data);
      var parts = ja ? Array.from(t.data) : t.data.split(/(\s+)/);
      var f = document.createDocumentFragment();
      parts.forEach(function (ch) {
        if (!ch) return;
        if (!ja && /^\s+$/.test(ch)) { f.appendChild(document.createTextNode(ch)); return; }
        var s = document.createElement('span');
        // 日本語は1文字ずつ弾む箱（tf-ch）。英語などは折り返しを変えないよう、箱にせずにじみながら出す（tf-w）
        s.className = ja ? 'tf-ch' : 'tf-w';
        s.textContent = ch;
        s.style.setProperty('--i', i++);
        if (inG) s.style.setProperty('--j', j++);
        f.appendChild(s);
      });
      t.parentNode.replaceChild(f, t);
    });
    busy = false;
  }
  split();
  if (window.MutationObserver) new MutationObserver(function () { if (!busy && h1.querySelector(':not(.tf-ch):not(.fx-sprout):not(svg):not(path)')) split(); })
    .observe(h1, { childList: true, subtree: true, characterData: true });
})();
