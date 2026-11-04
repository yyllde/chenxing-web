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
  background: 'linear-gradient(180deg,#fdf2f8 0%,#ffffff 100%)',
  contentRev: 136,
  imageVer: {
    'assets/images/hero-0-186325fb.webp': 107,
    'assets/images/sheet-qr-ef849c96.webp': 112,
    'assets/images/favicon-32.png': 72,
    'assets/images/cover-b193a539aad54a1aadf652-0ebd82a8.webp': 107,
    'assets/images/delta-pc-01-hot-fun.webp': 72,
    'assets/images/detail/content-e2a76c29dabf4760b9bb-d2b418d8.webp': 134,
    'assets/images/delta-pc-02-new-hot-fun.webp': 72,
    'assets/images/detail/955db451f862475ba0e17d532fd0a682.webp': 72,
    'assets/images/delta-pc-03-season-insurance.webp': 72,
    'assets/images/detail/content-74bb5694459a408d871e-17154360.webp': 134,
    'assets/images/item-dawang-xunshan.webp': 77,
    'assets/images/bingo.webp': 72,
    'assets/images/item-shenmi-heidong.webp': 76,
    'assets/images/content-item-musano7bp6p3-eedefba3.webp': 107,
    'assets/images/content-item-musaonb08own-cdf20bbf.webp': 107,
    'assets/images/content-item-musapfjtahwc-233b2017.webp': 107,
    'assets/images/content-item-musaq4bjzh25-44964013.webp': 107,
    'assets/images/content-item-musaqozgg9b1-4df837bd.webp': 107,
    'assets/images/content-item-musarno3awg2-a3ab9b17.webp': 107,
    'assets/images/content-item-musas734ulh4-b6a5da16.webp': 107,
    'assets/images/content-item-musasxxhdeuh-188035c9.webp': 107,
    'assets/images/content-item-muy0r2imc0kn-abf07d09.webp': 107,
    'assets/images/content-item-mw1dgehzd2sn-59d4e98a.webp': 134,
    'assets/images/content-item-mw1dhiuwt3q6-3277536e.webp': 134,
    'assets/images/content-item-mw1dkm9ecbk2-891a23a5.webp': 134,
    'assets/images/content-item-mw1dms6cdhdf-00441ef7.webp': 134,
    'assets/images/cover-cat-mw1eehi6ym5e-c32fe33b.webp': 134,
    'assets/images/content-item-mw1eeypk3nh7-aef48e8e.webp': 134,
    'assets/images/cover-0795399f5593455c95a30a-3172cb4b.webp': 107,
    'assets/images/item-yucun-fuli.webp': 78,
    'assets/images/deposit-event-01-welfare.png': 72,
    'assets/images/detail/bc7c0f66cd55435ab1e8845e4b9a481e.webp': 72,
    'assets/images/cover-bd7c5ddac3754c9e90388f-139dda20.webp': 107,
    'assets/images/gift-01-weekly-star.webp': 72,
    'assets/images/detail/820b2b250ea14a6dae055c33e5156033.webp': 72,
    'assets/images/cover-cat-mw1dcfnzdx43-69705f08.webp': 134,
    'assets/images/content-item-mw1de0iuoh5g-bffb77ae.webp': 134
  },
  imageSize: {
    'assets/images/delta-pc-01-hot-fun.webp': [
      420,
      378
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
  },
  themeColor: '#111827'
};

