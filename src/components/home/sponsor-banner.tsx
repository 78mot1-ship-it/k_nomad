import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SponsorBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <Card className="bg-secondary/60">
        <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3 sm:items-center">
            <span className="text-xl" aria-hidden>
              📢
            </span>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium">스폰서</span>
                <Badge variant="outline" className="text-[10px]">
                  Ad
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                노마드 전용 여행자보험, 하루 2,000원부터
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            알아보기
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
