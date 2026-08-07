"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/theme-provider";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Marquee } from "@/components/ui/marquee";
import { Meteors } from "@/components/ui/meteors";
import { Particles } from "@/components/ui/particles";
import { Ripple } from "@/components/ui/ripple";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { SparklesText } from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";

const WORKBENCH_HREF = "/home";

const MARQUEE_ITEMS = [
  "课程舱",
  "路径轨",
  "案例库",
  "活动台",
  "回放轨",
  "权益仓",
  "Agent 实战",
  "飞书文档",
  "席位权限",
];

function WorkbenchPreview({ isLight }: { isLight: boolean }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border shadow-[0_30px_80px_rgba(12,18,32,0.12)]",
        isLight
          ? "border-slate-200 bg-white"
          : "border-white/10 bg-[#0a121e] shadow-[0_30px_80px_rgba(0,0,0,0.45)]",
      )}
    >
      <BorderBeam
        size={180}
        duration={8}
        colorFrom={isLight ? "#0f8f88" : "#2dd4bf"}
        colorTo={isLight ? "#0284c7" : "#38bdf8"}
        borderWidth={1.5}
      />
      <div
        className={cn(
          "flex items-center gap-2 border-b px-4 py-3",
          isLight ? "border-slate-200" : "border-white/10",
        )}
      >
        <span className="size-2.5 rounded-full bg-[#ef7b67]" />
        <span className="size-2.5 rounded-full bg-[#e0a35a]" />
        <span className="size-2.5 rounded-full bg-[#4fbf8f]" />
        <span
          className={cn(
            "ml-3 font-mono text-[11px] tracking-wider",
            isLight ? "text-slate-400" : "text-white/40",
          )}
        >
          nova://workbench
        </span>
      </div>
      <div className="grid min-h-[220px] grid-cols-[52px_1fr]">
        <div
          className={cn(
            "flex flex-col gap-2.5 border-r p-3",
            isLight ? "border-slate-200" : "border-white/10",
          )}
        >
          {[true, false, false, false].map((on, i) => (
            <span
              key={i}
              className={cn(
                "size-7 rounded-lg",
                on
                  ? "bg-teal-500"
                  : isLight
                    ? "bg-slate-100"
                    : "bg-white/10",
              )}
            />
          ))}
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {[
            { code: "CRS", title: "课程舱", tip: "打开可学内容" },
          ].map((panel) => (
            <div
              key={panel.code}
              className={cn(
                "rounded-xl border p-4",
                isLight
                  ? "border-slate-200 bg-slate-50"
                  : "border-white/10 bg-white/5",
              )}
            >
              <p
                className={cn(
                  "font-mono text-[11px] tracking-[0.14em]",
                  isLight ? "text-teal-700" : "text-teal-300",
                )}
              >
                {panel.code}
              </p>
              <p
                className={cn(
                  "mt-2 font-[family-name:var(--font-nova-display)] text-base font-semibold tracking-tight",
                  isLight ? "text-slate-900" : "text-white",
                )}
              >
                {panel.title}
              </p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  isLight ? "text-slate-500" : "text-white/45",
                )}
              >
                {panel.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = theme === "light";
  const particleColor = isLight ? "#0f8f88" : "#2dd4bf";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "nova-landing relative min-h-dvh overflow-hidden transition-colors duration-300",
        isLight ? "bg-[#eef3f6] text-slate-900" : "bg-[#05080f] text-white",
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute inset-0",
            isLight
              ? "bg-[radial-gradient(ellipse_at_top,rgba(15,143,136,0.14),transparent_55%)]"
              : "bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.18),transparent_55%)]",
          )}
        />
        <div
          className={cn(
            "absolute inset-0",
            isLight
              ? "bg-[radial-gradient(ellipse_at_bottom_right,rgba(2,132,199,0.1),transparent_45%)]"
              : "bg-[radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,0.12),transparent_45%)]",
          )}
        />
        {mounted ? (
          <Particles
            className="absolute inset-0"
            quantity={isLight ? 90 : 140}
            ease={70}
            color={particleColor}
            refresh
          />
        ) : null}
        <Meteors
          number={isLight ? 10 : 18}
          className={isLight ? "opacity-40" : undefined}
        />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <BlurFade delay={0.05}>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-9 place-items-center rounded-lg font-[family-name:var(--font-nova-display)] text-sm font-extrabold tracking-tight",
                isLight
                  ? "bg-slate-900 text-teal-300"
                  : "bg-teal-400 text-[#04110f]",
              )}
            >
              N
            </span>
            <div className="leading-tight">
              <p className="font-[family-name:var(--font-nova-display)] text-lg font-bold tracking-tight">
                Nova
              </p>
              <p
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.16em]",
                  isLight ? "text-teal-700/80" : "text-teal-300/80",
                )}
              >
                Workbench
              </p>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={0.1}>
          <ThemeToggle />
        </BlurFade>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-88px)] w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-6">
        <div className="mx-auto max-w-3xl text-center">
          <BlurFade delay={0.12}>
            <div
              className={cn(
                "mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur",
                isLight
                  ? "border-slate-200 bg-white/70"
                  : "border-white/10 bg-white/5",
              )}
            >
              <span className="size-1.5 rounded-full bg-teal-500 shadow-[0_0_12px_#2dd4bf]" />
              <AnimatedGradientText
                speed={1.2}
                colorFrom={isLight ? "#0f766e" : "#2dd4bf"}
                colorTo={isLight ? "#0369a1" : "#38bdf8"}
                className="text-xs font-medium tracking-wide"
              >
                Nova 工作台 · AI 实战桌面
              </AnimatedGradientText>
            </div>
          </BlurFade>

          <BlurFade delay={0.22}>
            <h1 className="font-[family-name:var(--font-nova-display)] text-5xl font-extrabold tracking-[-0.06em] text-balance sm:text-6xl md:text-7xl">
              <SparklesText
                className={cn(
                  "inline-block",
                  isLight ? "text-slate-900" : "text-white",
                )}
                colors={{
                  first: isLight ? "#0f8f88" : "#2dd4bf",
                  second: isLight ? "#0284c7" : "#38bdf8",
                }}
                sparklesCount={8}
              >
                Nova
              </SparklesText>
              <span
                className={cn(
                  "mt-2 block",
                  isLight ? "text-slate-700" : "text-white/90",
                )}
              >
                工作台
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.34}>
            <p
              className={cn(
                "mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty sm:text-lg",
                isLight ? "text-slate-600" : "text-white/60",
              )}
            >
              把课程、路径与案例收成一张可开工的桌面。进入工作台，按任务打开，用 Agent
              做出结果。
            </p>
          </BlurFade>

          <BlurFade delay={0.46}>
            <div className="relative mx-auto mt-10 flex h-40 w-full max-w-md items-center justify-center">
              <Ripple
                className={isLight ? "opacity-30" : "opacity-50"}
                mainCircleSize={100}
                mainCircleOpacity={0.2}
                numCircles={5}
              />
              <ShimmerButton
                className={cn(
                  "relative z-10 h-14 px-8 text-base font-semibold",
                  isLight
                    ? "shadow-[0_0_36px_rgba(15,143,136,0.22)]"
                    : "shadow-[0_0_40px_rgba(45,212,191,0.25)]",
                )}
                background={
                  isLight
                    ? "linear-gradient(135deg, #0f8f88, #0c1220)"
                    : "linear-gradient(135deg, #0f8f88, #0c1220)"
                }
                shimmerColor="#5eead4"
                borderRadius="14px"
                onClick={() => router.push(WORKBENCH_HREF)}
              >
                <span className="flex items-center gap-2">
                  进入工作台
                  <ArrowRight className="size-4" />
                </span>
              </ShimmerButton>
            </div>
          </BlurFade>
        </div>

        <BlurFade delay={0.58} className="mt-6">
          <WorkbenchPreview isLight={isLight} />
        </BlurFade>

        <BlurFade delay={0.7} className="mt-12">
          <div className="relative overflow-hidden">
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r to-transparent",
                isLight ? "from-[#eef3f6]" : "from-[#05080f]",
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l to-transparent",
                isLight ? "from-[#eef3f6]" : "from-[#05080f]",
              )}
            />
            <Marquee pauseOnHover className="[--duration:28s] [--gap:2rem]">
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={item}
                  className={cn(
                    "rounded-full border px-4 py-1.5 font-mono text-xs tracking-[0.14em] uppercase",
                    isLight
                      ? "border-slate-200 bg-white/80 text-slate-500"
                      : "border-white/10 bg-white/5 text-white/55",
                  )}
                >
                  {item}
                </span>
              ))}
            </Marquee>
          </div>
        </BlurFade>
      </main>
    </div>
  );
}
