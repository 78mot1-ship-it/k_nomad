import { Star, Wallet, Wifi, Coffee, TrainFront } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { City } from "@/lib/mock-data";

export function CityCard({ city }: { city: City }) {
  return (
    <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">
      <div
        className={`relative flex h-28 items-center justify-center bg-gradient-to-br text-4xl ${city.gradient}`}
      >
        <span aria-hidden>{city.emoji}</span>
        {city.rank && (
          <Badge className="absolute left-2 top-2 bg-background/90 text-foreground shadow-sm">
            #{city.rank}
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="absolute right-2 top-2 bg-background/90 text-foreground shadow-sm"
        >
          {city.weatherEmoji} {city.weatherTemp}°C
        </Badge>
      </div>

      <CardContent className="flex flex-col gap-3 pb-4">
        <div>
          <h3 className="font-semibold leading-tight">{city.name}</h3>
          <p className="text-xs text-muted-foreground">{city.region}</p>
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-medium">{city.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            · 리뷰 {city.reviewCount}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Wallet className="size-4 shrink-0" />
            <span>월 {city.monthlyCostManwon}만원</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="size-4 shrink-0" />
            <span>{city.internetMbps}Mbps</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <Coffee className="size-3.5 shrink-0" />
          <span>코워킹 {city.coworkingLevel}</span>
          <span className="mx-1 h-3 w-px bg-border" aria-hidden />
          <TrainFront className="size-3.5 shrink-0" />
          <span>교통 {city.transitLevel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
