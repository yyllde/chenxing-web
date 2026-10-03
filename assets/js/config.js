/**
 * ============================================================================
 *  config.js —— 站点设置（标题 / 轮播 / 按钮 / 弹层 / 页脚）
 * ============================================================================
 *  ★ 这个文件是可视化后台生成的：打开 admin.html 改设置 → 第 ⑤ 步保存 config.js
 *    → 用它覆盖本文件即可，不需要手写代码。
 * ============================================================================
 */

var ASSETS = 'assets';

/* 一、站点基本信息 */
var SITE_CONFIG = {
  name: '辰兴电竞',
  title: '辰兴电竞 · 价格表',
  description: '辰兴电竞价格表 - 专业游戏陪玩服务平台',
  keywords: '游戏陪玩,电竞,陪玩师,游戏服务',
  favicon: 'assets/images/favicon-32.png',
  fallbackImage: 'assets/images/default-avatar.svg',
  background: 'linear-gradient(180deg,#fff1f2 0%,#fef3c7 100%)',
  contentRev: 91,
  imageVer: {
    'assets/images/hero-0-395e3c06.webp': 91,
    'assets/images/banner-footer-notice.webp': 72,
    'assets/images/sheet-qr-639c25b3.webp': 91,
    'assets/images/favicon-32.png': 72,
    'assets/images/cover-b193a539aad54a1aadf652-0ebd82a8.webp': 91,
    'assets/images/delta-pc-01-hot-fun.webp': 72,
    'assets/images/detail/e2a76c29dabf4760b9bb426b416e0188.webp': 72,
    'assets/images/delta-pc-02-new-hot-fun.webp': 72,
    'assets/images/detail/955db451f862475ba0e17d532fd0a682.webp': 72,
    'assets/images/delta-pc-03-season-insurance.webp': 72,
    'assets/images/detail/74bb5694459a408d871ebf5bb2a30917.webp': 72,
    'assets/images/item-dawang-xunshan.webp': 77,
    'assets/images/bingo.webp': 72,
    'assets/images/item-shenmi-heidong.webp': 76,
    'assets/images/cover-0795399f5593455c95a30a-3172cb4b.webp': 91,
    'assets/images/item-yucun-fuli.webp': 78,
    'assets/images/deposit-event-01-welfare.png': 72,
    'assets/images/detail/bc7c0f66cd55435ab1e8845e4b9a481e.webp': 72,
    'assets/images/cover-bd7c5ddac3754c9e90388f-139dda20.webp': 91,
    'assets/images/gift-01-weekly-star.webp': 72,
    'assets/images/detail/820b2b250ea14a6dae055c33e5156033.webp': 72
  },
  imageSize: {
    'assets/images/banner-footer-notice.webp': [
      1080,
      5063
    ],
    'assets/images/delta-pc-01-hot-fun.webp': [
      420,
      378
    ],
    'assets/images/detail/e2a76c29dabf4760b9bb426b416e0188.webp': [
      820,
      1367
    ],
    'assets/images/delta-pc-02-new-hot-fun.webp': [
      420,
      420
    ],
    'assets/images/detail/955db451f862475ba0e17d532fd0a682.webp': [
      820,
      3118
    ],
    'assets/images/delta-pc-03-season-insurance.webp': [
      420,
      420
    ],
    'assets/images/detail/74bb5694459a408d871ebf5bb2a30917.webp': [
      820,
      539
    ],
    'assets/images/item-dawang-xunshan.webp': [
      820,
      2709
    ],
    'assets/images/bingo.webp': [
      820,
      2870
    ],
    'assets/images/item-shenmi-heidong.webp': [
      820,
      2359
    ],
    'assets/images/item-yucun-fuli.webp': [
      820,
      1137
    ],
    'assets/images/deposit-event-01-welfare.png': [
      129,
      420
    ],
    'assets/images/detail/bc7c0f66cd55435ab1e8845e4b9a481e.webp': [
      820,
      1156
    ],
    'assets/images/gift-01-weekly-star.webp': [
      420,
      420
    ],
    'assets/images/detail/820b2b250ea14a6dae055c33e5156033.webp': [
      820,
      560
    ]
  }
};

/* 二、顶部主视觉轮播 */
var HERO_CONFIG = {
  autoplay: true,
  interval: 4000,
  slides: [
    {
      image: 'assets/images/hero-0-395e3c06.webp',
      alt: '',
      title: '欢迎回家~',
      subtitle: '辰兴电竞kook：8333',
      fit: 'contain',
      toCategory: ''
    }
  ]
};

/* 三、顶部导航 */
var NAV_CONFIG = {
  allLabel: '全部',
  allTitle: '辰兴电竞 · 全部价目'
};

/* 四、底部固定按钮 */
var CTA_CONFIG = {
  copyLabel: '复制客服微信',
  orderLabel: '点我下单 ♡'
};

/* 五、下单弹层 */
var SHEET_CONFIG = {
  title: '添加客服下单',
  desc: '扫码或搜索下方微信号，一对一安排',
  qrText: '公众号 / 客服二维码',
  qrImage: 'assets/images/sheet-qr-639c25b3.webp',
  wechat: 'ovozZ7i',
  copyLabel: '复制微信号',
  closeLabel: '关闭'
};

/* 六、内容区文案 */
var CONTENT_CONFIG = {
  posterBrand: '辰兴电竞',
  ruleLabel: '规则',
  defaultRule: '所有单子打结默认本单没有问题，投诉售后请在单子结束 24 小时内提出。',
  viewMoreText: '查看玩法'
};

/* 七、底部装饰横幅 */
var NOTICE_CONFIG = {
  image: 'assets/images/banner-footer-notice.webp',
  alt: '板板须知',
  title: '板板须知'
};

/* 八、页脚 */
var FOOTER_CONFIG = {
  highlightText: '🎮 一家专注服务、性价比的宝藏俱乐部！',
  serviceFeatures: '✨ 猛男甜妹 / 保驾护航 / 优质陪玩 / 高效售后 / 纯绿',
  serviceDescription: '💖 如需专属陪玩服务，请到公众号【辰兴电竞】【客服下单】选择【微信点单】，联系客服微信为您量身定制！',
  vipService: '🎉 职业选手 / 网红主播专属通道：私信客服，尊享 VIP 预约特权，定制专属电竞体验！',
  closingText: '💫 辰兴电竞，期待和您一起开黑！',
  contacts: [
    {
      label: '官方公众号',
      value: '辰兴电竞'
    },
    {
      label: '服务时间',
      value: '24 小时在线'
    }
  ],
  beian: {
    text: '',
    url: 'https://beian.miit.gov.cn/'
  },
  copyright: 'Copyright © 2026 辰兴电竞 All Rights Reserved'
};

/* 九、交互提示语 */
var UI_TEXT = {
  copiedWx: '已复制微信号: ',
  copyFailWx: '客服微信号: ',
  noWechat: '客服联系方式正在更新，请稍后再试',
  noPriceSheet: '这个玩法暂时没有价目表图片，可以在后台补上',
  heroPrev: '上一张',
  heroNext: '下一张'
};
