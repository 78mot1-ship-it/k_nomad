"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState =
  | {
      formError?: string;
      fieldErrors?: Record<string, string>;
      status?: "check-email";
      email?: string;
    }
  | undefined;

function mapAuthError(message: string): string {
  switch (message) {
    case "Invalid login credentials":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "Email not confirmed":
      return "이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.";
    case "User already registered":
      return "이미 가입된 이메일입니다.";
    default:
      return message;
  }
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { formError: "이메일과 비밀번호를 입력해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { formError: mapAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!name || !email || !password) {
    return { formError: "모든 항목을 입력해주세요." };
  }

  if (password.length < 8) {
    return { fieldErrors: { password: "비밀번호는 8자 이상이어야 합니다." } };
  }

  if (password !== passwordConfirm) {
    return {
      fieldErrors: { passwordConfirm: "비밀번호가 일치하지 않습니다." },
    };
  }

  const origin = (await headers()).get("origin");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return { formError: mapAuthError(error.message) };
  }

  if (!data.session) {
    return { status: "check-email", email };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
