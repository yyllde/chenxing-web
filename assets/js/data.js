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
    subtitle: '基础玩法',
    items: [
      {
        id: 'e2a76c29dabf4760b9bb426b416e0188',
        title: '基础体验单',
        subtitle: '',
        image: 'assets/images/delta-pc-01-hot-fun.webp',
        contentImage: 'assets/images/detail/e2a76c29dabf4760b9bb426b416e0188.webp',
        prices: [],
        rule: ''
      },
      {
        id: '955db451f862475ba0e17d532fd0a682',
        title: '基础小时陪',
        subtitle: '',
        image: 'assets/images/delta-pc-02-new-hot-fun.webp',
        contentImage: 'assets/images/detail/955db451f862475ba0e17d532fd0a682.webp',
        prices: [],
        rule: ''
      },
      {
        id: '74bb5694459a408d871ebf5bb2a30917',
        title: '新赛季九格保险',
        subtitle: '',
        image: 'assets/images/delta-pc-03-season-insurance.webp',
        contentImage: 'assets/images/detail/74bb5694459a408d871ebf5bb2a30917.webp',
        prices: [],
        rule: ''
      },
      {
        id: 'item-mur4ke6wnizj',
        title: '大王叫我来巡山',
        subtitle: '',
        image: null,
        contentImage: 'assets/images/item-dawang-xunshan.webp',
        prices: [],
        rule: ''
      },
      {
        id: 'item-mur4l0454k2a',
        title: '辰兴bingo单',
        subtitle: '',
        image: null,
        contentImage: 'assets/images/bingo.webp',
        prices: [],
        rule: ''
      },
      {
        id: 'item-mur4m0c6ysr2',
        title: '神秘黑洞趣味单',
        subtitle: '',
        image: null,
        contentImage: 'assets/images/item-shenmi-heidong.webp',
        prices: [],
        rule: ''
      }
    ],
    cover: 'assets/images/cover-b193a539aad54a1aadf652-0ebd82a8.webp'
  },
  {
    id: '0795399f5593455c95a30a4e93469c65',
    title: '预存/活动',
    subtitle: '',
    items: [
      {
        id: '003a0667adc9492cbfc8ce9acbf8af4d',
        title: '单次预存福利',
        subtitle: '',
        image: null,
        contentImage: 'assets/images/item-yucun-fuli.webp',
        prices: [],
        rule: ''
      },
      {
        id: 'bc7c0f66cd55435ab1e8845e4b9a481e',
        title: '累计消费福利',
        subtitle: '',
        image: 'assets/images/deposit-event-01-welfare.png',
        contentImage: 'assets/images/detail/bc7c0f66cd55435ab1e8845e4b9a481e.webp',
        prices: [],
        rule: ''
      }
    ],
    cover: 'assets/images/cover-0795399f5593455c95a30a-3172cb4b.webp'
  },
  {
    id: 'bd7c5ddac3754c9e90388f71495c581f',
    title: '礼物单',
    subtitle: '',
    items: [
      {
        id: '820b2b250ea14a6dae055c33e5156033',
        title: '辰兴礼物单',
        subtitle: '',
        image: 'assets/images/gift-01-weekly-star.webp',
        contentImage: 'assets/images/detail/820b2b250ea14a6dae055c33e5156033.webp',
        prices: [],
        rule: ''
      }
    ],
    cover: 'assets/images/cover-bd7c5ddac3754c9e90388f-139dda20.webp'
  }
];
