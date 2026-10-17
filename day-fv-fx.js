/* 放デイ用のFVの演出（2026-10-15）
   ・芽がのびる：その子のペースで「できた」をふやす（トップは見出しの横、下層は見出しラベルの横に小さく）
   ・ことばの吹き出し：日本語＋4言語のあいさつが、丸い写真のまわりに順番に出る（トップだけ）
   見出しの文字は言語切り替えで書きかわるので、演出は文字の外側に置く。飾りなので読み上げない */
(function () {
  var SPROUT = '<svg viewBox="0 0 48 56" aria-hidden="true" focusable="false">' +
    '<path class="fx-soil" d="M8 52h32"/>' +
    '<path class="fx-stem" pathLength="1" d="M24 52C24 42 22 34 25 22"/>' +
    '<path class="fx-leaf fx-leaf-l" d="M24.4 31C19 32 12.5 29 10 21c7-1.6 12.8 1.4 14.4 10z"/>' +
    '<path class="fx-leaf fx-leaf-r" d="M25 22c1-7.5 7-12.6 15-12.4-.6 8-6.6 12.6-15 12.4z"/>' +
    '</svg>';

  function sprout(cls) {
    var s = document.createElement('span');
    s.className = 'fx-sprout ' + (cls || '');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = SPROUT;
    return s;
  }

  function start(el) {
    // 画面が描かれてから動かす（最初から見えている場所なので、読みこみ直後に1回だけ）
    var go = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-grow'); }); }); };
    // トップの最初の演出（day-intro.js）があるときは、開きはじめてから
    if (document.documentElement.classList.contains('dy-hold')) window.addEventListener('dy-intro-open', go, { once: true });
    else go();
  }

  // FVの下の波を、すぐ下の段の地の色にそろえる（下層ページは段の色がページごとにちがうため）
  var wave = document.querySelector('.hero .wave path');
  if (wave) {
    var next = document.querySelector('.hero').nextElementSibling;
    if (next && next.tagName === 'MAIN') next = next.firstElementChild;
    var bgc = next && getComputedStyle(next).backgroundColor;
    if (!bgc || bgc === 'rgba(0, 0, 0, 0)') bgc = getComputedStyle(document.body).backgroundColor;
    wave.setAttribute('fill', bgc);
  }

  // トップのFV（PC）：楕円の写真の左端を、文字の段の右端に合わせる（画面幅や言語で文字の段の幅が変わるため）
  // ふちが透けるので、少し文字の段にかかってよい（文字の下は、ほぼ透けた部分になる）
  var topHero = document.querySelector('.hero');
  var txt = topHero && topHero.querySelector('.hero-txt');
  if (txt) {
    var fit = function () {
      var hr = topHero.getBoundingClientRect(), tr = txt.getBoundingClientRect();
      // 直し2：左端を文字の段の中ほどまで伸ばす（左側は長く透けるので、文字の下はほぼ地の色）
      topHero.style.setProperty('--fv-l', Math.round(Math.max(tr.right - hr.left - 400, hr.width * 0.22)) + 'px');
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  }

  // トップと、トップと同じ組み立ての下層ページのFV
  var h1 = document.querySelector('.hero h1');
  if (h1) {
    var sp = sprout('is-top');
    h1.appendChild(sp);
    h1.classList.add('fx-h1');
    start(h1);
    // 「できた」をふやす。の文字の終わりに置く（言語の切り替えや画面幅で長さが変わるので、そのたびに測り直す）
    var g = h1.querySelector('.g');
    var place = function () {
      if (!g) return;
      // 折り返したときは最後の行の終わり
      var rs = g.getClientRects();
      if (!rs.length) return;
      var hr = h1.getBoundingClientRect(), gr = rs[rs.length - 1];
      sp.style.left = (gr.right - hr.left) + 'px';
      sp.style.top = (gr.bottom - hr.top) + 'px';
    };
    place();
    window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    if (g && window.MutationObserver) new MutationObserver(place).observe(g, { childList: true, characterData: true, subtree: true });

    // ことばの吹き出し（こんにちは・Hello など）は、全ページで出さないことにした（2026-10-18・松本さん「各ページのFVの吹き出し演出削除して」）
    return;
  }

  // 下層：写真つきの見出し（dw-fv）は英字ラベルの前、写真なしのページは最初の見出しラベルの前
  var label = document.querySelector('.dw-fv .dw-en');
  if (!label) {
    var crumb = document.querySelector('nav.crumb');
    if (crumb) {
      var all = document.querySelectorAll('.eyebrow');
      for (var i = 0; i < all.length; i++) {
        if (crumb.compareDocumentPosition(all[i]) & Node.DOCUMENT_POSITION_FOLLOWING) { label = all[i]; break; }
      }
    }
  }
  if (label && label.parentNode) {
    var wrap = document.createElement('span');
    wrap.className = 'fx-sub';
    label.parentNode.insertBefore(wrap, label);
    wrap.appendChild(sprout('is-sub'));
    wrap.appendChild(label);
    start(wrap);
  }
})();
