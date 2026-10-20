/* ============================================================
   枭潼 · 摄影作品集 — 右侧半露轮盘导航
   盘面透出场景背景（backdrop blur），随幕旋转；
   高光与刻度随盘转动，色调随幕切换 —— 盘面与背景联动
   ============================================================ */
(function () {
  'use strict';

  var SM = window.__atlas && window.__atlas.scene;
  if (!SM) return;
  var isMobile = window.matchMedia('(max-width: 900px)').matches;

  var NAMES = [
    { cn: '开场', en: 'PROLOGUE' },
    { cn: '关于', en: 'ABOUT' },
    { cn: '欧陆', en: 'EUROPE' },
    { cn: '国内', en: 'CHINA' },
    { cn: '尾声', en: 'EPILOGUE' }
  ];
  /* 每幕盘面色调（冷调莫兰迪 RGB 三元组） */
  var TINTS = [
    '157,182,193',  // 开场 · 冰川蓝
    '168,184,176',  // 关于 · 灰绿
    '143,168,190',  // 欧陆 · 钢蓝
    '194,174,152',  // 国内 · 夜沙
    '169,163,184'   // 尾声 · 灰紫
  ];

  var nav = document.getElementById('dial');
  var disc = document.getElementById('dialDisc');
  var face = nav.querySelector('.dial-face');
  var ticks = nav.querySelector('.dial-ticks');
  var grip = document.getElementById('dialGrip');
  var numEl = document.getElementById('dialNum');
  var N = SM.count();
  var STEP = 14;                 // 每项间隔角（度）
  var rot = 0;                   // 当前盘角
  var raf = null;
  var items = [];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* 注入幕名 */
  for (var i = 0; i < N; i++) {
    (function (idx) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dial-item';
      b.setAttribute('aria-label', '第 ' + (idx + 1) + ' 幕 · ' + NAMES[idx].cn);
      b.innerHTML = '<span class="d-cn">' + NAMES[idx].cn + '</span>' +
                    '<span class="d-en">' + NAMES[idx].en + '</span>';
      b.addEventListener('click', function () { SM.go(idx); });
      disc.appendChild(b);
      items.push(b);
    })(i);
  }

  function nearest() { return clamp(Math.round(-rot / STEP), 0, N - 1); }

  function layout() {
    if (isMobile) {
      items.forEach(function (it, i) { it.classList.toggle('on', i === SM.current()); });
      return;
    }
    var r = disc.offsetWidth / 2;
    var R = r * 0.86;
    var curIdx = nearest();
    for (var i = 0; i < N; i++) {
      var deg = i * STEP + rot;              // 相对指针位（0° = 最左点）
      var a = deg * Math.PI / 180;
      var x = r - Math.cos(a) * R;
      var y = r + Math.sin(a) * R;
      items[i].style.transform =
        'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%)';
      var d = Math.min(1, Math.abs(deg) / 46);
      items[i].style.opacity = (1 - d * 0.62).toFixed(2);
      items[i].classList.toggle('on', i === curIdx);
    }
    /* 盘面与刻度随动（高光扫过） */
    face.style.transform = 'rotate(' + rot.toFixed(2) + 'deg)';
    ticks.style.transform = 'rotate(' + rot.toFixed(2) + 'deg)';
  }

  function tweenTo(target) {
    cancelAnimationFrame(raf);
    (function frame() {
      var d = target - rot;
      rot += d * 0.14;
      if (Math.abs(d) < 0.04) { rot = target; layout(); raf = null; return; }
      layout();
      raf = requestAnimationFrame(frame);
    })();
  }

  /* 场景切换 → 轮盘联动 */
  SM.onChange(function (cur) {
    tweenTo(-cur * STEP);
    numEl.textContent = ('0' + (cur + 1)).slice(-2);
    document.documentElement.style.setProperty('--dial-rgb', TINTS[cur] || TINTS[0]);
  });

  /* 拖拽转动（右侧弧带手柄） */
  var dragging = false, startY = 0, startRot = 0;
  grip.addEventListener('pointerdown', function (e) {
    dragging = true; startY = e.clientY; startRot = rot;
    cancelAnimationFrame(raf); raf = null;
    try { grip.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  grip.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    rot = clamp(startRot + (e.clientY - startY) * 0.14, -(N - 1) * STEP - 9, 9);
    layout();
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) {
    grip.addEventListener(ev, function () {
      if (!dragging) return;
      dragging = false;
      var idx = nearest();
      if (idx !== SM.current()) SM.go(idx);   // go 内部触发 onChange → 吸附
      else tweenTo(-idx * STEP);              // 回弹吸附
    });
  });

  /* 初始状态（含 ?scene=N 直达） */
  rot = -SM.current() * STEP;
  numEl.textContent = ('0' + (SM.current() + 1)).slice(-2);
  document.documentElement.style.setProperty('--dial-rgb', TINTS[SM.current()] || TINTS[0]);
  layout();
})();
