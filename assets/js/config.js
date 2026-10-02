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
  favicon: 'assets/images/favicon.ico',
  fallbackImage: 'assets/images/default-avatar.svg',
  background: 'linear-gradient(180deg,#fce7f3 0%,#fdf2f8 30%,#f3e8ff 100%)'
};

/* 二、顶部主视觉轮播 */
var HERO_CONFIG = {
  autoplay: true,
  interval: 4000,
  slides: [
    {
      image: 'assets/images/banner-header.png',
      alt: '',
      title: '',
      subtitle: '',
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
  qrImage: '',
  wechat: '',
  copyLabel: '复制微信号',
  closeLabel: '关闭'
};

/* 六、内容区文案 */
var CONTENT_CONFIG = {
  posterBrand: '辰兴电竞',
  ruleLabel: '规则',
  defaultRule: '1. 趣味玩法包过点卡、红包、左轮、整理背包。\n' +
    '2. 死亡即炸单，技术订单丢包撤视为撤离失败。\n' +
    '3. 带出低于 100 万不计入保底，免费送给老板；高于 100 万但不计入保底的，本局不加炸单保底。\n' +
    '4. 严禁卡保底，必须比订单规定的保底至少多 30W 才不算卡保底。\n' +
    '5. 首局不满意 / 前 4 局或中途连续 8 局以上撤离失败，联系客服可免费更换打手。\n' +
    '6. 所有单子打结默认本单没有问题，投诉售后请在单子结束 24 小时内提出。',
  viewMoreText: '查看玩法'
};

/* 七、底部装饰横幅 */
var NOTICE_CONFIG = {
  image: 'assets/images/banner-footer-notice.png',
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
