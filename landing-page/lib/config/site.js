import { TfiYoutube } from "react-icons/tfi";
import { FaRedditAlien, FaTiktok, FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter, FaSquareThreads, FaWeixin } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiWechatChannelsLine } from "react-icons/ri";

const baseSiteConfig = {
  name: "CR-Mentor",
  description:
    "The AI code review tool that helps developers improve code quality and reduce review time.",
  url: "https://cr-mentor.com",
  ogImage: "https://cr-mentor.com/logo.gif",
  metadataBase: "/",
  keywords: [
    "AI code review",
    "code review",
    "code review tool",
    "chatgpt code review",
  ],
  authors: [
    {
      name: "Gijela",
      url: "https://github.com/gijela",
    },
  ],
  icons: {
    icon: "https://cr-mentor.com/logo.gif",
    shortcut: "https://cr-mentor.com/logo.gif",
    apple: "https://cr-mentor.com/logo.gif",
  },
};

export const SiteConfig = {
  en: {
    name: "CR-Mentor",
    description:
      "This is a free, open-source and powerful landing page template for saas project, it will help you to make your startup faster.",
    url: "https://landingpage.inwind.cn",
    ogImage: "https://cr-mentor.com/logo.gif",
    metadataBase: "/",
    keywords: [
      "landing page template",
      "landing page boilerplate",
      "opensource landing page",
      "next.js landing page",
      "free landing page",
      "awesome landing page",
    ],
    authors: [
      {
        name: "Gijela",
        url: "https://github.com/gijela",
      },
    ],
    icons: {
      icon: "https://cr-mentor.com/logo.gif",
      shortcut: "https://cr-mentor.com/logo.gif",
      apple: "https://cr-mentor.com/logo.gif",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseSiteConfig.url,
      title: "CR-Mentor",
      description:
        "This is a free, open-source and powerful landing page template for saas project, it will help you to make your startup faster.",
      siteName: "CR-Mentor",
    },
    twitter: {
      card: "summary_large_image",
      title: "CR-Mentor",
      description:
        "This is a free, open-source and powerful landing page template for saas project, it will help you to make your startup faster.",
      images: [`${baseSiteConfig.url}/og.png`],
      creator: baseSiteConfig.creator,
    },
  },
  zh: {
    name: "CR-Mentor",
    description:
      "CR-Mentor 是一个基于 LLM 技术的智能代码审查工具，它能够帮助开发团队提高代码审查效率，提升代码质量。通过智能化的审查建议、知识库管理、风险代码识别等功能，让代码审查变得更加高效和规范。",
    url: "https://cr-mentor.com",
    ogImage: "https://cr-mentor.com/logo.gif",
    metadataBase: "/",
    keywords: [
      "代码审查工具",
      "智能代码审查",
      "代码审查工具",
      "代码审查",
      "代码审查工具",
      "代码审查工具",
    ],
    authors: [
      {
        name: "Gijela",
        url: "https://github.com/gijela",
      },
    ],
    icons: {
      icon: "https://cr-mentor.com/logo.gif",
      shortcut: "https://cr-mentor.com/logo.gif",
      apple: "https://cr-mentor.com/logo.gif",
    },
    openGraph: {
      type: "website",
      locale: "zh",
      url: baseSiteConfig.url,
      title: "inWind落地页模板",
      description:
        "这是一个免费、开源且功能强大的 saas 项目登陆页面模板，它将帮助您更快地启动。",
      siteName: "inWind落地页模板",
    },
    twitter: {
      card: "summary_large_image",
      title: "inWind落地页模板",
      description:
        "这是一个免费、开源且功能强大的 saas 项目登陆页面模板，它将帮助您更快地启动。",
      images: [`${baseSiteConfig.url}/og.png`],
      creator: baseSiteConfig.creator,
    },
  },
  es: {
    name: "Plantilla de página de destino de inWind",
    description:
      "Esta es una plantilla de página de destino gratuita, de código abierto y poderosa para proyectos SaaS que le ayudará a acelerar su puesta en marcha.",
    url: "https://landingpage.inwind.cn",
    ogImage: "https://cr-mentor.com/logo.gif",
    metadataBase: "/",
    keywords: [
      "plantilla de página de destino",
      "texto estándar de la página de destino",
      "Página de inicio de código abierto",
      "Página de inicio de next.js",
      "página de aterrizaje gratuita",
      "Impresionante página de destino",
    ],
    authors: [
      {
        name: "CR-Mentor",
        url: "https://CR-Mentor.com",
      },
    ],
    icons: {
      icon: "https://cr-mentor.com/logo.gif",
      shortcut: "https://cr-mentor.com/logo.gif",
      apple: "https://cr-mentor.com/logo.gif",
    },
    openGraph: {
      type: "website",
      locale: "es",
      url: baseSiteConfig.url,
      title: "Plantilla de página de destino de inWind",
      description:
        "Esta es una plantilla de página de destino gratuita, de código abierto y poderosa para proyectos SaaS que le ayudará a acelerar su puesta en marcha.",
      siteName: "Plantilla de página de destino de inWind",
    },
    twitter: {
      card: "summary_large_image",
      title: "Plantilla de página de destino de inWind",
      description:
        "Esta es una plantilla de página de destino gratuita, de código abierto y poderosa para proyectos SaaS que le ayudará a acelerar su puesta en marcha.",
      images: [`${baseSiteConfig.url}/og.png`],
      creator: baseSiteConfig.creator,
    },
  },
  fr: {
    name: "Modèle de page de destination inWind",
    description:
      "Il s'agit d'un modèle de page de destination gratuit, open source et puissant pour le projet Saas, il vous aidera à accélérer votre démarrage.",
    url: "https://landingpage.inwind.cn",
    ogImage: "https://cr-mentor.com/logo.gif",
    metadataBase: "/",
    keywords: [
      "modèle de page de destination",
      "modèle de page de destination",
      "page d'accueil open source",
      "Page de destination next.js",
      "page de destination gratuite",
      "superbe page de destination",
    ],
    authors: [
      {
        name: "CR-Mentor",
        url: "https://CR-Mentor.com",
      },
    ],
    icons: {
      icon: "https://cr-mentor.com/logo.gif",
      shortcut: "https://cr-mentor.com/logo.gif",
      apple: "https://cr-mentor.com/logo.gif",
    },
    openGraph: {
      type: "website",
      locale: "fr",
      url: baseSiteConfig.url,
      title: "Modèle de page de destination inWind",
      description:
        "Il s'agit d'un modèle de page de destination gratuit, open source et puissant pour le projet Saas, il vous aidera à accélérer votre démarrage.",
      siteName: "Modèle de page de destination inWind",
    },
    twitter: {
      card: "summary_large_image",
      title: "Modèle de page de destination inWind",
      description:
        "Il s'agit d'un modèle de page de destination gratuit, open source et puissant pour le projet Saas, il vous aidera à accélérer votre démarrage.",
      images: [`${baseSiteConfig.url}/og.png`],
      creator: baseSiteConfig.creator,
    },
  },
  ja: {
    name: "inWind ランディングページテンプレート",
    description:
      "これは、SaaS プロジェクト用の無料かつオープンソースの強力なランディング ページ テンプレートであり、スタートアップの迅速化に役立ちます。",
    url: "https://landingpage.inwind.cn",
    ogImage: "https://cr-mentor.com/logo.gif",
    metadataBase: "/",
    keywords: [
      "ランディングページテンプレート",
      "ランディングページの定型文",
      "オープンソースランディングページ",
      "next.js ランディング ページ",
      "無料のランディングページ",
      "素晴らしいランディングページ",
    ],
    authors: [
      {
        name: "CR-Mentor",
        url: "https://CR-Mentor.com",
      },
    ],
    icons: {
      icon: "https://cr-mentor.com/logo.gif",
      shortcut: "https://cr-mentor.com/logo.gif",
      apple: "https://cr-mentor.com/logo.gif",
    },
    openGraph: {
      type: "website",
      locale: "ja",
      url: baseSiteConfig.url,
      title: "inWind ランディングページテンプレート",
      description:
        "これは、SaaS プロジェクト用の無料かつオープンソースの強力なランディング ページ テンプレートであり、スタートアップの迅速化に役立ちます。",
      siteName: "inWind ランディングページテンプレート",
    },
    twitter: {
      card: "summary_large_image",
      title: "inWind ランディングページテンプレート",
      description:
        "これは、SaaS プロジェクト用の無料かつオープンソースの強力なランディング ページ テンプレートであり、スタートアップの迅速化に役立ちます。",
      images: [`${baseSiteConfig.url}/og.png`],
      creator: baseSiteConfig.creator,
    },
  },
  ru: {
    name: "Шаблон целевой страницы inWind",
    description:
      "Это бесплатный, открытый и мощный шаблон целевой страницы для saas-проекта, он поможет вам ускорить ваш стартап.",
    url: "https://landingpage.inwind.cn",
    ogImage: "https://cr-mentor.com/logo.gif",
    metadataBase: "/",
    keywords: [
      "шаблон целевой страницы",
      "шаблон целевой страницы",
      "целевая страница с открытым исходным кодом",
      "целевая страница next.js",
      "бесплатная целевая страница",
      "потрясающая целевая страница",
    ],
    authors: [
      {
        name: "CR-Mentor",
        url: "https://CR-Mentor.com",
      },
    ],
    icons: {
      icon: "https://cr-mentor.com/logo.gif",
      shortcut: "https://cr-mentor.com/logo.gif",
      apple: "https://cr-mentor.com/logo.gif",
    },
    openGraph: {
      type: "website",
      locale: "ru",
      url: baseSiteConfig.url,
      title: "Шаблон целевой страницы inWind",
      description:
        "Это бесплатный, открытый и мощный шаблон целевой страницы для saas-проекта, он поможет вам ускорить ваш стартап.",
      siteName: "Шаблон целевой страницы inWind",
    },
    twitter: {
      card: "summary_large_image",
      title: "Шаблон целевой страницы inWind",
      description:
        "Это бесплатный, открытый и мощный шаблон целевой страницы для saas-проекта, он поможет вам ускорить ваш стартап.",
      images: [`${baseSiteConfig.url}/og.png`],
      creator: baseSiteConfig.creator,
    },
  },
  ar: {
    name: "قالب صفحة الهبوط inWind",
    description:
      "هذا هو قالب صفحة الهبوط القوي والمفتوح المصدر والمجاني لمشروع SaaS، وسوف يساعدك على جعل بدء التشغيل الخاص بك أسرع.",
    url: "https://landingpage.inwind.cn",
    ogImage: "https://cr-mentor.com/logo.gif",
    metadataBase: "/",
    keywords: [
      "قالب صفحة الهبوط",
      "قالب صفحة الهبوط",
      "صفحة الهبوط مفتوحة المصدر",
      "صفحة الهبوط next.js",
      "صفحة هبوط مجانية",
      "صفحة هبوط رائعة",
    ],
    authors: [
      {
        name: "CR-Mentor",
        url: "https://CR-Mentor.com",
      },
    ],
    icons: {
      icon: "https://cr-mentor.com/logo.gif",
      shortcut: "https://cr-mentor.com/logo.gif",
      apple: "https://cr-mentor.com/logo.gif",
    },
    openGraph: {
      type: "website",
      locale: "ar",
      url: baseSiteConfig.url,
      title: "قالب صفحة الهبوط inWind",
      description:
        "هذا هو قالب صفحة الهبوط القوي والمفتوح المصدر والمجاني لمشروع SaaS، وسوف يساعدك على جعل بدء التشغيل الخاص بك أسرع.",
      siteName: "قالب صفحة الهبوط inWind",
    },
    twitter: {
      card: "summary_large_image",
      title: "قالب صفحة الهبوط inWind",
      description:
        "هذا هو قالب صفحة الهبوط القوي والمفتوح المصدر والمجاني لمشروع SaaS، وسوف يساعدك على جعل بدء التشغيل الخاص بك أسرع.",
      images: [`${baseSiteConfig.url}/og.png`],
      creator: baseSiteConfig.creator,
    },
  },
};
