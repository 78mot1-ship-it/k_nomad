export type Level = "상" | "중" | "하";

export interface City {
  id: string;
  name: string;
  region: string;
  rank?: number;
  rating: number;
  reviewCount: number;
  monthlyCostManwon: number;
  internetMbps: number;
  coworkingLevel: Level;
  transitLevel: Level;
  weatherTemp: number;
  weatherEmoji: string;
  emoji: string;
  gradient: string;
}

export const popularCities: City[] = [
  {
    id: "gangneung",
    name: "강릉",
    region: "강원도",
    rank: 1,
    rating: 4.6,
    reviewCount: 128,
    monthlyCostManwon: 145,
    internetMbps: 210,
    coworkingLevel: "상",
    transitLevel: "중",
    weatherTemp: 21,
    weatherEmoji: "☀️",
    emoji: "🌊",
    gradient: "from-sky-400 to-blue-600",
  },
  {
    id: "jeju",
    name: "제주",
    region: "제주특별자치도",
    rank: 2,
    rating: 4.5,
    reviewCount: 203,
    monthlyCostManwon: 160,
    internetMbps: 180,
    coworkingLevel: "상",
    transitLevel: "하",
    weatherTemp: 24,
    weatherEmoji: "🌤️",
    emoji: "🍊",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    id: "jeonju",
    name: "전주",
    region: "전라북도",
    rank: 3,
    rating: 4.4,
    reviewCount: 96,
    monthlyCostManwon: 120,
    internetMbps: 190,
    coworkingLevel: "중",
    transitLevel: "중",
    weatherTemp: 22,
    weatherEmoji: "☀️",
    emoji: "🏮",
    gradient: "from-amber-400 to-orange-600",
  },
  {
    id: "sokcho",
    name: "속초",
    region: "강원도",
    rank: 4,
    rating: 4.2,
    reviewCount: 74,
    monthlyCostManwon: 135,
    internetMbps: 175,
    coworkingLevel: "중",
    transitLevel: "하",
    weatherTemp: 19,
    weatherEmoji: "⛅",
    emoji: "🏔️",
    gradient: "from-cyan-400 to-sky-600",
  },
];

export const allCities: City[] = [
  ...popularCities,
  {
    id: "yeosu",
    name: "여수",
    region: "전라남도",
    rating: 4.1,
    reviewCount: 61,
    monthlyCostManwon: 110,
    internetMbps: 165,
    coworkingLevel: "중",
    transitLevel: "중",
    weatherTemp: 23,
    weatherEmoji: "🌤️",
    emoji: "🌉",
    gradient: "from-rose-400 to-pink-600",
  },
  {
    id: "tongyeong",
    name: "통영",
    region: "경상남도",
    rating: 4.0,
    reviewCount: 48,
    monthlyCostManwon: 105,
    internetMbps: 160,
    coworkingLevel: "하",
    transitLevel: "하",
    weatherTemp: 23,
    weatherEmoji: "☀️",
    emoji: "⛵",
    gradient: "from-indigo-400 to-blue-600",
  },
  {
    id: "gyeongju",
    name: "경주",
    region: "경상북도",
    rating: 3.9,
    reviewCount: 55,
    monthlyCostManwon: 100,
    internetMbps: 170,
    coworkingLevel: "중",
    transitLevel: "중",
    weatherTemp: 22,
    weatherEmoji: "🌤️",
    emoji: "🏯",
    gradient: "from-yellow-400 to-amber-600",
  },
  {
    id: "busan",
    name: "부산",
    region: "부산광역시",
    rating: 4.3,
    reviewCount: 187,
    monthlyCostManwon: 150,
    internetMbps: 220,
    coworkingLevel: "상",
    transitLevel: "상",
    weatherTemp: 24,
    weatherEmoji: "☀️",
    emoji: "🌆",
    gradient: "from-blue-400 to-indigo-600",
  },
  {
    id: "chuncheon",
    name: "춘천",
    region: "강원도",
    rating: 3.9,
    reviewCount: 33,
    monthlyCostManwon: 108,
    internetMbps: 155,
    coworkingLevel: "하",
    transitLevel: "중",
    weatherTemp: 18,
    weatherEmoji: "⛅",
    emoji: "🏞️",
    gradient: "from-lime-400 to-green-600",
  },
  {
    id: "namhae",
    name: "남해",
    region: "경상남도",
    rating: 3.8,
    reviewCount: 21,
    monthlyCostManwon: 95,
    internetMbps: 140,
    coworkingLevel: "하",
    transitLevel: "하",
    weatherTemp: 24,
    weatherEmoji: "🌤️",
    emoji: "🌴",
    gradient: "from-teal-400 to-emerald-600",
  },
  {
    id: "incheon",
    name: "인천",
    region: "인천광역시",
    rating: 4.0,
    reviewCount: 88,
    monthlyCostManwon: 130,
    internetMbps: 200,
    coworkingLevel: "상",
    transitLevel: "상",
    weatherTemp: 20,
    weatherEmoji: "☁️",
    emoji: "✈️",
    gradient: "from-slate-400 to-blue-600",
  },
];

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
