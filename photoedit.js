/* ============================================================
   枭潼 · 摄影作品集 — 地区照片编辑
   每个地区页可：新增 / 删除 / 切换是否在网站展示
   编辑即时写入 localStorage，点击「完成」刷新页面生效
   ============================================================ */
(function () {
  'use strict';

  function $(s, r) { return (r || document).querySelector(s); }

  // 解析当前地区（与 region.js 一致）
  var id = 'iceland';
  try { id = (new URLSearchParams(location.search)).get('id') || 'iceland'; } catch (e) {}
  var region = null;
  Object.keys(ATLAS.groups).forEach(function (g) {
    ATLAS.groups[g].forEach(function (r) { if (r.id === id) region = r; });
  });
  if (!region) return;

  var overlay = null;
  var listEl = null;

  function build() {
    overlay = document.createElement('div');
    overlay.id = 'photoEdit';
    overlay.className = 'pe-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="pe-panel">' +
        '<header class="pe-head">' +
          '<h3>编辑照片 <span>EDIT · ' + region.cn + '</span></h3>' +
          '<button class="pe-close" type="button" aria-label="关闭">×</button>' +
        '</header>' +
        '<div class="pe-list" id="peList"></div>' +
        '<form class="pe-add" id="peAdd" autocomplete="off">' +
          '<input id="peSrc" type="url" placeholder="图片网址 URL（https://…）" required>' +
          '<input id="peCn" type="text" placeholder="中文说明" maxlength="40">' +
          '<input id="peEn" type="text" placeholder="EN caption" maxlength="60">' +
          '<button type="submit">+ 添加照片</button>' +
        '</form>' +
        '<footer class="pe-foot">' +
          '<button class="pe-reset" type="button">重置该地区为默认</button>' +
          '<button class="pe-done" type="button">完成 · 刷新页面</button>' +
        '</footer>' +
      '</div>';
    document.body.appendChild(overlay);

    listEl = $('#peList', overlay);
    var srcEl = $('#peSrc', overlay);
    var cnEl = $('#peCn', overlay);
    var enEl = $('#peEn', overlay);

    $('.pe-close', overlay).addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    // 显隐切换（change 事件，稳定键 data-id 定位）
    listEl.addEventListener('change', function (e) {
      var cb = e.target;
      if (!cb || cb.dataset.act !== 'vis') return;
      var row = cb.closest('.pe-row');
      if (!row) return;
      ATLAS.PhotoStore.setHidden(region, row.dataset.id, !cb.checked);
      row.classList.toggle('hidden', !cb.checked);
    });

    // 删除
    listEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act="del"]');
      if (!btn) return;
      var row = btn.closest('.pe-row');
      if (!row) return;
      if (confirm('删除这张照片？')) {
        ATLAS.PhotoStore.remove(region, row.dataset.id);
        render();
      }
    });

    // 新增
    $('#peAdd', overlay).addEventListener('submit', function (e) {
      e.preventDefault();
      var src = srcEl.value.trim();
      if (!src) return;
      ATLAS.PhotoStore.add(region, {
        src: src,
        cn: cnEl.value.trim(),
        en: enEl.value.trim()
      });
      srcEl.value = cnEl.value = enEl.value = '';
      render();
    });

    // 重置
    $('.pe-reset', overlay).addEventListener('click', function () {
      if (confirm('确定要清除对「' + region.cn + '」的所有编辑（新增/删除/显隐）吗？')) {
        ATLAS.PhotoStore.reset(region);
        render();
      }
    });

    // 完成 → 刷新页面以应用到展示
    $('.pe-done', overlay).addEventListener('click', function () { location.reload(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') close();
    });
  }

  function render() {
    var photos = ATLAS.PhotoStore.getEffective(region);
    listEl.innerHTML = '';
    if (!photos.length) {
      listEl.innerHTML = '<p class="pe-empty">该地区暂无照片，请在下方添加。</p>';
      return;
    }
    photos.forEach(function (p) {
      var row = document.createElement('div');
      row.className = 'pe-row' + (p.hidden ? ' hidden' : '');
      row.dataset.id = p.id;
      row.innerHTML =
        '<img src="' + p.src + '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
        '<div class="pe-meta">' +
          '<b>' + (p.cn || '（无说明）') + '</b>' +
          '<span>' + (p.en || '') + '</span>' +
        '</div>' +
        '<label class="pe-vis">' +
          '<input type="checkbox" data-act="vis" ' + (p.hidden ? '' : 'checked') + '>' +
          '展示' +
        '</label>' +
        '<button class="pe-del" type="button" data-act="del" aria-label="删除">×</button>';
      listEl.appendChild(row);
    });
  }

  function open() {
    if (!overlay) build();
    render();
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  var btn = $('#rEdit');
  if (btn) btn.addEventListener('click', open);
})();
