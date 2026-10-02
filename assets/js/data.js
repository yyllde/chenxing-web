/**
 * ============================================================================
 *  data.js —— 页面内容数据（分类 / 玩法 / 价格 / 规则）
 * ============================================================================
 *  ★ 这个文件是可视化后台生成的：打开 admin.html 改内容 → 第 ⑤ 步保存 data.js
 *    → 用它覆盖本文件即可，不需要手写代码。
 *
 *  字段说明：
 *    id            唯一编号（别重复，分享链接里会用到）
 *    title         分类名 / 玩法名
 *    cover         分类封面图（可留空 => null）
 *    image         玩法小图标（可留空 => null）
 *    contentImage  价目表大图（可留空 => null）
 *    prices        价格盒数组 [{ n: 名称, v: 价格, u: 单位 }]
 *    rule          规则文字；留空则不显示规则块
 * ============================================================================
 */

var ASSETS = 'assets';

var SERVICE_CATEGORIES = [
  {
    id: 'b193a539aad54a1aadf65294bbd9f742',
    title: '三角洲端游',
    subtitle: '',
    cover: 'assets/images/covers/cover-delta-pc.jpg',
    items: [
      {
        id: 'e2a76c29dabf4760b9bb426b416e0188',
        title: '爆款趣味玩法',
        subtitle: '',
        image: 'assets/images/delta-pc-01-hot-fun.png',
        contentImage: 'assets/images/detail/e2a76c29dabf4760b9bb426b416e0188.jpg',
        prices: [],
        rule: ''
      },
      {
        id: '955db451f862475ba0e17d532fd0a682',
        title: '上新爆款玩法',
        subtitle: '',
        image: 'assets/images/delta-pc-02-new-hot-fun.png',
        contentImage: 'assets/images/detail/955db451f862475ba0e17d532fd0a682.jpg',
        prices: [],
        rule: ''
      },
      {
        id: '74bb5694459a408d871ebf5bb2a30917',
        title: '新赛季九格保险',
        subtitle: '',
        image: 'assets/images/delta-pc-03-season-insurance.png',
        contentImage: 'assets/images/detail/74bb5694459a408d871ebf5bb2a30917.jpg',
        prices: [],
        rule: ''
      },
      {
        id: 'bd9ae72e7eea4a248c2fed8da5e972e5',
        title: '体验单/小时区/基础单',
        subtitle: '',
        image: 'assets/images/delta-pc-04-experience-basic.jpg',
        contentImage: 'assets/images/detail/bd9ae72e7eea4a248c2fed8da5e972e5.jpg',
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: 'ff4d326fdba04df5ac13a418245c2366',
    title: '三角洲手游',
    subtitle: '',
    cover: 'assets/images/covers/cover-delta-mobile.jpg',
    items: [
      {
        id: '241d37eda56f49c3a240299f602fbc83',
        title: '手游体验单',
        subtitle: '',
        image: 'assets/images/delta-mobile-01-experience.png',
        contentImage: 'assets/images/detail/241d37eda56f49c3a240299f602fbc83.jpg',
        prices: [],
        rule: ''
      },
      {
        id: 'ad6531bd85e645a1add0b6122f0e1323',
        title: '超值特惠单',
        subtitle: '',
        image: 'assets/images/delta-mobile-02-value-deal.png',
        contentImage: 'assets/images/detail/ad6531bd85e645a1add0b6122f0e1323.jpg',
        prices: [],
        rule: ''
      },
      {
        id: '6066593512b54a76860ee0002ad88d75',
        title: '娱乐/基础区',
        subtitle: '',
        image: 'assets/images/delta-mobile-03-casual-basic.jpg',
        contentImage: 'assets/images/detail/6066593512b54a76860ee0002ad88d75.jpg',
        prices: [],
        rule: ''
      },
      {
        id: 'd1949e2b41cf4fbaa6919358a3dc7bfb',
        title: '技术区',
        subtitle: '',
        image: 'assets/images/delta-mobile-04-technical.jpg',
        contentImage: 'assets/images/detail/d1949e2b41cf4fbaa6919358a3dc7bfb.jpg',
        prices: [],
        rule: ''
      },
      {
        id: 'e59af58923b849fb8092514c6b21a7e3',
        title: '爆款趣味单',
        subtitle: '',
        image: 'assets/images/delta-mobile-05-hot-fun.png',
        contentImage: 'assets/images/detail/e59af58923b849fb8092514c6b21a7e3.jpg',
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: 'eda583c669ea49bb921b1f7bc079e94b',
    title: '渡渡鸟纯女端游',
    subtitle: '',
    cover: 'assets/images/covers/cover-girls-pc.jpg',
    items: [
      {
        id: '0e48fb7884494beea7a884ca718deef3',
        title: '体验基础单',
        subtitle: '',
        image: 'assets/images/girls-pc-01-experience-basic.png',
        contentImage: 'assets/images/detail/0e48fb7884494beea7a884ca718deef3.jpg',
        prices: [],
        rule: ''
      },
      {
        id: '3bcd66a0b4bc4d208858e86fe2d7b465',
        title: '小时计费区',
        subtitle: '',
        image: 'assets/images/girls-pc-02-hourly.png',
        contentImage: 'assets/images/detail/3bcd66a0b4bc4d208858e86fe2d7b465.jpg',
        prices: [],
        rule: ''
      },
      {
        id: '6df2182382ff4e63a20b1008ea9a46a3',
        title: '爆款趣味单',
        subtitle: '',
        image: 'assets/images/girls-pc-03-hot-fun.png',
        contentImage: 'assets/images/detail/6df2182382ff4e63a20b1008ea9a46a3.jpg',
        prices: [],
        rule: ''
      },
      {
        id: '86f23346cdd44d9c849472e69c07eb12',
        title: '渡渡鸟纯女板板须知',
        subtitle: '',
        image: 'assets/images/girls-pc-04-notice.png',
        contentImage: 'assets/images/detail/86f23346cdd44d9c849472e69c07eb12.jpg',
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: '4c109de554ce444bb4ff8a52d97c2ea6',
    title: '洛克王国',
    subtitle: '',
    cover: 'assets/images/covers/cover-roco-kingdom.jpg',
    items: [
      {
        id: '39179596db5e4cd9952ffd82cb2a3d22',
        title: '托管',
        subtitle: '',
        image: 'assets/images/roco-kingdom-01-hosting.png',
        contentImage: 'assets/images/detail/39179596db5e4cd9952ffd82cb2a3d22.jpg',
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: 'cccee0adc69943a09ae879e07b20339d',
    title: '瓦罗兰特',
    subtitle: '',
    cover: 'assets/images/covers/cover-valorant.jpg',
    items: [
      {
        id: '46a84cc1587c4002a23438559e9dcdf3',
        title: '基础价目表',
        subtitle: '',
        image: 'assets/images/default-avatar.svg',
        contentImage: null,
        prices: [],
        rule: ''
      },
      {
        id: '00f8f624e9d64336a4e66be91db708c6',
        title: '趣味玩法',
        subtitle: '',
        image: null,
        contentImage: null,
        prices: [],
        rule: ''
      },
      {
        id: '88514c93945342588d5f433d6da86fe9',
        title: '主播专区',
        subtitle: '',
        image: null,
        contentImage: null,
        prices: [],
        rule: ''
      },
      {
        id: '44b6a6a756864b3788f5bb67df07df5a',
        title: '预存/活动',
        subtitle: '',
        image: null,
        contentImage: null,
        prices: [],
        rule: ''
      },
      {
        id: 'f2b47cbef4634398a2ccead3dbccfa6b',
        title: '板板须知',
        subtitle: '',
        image: 'assets/images/default-avatar.svg',
        contentImage: null,
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: 'd40f7dc6338d4583b2c9dbee5b3f4d0c',
    title: 'LOL',
    subtitle: '',
    cover: 'assets/images/covers/cover-lol.jpg',
    items: [
      {
        id: '48636c8a1f704eff8e931339ab39c8e5',
        title: '小时区',
        subtitle: '',
        image: 'assets/images/lol-01-hourly.jpg',
        contentImage: 'assets/images/detail/48636c8a1f704eff8e931339ab39c8e5.jpg',
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: 'a2ecfcefd0794f39b5823812968fb441',
    title: '唱歌/语聊/小游戏',
    subtitle: '',
    cover: 'assets/images/covers/cover-sing-chat.jpg',
    items: [
      {
        id: '5784c0f5dce94245814c10870a27e5ad',
        title: '唱歌/语聊/小游戏',
        subtitle: '',
        image: 'assets/images/sing-chat-minigame-01-main.png',
        contentImage: 'assets/images/detail/5784c0f5dce94245814c10870a27e5ad.jpg',
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: '0795399f5593455c95a30a4e93469c65',
    title: '预存/活动',
    subtitle: '',
    cover: 'assets/images/covers/cover-deposit-event.jpg',
    items: [
      {
        id: '003a0667adc9492cbfc8ce9acbf8af4d',
        title: '中秋国庆双节活动',
        subtitle: '',
        image: null,
        contentImage: null,
        prices: [],
        rule: ''
      },
      {
        id: 'bc7c0f66cd55435ab1e8845e4b9a481e',
        title: '预存福利',
        subtitle: '',
        image: 'assets/images/deposit-event-01-welfare.png',
        contentImage: 'assets/images/detail/bc7c0f66cd55435ab1e8845e4b9a481e.jpg',
        prices: [],
        rule: ''
      }
    ]
  },
  {
    id: 'bd7c5ddac3754c9e90388f71495c581f',
    title: '礼物单',
    subtitle: '',
    cover: 'assets/images/covers/cover-gift.jpg',
    items: [
      {
        id: '820b2b250ea14a6dae055c33e5156033',
        title: '渡渡鸟周星好礼',
        subtitle: '',
        image: 'assets/images/gift-01-weekly-star.png',
        contentImage: 'assets/images/detail/820b2b250ea14a6dae055c33e5156033.jpg',
        prices: [],
        rule: ''
      },
      {
        id: 'e87377ef03184dfc9eca302c0a26b885',
        title: '礼物单',
        subtitle: '',
        image: 'assets/images/gift-02-gift-list.png',
        contentImage: 'assets/images/detail/e87377ef03184dfc9eca302c0a26b885.jpg',
        prices: [],
        rule: ''
      }
    ]
  }
];
