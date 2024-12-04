import { defaultLocale, getDictionary } from "@/lib/i18n";

import Hero from "@/components/home/hero";
import Feature from "@/components/home/feature";
// import Pricing from "@/components/home/pricing";
// import Testimonial from "@/components/home/testimonial";
// import Faq from "@/components/home/faq";
import Cta from "@/components/home/cta";
// import HowItWork from "@/components/home/howItWork";

export default async function Home({ params }) {
  const langName = params.lang || defaultLocale;
  const dict = await getDictionary(langName);

  return (
    <div className="max-w-[1280px] mx-auto">
      <Hero lang={langName} locale={dict.Hero} CTALocale={dict.CTAButton} />
      <Feature locale={dict.Feature} langName={langName} />
      {/* <Pricing locale={dict.Pricing} langName={langName} /> */}
      {/* <Testimonial locale={dict.Testimonial} langName={langName} /> */}
      {/* <Faq locale={dict.Faq} langName={langName} /> */}
      {/* <HowItWork locale={dict.HowItWork} /> */}
      <Cta lang={langName} locale={dict.CTA} CTALocale={dict.CTAButton} />
    </div>
  );
}
