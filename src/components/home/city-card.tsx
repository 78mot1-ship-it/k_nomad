import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LikeDislikeButtons } from "@/components/home/like-dislike-buttons";
import type { City } from "@/lib/mock-data";
import type { ReactionType } from "@/lib/cities";

export function CityCard({
  city,
  initialReaction,
  isLoggedIn,
}: {
  city: City;
  initialReaction: ReactionType | null;
  isLoggedIn: boolean;
}) {
  return (
    <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">
      <div
        className={`flex h-28 items-center justify-center bg-gradient-to-br text-4xl ${city.gradient}`}
      >
        <span aria-hidden>{city.emoji}</span>
      </div>

      <CardContent className="flex flex-col gap-3 pb-4">
        <div>
          <h3 className="font-semibold leading-tight">{city.name}</h3>
          <p className="text-xs text-muted-foreground">{city.region}</p>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wallet className="size-4 shrink-0" />
          <span>월 {city.monthlyCostManwon}만원</span>
        </div>

        <dl className="flex flex-col gap-1 border-t border-border pt-3 text-xs">
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">예산</dt>
            <dd className="text-muted-foreground">· {city.budget}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">지역</dt>
            <dd className="text-muted-foreground">· {city.regionGroup}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">환경</dt>
            <dd className="text-muted-foreground">· {city.environment.join(", ")}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="font-medium text-foreground">최고 계절</dt>
            <dd className="text-muted-foreground">· {city.bestSeason}</dd>
          </div>
        </dl>

        <LikeDislikeButtons
          cityId={city.id}
          initialLikeCount={city.likeCount}
          initialDislikeCount={city.dislikeCount}
          initialReaction={initialReaction}
          isLoggedIn={isLoggedIn}
        />
      </CardContent>
    </Card>
  );
}
