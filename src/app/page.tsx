import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/home/hero-section";
import { PopularCitiesSection } from "@/components/home/popular-cities-section";
import { AllCitiesSection } from "@/components/home/all-cities-section";
import { CommunitySection } from "@/components/home/community-section";
import { SponsorBanner } from "@/components/home/sponsor-banner";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <PopularCitiesSection />
        <AllCitiesSection />
        <CommunitySection />
        <SponsorBanner />
      </main>
      <SiteFooter />
    </>
  );
}
