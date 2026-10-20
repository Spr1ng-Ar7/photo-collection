/* ============================================================
   枭潼 · 摄影作品集 — 地区手记页
   ?id=<regionId> → 手记（旅行感悟 + 摄影笔记）+ 照片流
   ============================================================ */
(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ------------------------------------------------ 解析地区 */
  var id = 'iceland';
  try { id = (new URLSearchParams(location.search)).get('id') || 'iceland'; } catch (e) {}

  var groups = ATLAS.groups;
  var region = null, gname = null, ridx = 0;
  Object.keys(groups).forEach(function (g) {
    groups[g].forEach(function (r, i) {
      if (r.id === id) { region = r; gname = g; ridx = i; }
    });
  });
  if (!region) { location.replace('index.html'); return; }

  var CHAPTERS = {
    europe: { tag: 'CHAPTER 01 · EUROPE', cn: '欧陆拾遗', scene: 2 },
    china:  { tag: 'CHAPTER 02 · CHINA',  cn: '山城与港岛', scene: 3 }
  };
  var ch = CHAPTERS[gname];
  var list = groups[gname];
  var prev = list[(ridx - 1 + list.length) % list.length];
  var next = list[(ridx + 1) % list.length];

  document.title = region.cn + ' · 旅行手记 — 枭潼摄影作品集';

  // 展示照片 = 未被隐藏的照片（隐藏的仅在编辑面板可见）
  var displayPhotos = ATLAS.display(region) || [];
  var heroPhoto = displayPhotos[0] || region.photos[0];

  /* ------------------------------------------------ 头版 */
  $('#rBack').href = 'index.html?scene=' + ch.scene;
  $('#rCrumb').textContent = ch.tag + ' / ' + ch.cn;
  $('#rEyebrow').textContent = ch.tag + ' · ' + ch.cn;
  $('#rCn').textContent = region.cn;
  $('#rEn').textContent = region.en + ' · ' + region.alias;
  $('#rLine').textContent = region.line;
  if (heroPhoto) $('#rHeroBg').style.backgroundImage = 'url("' + heroPhoto.src + '")';

  /* ------------------------------------------------ 照片流排版 */
  var flow = $('#rFlow');
  var rest = displayPhotos.slice(1);      // displayPhotos[0] 已用于头版
  var notes = region.notes || [];

  function makeFigure(photo, cls) {
    var fig = el('figure', cls + ' r-rise');
    var wrap = el('div', 'rf-imgwrap');
    var im = new Image();
    im.loading = 'lazy';
    im.alt = photo.cn || region.cn;
    im.src = photo.src;
    wrap.appendChild(im);
    var btn = el('button', 'rf-card', '✉');
    btn.type = 'button';
    btn.title = '制成明信片';
    btn.addEventListener('click', function () {
      if (window.Postcard) Postcard.open(photo, region);
    });
    wrap.appendChild(btn);
    fig.appendChild(wrap);
    fig.appendChild(el('figcaption', 'rf-cap',
      '<b>' + photo.cn + '</b><span>' + photo.en + '</span>'));
    return fig;
  }

  function makeNote(note) {
    var sec = el('section', 'rf-note r-rise');
    sec.appendChild(el('p', 'rf-note-h', note.h));
    sec.appendChild(el('p', 'rf-note-p', note.p));
    return sec;
  }

  function makeDuo(a, b) {
    var d = el('div', 'rf-duo');
    d.appendChild(makeFigure(a, 'rf-fig'));
    d.appendChild(makeFigure(b, 'rf-fig'));
    return d;
  }

  if (notes[0]) flow.appendChild(makeNote(notes[0]));
  if (rest.length) flow.appendChild(makeFigure(rest[0], 'rf-fig rf-wide'));
  if (notes[1]) flow.appendChild(makeNote(notes[1]));

  var i = 1, wideNext = false;
  while (i < rest.length) {
    if (wideNext) {
      flow.appendChild(makeFigure(rest[i], 'rf-fig rf-wide'));
      i++; wideNext = false;
    } else if (i + 1 < rest.length) {
      flow.appendChild(makeDuo(rest[i], rest[i + 1]));
      i += 2; wideNext = true;
    } else {
      flow.appendChild(makeFigure(rest[i], 'rf-fig rf-wide'));
      i++;
    }
  }

  /* ------------------------------------------------ 底部导航 */
  $('#rPrev').innerHTML = '←&thinsp;上一站<b>' + prev.cn + '</b><span>' + prev.en + '</span>';
  $('#rNext').innerHTML = '下一站&thinsp;→<b>' + next.cn + '</b><span>' + next.en + '</span>';
  $('#rPrev').href = 'region.html?id=' + prev.id;
  $('#rNext').href = 'region.html?id=' + next.id;

  /* ------------------------------------------------ 明信片入口 */
  function openCard() {
    if (window.Postcard && heroPhoto) Postcard.open(heroPhoto, region);
  }
  $('#rCardTop').addEventListener('click', openCard);
  $('#rCardBottom').addEventListener('click', openCard);

  /* ------------------------------------------------ 滚动浮现
     IntersectionObserver 为主，scroll 事件兜底（渲染调度
     受限的环境下 IO 回调可能不派发，scroll 检测幂等共存） */
  var riseNodes = Array.prototype.slice.call(document.querySelectorAll('.r-rise'));
  function riseCheck() {
    for (var k = 0; k < riseNodes.length; k++) {
      var n = riseNodes[k];
      if (n.classList.contains('in')) continue;
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) n.classList.add('in');
    }
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    riseNodes.forEach(function (n) { io.observe(n); });
  }
  window.addEventListener('scroll', riseCheck, { passive: true });
  riseCheck();

  /* 调试钩子（自动化测试用） */
  window.__region = { rise: riseCheck };

  /* ------------------------------------------------ 头版视差 */
  var bg = $('#rHeroBg');
  var hero = $('.r-hero');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      if (y < hero.offsetHeight * 1.2) {
        bg.style.transform = 'translateY(' + (y * 0.32).toFixed(1) + 'px) scale(1.08)';
      }
      ticking = false;
    });
  }, { passive: true });
})();
