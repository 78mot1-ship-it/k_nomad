import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export async function UserMenu() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/login">로그인</Link>}
        />
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href="/register">무료 가입</Link>}
        />
      </>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "회원";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <Avatar size="sm">
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{displayName}</span>
      <form action={signOut}>
        <Button variant="ghost" size="sm" type="submit">
          로그아웃
        </Button>
      </form>
    </>
  );
}
