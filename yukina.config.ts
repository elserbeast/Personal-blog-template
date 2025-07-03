import I18nKeys from "./src/locales/keys";
import type { Configuration } from "./src/types/config";

const YukinaConfig: Configuration = {
  title: "柚子酱的Blog",
  subTitle: "",
  brandTitle: "",

  description: "",

  site: "http://localhost:4321/",

  locale: "zh-CN",

  navigators: [
    {
      nameKey: I18nKeys.nav_bar_home,
      href: "/",
    },
    {
      nameKey: I18nKeys.nav_bar_archive,
      href: "/archive",
    },
    // {
    //   nameKey: I18nKeys.nav_bar_about,
    //   href: "/about",
    // },
    {
      nameKey: I18nKeys.nav_bar_AI,
      href: "/ChatYukina",
    },
    {
      nameKey: I18nKeys.nav_bar_jianli, // 需要在 keys.ts 里加这个 key
      href: "/jianli",
    },
  ],

  username: "柚子酱",
  sign: "Ad Astra Per Aspera.",
  avatarUrl: "130、图片.png",
  socialLinks: [
    {
      icon: "line-md:github-loop",
      link: "https://github.com/elserbeast",
    },
    {
      icon: "mingcute:bilibili-line",
      link: "https://space.bilibili.com/404096393?spm_id_from=333.1007.0.0",
    },
    {
      icon: "mingcute:netease-music-line",
      link: "",
    },
  ],
  maxSidebarCategoryChip: 6, // It is recommended to set it to a common multiple of 2 and 3
  maxSidebarTagChip: 12,
  maxFooterCategoryChip: 6,
  maxFooterTagChip: 24,

  banners: [
    "/130、图片.png",
    "/130、图片.png",
    "/130、图片.png",
    "/130、图片.png",
    "/130、图片.png",
    "/130、图片.png",
    "/130、图片.png",
    "/130、图片.png",
  ],

  slugMode: "HASH", // 'RAW' | 'HASH'

  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
  },

  // WIP functions
  bannerStyle: "LOOP", // 'loop' | 'static' | 'hidden'
};

export default YukinaConfig;
