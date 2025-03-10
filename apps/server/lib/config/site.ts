const baseSiteConfig = {
  name: "AI CodeReview Mentor",
  description:
    "AI Code Review Mentor is an intelligent code review assistant that helps developers improve code quality, identify potential issues, and provide optimization suggestions. Through advanced AI technology, it delivers professional and timely review feedback for your code.",
  url: "https://cr-mentor.top",
  metadataBase: "/",
  keywords: [
    "AI code review",
    "code review tool",
    "AI-driven code review",
    "code generator",
    "code optimization suggestions",
    "code review workshop",
  ],
  authors: [
    {
      name: "Gijela",
      url: "https://cr-mentor.top",
    },
  ],
  icons: {
    icon: "/logo.gif",
    shortcut: "/logo.gif",
    apple: "/logo.gif",
  },
  creator: "Gijela",
};

export const SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/demo.png`],
    creator: baseSiteConfig.creator,
  },
};