/* 二、顶部主视觉轮播 */
var HERO_CONFIG = {
  autoplay: true,
  interval: 4000,
  slides: [
    {
      image: 'assets/images/hero-0-186325fb.webp',
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
  copyLabel: '复制公众号微信',
  orderLabel: '点我下单 ♡'
};

/* 五、下单弹层 */
var SHEET_CONFIG = {
  title: '添加客服下单',
  desc: '扫码或搜索下方公众号，一对一安排',
  qrText: '公众号 / 客服二维码',
  qrImage: 'assets/images/sheet-qr-ef849c96.webp',
  wechat: '辰兴电竞',
  copyLabel: '复制公众号',
  closeLabel: '关闭'
};

/* 六、内容区文案 */
var CONTENT_CONFIG = {
  posterBrand: '辰兴电竞',
  ruleLabel: '规则',
  defaultRule: '所有单子打结默认本单没有问题，投诉售后请在单子结束 24 小时内提出。',
  viewMoreText: '查看玩法',
  orderNoticeTitle: '板板权益 · 赔付须知',
  orderNotice: '1. 护航单/趣味单默认双护。打手包所有红卡、金卡及过点卡，需特定卡可以提前告知客服（体验单除外）；打手装备四头五甲起，陪玩单双陪必须包全卡和带包，单陪只包过点卡（巅峰及以上需包一张金卡一张红卡）。\n' +
    '2. 关于炸单赔付：撤离失败视为炸单，补偿航天巴克什 70W / 监狱 80W 的保底；安全箱带出价值超过 70W 的部分计入保底，且当局不用补偿保底；丢包撤不算撤离。\n' +
    '3. 陪玩师/护航打手双倒，老板兜底算炸单（默认累计保底单）。\n' +
    '① 陪玩/护航打手已将老板护送到安全的撤离位置，但想给老板加餐，但是没打赢，导致陪玩/护航死亡，不算炸单。\n' +
    '② 陪玩/护航打手不得卡保底：结算界面带出价值需至少超出保底价值 30W 及以上，否则补一局（单局赌约单不享受此权益）。被杀、且明确证实被外挂击杀的对局，不享受炸单补偿。\n' +
    '4. 连续炸单 3 把可联系客服换人/进行售后服务；如果板板不换人，由板板和客服说明。连续炸单 5 把，不论何种理由直接换人。\n' +
    '5. 出现恶意卡保底或服务态度恶劣等情况，请及时录屏取证并联系客服售后处理。打手在局内紧急情况时可能也会出现语气过急，请板板多一分谅解。有视频按照视频具体情况处理；打手无视频就按照板板所说赔偿并更换打手。\n' +
    '6. 默认非特殊趣味单（出红/金结单）打手尽量不参与摸容器和卡房，时间紧急等特殊情况除外。板板也可邀请香香手打手一同摸物资。特殊趣味单打手参与摸容器和卡房；打手在未获得板板许可的情况下，不得摸容器以及卡房。\n' +
    '7. 为确保顺利撤离，需要板板尽量配合打手的指挥。若因板板不听指挥乱跑、乱丢东西或藏物资等自身原因导致撤离失败或无法结单，将不提供任何售后补偿或直接结单；如发现打手藏物资，或对打手行动收获有异议，请及时录屏取证联系客服处理。\n' +
    '8. 若板板账号处于黑屋状态，遇到外挂、服务器异常等不可抗力因素导致对局异常，不提供售后服务。外挂局的定义如下：\n' +
    '① 对局结束举报成功且收到邮件。\n' +
    '② 对局被踢出，或击杀回放有明显问题（如准星锁头等较为明显的外挂）。\n' +
    '仅为酌情判断标准：\n' +
    '① 对局结束敌方战绩异常，如 30 级小号 / KD 异常 / 资产过低等。\n' +
    '② 基础保底 +50W 范围内为卡保底行为，需给板板补一把机密撤离。\n' +
    '9. 所有单子打「结单」默认本单没有问题。如需售后，请在单子结束的 24H 以内联系客服连坐追缴，售后期限为 7 天内，超时无法核实处理。\n' +
    '10. 老板不可与打手私自添加联系方式，脱离俱乐部交易概不负责。老板举报私加行为成功，直接扣除该陪玩当周期全部工资 + 押金，奖励到板板账户余额中。\n' +
    '11. 趣味单默认打手选图。如果板板想要指定地图，需与客服沟通好再派单；如指定监狱地图需额外加收 20%。\n' +
    '12. 本店默认所有大红单、赌约单，海洋之泪、非洲之心、复苏呼吸机可当赖子使用。\n' +
    '\n' +
    '最终解释权归辰兴所有。'
};

/* 七、底部装饰横幅 */
var NOTICE_CONFIG = {
  image: '',
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
    text: '粤ICP备2026160658号',
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
