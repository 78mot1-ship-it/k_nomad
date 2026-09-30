export type Budget = "100만원" | "100~200만원" | "200만원";
export type RegionGroup = "수도권" | "경상도" | "전라도" | "강원도" | "제주도" | "충청도";
export type Environment = "자연친화" | "도심선호" | "카페작업" | "코워킹 필수";
export type Season = "봄" | "여름" | "가을" | "겨울";

export interface City {
  id: string;
  name: string;
  region: string;
  regionGroup: RegionGroup;
  likeCount: number;
  dislikeCount: number;
  monthlyCostManwon: number;
  budget: Budget;
  environment: Environment[];
  bestSeason: Season;
  emoji: string;
  gradient: string;
}

// City data now lives in Supabase (public.cities / public.city_reactions) — see src/lib/cities.ts.

export interface Meetup {
  id: string;
  city: string;
  title: string;
  schedule: string;
  attendeeCount: number;
}

export const weeklyMeetups: Meetup[] = [
  { id: "m1", city: "강릉", title: "커피챗", schedule: "토 14:00", attendeeCount: 5 },
  { id: "m2", city: "제주", title: "워크앤드", schedule: "일 11:00", attendeeCount: 8 },
  { id: "m3", city: "전주", title: "저녁모임", schedule: "금 19:00", attendeeCount: 3 },
];

export interface Member {
  id: string;
  username: string;
  online: boolean;
}

export const recentMembers: Member[] = [
  { id: "u1", username: "kimdev", online: true },
  { id: "u2", username: "seoulnomad", online: true },
  { id: "u3", username: "jiyoon", online: true },
  { id: "u4", username: "travelcoder", online: true },
  { id: "u5", username: "minsu", online: true },
  { id: "u6", username: "codewander", online: true },
];
