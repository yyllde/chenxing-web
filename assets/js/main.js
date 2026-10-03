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
   * 关键设计：**每张图各自一个版本号**（后台维护，存在 SITE_CONFIG.imageVer 里）。
   *
   * 为什么不是「所有图共用一个版本号」：
   *   共用的话，你发布一次内容 → 版本号变了 → 浏览器会把这 2MB 多的图**全部重新下一次**，
   *   哪怕你只改了一个字。实测过，页面下载量直接翻倍。
   *   各自一个版本号之后，只有你真正换过的那张图地址会变，其它图继续吃浏览器缓存。
   * ------------------------------------------------------------------------ */

  function imgVerMap() {
    var m = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG && SITE_CONFIG.imageVer) || {};
    return (m && typeof m === 'object') ? m : {};
  }

  /* 图片的原始宽高（后台上传时一起记下来的）。
     为什么要它：懒加载的图在下载完之前是没有高度的，如果不预留位置，
     整页会「瘪」下去，结果下面的图反而被判定成「就在屏幕附近」而提前下载 ——
     那就等于懒加载白做了。按真实宽高预留之后，页面高度是对的，懒加载才真的有效。 */
  function imgSizeMap() {
    var m = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG && SITE_CONFIG.imageSize) || {};
    return (m && typeof m === 'object') ? m : {};
  }

  function withVer(src) {
    if (!src || !/^assets\//.test(src)) return src;      /* 外链图片不加 */
    var v = imgVerMap()[src];
    if (!v) return src;                                   /* 没登记过就用原地址 */
    return src + (src.indexOf('?') >= 0 ? '&' : '?') + 'v=' + v;
  }

  /* 懒加载观察器。
     为什么不用浏览器自带的 loading="lazy"：它是在**图片插入那一刻**判断位置的，
     而页面刚渲染时下面的内容还没生成、整页很短，底部那些图会被误判成「在首屏附近」
     而立刻下载 —— 实测过，一张 463KB 的底部长图照样在首屏就被拉下来了。
     自己用 IntersectionObserver 判断，位置一定准。

     600px 是实测调优后的结果，**不要轻易加大**（2026-10-03 试过 1000px 又改回来）：
       实测（1440×900、不滚动、禁缓存、CDP 逐像素步进记录首次请求时的 scrollY）：
         提前量 600px → 首屏共下 3 张图：轮播 175KB + 封面 109KB + favicon
         提前量 1000px → 首屏多下 1 张价目表长图 151KB（它距屏下沿 603px）
       收益侧：慢 4G（0.4Mbps）页脚长图要 6.5s 下完，600px 只能给 0.86s 缓冲、
       1000px 给 1.43s —— 两个都不够，所以「加大提前量」在弱网下避免不了空白；
       而它确实让「正常网速下滚动」更顺一点。
       代价侧：首屏稳定多 151KB ≈ 弱网 +3.1 秒、一般 4G +0.77 秒，
       且会让 _verify/verify-lazy.mjs 判定「远处图被提前下载」而不通过。
       结论：首屏代价是**每次访问都付的确定成本**，滚动顺滑的收益只在中等网速下可感，
       故保持 600px。真要在弱网下不出现空白，正确做法是压图（页脚长图已从
       463KB/1080×5063 压到 290KB/900×4219）+ 把长图切成多段，而不是加大提前量。 */
  var lazyObserver = (typeof IntersectionObserver !== 'undefined')
    ? new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        lazyObserver.unobserve(e.target);
        var s = e.target.getAttribute('data-lazy-src');
        if (s) { e.target.removeAttribute('data-lazy-src'); e.target.src = s; }
      });
    }, { rootMargin: '600px 0px' })
    : null;

  /* 创建带兜底的图片。
     eager=true 用于首屏第一眼就要看到的图（比如轮播第 1 张），其余一律懒加载。 */
  function img(src, cls, alt, eager) {
    var i = document.createElement('img');
    if (cls) i.className = cls;
    if (alt) i.alt = alt;
    i.decoding = 'async';
    if (src) {
      var real = withVer(src);
      var sz = imgSizeMap()[src];
      if (sz && sz[0] && sz[1]) { i.width = sz[0]; i.height = sz[1]; }   /* 预留位置，避免整页瘪下去 */
      if (eager || !lazyObserver) {
        i.src = real;
      } else {
        i.loading = 'lazy';                                  /* 双保险 */
        i.setAttribute('data-lazy-src', real);
        lazyObserver.observe(i);
      }
      i.addEventListener('error', function () {
        if (i.dataset.fallbackApplied) return;
        i.dataset.fallbackApplied = '1';
        i.src = withVer(FALLBACK_IMG);   /* 兜底图也要带版本号，否则它自己会被缓存钉住 */
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
      slide.appendChild(img(s.image, null, s.alt || '', i === 0));

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

    /* 内容刚重建过：重新挂一次吸顶钩子（「全部」视图里没有胶囊行，函数自己会跳过） */
    initSubtabsSticky();
  }

  /* ---- 4.1 「全部」视图：每个分类一张卡片 ---- */
  function renderAllView(wrap) {
    var nav = (typeof NAV_CONFIG !== 'undefined' && NAV_CONFIG) || {};
    var content = (typeof CONTENT_CONFIG !== 'undefined' && CONTENT_CONFIG) || {};

    wrap.appendChild(el('div', 'big-title fun', nav.allTitle || '全部价目'));

    var list = el('div', 'cat-list');

    categories().forEach(function (cat) {
      var card = el('div', 'cat-card');

      /* 圆形图取图顺序（2026-10-03 定）：
         ① 分类自己的「主页圆形图」= cat.cover（后台分类那一层可直接传，用户要的就是这个）
         ② 没传 → 第一个玩法的价目表大图（兜底，不改动也能看）
         ③ 还没有 → 第一个有图玩法的任意图
         ④ 都没有 → 默认头像图 */
      var firstItem = (cat.items || [])[0] || {};
      var circleSrc = cat.cover || '';
      if (!circleSrc) circleSrc = firstItem.contentImage || '';
      if (!circleSrc) {
        (cat.items || []).some(function (it) {
          circleSrc = it.contentImage || it.image || '';
          return !!circleSrc;
        });
      }

      var cover = el('div', 'cat-card-cover');
      var coverCircle = el('div', 'cat-card-cover-circle');
      coverCircle.appendChild(img(circleSrc || FALLBACK_IMG, null, firstItem.title || cat.title));
      cover.appendChild(coverCircle);
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

  /* ==========================================================================
   * 4.4 胶囊行吸顶（2026-10-03）
   * ========================================================================
   *  为什么做：14 个玩法时胶囊行是 6 行 301px。访客滚到价格表时它早已滚出屏幕，
   *        想换玩法必须一路滚回顶部（实测得滚回 y≈454）。
   *
   *  为什么「吸住后收成一行」：纯吸顶会让它连同上方的分类标签栏常驻遮挡
   *        67 + 301 = 368px = 手机屏高的 44%，把访客最想看的价格表挤没了 ——
   *        与吸顶的目的相反。收成一行后只占约 129px（屏高 15%），不遮挡价格，
   *        且 14 个玩法仍然全部可达（左右滑动 + 选中项自动居中）。
   *
   *  判据用「哨兵」而不是 scrollTop 阈值：胶囊行在文档里的高度会随分类切换 /
   *        字体加载 / 断点换行而变化，写死数字早晚错位。在它前面放一个 1px 的哨兵，
   *        哨兵顶到标签栏下沿 = 刚好吸住。
   * ======================================================================== */

  var subsEl = null;
  var subsSealEl = null;
  var subsTabsEl = null;     /* 分类标签栏 .tabs 那个 nav（注意不是 id="tabs" 的元素！） */
  var subsStuck = null;      /* 上一次的状态：只在「变了」的时候动 DOM */
  var subsRaf = 0;

  function subsMeasureTabs() {
    /* 胶囊行要吸在分类标签栏正下方 —— 返回该用多少 top。
       ⚠️ 坑：分类标签栏的 DOM 是
            <nav class="tabs">            ← 真正吸顶、真正有高度的是这一层
              <div class="tabs-inner" id="tabs">   ← id 却叫 tabs，但没有上下内边距
            所以**不能**用 $('tabs')（那是 .tabs-inner，实测 64.8px），
            必须按 class 取 <nav>（实测 66.8px），否则会重叠约 2px。

       为什么要多加下边框：sticky 的 top 是按「不含 border 的 padding box 上沿」
       对齐的，而 getBoundingClientRect().height 含 border。
       ⚠️ 也不要缓存：首屏字体 / 图片加载会让标签栏高度变化，缓存值会过期。 */
    if (!subsTabsEl) subsTabsEl = document.querySelector('.tabs');
    if (!subsTabsEl) return 0;
    var cs = window.getComputedStyle(subsTabsEl);
    var border = parseFloat(cs.borderBottomWidth) || 0;
    return Math.round(subsTabsEl.getBoundingClientRect().height + border);
  }

  function subsCenterActive() {
    /* 把选中的胶囊滚到可视区中间 —— 否则切到靠后的玩法时，选中项会落在
       横向滚动区外面，访客看不到自己选的是哪个。 */
    if (!subsEl || !subsEl.classList.contains('is-stuck')) return;
    var on = subsEl.querySelector('.subtab.on');
    if (!on) return;
    var box = subsEl.getBoundingClientRect();
    var cur = on.getBoundingClientRect();
    /* 选中项中心在「内容坐标系」里的位置 = 当前偏移 + 它相对容器的位置 + 半个自身宽 */
    var centerInContent = (cur.left - box.left) + subsEl.scrollLeft + cur.width / 2;
    var max = subsEl.scrollWidth - subsEl.clientWidth;
    if (max <= 0) return;   /* 没得滚（玩法少 / 屏幕宽）就别动 */
    subsEl.scrollLeft = Math.max(0, Math.min(max, centerInContent - subsEl.clientWidth / 2));
  }

  function subsSync() {
    subsRaf = 0;
    if (!subsEl || !subsSealEl) return;

    /* 每次都重新量：标签栏高度会随字体 / 断点变化，不能用缓存值 */
    var tabsH = subsMeasureTabs();
    var stuck = subsSealEl.getBoundingClientRect().top <= tabsH + 1;

    if (stuck !== subsStuck) {
      subsStuck = stuck;
      if (stuck) {
        /* ★ 就在这一刻把 top 定下来（而非首屏算一次存着）——
           这样无论标签栏之后怎么变高变矮，吸住的位置都是准的 */
        subsEl.style.top = tabsH + 'px';
        subsEl.classList.add('is-stuck');
        subsCenterActive();          /* 状态一变宽度就变，立刻用新宽度重新居中 */
      } else {
        subsEl.style.top = '';
        subsEl.classList.remove('is-stuck');
        subsEl.scrollLeft = 0;       /* 回到多行布局时清掉横向偏移 */
      }
    } else if (stuck) {
      subsEl.style.top = tabsH + 'px';   /* 窗口尺寸变了就跟着更新 */
      subsCenterActive();
    }
  }

  function subsOnScroll() {
    if (subsRaf) return;
    subsRaf = (window.requestAnimationFrame || function (f) { return setTimeout(f, 16); })(subsSync);
  }

  function initSubtabsSticky() {
    var wrap = $('content');
    if (!wrap) return;

    /* 每次内容重绘 #content 都会被清空重建，所以在这里重新挂钩子 */
    subsEl = wrap.querySelector('.subtabs');

    if (subsSealEl && subsSealEl.parentNode) subsSealEl.parentNode.removeChild(subsSealEl);
    subsSealEl = null;
    subsStuck = null;

    /* 「全部」视图没有胶囊行 —— 什么都不用挂 */
    if (!subsEl) return;

    subsSealEl = document.createElement('div');
    subsSealEl.setAttribute('aria-hidden', 'true');
    subsSealEl.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none;';
    subsEl.parentNode.insertBefore(subsSealEl, subsEl);

    if (!initSubtabsSticky.hooked) {
      initSubtabsSticky.hooked = true;
      window.addEventListener('scroll', subsOnScroll, { passive: true });
      /* resize 会让换行数 / 标签栏高度变化，重算一次（subsSync 自己会重量） */
      window.addEventListener('resize', subsOnScroll);
      /* 字体加载完宽度会变 → 影响有没有换行，所以也要重量一次 */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { subsOnScroll(); });
      }
    }

    subsSync();
  }

  /* 海报卡：标题 / 价格盒 / 规则。
     ⚠️ 2026-10-03 起**不再使用分类封面做底图**（用户要求：主页与详情页都不再出现那张封面图）。
     所以这里不读 cat.cover；旧数据里残留的 cover 字段只是历史数据，前台完全不展示。
     想恢复底图：把下面那行 `if (posterBgOn && cat.cover) …` 接回来（图片仍在仓库 assets/images/covers/）。 */
  function buildPoster(cat, item) {
    var content = (typeof CONTENT_CONFIG !== 'undefined' && CONTENT_CONFIG) || {};

    var poster = el('div', 'poster anim-up');

    /* 逃生开关：内容配置里显式写 posterBg: true 才会显示底图（默认关闭） */
    var posterBgOn = content.posterBg === true;
    if (posterBgOn && cat.cover) poster.appendChild(img(cat.cover, 'poster-bg', ''));

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
      /* eager=true：这个弹层是 display:none 的，里面的图**永远不会**进入视口，
         交给 IntersectionObserver 就会一直不加载 —— 访客点开弹层才会看到二维码
         空白一下（弱网下更明显）。二维码只有几十 KB，直接下。 */
      qr.appendChild(img(cfg.qrImage, null, '客服二维码', true));
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
   *           这一步只问轻量的 /api/public-rev（几十字节），
   *           只有 rev 变了才去拉 /api/public-content（6.6KB 完整内容）。
   *           后端没有这个端点时自动退回老路径，实时性不退化。
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
    if (before === after) return false;   /* 内容没变就不重绘，避免闪一下、也避免白下一遍图 */

    /* 真的变了才重绘。各渲染函数都是「先清空再重建」，可以安全重复调用。
       没换过的图地址不变，浏览器直接吃缓存，所以重绘不会重新下载它们。 */
    applySiteConfig();
    renderHero();
    renderTabs();
    renderContent();
    renderSiteParts();
    return true;
  }

  /* 拉完整内容（老路径）。首屏、以及「rev 真的变了」时才走这里。 */
  function fetchFull() {
    return fetch(LIVE_API + '/api/public-content?t=' + Date.now(), { cache: 'no-store', mode: 'cors' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.ok || !j.data || !j.config) return;
        liveRev = j.rev;
        applyRemoteContent(j);
      });
  }

  /* 每 10 秒只问「rev 变了没」—— 响应体几十字节。
     变了才去拉 6.6KB 的完整内容；没变时正文一个字节都不多下。 */
  function pollRev() {
    return fetch(LIVE_API + '/api/public-rev?t=' + Date.now(), { cache: 'no-store', mode: 'cors' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        /* 轻量接口不可用（后端还是老版本 / 网络抖动）→ 退回老路径直接拉完整内容，
           让「≤10 秒生效」这条硬指标在任何情况下都不退化。 */
        if (!j || !j.ok) return fetchFull();
        if (liveRev !== null && String(j.rev) === String(liveRev)) return;   /* 没更新就不动 */
        return fetchFull();
      });
  }

  function syncLive() {
    if (!LIVE_API || !window.fetch || liveBusy) return;
    liveBusy = true;
    /* 首屏（还没应用过任何云端内容）直接拉完整内容：
       保证「打开页面就是最新」，不依赖任何版本号比较。 */
    var job = (liveRev === null) ? fetchFull() : pollRev();
    job.catch(function () {
      /* 云端不通 → 静默跳过，页面继续显示静态内容 */
    }).then(function () { liveBusy = false; });
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

  /* 按地址栏里的 #cat=..&item=.. 切到对应玩法。
     init 时跑一次；地址栏之后再变（浏览器前进/后退、或点开分享链接）也会再跑。 */
  function applyHash() {
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
  }

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

    applyHash();

    /* 地址栏锚点变了就跟着切过去。
       以前没有这个监听，导致两个真实问题：
         · 用浏览器「后退 / 前进」时，地址栏变了但页面内容不变
         · 已经打开着网站时，点别人发的分享链接（#cat=..&item=..）页面不切换 */
    window.addEventListener('hashchange', function () {
      var q = parseHash();
      var catId = q.cat || ALL;
      if (catId !== ALL && !findCat(catId)) catId = ALL;

      var item = null;
      if (catId !== ALL && q.item) {
        var cat = findCat(catId);
        var items = (cat && cat.items) || [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].id === q.item) item = q.item;
        }
      }

      /* 和当前显示的完全一样就不用重画（go() 改地址栏也会触发这个事件，
         不拦一下会白重绘一次，还会把滚动位置顶回顶部） */
      if (catId === state.cat && item === state.item) return;
      applyHash();
    });

    syncUrl();

    /* 测试钩子（和 window.CX_LIVE_API 一样是「给测试用的覆盖入口」）：
       本文件是 IIFE，外面改 window.SERVICE_CATEGORIES 不会触发重绘，
       所以留一个显式重绘口，验证脚本才能用「构造好的内容」测取图优先级。 */
    window.CX_RERENDER = function () {
      renderTabs();
      renderContent();
      return true;
    };

    /* 本地静态内容已经在上面渲染完了，现在再异步去云端要最新的 */
    startLivePolling();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
