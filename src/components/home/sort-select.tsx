"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortLabels: Record<string, string> = {
  rating: "정렬: 평점순",
  cost: "정렬: 비용순",
  internet: "정렬: 인터넷속도순",
  reviews: "정렬: 리뷰많은순",
};

export function SortSelect() {
  return (
    <Select defaultValue="rating">
      <SelectTrigger size="sm" className="rounded-full bg-background">
        <SelectValue>{(value: string) => sortLabels[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="rating">평점순</SelectItem>
        <SelectItem value="cost">비용순</SelectItem>
        <SelectItem value="internet">인터넷속도순</SelectItem>
        <SelectItem value="reviews">리뷰많은순</SelectItem>
      </SelectContent>
    </Select>
  );
}
