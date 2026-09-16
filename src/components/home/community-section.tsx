import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { weeklyMeetups, recentMembers } from "@/lib/mock-data";

export function CommunitySection() {
  return (
    <section id="community" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span aria-hidden>🧑‍🤝‍🧑</span> 이번 주 밋업
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {weeklyMeetups.map((meetup) => (
              <div
                key={meetup.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">
                    {meetup.city} {meetup.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {meetup.schedule}
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Users className="size-3" />
                  {meetup.attendeeCount}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="mt-1 w-full">
              전체 밋업 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span aria-hidden>👋</span> 최근 가입한 노마드
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {recentMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>
                      {member.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                    {member.online && (
                      <AvatarBadge className="bg-emerald-500" />
                    )}
                  </Avatar>
                  <span className="truncate text-sm">{member.username}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-1 w-full">
              커뮤니티 둘러보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
