/* ============================================================
   枭潼 · 摄影作品集 — 明信片工作室
   选中相册图 / 上传本地图 → canvas 合成（照片 + 邮票 +
   邮戳 + 手写留言 + 落款）→ 导出 PNG 保存
   ============================================================ */
(function () {
  'use strict';

  var W = 1600, H = 1000;
  var root, canvas, ctx, msgEl, signEl, placeEl, fileEl, saveBtn;
  var photoImg = null;
  var isOpen = false;
  var state = { photo: null, region: null };
  var renderTimer = null;

  function $(s, r) { return (r || document).querySelector(s); }

  /* ------------------------------------------------ DOM 注入 */
  function build() {
    root = document.createElement('div');
    root.id = 'postcard';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="pc-top">' +
        '<p class="pc-title">明信片工作室 <span>POSTCARD&nbsp;STUDIO</span></p>' +
        '<button class="pc-close" type="button" aria-label="关闭">×<em>ESC</em></button>' +
      '</div>' +
      '<div class="pc-body">' +
        '<div class="pc-preview"><canvas id="pcCanvas" width="' + W + '" height="' + H + '"></canvas></div>' +
        '<div class="pc-controls">' +
          '<label class="pc-label" for="pcMsg">留言 <span>MESSAGE</span></label>' +
          '<textarea id="pcMsg" rows="3" maxlength="64" placeholder="写一句想寄出的话……"></textarea>' +
          '<label class="pc-label" for="pcSign">署名 <span>SIGNATURE</span></label>' +
          '<input id="pcSign" type="text" maxlength="24" value="枭潼 · XIAO TONG">' +
          '<label class="pc-label" for="pcPlace">邮戳地 <span>POSTMARK</span></label>' +
          '<input id="pcPlace" type="text" maxlength="14" placeholder="旅途中">' +
          '<div class="pc-row">' +
            '<button class="pc-btn ghost" id="pcUpload" type="button">上传图片<em>UPLOAD</em></button>' +
            '<button class="pc-btn solid" id="pcSave" type="button">保存明信片<em>SAVE&nbsp;PNG</em></button>' +
          '</div>' +
          '<input id="pcFile" type="file" accept="image/*" hidden>' +
          '<p class="pc-hint">图源自 Unsplash / Picsum，可自由保存使用<br>上传自己的照片亦可制作</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    canvas = $('#pcCanvas');
    ctx = canvas.getContext('2d');
    msgEl = $('#pcMsg');
    signEl = $('#pcSign');
    placeEl = $('#pcPlace');
    fileEl = $('#pcFile');
    saveBtn = $('#pcSave');

    $('.pc-close', root).addEventListener('click', close);
    $('#pcUpload').addEventListener('click', function () { fileEl.click(); });
    saveBtn.addEventListener('click', save);
    [msgEl, signEl, placeEl].forEach(function (el) {
      el.addEventListener('input', scheduleRender);
    });
    fileEl.addEventListener('change', onFile);
    window.addEventListener('keydown', function (e) {
      if (isOpen && e.key === 'Escape') close();
    });
    /* 点击预览区外背景不关闭（防误触），仅 ESC / × */
  }

  /* ---------------------------------------------- 图片加载 */
  function loadPhoto(src) {
    var im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = function () { photoImg = im; render(); };
    im.onerror = function () {
      // 跨域失败：退化为无 crossOrigin 再试（可预览，导出可能受限）
      var im2 = new Image();
      im2.onload = function () { photoImg = im2; render(); };
      im2.src = src;
    };
    im.src = src;
  }

  function onFile() {
    var f = fileEl.files && fileEl.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var im = new Image();
      im.onload = function () {
        photoImg = im;
        state.photo = { src: f.name, cn: '来自我的相册', en: 'FROM MY OWN ALBUM' };
        render();
      };
      im.src = rd.result;
    };
    rd.readAsDataURL(f);
    fileEl.value = '';
  }

  /* ---------------------------------------------- 绘制工具 */
  function drawCover(im, x, y, w, h) {
    var ir = im.width / im.height, r = w / h;
    var sw, sh, sx, sy;
    if (ir > r) { sh = im.height; sw = sh * r; sx = (im.width - sw) / 2; sy = 0; }
    else { sw = im.width; sh = sw / r; sx = 0; sy = (im.height - sh) / 2; }
    ctx.drawImage(im, sx, sy, sw, sh, x, y, w, h);
  }

  function wrapText(text, maxW) {
    var lines = [], line = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === '\n') { lines.push(line); line = ''; continue; }
      if (line && ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; }
      else line += ch;
    }
    if (line) lines.push(line);
    return lines;
  }

  /* 邮票：锯齿白框 + 程序画山景 */
  function drawStamp(x, y, w, h) {
    var i, n;
    // 白底
    ctx.fillStyle = '#FBFCFC';
    ctx.fillRect(x, y, w, h);
    // 山景
    var ix = x + 12, iy = y + 12, iw = w - 24, ih = h - 44;
    var g = ctx.createLinearGradient(0, iy, 0, iy + ih);
    g.addColorStop(0, '#8FA8BE');
    g.addColorStop(0.62, '#C7D3D5');
    g.addColorStop(1, '#EDF2F2');
    ctx.fillStyle = g;
    ctx.fillRect(ix, iy, iw, ih);
    // 太阳
    ctx.fillStyle = 'rgba(244,246,246,0.9)';
    ctx.beginPath();
    ctx.arc(ix + iw * 0.72, iy + ih * 0.28, iw * 0.09, 0, 7);
    ctx.fill();
    // 远山 / 近山
    ctx.fillStyle = '#7FA3B2';
    ctx.beginPath();
    ctx.moveTo(ix, iy + ih);
    ctx.lineTo(ix + iw * 0.38, iy + ih * 0.3);
    ctx.lineTo(ix + iw * 0.72, iy + ih);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5E7480';
    ctx.beginPath();
    ctx.moveTo(ix + iw * 0.34, iy + ih);
    ctx.lineTo(ix + iw * 0.68, iy + ih * 0.44);
    ctx.lineTo(ix + iw, iy + ih);
    ctx.closePath(); ctx.fill();
    // 邮票文字
    ctx.fillStyle = '#5E7480';
    ctx.font = '600 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('M O   C H E N', x + w / 2, y + h - 14);
    // 锯齿（纸色小圆沿边咬出）
    ctx.fillStyle = '#F2F1EC';
    var step = 15, r = 5;
    n = Math.floor(w / step);
    for (i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.arc(x + i * step, y, r, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(x + i * step, y + h, r, 0, 7); ctx.fill();
    }
    n = Math.floor(h / step);
    for (i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.arc(x, y + i * step, r, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(x + w, y + i * step, r, 0, 7); ctx.fill();
    }
  }

  /* 邮戳：双圆 + 日期 + 地名 */
  function drawPostmark(cx, cy, place) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-13 * Math.PI / 180);
    ctx.strokeStyle = 'rgba(35,46,53,0.52)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 96, 0, 7); ctx.stroke();
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(0, 0, 76, 0, 7); ctx.stroke();
    ctx.fillStyle = 'rgba(35,46,53,0.58)';
    ctx.textAlign = 'center';
    var today = new Date();
    var dateStr = today.getFullYear() + '.' +
      ('0' + (today.getMonth() + 1)).slice(-2) + '.' +
      ('0' + today.getDate()).slice(-2);
    ctx.font = '500 23px Inter, sans-serif';
    ctx.fillText(dateStr, 0, -16);
    ctx.font = '400 30px "Noto Serif SC", serif';
    ctx.fillText(place || '旅途中', 0, 26);
    ctx.font = '400 13px Inter, sans-serif';
    ctx.fillText('P O S T M A R K', 0, 52);
    ctx.restore();
  }

  /* ---------------------------------------------- 主渲染 */
  function render() {
    if (!ctx) return;
    var paper = '#F2F1EC';
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, W, H);

    // 外框细线
    ctx.strokeStyle = 'rgba(35,46,53,0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, W - 52, H - 52);

    var PX = 64, PY = 64, PW = 1150, PH = 810;

    // 照片
    if (photoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(PX, PY, PW, PH);
      ctx.clip();
      drawCover(photoImg, PX, PY, PW, PH);
      ctx.restore();
    } else {
      ctx.fillStyle = '#E4E7E4';
      ctx.fillRect(PX, PY, PW, PH);
      ctx.strokeStyle = 'rgba(94,116,128,0.5)';
      ctx.setLineDash([10, 8]);
      ctx.strokeRect(PX + 30, PY + 30, PW - 60, PH - 60);
      ctx.setLineDash([]);
      ctx.fillStyle = '#5E7480';
      ctx.font = '300 34px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('点 击「 上 传 图 片 」放 入 你 的 照 片', PX + PW / 2, PY + PH / 2);
    }

    // 照片 caption
    var cap = state.photo;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#232E35';
    ctx.font = '400 27px "Noto Serif SC", serif';
    ctx.fillText(cap && cap.cn ? cap.cn : '', PX + 4, PY + PH + 48);
    ctx.fillStyle = '#7FA3B2';
    ctx.font = 'italic 400 22px "Cormorant Garamond", serif';
    ctx.fillText(cap && cap.en ? cap.en : '', PX + 4, PY + PH + 82);

    // 右栏
    var RX = 1214, RW = W - RX - 64; // 1214..1536
    drawStamp(RX + (RW - 226) / 2, 64, 226, 170);
    drawPostmark(RX + RW / 2, 318, placeEl.value.trim());

    // 地址虚线
    ctx.strokeStyle = 'rgba(94,116,128,0.45)';
    ctx.setLineDash([4, 7]);
    ctx.lineWidth = 1.6;
    [492, 566, 640].forEach(function (yy) {
      ctx.beginPath();
      ctx.moveTo(RX + 12, yy);
      ctx.lineTo(RX + RW - 12, yy);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 留言
    ctx.fillStyle = '#7FA3B2';
    ctx.font = '400 15px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('M E S S A G E · 留 言', RX + 12, 706);
    ctx.fillStyle = 'rgba(35,46,53,0.88)';
    ctx.font = '400 36px "Ma Shan Zheng", "Noto Serif SC", serif';
    var msg = msgEl.value.trim() || '见字如面。';
    var lines = wrapText(msg, RW - 24).slice(0, 4);
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], RX + 12, 760 + i * 52);
    }

    // 署名
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(35,46,53,0.8)';
    ctx.font = '600 34px Caveat, "Ma Shan Zheng", cursive';
    ctx.fillText('— ' + (signEl.value.trim() || '枭潼'), W - 76, H - 56);

    // 右栏竖缝虚线（明信片背感）
    ctx.strokeStyle = 'rgba(94,116,128,0.3)';
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.moveTo(RX - 34, 64);
    ctx.lineTo(RX - 34, H - 64);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 180);
  }

  /* ---------------------------------------------- 保存 */
  function save() {
    try {
      var url = canvas.toDataURL('image/png');
      var a = document.createElement('a');
      var place = (placeEl.value.trim() || 'postcard').replace(/\s+/g, '-');
      a.href = url;
      a.download = 'postcard-' + place + '.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      saveBtn.classList.add('done');
      saveBtn.innerHTML = '已保存 ✓<em>SAVED</em>';
      setTimeout(function () {
        saveBtn.classList.remove('done');
        saveBtn.innerHTML = '保存明信片<em>SAVE&nbsp;PNG</em>';
      }, 1800);
    } catch (err) {
      alert('该图片受跨域限制无法导出，请改用「上传图片」制作。');
    }
  }

  /* ---------------------------------------------- 开关 */
  function open(photo, region) {
    if (!root) build();
    state.photo = photo || {
      src: (window.ATLAS && ATLAS.hero.img) || '',
      cn: '以光为笔，以影为墨',
      en: 'Collecting light at the edge of the world.'
    };
    state.region = region || null;
    msgEl.value = photo && photo.cn ? photo.cn : '';
    placeEl.value = region && region.cn ? region.cn : '';
    loadPhoto(state.photo.src);

    isOpen = true;
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('36px "Ma Shan Zheng"'),
        document.fonts.load('600 34px Caveat')
      ]).then(render).catch(function () {});
    }
  }

  function close() {
    isOpen = false;
    root.classList.remove('open');
    root.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.Postcard = { open: open, close: close, isOpen: function () { return isOpen; } };
})();
