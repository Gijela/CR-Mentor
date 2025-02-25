import { defineConfig } from "vitepress"

export const shared = defineConfig({
  title: "shadcn/ui Boilerplate",
  rewrites: {
    "en/:rest*": ":rest*",
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  sitemap: {
    hostname: "https://cr-mentor.com",
    transformItems(items) {
      return items.filter((item) => !item.url.includes("migration"))
    },
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/vite-boilerplate.svg" }],
    ["link", { rel: "icon", type: "image/png", href: "/vite-boilerplate.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "en" }],
    ["meta", { property: "og:title", content: "shadcn/ui Boilerplate | " }],
    ["meta", { property: "og:site_name", content: "shadcn/ui Boilerplate" }],
    ["meta", { property: "og:image", content: `https://cr-mentor.com/overview.png` }],
    ["meta", { property: "og:url", content: "https://cr-mentor.com" }],
  ],

  themeConfig: {
    logo: { src: "/vite-boilerplate.svg", width: 24, height: 24 },

    socialLinks: [
      { icon: "github", link: "https://github.com/Gijela/CR-Mentor" },
    ],

  },
  ignoreDeadLinks: [
    /^https?:\/\/localhost/,
  ],
})
