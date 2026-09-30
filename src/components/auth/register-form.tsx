"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "@/app/auth/actions";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);

  if (state?.status === "check-email") {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{state.email}</span>{" "}
          주소로 인증 메일을 보냈어요. 메일함에서 링크를 클릭해 가입을
          완료하세요.
        </p>
        <Link href="/login" className="text-sm font-medium text-primary hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          이름
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="홍길동"
          autoComplete="name"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          이메일
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          비밀번호
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="8자 이상 입력하세요"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {state?.fieldErrors?.password && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.password}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="passwordConfirm" className="text-sm font-medium">
          비밀번호 확인
        </label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {state?.fieldErrors?.passwordConfirm && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.passwordConfirm}
          </p>
        )}
      </div>

      {state?.formError && (
        <p className="text-sm text-destructive">{state.formError}</p>
      )}

      <Button type="submit" className="mt-2 h-10 w-full" disabled={isPending}>
        {isPending ? "가입 중..." : "회원가입"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
