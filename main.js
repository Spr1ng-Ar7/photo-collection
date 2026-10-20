/* ============================================================
   枭潼 · 摄影作品集 — 交互主逻辑
   场景管理 / 雾化擦除 / 竖向轮盘 / 翻页相册
   ============================================================ */
(function () {
  'use strict';

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var isMobile = window.matchMedia('(max-width: 900px)').matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function img(src) { var im = new Image(); im.src = src; return im; }

  /* ============================================================
     数据展开：地区索引
     ============================================================ */
  var GROUPS = ATLAS.groups; // { europe:[region…], china:[region…] }
  var REGION_MAP = {};
  Object.keys(GROUPS).forEach(function (g) {
    GROUPS[g].forEach(function (r) { REGION_MAP[r.id] = r; });
  });

  /* ============================================================
     ① 场景管理器
     ============================================================ */
  var SceneManager = (function () {
    var scenes = $$('.scene');
    var N = scenes.length;
    var cur = 0;
    var busy = false;
    var listeners = [];

    function render() {
      $('#stage').style.transform = 'translateY(' + (-cur * 100) + 'vh)';
      listeners.forEach(function (fn) { fn(cur); });
    }

    function go(i) {
      i = clamp(i, 0, N - 1);
      if (busy || i === cur) return false;
      busy = true;
      cur = i;
      render();
      setTimeout(function () { busy = false; }, 1150);
      return true;
    }
    function next() { return go(cur + 1); }
    function prev() { return go(cur - 1); }

    // 品牌回首页
    $$('[data-goto]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        go(parseInt(el.getAttribute('data-goto'), 10) || 0);
      });
    });

    render();

    // 支持 ?scene=N 直达（地区手记页返回时落到对应幕）
    (function () {
      var m = /[?&]scene=(\d+)/.exec(location.search);
      if (m) {
        var idx = clamp(parseInt(m[1], 10) || 0, 0, N - 1);
        if (idx !== cur) {
          cur = idx;
          $('#stage').style.transition = 'none';
          render();
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { $('#stage').style.transition = ''; });
          });
        }
      }
    })();

    return {
      go: go, next: next, prev: prev,
      current: function () { return cur; },
      count: function () { return N; },
      isBusy: function () { return busy; },
      isWheelScene: function () { return scenes[cur].classList.contains('wheel-scene'); },
      onChange: function (fn) { listeners.push(fn); }
    };
  })();

  /* ============================================================
     ② 开场 · 雾化擦除（冰霜画布）
     ============================================================ */
  var Fog = (function () {
    var canvas = $('#fog');
    if (!canvas) return { cleared: function () { return true; } };
    var ctx = canvas.getContext('2d');
    var hint = $('#fogHint');
    var cue = $('#scrollCue');
    var heroScene = $('#scene-hero');

    var cleared = false;
    var brushing = false;
    var last = null;
    var strokeCount = 0;
    var BRUSH = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.09);

    // 低分辨率采样画布（擦除比例）
    var SAMPLE_W = 72, SAMPLE_H = 44;
    var sampler = document.createElement('canvas');
    sampler.width = SAMPLE_W; sampler.height = SAMPLE_H;
    var sctx = sampler.getContext('2d');

    function size() {
      canvas.width = Math.round(window.innerWidth * DPR);
      canvas.height = Math.round(window.innerHeight * DPR);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }

    function paintFrost() {
      var w = canvas.width, h = canvas.height;
      ctx.globalCompositeOperation = 'source-over';
      // 基底：半透冰白
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(214,226,230,0.97)');
      g.addColorStop(0.5, 'rgba(200,214,219,0.96)');
      g.addColorStop(1, 'rgba(188,205,212,0.97)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // 大块云斑
      for (var i = 0; i < 26; i++) {
        var x = Math.random() * w, y = Math.random() * h;
        var r = (60 + Math.random() * 220) * DPR;
        var rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        var tone = Math.random() > 0.5 ? '255,255,255' : '170,190,199';
        rg.addColorStop(0, 'rgba(' + tone + ',' + (0.10 + Math.random() * 0.14) + ')');
        rg.addColorStop(1, 'rgba(' + tone + ',0)');
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      // 冰晶细屑
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      for (var j = 0; j < 900; j++) {
        var cx = Math.random() * w, cy = Math.random() * h;
        var len = (1 + Math.random() * 5) * DPR;
        var a = Math.random() * Math.PI * 2;
        ctx.globalAlpha = 0.12 + Math.random() * 0.3;
        ctx.lineWidth = Math.max(0.6, Math.random() * 1.4 * DPR);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // 边缘更冷更厚
      var vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.72);
      vg.addColorStop(0, 'rgba(150,175,186,0)');
      vg.addColorStop(1, 'rgba(140,168,180,0.5)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    }

    function eraseAt(x, y, strength) {
      var px = x * DPR, py = y * DPR, r = BRUSH * DPR;
      ctx.globalCompositeOperation = 'destination-out';
      var g = ctx.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, 'rgba(0,0,0,' + (strength || 0.75) + ')');
      g.addColorStop(0.55, 'rgba(0,0,0,' + (strength || 0.75) * 0.5 + ')');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
    }

    function strokeTo(x, y) {
      if (last) {
        var dx = x - last.x, dy = y - last.y;
        var dist = Math.hypot(dx, dy);
        var steps = Math.max(1, Math.floor(dist / (BRUSH * 0.35)));
        for (var i = 1; i <= steps; i++) {
          eraseAt(last.x + dx * i / steps, last.y + dy * i / steps, 0.55);
        }
      } else {
        eraseAt(x, y, 0.8);
      }
      last = { x: x, y: y };
      strokeCount++;
      if (strokeCount % 3 === 0) checkProgress();
    }

    function erasedRatio() {
      sctx.clearRect(0, 0, SAMPLE_W, SAMPLE_H);
      sctx.drawImage(canvas, 0, 0, SAMPLE_W, SAMPLE_H);
      var d = sctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
      var gone = 0, total = SAMPLE_W * SAMPLE_H;
      for (var i = 3; i < d.length; i += 4) {
        if (d[i] < 60) gone++;
      }
      return gone / total;
    }

    function checkProgress() {
      if (cleared) return;
      if (erasedRatio() >= 0.35) clearAll();
    }

    function clearAll() {
      if (cleared) return;
      cleared = true;
      canvas.style.transition = 'opacity 1.4s cubic-bezier(.22,.61,.21,1)';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      hint.classList.add('gone');
      setTimeout(function () { canvas.style.display = 'none'; }, 1500);
      setTimeout(function () { cue.classList.add('show'); }, 900);
    }

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (cleared) return;
      brushing = true;
      last = null;
      var p = pos(e);
      strokeTo(p.x, p.y);
      hint.classList.add('gone');
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!brushing || cleared) return;
      var p = pos(e);
      strokeTo(p.x, p.y);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      canvas.addEventListener(ev, function () {
        brushing = false; last = null;
        checkProgress();
      });
    });

    canvas.addEventListener('dblclick', function () { clearAll(); });

    window.addEventListener('resize', function () {
      if (cleared) return;
      size(); paintFrost();
    });

    // 首屏：背景缓推 + 上霜
    size(); paintFrost();
    requestAnimationFrame(function () { heroScene.classList.add('awake'); });
    img(ATLAS.hero.img);

    return { cleared: function () { return cleared; }, clearAll: clearAll };
  })();

  /* ============================================================
     ③ 竖向轮盘（欧陆 / 国内）
     ============================================================ */
  function Wheel(sceneEl, wheelEl, panelEl, regions) {
    var self = this;
    self.regions = regions;
    self.scene = sceneEl;
    self.el = wheelEl;
    self.panel = panelEl;

    self.items = [];
    self.index = 0;
    self.STEP = isMobile ? 0 : 14;          // 每项间隔角
    self.rot = 0;                            // 当前旋转角
    self.targetRot = 0;
    self.vel = 0;
    self.dragging = false;
    self.dragY = 0;
    self.dragV = 0;
    self.dragT = 0;
    self.raf = null;
    self.active = false;
    self.accum = 0;                          // 滚轮累计（用于场景切换判定）

    self.bgA = $('[data-bg-a]', sceneEl);
    self.bgB = $('[data-bg-b]', sceneEl);
    self.bgFlip = false;

    // 构建轮盘项
    regions.forEach(function (r, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wheel-item';
      b.innerHTML = '<span class="cn">' + r.cn + '</span>' + r.en;
      b.addEventListener('click', function () { self.onItemClick(i); });
      wheelEl.appendChild(b);
      self.items.push(b);
      var dp = ATLAS.display(r);
      if (dp[0]) img(dp[0].src); // 预载签名图（取展示首张）
    });

    self.select(0, true);

    if (!isMobile) {
      // —— 桌面：拖拽 + 惯性 ——
      wheelEl.addEventListener('pointerdown', function (e) {
        self.dragging = true;
        self.dragY = e.clientY;
        self.dragV = 0;
        self.dragT = performance.now();
        try { wheelEl.setPointerCapture(e.pointerId); } catch (err) {}
      });
      wheelEl.addEventListener('pointermove', function (e) {
        if (!self.dragging) return;
        var now = performance.now();
        var dy = e.clientY - self.dragY;
        self.dragY = e.clientY;
        // 垂直拖动 → 角度（向下拖 = 轮盘向下转）
        var dRot = dy * 0.16;
        self.rot += dRot;
        self.targetRot = self.rot;
        self.vel = 0;
        var dt = Math.max(1, now - self.dragT);
        self.dragV = self.dragV * 0.7 + (dRot / dt * 16) * 0.3;
        self.dragT = now;
        self.layout();
        self.pickNearest();
      });
      ['pointerup', 'pointercancel'].forEach(function (ev) {
        wheelEl.addEventListener(ev, function () {
          if (!self.dragging) return;
          self.dragging = false;
          self.vel = clamp(self.dragV * 14, -14, 14); // 惯性初速
          self.kick();
        });
      });
    }

    // 面板按钮 → 跳转地区手记页
    $('.enter-btn', panelEl).addEventListener('click', function () {
      location.href = 'region.html?id=' + self.regions[self.index].id;
    });
  }

  Wheel.prototype.limits = function () {
    return { min: -(this.regions.length - 1) * this.STEP, max: 0 };
  };

  Wheel.prototype.kick = function () {
    var self = this;
    if (self.raf) return;
    var L = self.limits();
    function frame() {
      if (!self.dragging) {
        self.rot += self.vel;
        self.vel *= 0.93; // 摩擦
        // 边界橡皮筋
        if (self.rot > L.max) { self.rot = L.max + (self.rot - L.max) * 0.4; self.vel *= 0.5; }
        if (self.rot < L.min) { self.rot = L.min + (self.rot - L.min) * 0.4; self.vel *= 0.5; }
        // 低速吸附
        if (Math.abs(self.vel) < 0.25) {
          var snap = Math.round(self.rot / self.STEP) * self.STEP;
          self.rot += (snap - self.rot) * 0.18;
          if (Math.abs(snap - self.rot) < 0.02 && Math.abs(self.vel) < 0.05) {
            self.rot = snap; self.vel = 0;
            self.layout();
            self.pickNearest();
            self.raf = null;
            return;
          }
        }
        self.layout();
        self.pickNearest();
      }
      self.raf = requestAnimationFrame(frame);
    }
    self.raf = requestAnimationFrame(frame);
  };

  Wheel.prototype.layout = function () {
    if (isMobile) return;
    var self = this;
    var R = self.el.offsetWidth / 2;
    for (var i = 0; i < self.items.length; i++) {
      var a = (i * self.STEP + self.rot) * Math.PI / 180;
      var x = R + Math.cos(a) * R * 0.92;
      var y = R + Math.sin(a) * R * 0.92;
      self.items[i].style.transform =
        'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) translate(-50%,-50%)';
      // 离 0° 越远越淡
      var d = Math.min(1, Math.abs(i * self.STEP + self.rot) / 80);
      self.items[i].style.opacity = (1 - d * 0.72).toFixed(2);
      self.items[i].style.visibility = (i * self.STEP + self.rot > 100 || i * self.STEP + self.rot < -100) ? 'hidden' : 'visible';
    }
  };

  Wheel.prototype.pickNearest = function () {
    var idx = clamp(Math.round(-this.rot / this.STEP), 0, this.regions.length - 1);
    if (idx !== this.index) this.select(idx);
  };

  Wheel.prototype.select = function (idx, instant) {
    var self = this;
    self.index = idx;
    var r = self.regions[idx];
    self.items.forEach(function (it, i) { it.classList.toggle('on', i === idx); });

    // 面板
    var p = self.panel;
    $('.region-cn', p).textContent = r.cn + ' · ' + r.alias;
    $('.region-en', p).textContent = r.en;
    $('.region-line', p).textContent = r.line;
    var dp = ATLAS.display(r);
    $('.region-count', p).textContent = dp.length + ' FRAMES · ' + dp.length + ' 张';
    if (!instant) {
      p.style.animation = 'none';
      void p.offsetWidth;
      p.style.animation = '';
    }

    // 背景交叉淡入
    var showEl = self.bgFlip ? self.bgA : self.bgB;
    var hideEl = self.bgFlip ? self.bgB : self.bgA;
    var dp0 = ATLAS.display(r)[0];
    if (dp0) showEl.style.backgroundImage = 'url("' + dp0.src + '")';
    showEl.classList.add('show');
    hideEl.classList.remove('show');
    self.bgFlip = !self.bgFlip;
  };

  Wheel.prototype.onItemClick = function (i) {
    var self = this;
    if (i === self.index) {
      location.href = 'region.html?id=' + self.regions[i].id;
      return;
    }
    if (isMobile) {
      self.select(i);
      self.items[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      return;
    }
    // 旋转到目标项
    self.targetRot = -i * self.STEP;
    cancelAnimationFrame(self.raf); self.raf = null;
    (function tween() {
      var d = self.targetRot - self.rot;
      self.rot += d * 0.16;
      if (Math.abs(d) < 0.03) {
        self.rot = self.targetRot;
        self.layout(); self.select(i);
        return;
      }
      self.layout(); self.pickNearest();
      requestAnimationFrame(tween);
    })();
  };

  /* 滚轮输入：返回 true 表示已消费（用于场景切换判断） */
  Wheel.prototype.feed = function (deltaY) {
    var self = this;
    if (isMobile) return false;
    var L = self.limits();
    var atTop = self.index === 0 && self.rot >= L.max - 0.5;
    var atBottom = self.index === self.regions.length - 1 && self.rot <= L.min + 0.5;

    if ((deltaY < 0 && atTop) || (deltaY > 0 && atBottom)) {
      // 到达边界：累计冲量后放行场景切换
      self.accum += deltaY;
      if (Math.abs(self.accum) > 260) { self.accum = 0; return false; }
      return true;
    }
    self.accum = 0;
    // 向下滚（deltaY>0）= 轮盘前进到下一项；与场景切换方向约定一致
    self.vel -= deltaY * 0.012;
    self.vel = clamp(self.vel, -16, 16);
    cancelAnimationFrame(self.raf); self.raf = null;
    self.kick();
    return true;
  };

  Wheel.prototype.activate = function () { this.active = true; this.layout(); };
  Wheel.prototype.deactivate = function () { this.active = false; };

  var wheelEurope = new Wheel($('#scene-europe'), $('#wheelEurope'), $('#panelEurope'), GROUPS.europe);
  var wheelChina = new Wheel($('#scene-china'), $('#wheelChina'), $('#panelChina'), GROUPS.china);
  var wheels = { 'scene-europe': wheelEurope, 'scene-china': wheelChina };

  SceneManager.onChange(function (cur) {
    var id = $$('.scene')[cur].id;
    Object.keys(wheels).forEach(function (k) {
      if (k === id) wheels[k].activate(); else wheels[k].deactivate();
    });
  });
  // 初始
  wheelEurope.layout(); wheelChina.layout();

  /* ============================================================
     全局滚轮 / 触摸 / 键盘 → 场景 or 轮盘
     ============================================================ */
  (function () {
    var lock = 0;
    window.addEventListener('wheel', function (e) {
      if (Album.isOpen()) return;
      var now = performance.now();
      if (now - lock < 1150) return;
      if (SceneManager.isBusy()) return;

      var scenes = $$('.scene');
      var curScene = scenes[SceneManager.current()];
      var w = wheels[curScene.id];
      if (w && w.active && !isMobile) {
        var consumed = w.feed(e.deltaY);
        if (consumed) return;
      }
      if (Math.abs(e.deltaY) < 24) return;
      lock = now;
      if (e.deltaY > 0) SceneManager.next(); else SceneManager.prev();
    }, { passive: true });

    // 触摸
    var tY = null, tX = null;
    window.addEventListener('touchstart', function (e) {
      if (Album.isOpen()) return;
      tY = e.touches[0].clientY; tX = e.touches[0].clientX;
    }, { passive: true });
    window.addEventListener('touchend', function (e) {
      if (Album.isOpen() || tY === null) return;
      var dy = tY - e.changedTouches[0].clientY;
      var dx = tX - e.changedTouches[0].clientX;
      tY = null;
      if (Math.abs(dy) < 60 || Math.abs(dy) < Math.abs(dx)) return;
      // 轮盘场景在移动端为横向列表，不拦截纵向切幕
      if (dy > 0) SceneManager.next(); else SceneManager.prev();
    }, { passive: true });

    // 键盘
    window.addEventListener('keydown', function (e) {
      if (Album.isOpen()) {
        if (e.key === 'Escape') Album.close();
        if (e.key === 'ArrowRight') Album.next();
        if (e.key === 'ArrowLeft') Album.prev();
        return;
      }
      if (['ArrowDown', 'PageDown', ' '].indexOf(e.key) >= 0) { e.preventDefault(); SceneManager.next(); }
      if (['ArrowUp', 'PageUp'].indexOf(e.key) >= 0) { e.preventDefault(); SceneManager.prev(); }
      if (e.key === 'Home') SceneManager.go(0);
      if (e.key === 'End') SceneManager.go(4);
    });
  })();

  /* ============================================================
     ④ 翻页相册
     ============================================================ */
  var Album = (function () {
    var root = $('#album');
    var stage = $('#albumStage');
    var topPage = $('.page-top', stage);
    var underPage = $('.page-under', stage);
    var regionEl = $('.album-region');
    var counterB = $('.album-counter b');
    var counterS = $('.album-counter span');
    var capEl = $('.album-caption');
    var open = false;
    var region = null;
    var cur = 0;
    var flipping = false;
    var photos = []; // 当前相册展示照片（已过滤隐藏）

    function fill(pageEl, photo, region) {
      pageEl.innerHTML = '';
      if (!photo) return;
      var im = document.createElement('img');
      im.alt = photo.cn || region.cn;
      im.src = photo.src;
      im.onerror = function () {
        im.remove();
        var ph = document.createElement('div');
        ph.className = 'ph';
        ph.textContent = region.en.charAt(0);
        pageEl.appendChild(ph);
      };
      pageEl.appendChild(im);
    }

    function meta() {
      var total = photos.length;
      counterB.textContent = ('0' + (cur + 1)).slice(-2);
      counterS.textContent = total;
      var p = photos[cur];
      if (!p) return;
      $('b', capEl).textContent = p.cn;
      $('span', capEl).textContent = p.en;
    }

    function render(instant) {
      if (instant) topPage.classList.add('instant');
      topPage.classList.remove('flip-next', 'flip-prev');
      fill(topPage, photos[cur], region);
      fill(underPage, photos[cur + 1] || photos[0], region);
      meta();
      if (instant) { void topPage.offsetWidth; topPage.classList.remove('instant'); }
    }

    function normalize() {
      flipping = false;
      topPage.classList.add('instant');
      render(false);
      void topPage.offsetWidth;
      topPage.classList.remove('instant');
    }

    function next() {
      if (!open || flipping || !region) return;
      if (cur >= photos.length - 1) { bounce('next'); return; }
      flipping = true;
      fill(underPage, photos[cur + 1], region);
      topPage.classList.add('flip-next');
      setTimeout(function () {
        cur++;
        normalize();
      }, 920);
    }

    function prev() {
      if (!open || flipping || !region) return;
      if (cur <= 0) { bounce('prev'); return; }
      flipping = true;
      // 顶页先置为「已翻走」状态显示上一张，再翻回
      topPage.classList.add('instant');
      fill(topPage, photos[cur - 1], region);
      topPage.classList.add('flip-prev');
      void topPage.offsetWidth;
      topPage.classList.remove('instant');
      requestAnimationFrame(function () {
        topPage.classList.remove('flip-prev');
        setTimeout(function () {
          cur--;
          normalize();
        }, 920);
      });
    }

    function bounce(dir) {
      stage.style.transition = 'transform .35s cubic-bezier(.22,.61,.21,1)';
      stage.style.transform = 'translateX(' + (dir === 'next' ? -14 : 14) + 'px)';
      setTimeout(function () {
        stage.style.transform = 'translateX(0)';
        setTimeout(function () { stage.style.transition = ''; }, 380);
      }, 180);
    }

    function openAlbum(r) {
      region = r;
      photos = ATLAS.display(region);
      cur = 0;
      open = true;
      $('b', regionEl).textContent = r.cn;
      $('span', regionEl).textContent = r.en;
      if (photos.length) {
        render(true);
        // 预载后续
        photos.slice(1, 4).forEach(function (p) { img(p.src); });
      } else {
        fill(topPage, null, region);
        fill(underPage, null, region);
        meta();
      }
      root.classList.add('open');
      root.setAttribute('aria-hidden', 'false');
    }

    function close() {
      open = false;
      root.classList.remove('open');
      root.setAttribute('aria-hidden', 'true');
    }

    $('.album-close').addEventListener('click', close);
    $('.album-nav.next').addEventListener('click', next);
    $('.album-nav.prev').addEventListener('click', prev);
    $('.album-card').addEventListener('click', function () {
      if (!open || !region || !photos[cur]) return;
      if (window.Postcard) Postcard.open(photos[cur], region);
    });

    // 拖拽翻页
    var dX = null;
    stage.addEventListener('pointerdown', function (e) { dX = e.clientX; });
    window.addEventListener('pointerup', function (e) {
      if (dX === null || !open) return;
      var dx = e.clientX - dX;
      dX = null;
      if (dx < -55) next();
      else if (dx > 55) prev();
    });

    // 点击书页左右半区翻页
    stage.addEventListener('click', function (e) {
      if (!open || flipping) return;
      var r = stage.getBoundingClientRect();
      if (e.clientX > r.left + r.width / 2) next(); else prev();
    });

    return {
      open: openAlbum,
      close: close,
      next: next,
      prev: prev,
      isOpen: function () { return open; }
    };
  })();

  /* ============================================================
     ⑤ 其余填充：HERO / ABOUT 图
     ============================================================ */
  $('#heroBg').style.backgroundImage = 'url("' + ATLAS.hero.img + '")';
  $('#aboutImg').src = ATLAS.about.img;

  // 尾声：明信片入口（无预选图，默认签名图，可上传自己的照片）
  var endBtn = $('#endCardBtn');
  if (endBtn) endBtn.addEventListener('click', function () {
    if (window.Postcard) Postcard.open(null, null);
  });

  /* 调试钩子（自动化测试用） */
  window.__atlas = {
    go: SceneManager.go,
    scene: SceneManager,
    clearFog: Fog.clearAll,
    openAlbum: function (id) { Album.open(REGION_MAP[id]); },
    closeAlbum: Album.close
  };

})();
