// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type AdminUserBody = {
  email?: string;
  display_name?: string;
  password?: string;
  role?: "user" | "admin";
  is_member?: boolean;
  is_active?: boolean;
};

function jsonError(message: string, status = 400) {
  return Response.json({ detail: message }, { status });
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const callerId = ctx.userClaims?.id;
    if (!callerId) return jsonError("未登录", 401);

    const { data: caller, error: callerError } = await ctx.supabase
      .from("profiles")
      .select("role,is_active")
      .eq("id", callerId)
      .single();
    if (callerError || caller?.role !== "admin" || !caller.is_active) {
      return jsonError("需要管理员权限", 403);
    }

    const payload = (await req.json()) as {
      action?: "create" | "update";
      id?: string;
      body?: AdminUserBody;
    };
    const body = payload.body ?? {};

    if (payload.action === "create") {
      const email = body.email?.trim().toLowerCase();
      if (!email || !body.password || body.password.length < 6) {
        return jsonError("邮箱和至少 6 位的初始密码为必填项");
      }

      const { data, error } = await ctx.supabaseAdmin.auth.admin.createUser({
        email,
        password: body.password,
        email_confirm: true,
        user_metadata: { display_name: body.display_name?.trim() || email.split("@")[0] },
      });
      if (error || !data.user) return jsonError(error?.message || "创建用户失败");

      const { data: profile, error: profileError } = await ctx.supabaseAdmin
        .from("profiles")
        .update({
          display_name: body.display_name?.trim() || email.split("@")[0],
          role: body.role === "admin" ? "admin" : "user",
          is_member: Boolean(body.is_member),
          is_active: body.is_active !== false,
        })
        .eq("id", data.user.id)
        .select()
        .single();
      if (profileError) {
        await ctx.supabaseAdmin.auth.admin.deleteUser(data.user.id);
        return jsonError(profileError.message);
      }
      return Response.json(profile, { status: 201 });
    }

    if (payload.action === "update" && payload.id) {
      if (body.password) {
        const { error } = await ctx.supabaseAdmin.auth.admin.updateUserById(payload.id, {
          password: body.password,
        });
        if (error) return jsonError(error.message);
      }

      const profilePatch: Record<string, unknown> = {};
      for (const key of ["display_name", "role", "is_member", "is_active"] as const) {
        if (body[key] !== undefined) profilePatch[key] = body[key];
      }
      const { data: profile, error } = await ctx.supabaseAdmin
        .from("profiles")
        .update(profilePatch)
        .eq("id", payload.id)
        .select()
        .single();
      if (error) return jsonError(error.message);
      return Response.json(profile);
    }

    return jsonError("无效操作");
  }),
};
