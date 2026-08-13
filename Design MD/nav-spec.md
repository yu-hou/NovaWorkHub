# 导航栏 · 结构层级与组件规范


---

## 一、顶层骨架

```
Window（100vw × 100vh，overflow: hidden）
└── body（背景 #ffffff，不滚动）
    └── .app-shell（height: 100vh，grid 两栏，无 gap / 无 padding）
        ├── .sidebar     248px  → Layer 2 浅灰柱侧栏（全出血）
        └── .main-panel  1fr   → Layer 3 纯白主体（全出血）
```

SVG 实测比例（1280 × 832 画布）：

| 区域 | 宽度 | 占比 |
|---|---|---|
| sidebar | 248px | 19.4% |
| main-panel | 1032px | 80.6% |

**为什么侧栏「原地不动」**：`.app-shell` 锁定 `height: 100vh`，`body` 禁止自身滚动（`overflow: hidden`），只有 `.main-panel` 设置 `overflow-y: auto`，是页面里唯一的滚动容器。这不是 `position: sticky` 的取巧，而是从根上只有一个滚动上下文——侧栏在物理意义上没有滚动。

---

## 二、Layer 1 — 画布

| 属性 | 规范值 |
|---|---|
| 背景色 | `#ffffff` 纯白 |
| 外边距 | 无（全出血，无 `--shell-gap`） |
| 是否滚动 | 不滚动（`overflow: hidden`） |

---

## 三、Layer 2 — `.sidebar` 侧栏

| 属性 | 规范值 | 来源 |
|---|---|---|
| 宽度 | **248px** | SVG 实测路径 `M0 0H248V832` |
| 内边距 | 24px 16px | |
| 背景 | `rgba(218,218,218,.20)` 极浅灰 | SVG `#DADADA fill-opacity="0.2"` |
| 模糊 | `backdrop-filter: blur(2px)` | SVG foreignObject `blur-radius="4"` ≈ CSS 2px |
| 右侧边框 | `1px solid rgba(99,99,99,.14)` | SVG v5：`#636363 fill-opacity="0.14"` 轻灰分割线 |
| 其余边框 | 无 | 全出血 |
| 圆角 | 无 | 全出血 |
| 阴影 | 无 | |
| 滚动 | 自身不滚动 | |

以下区域根据业务需求自行删减

### 3-1 Header 区

```
.sidebar-header
├── .logo-mark           40×40px，squircle（border-radius: 9999px），纯黑底，白色 outline 图标
├── .header-text（紧贴 logo 右侧，两行堆叠，行距极紧）
│   ├── .title           "Oculis"  19px / weight 700
│   └── .subtitle        邮箱      12px / color var(--body-mid)
└── .collapse-btn        最右侧，双竖条（一深一浅），视觉权重刻意压低
```

| 元素 | 规范值 |
|---|---|
| logo-mark 尺寸 | 40px |
| logo-mark 圆角 | 9999px |
| logo-mark 背景 | `var(--ink)` 纯黑 |
| logo 图标色 | `var(--on-primary)` 白 |
| title | 19px / 700 |
| subtitle | 12px / `var(--body-mid)` |
| collapse-btn | Header 行最右侧，双竖条图标 |

### 3-2 搜索框

```
.sidebar-search（整行宽度）
├── 搜索图标（左侧）
├── placeholder "Search"
└── .kbd-badge  右侧 "⌘K"，圆角小方块，深灰底，等宽字体
```

| 元素 | 规范值 |
|---|---|
| 形状 | 圆角矩形（radius: 10px） |
| 高度 | 36px |
| 背景 | `rgba(32,21,21,.07)` 浅灰内嵌层 |
| kbd-badge 背景 | `rgba(32,21,21,.12)` 略深灰 |
| kbd-badge 字体 | 11px monospace |

### 3-3 导航项列表

```
.nav-list
├── [组1 — 核心视图]
│   ├── .nav-item.active   Dashboard       ← 当前激活
│   ├── .nav-item          Performance
│   └── .nav-item          Conversations
├── .group-divider + .group-label "社群"   ← hairline + 文字标签
└── [组2 — 资源与设置]
    ├── .nav-item          Guides
    ├── .nav-item          Hotspots
    ├── .nav-item          Templates  + .badge "10"
    └── .nav-item          Feedback
```

**导航项两态：**

| 状态 | 背景 | 文字色 | 字重 |
|---|---|---|---|
| 未激活 | transparent | `var(--body)` | 500 |
| 激活 | `var(--primary)` 主题色实底 | `var(--on-primary)` 白 | 600 |
| Hover | `rgba(32,21,21,.06)` 轻灰底 | — | — |

