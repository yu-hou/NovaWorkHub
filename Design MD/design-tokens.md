# Design Tokens

> 汇总自 `nav-spec.md` + `卡片组件设计规范.md`，覆盖颜色与字体两个维度。
> 所有 token 以 CSS 自定义属性形式定义，可直接引入项目。

---

## 一、颜色 Color Tokens

### 1.1 画布 / 背景层

| Token | 值 | 用途 | 来源 |
|---|---|---|---|
| `--color-canvas` | `#FFFFFF` | 主体纯白背景 | 导航栏 main-panel |
| `--color-canvas-soft` | `#F2F2F3` | 侧栏 / Soft Card 底色（中性冷灰） | 导航栏 sidebar |
| `--color-canvas-card` | `#FAFAFB` | 内容卡片背景 | 卡片组件 |
| `--color-canvas-image` | `#DEDEDE` | 图片占位背景 | 卡片组件 |

### 1.2 文字层

| Token | 值 | 用途 | 来源 |
|---|---|---|---|
| `--color-text-ink` | `#1A1A1C` | 最高权重文字 / logo-mark 背景 | 导航栏 |
| `--color-text-primary` | `#000000` | 卡片标题 | 卡片组件 |
| `--color-text-body` | `#3A3A3C` | 导航项正文 | 导航栏 |
| `--color-text-secondary` | `#181818` | 数据统计数字 | 卡片组件 |
| `--color-text-tertiary` | `#666666` | 描述文字 / 次要说明 | 卡片组件 |
| `--color-text-mid` | `#8E8E93` | 邮箱、标签等弱化文字 | 导航栏 subtitle |
| `--color-text-tag` | `#3C3C43` | 浮层标签文字 | 卡片组件 |
| `--color-text-on-primary` | `#FFFFFF` | 主色背景上的文字 / 图标 | 导航栏激活态、卡片按钮 |

### 1.3 品牌 / 交互色

| Token | 值 | 用途 | 来源 |
|---|---|---|---|
| `--color-primary` | `#7C5CFC` | 导航激活态实底、主题色 | 导航栏 |
| `--color-primary-soft` | `#EDE8FF` | badge 背景 | 导航栏 |
| `--color-primary-deep` | `#5A3DD8` | badge 文字 | 导航栏 |
| `--color-action` | `#3C3C43` | 卡片主按钮背景 / 描边 | 卡片组件 |

### 1.4 边框 / 分割线

| Token | 值 | 用途 | 来源 |
|---|---|---|---|
| `--color-border-soft` | `rgba(0, 0, 0, 0.08)` | 内部发丝边 | 导航栏 |
| `--color-border-sidebar` | `rgba(99, 99, 99, 0.14)` | 侧栏右侧分割线 | 导航栏 |
| `--color-border-action` | `#3C3C43` | 卡片按钮描边 | 卡片组件 |
| `--color-border-card` | `rgba(99, 99, 99, 0.14)` | 卡片外边框 Inside 0.5px | 卡片组件 |

### 1.5 覆盖层 / 模糊

| Token | 值 | 用途 | 来源 |
|---|---|---|---|
| `--color-sidebar-bg` | `rgba(218, 218, 218, 0.20)` | 侧栏磨砂层（不用实色时） | 导航栏 v3 |
| `--color-search-bg` | `rgba(32, 21, 21, 0.07)` | 搜索框背景 | 导航栏 |
| `--color-kbd-bg` | `rgba(32, 21, 21, 0.12)` | kbd 徽标背景 | 导航栏 |
| `--color-hover` | `rgba(32, 21, 21, 0.06)` | 导航项 Hover 态背景 | 导航栏 |
| `--color-canvas-tag` | `#FFFFFF` | 卡片浮层标签背景（纯白） | 卡片组件 |

---

## 二、字体 Typography Tokens

### 2.1 字体族

| Token | 值 | 用途 |
|---|---|---|
| `--font-display` | `'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif` | 标题、logo |
| `--font-mono` | `'Source Code Pro', monospace` | 标签、数据、描述、按钮 |

### 2.2 字阶 & 行高

