/**
 * ============================================================================
 *  main.js —— 前台渲染与交互引擎（融合版）
 * ============================================================================
 *  职责：
 *    1. 把 data.js（内容）与 config.js（配置）渲染成页面
 *    2. 实现交互：轮播、分类切换、条目切换、复制微信、下单弹层、图片放大
 *    3. URL 锚点同步（#cat=分类id&item=条目id），方便分享到具体玩法
 *
 *  ★ 一般情况下不需要改这个文件：
 *    · 改文字 / 图片 -> assets/js/config.js、assets/js/data.js
 *    · 改样式        -> assets/css/base.css、assets/css/layout.css
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
   * 0. 小工具
   * ======================================================================== */

  function $(id) { return document.getElementById(id); }

  /* 创建元素：el('div', 'cls', '文字') */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function clear(node) {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  /* 空白图片：用于清空 lightbox，避免出现「碎图」图标 */
  var BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  /* 图片加载失败时的兜底图（可在 config.js -> SITE_CONFIG.fallbackImage 里改） */
  var FALLBACK_IMG = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.fallbackImage)
    ? SITE_CONFIG.fallbackImage
    : (typeof ASSETS !== 'undefined' ? ASSETS : 'assets') + '/images/default-avatar.svg';

  /* 提示语（config.js -> UI_TEXT），缺字段时用这里的默认值兜底 */
  var TEXT = (typeof UI_TEXT !== 'undefined' && UI_TEXT) || {};
  function txt(key, fallback) {
    return (TEXT[key] !== undefined && TEXT[key] !== '') ? TEXT[key] : fallback;
  }

  /* 价格格式化：纯数字前面补 ¥，「送20 / 半价 / 免费」这类描述原样显示 */
  function fmtPrice(v) {
    v = (v === undefined || v === null) ? '' : String(v).trim();
    if (!v) return '';
    return /^\d+(\.\d+)?$/.test(v) ? '¥' + v : v;
  }

  /* --------------------------------------------------------------------------
   * 图片地址的版本号 —— 解决「换了图片但网站还是显示旧的」
   *
   * GitHub Pages 给所有静态文件固定返回 cache-control: max-age=600，而且**没法覆盖**。
   * 所以如果你换了一张图、文件名没变（比如还是 banner-header.webp），
   * 浏览器和 CDN 会一直拿缓存里那张旧图，最多 10 分钟都不更新。
   *
   * 办法：所有图片地址后面挂一个 ?v=<内容版本>。版本一变，地址就变，
   * 浏览器才会当成新资源去取。版本号来自 config.js 里的 SITE_CONFIG.contentRev
   * （后台每次发布/换图都会把它往前推）。
   * ------------------------------------------------------------------------ */
  var assetVer = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG && SITE_CONFIG.contentRev) || '';

  function withVer(src) {
    if (!src || !assetVer) return src;
    if (!/^assets\//.test(src)) return src;        /* 外链图片不加 */
    return src + (src.indexOf('?') >= 0 ? '&' : '?') + 'v=' + assetVer;
  }

  /* 创建带兜底的图片 */
  function img(src, cls, alt) {
    var i = document.createElement('img');
    if (cls) i.className = cls;
    if (alt) i.alt = alt;
    if (src) {
      i.src = withVer(src);
      i.addEventListener('error', function () {
        if (i.dataset.fallbackApplied) return;
        i.dataset.fallbackApplied = '1';
        i.src = FALLBACK_IMG;
      });
    }
    return i;
  }

  /* ==========================================================================
   * 1. 站点级配置注入（标题 / SEO / 图标 / 页面底色）
   * ======================================================================== */

  function setMeta(name, content) {
    if (!content) return;
    var m = document.querySelector('meta[name="' + name + '"]');
    if (!m) {
      m = document.createElement('meta');
      m.setAttribute('name', name);
      document.head.appendChild(m);
    }
    m.setAttribute('content', content);
  }

  function applySiteConfig() {
    if (typeof SITE_CONFIG === 'undefined') return;

    if (SITE_CONFIG.title) document.title = SITE_CONFIG.title;
    setMeta('description', SITE_CONFIG.description);
    setMeta('keywords', SITE_CONFIG.keywords);

    if (SITE_CONFIG.favicon) {
      var link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = SITE_CONFIG.favicon;
    }

    /* 页面底色：base.css 里 body 读的是 --page-bg */
    if (SITE_CONFIG.background) {
      document.documentElement.style.setProperty('--page-bg', SITE_CONFIG.background);
    }
  }

  /* ==========================================================================
   * 2. 顶部主视觉轮播
   * ======================================================================== */

  var heroSlides = [];
  var heroIdx = 0;
  var heroTimer = null;

  function applyHero() {
    var track = $('heroTrack');
    var dots = $('heroDots');
    if (!track) return;

    track.style.transform = 'translateX(' + (-heroIdx * 100) + '%)';

    if (dots) {
      for (var i = 0; i < dots.children.length; i++) {
        dots.children[i].className = 'hero-dot' + (i === heroIdx ? ' on' : '');
      }
    }
  }

  function showHero(i, manual) {
    if (!heroSlides.length) return;
    heroIdx = ((i % heroSlides.length) + heroSlides.length) % heroSlides.length;
    applyHero();
    if (manual) startHeroTimer();   /* 手动切换后重新计时，避免刚点完就自动翻页 */
  }

  function stopHeroTimer() {
    if (heroTimer) { window.clearInterval(heroTimer); heroTimer = null; }
  }

  function startHeroTimer() {
    stopHeroTimer();
    var cfg = (typeof HERO_CONFIG !== 'undefined' && HERO_CONFIG) || {};
    if (!cfg.autoplay || heroSlides.length < 2) return;
    heroTimer = window.setInterval(function () { showHero(heroIdx + 1); }, cfg.interval || 4000);
  }

  function renderHero() {
    var hero = $('hero');
    var track = $('heroTrack');
    var dots = $('heroDots');
    if (!hero || !track) return;

    var cfg = (typeof HERO_CONFIG !== 'undefined' && HERO_CONFIG) || {};
    heroSlides = cfg.slides || [];

    clear(track);
    clear(dots);

    /* 没配轮播就整块不显示，不留空白 */
    if (!heroSlides.length) { hero.style.display = 'none'; return; }

    heroSlides.forEach(function (s, i) {
      var slide = el('div', 'hero-slide' + (s.fit === 'contain' ? ' is-contain' : ''));
      slide.appendChild(img(s.image, null, s.alt || ''));

      if (s.title || s.subtitle) {
        var cap = el('div', 'hero-cap');
        if (s.title) cap.appendChild(el('div', 't fun', s.title));
        if (s.subtitle) cap.appendChild(el('div', 's', s.subtitle));
        slide.appendChild(cap);
      }

      /* 配了 toCategory 就整张图可点击，跳到对应分类 */
      if (s.toCategory) {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', function () { go(s.toCategory, null, false); });
      }

      track.appendChild(slide);

      var dot = el('button', 'hero-dot' + (i === 0 ? ' on' : ''));
      dot.type = 'button';
      dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 张');
      dot.addEventListener('click', function () { showHero(i, true); });
      dots.appendChild(dot);
    });

    heroIdx = 0;
    applyHero();

    /* 只有一张图时不显示箭头和指示点 */
    var single = heroSlides.length < 2;
    $('heroPrev').style.display = single ? 'none' : '';
    $('heroNext').style.display = single ? 'none' : '';
    dots.style.display = single ? 'none' : '';

    startHeroTimer();

    /* 鼠标停在轮播上时暂停自动播放 */
    hero.addEventListener('mouseenter', stopHeroTimer);
    hero.addEventListener('mouseleave', startHeroTimer);
  }

  /* ==========================================================================
   * 3. 分类导航 + 路由（URL 锚点）
   * ======================================================================== */

  var ALL = 'all';
  var state = { cat: ALL, item: null };

  function categories() {
    return (typeof SERVICE_CATEGORIES !== 'undefined' && SERVICE_CATEGORIES) ? SERVICE_CATEGORIES : [];
  }

  function findCat(id) {
    var list = categories();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function parseHash() {
    var raw = (window.location.hash || '').replace(/^#/, '');
    var out = {};
    if (!raw) return out;
    raw.split('&').forEach(function (kv) {
      if (!kv) return;
      var p = kv.split('=');
      try { out[p[0]] = decodeURIComponent(p[1] || ''); }
      catch (e) { out[p[0]] = p[1] || ''; }
    });
    return out;
  }

  /* 把当前状态写进地址栏（方便分享 / 刷新后停在原处）。
     file:// 下 history API 不可用时静默失败，不影响使用。 */
  function syncUrl() {
    var h = '#cat=' + encodeURIComponent(state.cat);
    if (state.item) h += '&item=' + encodeURIComponent(state.item);
    try {
      window.history.replaceState(null, '', h);
    } catch (e) {
      /* 忽略：只是个便利功能 */
    }
  }

  /* 跳转：catId 必填，itemId 可选，scroll 控制是否回到顶部 */
  function go(catId, itemId, scroll) {
    state.cat = catId;
    state.item = itemId || null;
    if (catId === ALL) state.item = null;

    renderTabs();
    renderContent();
    syncUrl();

    if (scroll !== false) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderTabs() {
    var box = $('tabs');
    if (!box) return;
    clear(box);

    var nav = (typeof NAV_CONFIG !== 'undefined' && NAV_CONFIG) || {};

    function mkTab(label, id) {
      var b = el('button', 'tab' + (state.cat === id ? ' on' : ''), label);
      b.type = 'button';
      b.addEventListener('click', function () { go(id, null); });
      return b;
    }

    box.appendChild(mkTab(nav.allLabel || '全部', ALL));
    categories().forEach(function (c) { box.appendChild(mkTab(c.title, c.id)); });
  }

  /* ==========================================================================
   * 4. 内容区渲染
   * ======================================================================== */

  function renderContent() {
    var wrap = $('content');
    if (!wrap) return;
    clear(wrap);

    if (state.cat === ALL) {
      renderAllView(wrap);
    } else {
      renderCategoryView(wrap, findCat(state.cat));
    }
  }

  /* ---- 4.1 「全部」视图：每个分类一张卡片 ---- */
  function renderAllView(wrap) {
    var nav = (typeof NAV_CONFIG !== 'undefined' && NAV_CONFIG) || {};
    var content = (typeof CONTENT_CONFIG !== 'undefined' && CONTENT_CONFIG) || {};

    wrap.appendChild(el('div', 'big-title fun', nav.allTitle || '全部价目'));

    var list = el('div', 'cat-list');

    categories().forEach(function (cat) {
      var card = el('div', 'cat-card');

      /* 封面 + 压在封面上的分类名（沿用 dduniao 的粉色渐变条识别） */
      var cover = el('div', 'cat-card-cover');
      if (cat.cover) cover.appendChild(img(cat.cover, null, cat.title));
      cover.appendChild(el('div', 'cat-card-name fun', cat.title));
      card.appendChild(cover);

      var body = el('div', 'cat-card-body');

      var chips = el('div', 'cat-card-items');
      (cat.items || []).forEach(function (item) {
        var chip = el('button', 'cat-chip', item.title);
        chip.type = 'button';
        chip.addEventListener('click', function () { go(cat.id, item.id); });
        chips.appendChild(chip);
      });
      body.appendChild(chips);

      var btn = el('button', 'cat-card-btn fun', content.viewMoreText || '查看玩法');
      btn.type = 'button';
      btn.addEventListener('click', function () { go(cat.id, null); });
      body.appendChild(btn);

      card.appendChild(body);
      list.appendChild(card);
    });

    wrap.appendChild(list);
  }

  /* ---- 4.2 分类视图：大标题 + 玩法胶囊 + 海报卡 + 价目表 ---- */
  function renderCategoryView(wrap, cat) {
    if (!cat) { renderAllView(wrap); return; }

    var items = cat.items || [];

    /* 先确定当前条目：地址栏指定的那个，找不到就用第一个。
       必须在渲染胶囊按钮之前定下来，否则第一个按钮不会被高亮。 */
    var current = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === state.item) current = items[i];
    }
    if (!current) current = items[0];
    if (current) state.item = current.id;

    wrap.appendChild(el('div', 'big-title fun', cat.title));

    /* 玩法胶囊按钮 */
    if (items.length) {
      var subs = el('div', 'subtabs');
      items.forEach(function (item) {
        var on = (state.item === item.id);
        var b = el('button', 'subtab' + (on ? ' on' : ''), item.title);
        b.type = 'button';
        b.addEventListener('click', function () { go(cat.id, item.id); });
        subs.appendChild(b);
      });
      wrap.appendChild(subs);
    }

    if (!current) return;

    wrap.appendChild(buildPoster(cat, current));
    wrap.appendChild(buildPriceSheet(cat, current));
  }

  /* 海报卡：分类封面做底图，上面叠标题 / 价格盒 / 规则 */
  function buildPoster(cat, item) {
    var content = (typeof CONTENT_CONFIG !== 'undefined' && CONTENT_CONFIG) || {};

    var poster = el('div', 'poster anim-up');

    if (cat.cover) poster.appendChild(img(cat.cover, 'poster-bg', ''));

    var body = el('div', 'poster-body');

    body.appendChild(el('div', 'p-title fun', item.title));

    var sub = item.subtitle || cat.subtitle || content.posterBrand || '';
    if (sub) body.appendChild(el('div', 'p-sub', sub));

    /* 价格盒 */
    var prices = item.prices || [];
    if (prices.length) {
      var box = el('div', 'prices');
      prices.forEach(function (p) {
        var pb = el('div', 'price-box');
        if (p.n) pb.appendChild(el('div', 'n', p.n));

        var v = el('div', 'v');
        v.appendChild(document.createTextNode(fmtPrice(p.v)));
        if (p.u) v.appendChild(el('span', 'u', ' ' + p.u));
        pb.appendChild(v);

        box.appendChild(pb);
      });
      body.appendChild(box);
    }

    /* 规则：该条目没写规则就不显示这一块（避免出现与分类无关的内容） */
    var rule = (item.rule || '').trim();
    if (rule) {
      var r = el('div', 'rule');
      r.appendChild(el('span', 'rt', content.ruleLabel || '规则'));
      r.appendChild(el('p', null, rule));
      body.appendChild(r);
    }

    poster.appendChild(body);
    return poster;
  }

  /* 价目表大图卡 */
  function buildPriceSheet(cat, item) {
    var sheet = el('div', 'price-sheet');

    var head = el('div', 'price-sheet-head');
    head.appendChild(el('span', null, item.title + ' · 价目表'));
    if (item.contentImage) head.appendChild(el('span', 'hint', '点击图片可放大'));
    sheet.appendChild(head);

    if (item.contentImage) {
      var im = img(item.contentImage, 'price-sheet-img', item.title + ' 价目表');
      im.addEventListener('click', function () { openLightbox(item.contentImage, item.title + ' · 价目表'); });
      sheet.appendChild(im);
    } else {
      sheet.appendChild(el('div', 'price-sheet-empty', txt('noPriceSheet', '这个玩法暂时没有价目表图片，可以在后台补上')));
    }

    return sheet;
  }

  /* ---- 4.3 底部横幅 + 页脚（整页只渲染一次，切换分类时不会闪烁） ---- */
  function renderSiteParts() {
    var box = $('siteparts');
    if (!box) return;
    clear(box);

    /* 底部装饰横幅（板板须知长图） */
    var notice = (typeof NOTICE_CONFIG !== 'undefined' && NOTICE_CONFIG) || {};
    if (notice.image) {
      var n = el('div', 'notice');
      if (notice.title) n.appendChild(el('div', 'notice-head fun', notice.title));

      var ni = img(notice.image, 'notice-img', notice.title || '板板须知');
      ni.addEventListener('click', function () { openLightbox(notice.image, notice.title || ''); });
      n.appendChild(ni);

      box.appendChild(n);
    }

    /* 页脚 */
    var F = (typeof FOOTER_CONFIG !== 'undefined' && FOOTER_CONFIG) || {};

    var footer = el('footer', 'footer');
    var inner = el('div', 'footer-inner');

    var lines = [
      ['highlight', F.highlightText],
      ['features', F.serviceFeatures],
      ['desc', F.serviceDescription],
      ['vip', F.vipService],
      ['closing', F.closingText]
    ];
    lines.forEach(function (pair) {
      if (!pair[1]) return;
      inner.appendChild(el('p', pair[0] + (pair[0] === 'highlight' || pair[0] === 'closing' ? ' fun' : ''), pair[1]));
    });

    if (F.contacts && F.contacts.length) {
      var contacts = el('div', 'footer-contacts');
      F.contacts.forEach(function (c) {
        var d = el('div', 'footer-contact');
        d.appendChild(el('span', 'k', c.label));
        d.appendChild(el('span', 'v', c.value));
        contacts.appendChild(d);
      });
      inner.appendChild(contacts);
    }

    var beian = el('div', 'footer-beian');
    if (F.beian && F.beian.text) {
      var a = document.createElement('a');
      a.href = F.beian.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = F.beian.text;
      beian.appendChild(a);
    }
    if (F.copyright) beian.appendChild(el('div', 'footer-copy', F.copyright));
    inner.appendChild(beian);

    footer.appendChild(inner);
    box.appendChild(footer);
  }

  /* ==========================================================================
   * 5. 底部按钮 / 下单弹层 / 复制微信 / 轻提示
   * ======================================================================== */

  var toastTimer = null;

  function toast(msg) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.classList.remove('show'); }, 1800);
  }

  /* 老式复制（file:// 下 navigator.clipboard 常常不可用，用这个兜底） */
  function legacyCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  function wechatId() {
    return (typeof SHEET_CONFIG !== 'undefined' && SHEET_CONFIG && SHEET_CONFIG.wechat) || '';
  }

  function copyWx() {
    var wx = wechatId();

    /* 还没填微信号时：如果配了二维码，就弹出来让访客扫码；
       二维码也没有，才提示还没设置 —— 避免访客看到一个「半成品」提示。 */
    if (!wx) {
      var sheet = (typeof SHEET_CONFIG !== 'undefined' && SHEET_CONFIG) || {};
      if (sheet.qrImage) { openSheet(); return; }
      toast(txt('noWechat', '客服联系方式还没设置好，请稍后再试'));
      return;
    }

    var ok = function () { toast(txt('copiedWx', '已复制微信号: ') + wx); };
    var fail = function () { toast(txt('copyFailWx', '客服微信号: ') + wx); };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(wx).then(ok)['catch'](function () {
        if (legacyCopy(wx)) ok(); else fail();
      });
    } else {
      if (legacyCopy(wx)) ok(); else fail();
    }
  }

  function openSheet() {
    var mask = $('mask');
    if (mask) mask.classList.add('show');
  }

  function closeSheet() {
    var mask = $('mask');
    if (mask) mask.classList.remove('show');
  }

  function initCta() {
    var cfg = (typeof CTA_CONFIG !== 'undefined' && CTA_CONFIG) || {};

    var copyBtn = $('ctaCopy');
    var orderBtn = $('ctaOrder');
    if (!copyBtn || !orderBtn) return;

    copyBtn.textContent = cfg.copyLabel || '复制客服微信';
    orderBtn.textContent = cfg.orderLabel || '点我下单 ♡';

    copyBtn.addEventListener('click', copyWx);
    orderBtn.addEventListener('click', openSheet);
  }

  function initSheet() {
    var cfg = (typeof SHEET_CONFIG !== 'undefined' && SHEET_CONFIG) || {};

    $('sheetTitle').textContent = cfg.title || '';
    $('sheetDesc').textContent = cfg.desc || '';

    var qr = $('sheetQr');
    clear(qr);
    if (cfg.qrImage) {
      qr.appendChild(img(cfg.qrImage, null, '客服二维码'));
    } else {
      qr.textContent = cfg.qrText || '';
    }

    $('sheetWx').textContent = cfg.wechat || '';
    $('sheetCopy').textContent = cfg.copyLabel || '复制微信号';
    /* 没填微信号就不显示「复制微信号」按钮，免得访客点了毫无反应 */
    $('sheetCopy').style.display = cfg.wechat ? '' : 'none';
    $('sheetClose').textContent = cfg.closeLabel || '关闭';

    $('sheetCopy').addEventListener('click', copyWx);
    $('sheetClose').addEventListener('click', closeSheet);

    var mask = $('mask');
    mask.addEventListener('click', function (e) { if (e.target === mask) closeSheet(); });
  }

  /* ==========================================================================
   * 6. 图片放大预览
   * ======================================================================== */

  function openLightbox(src, alt) {
    var lb = $('lightbox');
    if (!lb || !src) return;
    $('lightboxImg').src = src;
    $('lightboxImg').alt = alt || '';
    lb.style.display = 'flex';
  }

  function closeLightbox() {
    var lb = $('lightbox');
    if (!lb) return;
    lb.style.display = 'none';
    $('lightboxImg').src = BLANK_IMG;
  }

  function initLightbox() {
    $('lightboxClose').addEventListener('click', closeLightbox);
    $('lightbox').addEventListener('click', function (e) {
      if (e.target === this) closeLightbox();
    });
  }

  /* ==========================================================================
   * 6.5 实时内容同步 —— 让「发布 → 访客看到」从 663 秒降到 1 秒级
   * ========================================================================
   *  问题：GitHub Pages 给所有静态文件固定返回 cache-control: max-age=600，
   *        已经访问过网站的人，浏览器会把 index.html / data.js / config.js
   *        缓存整整 10 分钟。所以后台点「发布」之后，老访客最坏要
   *        63 秒（重建）+ 600 秒（缓存）= 663 秒 才看得到新内容。
   *
   *  做法：① 先用本地静态内容秒开（这块完全不受影响；云端挂了也照常显示）
   *        ② 再异步向云端问一句「有没有更新」，有就把内容换掉重新渲染
   *        ③ 页面开着时每 10 秒问一次，切回前台时立刻问一次
   *
   *  所以这条链路不依赖单一方案：云端不通 → 静默跳过 → 退化成原来的静态站。
   * ======================================================================== */

  /* 后台地址。测试时可覆盖：window.CX_LIVE_API = 'http://127.0.0.1:8888'
     传空字符串就等于关掉实时同步。 */
  var LIVE_API = (typeof window.CX_LIVE_API === 'string')
    ? window.CX_LIVE_API
    : 'https://chenxing-admin.pages.dev';

  var liveRev = null;      /* 已经应用过的云端版本号 */
  var liveBusy = false;

  /* 键名排序后再比较：避免键顺序不同被误判成「内容变了」而白重绘一次 */
  function stableJson(v) {
    if (v === null || v === undefined || typeof v !== 'object') return JSON.stringify(v);
    if (Object.prototype.toString.call(v) === '[object Array]') {
      return '[' + v.map(stableJson).join(',') + ']';
    }
    return '{' + Object.keys(v).sort().map(function (k) {
      return JSON.stringify(k) + ':' + stableJson(v[k]);
    }).join(',') + '}';
  }

  function configSnapshot() {
    return [SITE_CONFIG, HERO_CONFIG, NAV_CONFIG, CTA_CONFIG,
            SHEET_CONFIG, CONTENT_CONFIG, NOTICE_CONFIG, FOOTER_CONFIG, UI_TEXT];
  }

  /* 把云端内容换进来。内容其实没变就返回 false，不重绘 —— 也就不会闪一下 */
  function applyRemoteContent(j) {
    var cfg = j.config || {};
    var before = stableJson([SERVICE_CATEGORIES, configSnapshot()]);

    if (j.data) window.SERVICE_CATEGORIES = j.data;
    if (cfg.SITE) window.SITE_CONFIG = cfg.SITE;
    if (cfg.HERO) window.HERO_CONFIG = cfg.HERO;
    if (cfg.NAV) window.NAV_CONFIG = cfg.NAV;
    if (cfg.CTA) window.CTA_CONFIG = cfg.CTA;
    if (cfg.SHEET) window.SHEET_CONFIG = cfg.SHEET;
    if (cfg.CONTENT) window.CONTENT_CONFIG = cfg.CONTENT;
    if (cfg.NOTICE) window.NOTICE_CONFIG = cfg.NOTICE;
    if (cfg.FOOTER) window.FOOTER_CONFIG = cfg.FOOTER;
    if (cfg.UI_TEXT) window.UI_TEXT = cfg.UI_TEXT;

    var after = stableJson([SERVICE_CATEGORIES, configSnapshot()]);
    var contentChanged = (before !== after);

    /* 即使文字内容没变，只要版本号往前走了（典型情况：你换了同一张图，
       内容里的图片路径没变），也要重绘一次 —— 否则浏览器会一直吃 600 秒缓存里的旧图 */
    var verChanged = String(j.rev) !== String(assetVer);

    if (!contentChanged && !verChanged) return false;
    if (verChanged) assetVer = j.rev;

    /* 真的变了才重绘。各渲染函数都是「先清空再重建」，可以安全重复调用 */
    applySiteConfig();
    renderHero();
    renderTabs();
    renderContent();
    renderSiteParts();
    return true;
  }

  function syncLive() {
    if (!LIVE_API || !window.fetch || liveBusy) return;
    liveBusy = true;
    fetch(LIVE_API + '/api/public-content?t=' + Date.now(), { cache: 'no-store', mode: 'cors' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        liveBusy = false;
        if (!j || !j.ok || !j.data || !j.config) return;
        if (liveRev !== null && String(j.rev) === String(liveRev)) return;   /* 没更新就不动 */
        liveRev = j.rev;
        applyRemoteContent(j);
      })
      .catch(function () {
        liveBusy = false;   /* 云端不通 → 静默跳过，页面继续显示静态内容 */
      });
  }

  function startLivePolling() {
    /* 本地双击打开（file://）时不做同步：
       本地预览就该看本地文件，不该跑去打线上接口 */
    if (window.location.protocol === 'file:') return;
    if (!LIVE_API || !window.fetch) return;
    syncLive();
    /* 页面开着的时候每 10 秒问一次 —— 这就是「用户感知 ≤10 秒」的保证 */
    window.setInterval(function () {
      if (document.visibilityState === 'hidden') return;
      syncLive();
    }, 10000);
    /* 从别的标签页切回来时立刻查一次，不用干等一个轮询周期 */
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') syncLive();
    });
  }

  /* ==========================================================================
   * 7. 启动
   * ======================================================================== */

  function init() {
    applySiteConfig();

    renderHero();
    initCta();
    initSheet();
    initLightbox();
    renderSiteParts();

    /* 顶栏箭头 */
    $('heroPrev').setAttribute('aria-label', txt('heroPrev', '上一张'));
    $('heroNext').setAttribute('aria-label', txt('heroNext', '下一张'));
    $('heroPrev').addEventListener('click', function () { showHero(heroIdx - 1, true); });
    $('heroNext').addEventListener('click', function () { showHero(heroIdx + 1, true); });

    /* Esc：先关图片预览，再关下单弹层 */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if ($('lightbox').style.display === 'flex') { closeLightbox(); return; }
      closeSheet();
    });

    /* 支持「分享出去的具体玩法链接」：#cat=<分类id>&item=<条目id>
       也支持直接分享「全部」视图：#cat=all */
    var hasHash = !!(window.location.hash || '').replace(/^#/, '');
    var q = parseHash();
    var catId = q.cat || ALL;
    if (catId !== ALL && !findCat(catId)) catId = ALL;

    state.cat = catId;
    state.item = null;

    if (catId !== ALL && q.item) {
      var cat = findCat(catId);
      var items = (cat && cat.items) || [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === q.item) state.item = q.item;
      }
    }

    /* 第一次打开（地址栏还没有锚点）时停在第一个分类，
       免得首屏只有一堆分类卡片显得空；带 #cat=all 进来则忠实显示「全部」 */
    if (catId === ALL && !hasHash) {
      var list = categories();
      if (list.length) state.cat = list[0].id;
    }

    renderTabs();
    renderContent();
    syncUrl();

    /* 本地静态内容已经在上面渲染完了，现在再异步去云端要最新的 */
    startLivePolling();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
