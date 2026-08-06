"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getSupabase } from "@/lib/supabase";

function authErrorMessage(
  error: { code?: string; message?: string; status?: number },
  fallback: string,
) {
  switch (error.code) {
    case "over_email_send_rate_limit":
      return "验证邮件发送次数已达上限，请约 1 小时后再试。请勿重复提交；若仍未收到邮件，请联系管理员。";
    case "over_request_rate_limit":
      return "请求过于频繁，请等待几分钟后再试。";
    case "email_address_not_authorized":
      return "当前邮件服务暂时无法向该邮箱发送验证邮件，请联系管理员。";
    case "user_already_exists":
      return "该邮箱已注册，请直接前往登录。";
    case "email_not_confirmed":
      return "邮箱尚未验证，请先打开验证邮件完成激活。";
    case "invalid_credentials":
      return "邮箱或密码不正确。";
    default:
      if (error.status === 429 || error.message?.toLowerCase().includes("rate limit")) {
        return "操作过于频繁，请稍后再试。";
      }
      return error.message || fallback;
  }
}

export type AuthUser = {
  id: string;
  email: string;
  display_name: string;
  role: string;
  is_member: boolean;
  is_active: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  isMember: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  loginWithCode: (email: string, code: string) => Promise<void>;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  registerWithPassword: (
    email: string,
    password: string,
  ) => Promise<{ signedIn: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  sendCode: (email: string) => Promise<string>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = getSupabase();
    const { data: sessionData } = await supabase.auth.getSession();
    const authUser = sessionData.session?.user;
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id,email,display_name,role,is_member,is_active")
      .eq("id", authUser.id)
      .single();
    if (error || !profile) {
      setUser(null);
      setLoading(false);
      return;
    }
    if (!profile.is_active) {
      await supabase.auth.signOut();
      setUser(null);
      setLoading(false);
      throw new Error("账号已被停用");
    }
    setUser(profile as AuthUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Refresh synchronizes React state with the persisted Supabase session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh().catch(() => setLoading(false));
    const supabase = getSupabase();
    const { data } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void refresh().catch(() => setLoading(false)), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const sendCode = useCallback(async (email: string) => {
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    if (error) throw new Error(authErrorMessage(error, "验证码发送失败"));
    return "验证码已发送，请检查邮箱（也可能在垃圾邮件中）";
  }, []);

  const loginWithCode = useCallback(
    async (email: string, code: string) => {
      const { error } = await getSupabase().auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (error) throw new Error(authErrorMessage(error, "验证码校验失败"));
      await refresh();
    },
    [refresh],
  );

  const loginWithPassword = useCallback(
    async (email: string, password: string) => {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) throw new Error(authErrorMessage(error, "登录失败"));
      await refresh();
    },
    [refresh],
  );

  const registerWithPassword = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await getSupabase().auth.signUp({ email, password });
      if (error) throw new Error(authErrorMessage(error, "注册失败"));
      if (data.session) {
        await refresh();
        return { signedIn: true, message: "注册成功，已为你登录" };
      }
      return {
        signedIn: false,
        message: "注册成功，请前往邮箱完成验证后使用密码登录",
      };
    },
    [refresh],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user?.email) throw new Error("请先登录");
      const supabase = getSupabase();
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (verifyError) throw new Error("当前密码不正确");

      const { error } = await supabase.auth.updateUser({
        current_password: currentPassword,
        password: newPassword,
      });
      if (error) throw new Error(error.message);
    },
    [user],
  );

  const logout = useCallback(() => {
    void getSupabase().auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isLoggedIn: !!user,
      isMember: !!(user && (user.is_member || user.role === "admin")),
      isAdmin: user?.role === "admin",
      refresh,
      loginWithCode,
      loginWithPassword,
      registerWithPassword,
      changePassword,
      sendCode,
      logout,
    }),
    [
      user,
      loading,
      refresh,
      loginWithCode,
      loginWithPassword,
      registerWithPassword,
      changePassword,
      sendCode,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
