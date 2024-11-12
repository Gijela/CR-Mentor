import "./globals.css";
// import { Plus_Jakarta_Sans } from "next/font/google";

import { SiteConfig } from "@/lib/config/site";
import CustomHead from "@/components/common/head";
import Navbar from "@/components/common/navbar";
// import Footer from "@/components/common/footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: SiteConfig.name,
  description: SiteConfig.description,
  keywords: SiteConfig.keywords,
  authors: SiteConfig.authors,
  creator: SiteConfig.creator,
  icons: SiteConfig.icons,
  metadataBase: SiteConfig.metadataBase,
  openGraph: SiteConfig.openGraph,
  twitter: SiteConfig.twitter,
};

// const jakarta = Plus_Jakarta_Sans({
//   weight: ["500", "800"],
//   subsets: ["latin"],
//   display: "swap",
// });

export default async function RootLayout({ children }) {
  return (
    // <html lang="en" className={jakarta.className}>
    <html lang="en">
      <head>
        <CustomHead />
      </head>
      <body>
        <ClerkProvider>
          <ThemeProvider>
            <div className="w-full min-h-screen text-base-content bg-base-100">
              <Navbar />
              <div>{children}</div>
              {/* <Footer /> */}
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