**导航项尺寸：**

| 属性 | 规范值 |
|---|---|
| 行高 | 44px |
| 圆角 | `var(--radius-btn)` 10px |
| 图标 | 17px outline 线性 |
| 文字 | 15px |

**数量徽标（仅 Templates）：**

| 属性 | 规范值 |
|---|---|
| 形状 | pill 胶囊 |
| 背景 | `var(--primary-soft)` |
| 文字色 | `var(--primary-deep)` |
| 字号 | 11px |
| 位置 | 行尾对齐 |

---

## 四、Layer 3 — `.main-panel` 主内容区

| 属性 | 规范值 |
|---|---|
| 背景 | `#ffffff` 纯白 |
| 圆角 | 无（全出血） |
| 阴影 | 无 |
| 边框 | 无（与 sidebar 右侧边框自然分隔） |
| 滚动 | `overflow-y: auto`（页面唯一滚动容器） |

### 4-1 内嵌 Soft Card（Level 2）

主体内的次级模块用 `var(--canvas-soft)` 底色区分，不加独立投影。

```
.main-panel
└── .soft-card（背景 var(--canvas-soft)，radius 16px）
    └── 具体内容：统计格、列表行等
```

---

## 五、移动端（≤ 760px）退化规则

| 维度 | 桌面端 | 移动端 |
|---|---|---|
| 整页滚动 | 禁止 | 恢复单一滚动容器 |
| 侧栏 | 左侧固定浅灰柱 248px | `position:sticky; top:0` 吸顶，仅显示 Header |
| 侧栏背景 | `#F2F2F3` | `#F2F2F3` 保持一致 |
| 侧栏模糊 | `blur(2px)` | none（关闭） |
| 搜索框 / 导航列表 | 显示 | 隐藏 |

---

## 六、CSS Token 汇总

| Token | 当前值（v6） | 说明 |
|---|---|---|
| `--canvas-soft` | `#F2F2F3` | 侧栏背景 / Soft Card 底色（中性冷灰，替代原暖米色） |
| `--canvas` | `#ffffff` | 主体纯白 |
| `--border-soft` | `rgba(0,0,0,.08)` | 内部发丝边 |
| `--ink` | `#1a1a1c` | logo-mark 背景 / 标题色 |
| `--body` | `#3a3a3c` | 导航项文字 |
| `--body-mid` | `#8e8e93` | 次要文字（邮箱、标签） |
| `--primary` | `#7c5cfc` | 激活态实底 |
| `--primary-soft` | `#ede8ff` | badge 背景 |
| `--primary-deep` | `#5a3dd8` | badge 文字 |
| `--on-primary` | `#ffffff` | 激活态文字 / 图标 |
| `--radius-btn` | `10px` | 导航项圆角 |
| sidebar-width | **248px** | SVG 实测 |
| sidebar-background | **`#F2F2F3`** | 用户指定，中性冷灰实色 |
| sidebar-backdrop | `blur(2px)` | 轻微模糊 |
| sidebar-border-right | `1px solid rgba(99,99,99,.14)` | 轻灰分割线 |
| nav-item-height | 44px | |
| nav-item-icon | 17px outline | |
| nav-item-font | 15px / 500 | |
| active-font | 15px / 600 | |
| logo-mark-size | 40px | |
| title-font | 19px / 700 | |
| subtitle-font | 12px | |
| badge-font | 11px | |

---

## 七、演进记录

| 版本 | 核心变化 |
|---|---|
| **v1** | 两块不透明白色面板，`position: sticky` 实现侧栏不动 |
| **v2** | 侧栏改为磨砂玻璃（`blur(20px)`），`.app-shell` 锁高实现真正独立滚动，激活态改为主题色实底 |
| **v3** | 全出血布局（移除 `--shell-gap` 和圆角），侧栏改为 `rgba(218,218,218,.20)` 浅灰实色柱，移除 `backdrop-filter` |
| **v4** | 侧栏宽度修正为 248px，`backdrop-filter: blur(2px)` 轻微模糊重新加入，右侧边框改为 `rgba(0,0,0,.38)` 可见分割线 |
| **v5** | 右侧边框改为 `rgba(99,99,99,.14)` 轻灰，视觉更轻 |
| **v6（当前）** | 侧栏背景改为 `#F2F2F3` 中性冷灰实色，页面内清除所有暖灰色；文字/边框 token 同步去暖 |
