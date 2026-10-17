/* トップの試作「おしゃれに」（2026-10-17・top-chic.html だけで読む）。top-chic.css とセット。day-lively.js のあとに読む */
(function () {
  document.body.classList.add('chic');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A・C 段ごとに：背景の大きな英字と、見出しの番号と細い線（英字は見出しの小さな英字をそのまま使う）
  var bgs = [];
  var n = 0;
  document.querySelectorAll('main.dw > section').forEach(function (sec) {
    var en = sec.querySelector('.dw-en');
    if (!en || en.classList.contains('ch-num')) return;
    var word = en.textContent.trim();
    n++;
    var bg = document.createElement('span');
    bg.className = 'ch-bg ' + (n % 2 ? 'is-r' : 'is-l');
    bg.setAttribute('aria-hidden', 'true');
    bg.textContent = word;
    sec.insertBefore(bg, sec.firstChild);
    bgs.push(bg);
    var no = document.createElement('span');
    no.className = 'ch-no';
    no.setAttribute('aria-hidden', 'true');
    no.textContent = (n < 10 ? '0' : '') + n;
    var rule = document.createElement('span');
    rule.className = 'ch-rule';
    rule.setAttribute('aria-hidden', 'true');
    en.classList.add('ch-num');
    en.insertBefore(rule, en.firstChild);
    en.insertBefore(no, rule);
  });

  // E FVの丸い写真に、小さな丸い写真を2枚重ねる（人の写っていない写真）
  var photo = document.querySelector('.hero-photo');
  var subs = [];
  if (photo) {
    [['is-a', 'img/dw-books.jpg', 'イメージ写真（絵本の棚）'], ['is-b', 'img/dw-blocks.jpg', 'イメージ写真（積み木の置かれた机）']].forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'ch-sub ' + s[0];
      d.innerHTML = '<img src="' + s[1] + '" alt="' + s[2] + '" decoding="async">';
      photo.appendChild(d);
      subs.push(d);
    });
  }

  if (reduce) return;

  // A・E スクロールに合わせて、英字は横に、小さな写真は縦に少しずらす
  var ticking = false;
  function move() {
    ticking = false;
    var vh = innerHeight;
    bgs.forEach(function (bg, i) {
      var r = bg.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var k = (r.top + r.height / 2 - vh / 2) / vh;
      bg.style.setProperty('--bx', (k * (i % 2 ? 60 : -60)).toFixed(1));
    });
    subs.forEach(function (s, i) { s.style.setProperty('--cy', (scrollY * (i ? -0.12 : 0.08)).toFixed(1)); });
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
  move();

  // H PCだけ：マウスのそばに小さな丸
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var c = document.createElement('div');
    c.className = 'ch-cursor';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    var x = -100, y = -100, cx = -100, cy = -100, running = false;
    function follow() {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      c.style.setProperty('--mx', cx.toFixed(1) + 'px');
      c.style.setProperty('--my', cy.toFixed(1) + 'px');
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.3) requestAnimationFrame(follow); else running = false;
    }
    addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      c.classList.add('is-on');
      c.classList.toggle('is-big', !!e.target.closest('a, button, summary, .dw-card'));
      if (!running) { running = true; requestAnimationFrame(follow); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { c.classList.remove('is-on'); });
  }
})();
