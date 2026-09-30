import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/home/hero-section";
import { CityListSection } from "@/components/home/city-list-section";
import { CommunitySection } from "@/components/home/community-section";
import { SponsorBanner } from "@/components/home/sponsor-banner";
import { createClient } from "@/lib/supabase/server";
import { getCities, getUserReactions } from "@/lib/cities";

export default async function Home() {
  const supabase = await createClient();

  const [cities, {
    data: { user },
  }] = await Promise.all([getCities(supabase), supabase.auth.getUser()]);

  const initialReactions = user ? await getUserReactions(supabase, user.id) : {};

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <CityListSection cities={cities} initialReactions={initialReactions} isLoggedIn={!!user} />
        <CommunitySection />
        <SponsorBanner />
      </main>
      <SiteFooter />
    </>
  );
}