| Token | 字号 | 行高 | 字重 | 用途 | 来源 |
|---|---|---|---|---|---|
| `--type-logo-title` | 19px | — | 700 | 侧栏产品名 | 导航栏 |
| `--type-headline` | 18px | 21px | 510 | 卡片标题 | 卡片组件 |
| `--type-nav` | 15px | 44px | 500 | 导航项正文 | 导航栏 |
| `--type-nav-active` | 15px | 44px | 600 | 导航项激活态 | 导航栏 |
| `--type-body` | 14px | 18px | 400 | 卡片描述、统计数字 | 卡片组件 |
| `--type-label` | 12px | 15px | 400 | 卡片标签、按钮文字 | 卡片组件 |
| `--type-subtitle` | 12px | — | 400 | 侧栏邮箱、次要信息 | 导航栏 |
| `--type-badge` | 11px | — | 400 | 数量徽标、kbd 提示 | 导航栏 |

---

## 三、完整 CSS 变量定义

```css
:root {
  /* ── 画布 / 背景 ── */
  --color-canvas:          #FFFFFF;
  --color-canvas-soft:     #F2F2F3;
  --color-canvas-card:     #FAFAFB;
  --color-canvas-image:    #DEDEDE;
  --color-canvas-tag:      #FFFFFF;

  /* ── 文字 ── */
  --color-text-ink:        #1A1A1C;
  --color-text-primary:    #000000;
  --color-text-body:       #3A3A3C;
  --color-text-secondary:  #181818;
  --color-text-tertiary:   #666666;
  --color-text-mid:        #8E8E93;
  --color-text-tag:        #3C3C43;
  --color-text-on-primary: #FFFFFF;

  /* ── 品牌 / 交互 ── */
  --color-primary:         #7C5CFC;
  --color-primary-soft:    #EDE8FF;
  --color-primary-deep:    #5A3DD8;
  --color-action:          #3C3C43;

  /* ── 边框 / 分割线 ── */
  --color-border-soft:     rgba(0, 0, 0, 0.08);
  --color-border-sidebar:  rgba(99, 99, 99, 0.14);
  --color-border-action:   #3C3C43;
  --color-border-card:     rgba(99, 99, 99, 0.14);

  /* ── 覆盖层 ── */
  --color-sidebar-bg:      rgba(218, 218, 218, 0.20);
  --color-search-bg:       rgba(32, 21, 21, 0.07);
  --color-kbd-bg:          rgba(32, 21, 21, 0.12);
  --color-hover:           rgba(32, 21, 21, 0.06);

  /* ── 字体族 ── */
  --font-display: 'SF Pro', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    'Source Code Pro', monospace;

  /* ── 字阶 ── */
  --type-logo-title-size:    19px;
  --type-logo-title-weight:  700;

  --type-headline-size:      18px;
  --type-headline-height:    21px;
  --type-headline-weight:    510;

  --type-nav-size:           15px;
  --type-nav-height:         44px;
  --type-nav-weight:         500;
  --type-nav-active-weight:  600;

  --type-body-size:          14px;
  --type-body-height:        18px;
  --type-body-weight:        400;

  --type-label-size:         12px;
  --type-label-height:       15px;
  --type-label-weight:       400;

  --type-badge-size:         11px;
  --type-badge-weight:       400;
}
```

---

## 四、Token 映射速查

```
品牌色阶
  深 --color-primary-deep  #5A3DD8
  主 --color-primary       #7C5CFC
  浅 --color-primary-soft  #EDE8FF

文字色阶（深 → 浅）
  #000000  --color-text-primary    卡片大标题
  #1A1A1C  --color-text-ink        logo / 顶层标题
  #181818  --color-text-secondary  数据数字
  #3A3A3C  --color-text-body       导航正文
  #3C3C43  --color-text-tag        标签 / action 元素
  #666666  --color-text-tertiary   描述文字
  #8E8E93  --color-text-mid        弱化信息
  #FFFFFF  --color-text-on-primary 反白文字

背景色阶（深 → 浅）
  #F2F2F3  --color-canvas-soft     侧栏 / Soft Card
  #FAFAFB  --color-canvas-card     内容卡片
  #FFFFFF  --color-canvas          主体纯白

字号阶梯
  19px  --type-logo-title   产品名
  18px  --type-headline     大标题
  15px  --type-nav          导航
  14px  --type-body         正文
  12px  --type-label        标签 / 按钮
  11px  --type-badge        徽标
```
