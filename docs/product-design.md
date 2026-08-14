# CreatiScout 产品设计方案 v1

> 一句话定位：让品牌方"派活儿给数字员工"，数字员工自动跑通从 brief → 达人 → 内容 → 投放 → 复盘的完整 KOL 营销链路；关键卡点回到人工确认。

---

## 0. 核心心智

整个产品围绕一个动作展开：**派活儿**。

- 用户进入产品的第一件事不是看报表，而是"告诉员工要做什么"。
- 员工(数字员工)是真正在干活的执行者，campaign / 邮件 / 达人合作都是员工的产物。
- 用户的角色更像"老板 + 终审"：派活、看进度、在关键卡点拍板。

---

## 1. 全局信息架构（业务侧边栏）

宽度沿用现有 220px、白底、左侧主导航。从上到下：

| 顺序 | 名称 | 图标 | 视觉特殊处理 | 作用 |
|---|---|---|---|---|
| 1 | **新建任务** | `fa-plus` | **品牌色实心胶囊按钮** (`bg-brand text-white`)，比其他 nav 更突出 | 全局 CTA，唤起右侧 Chat 抽屉 |
| 2 | Dashboard 总览 | `fa-home` | 普通 nav | 跨项目健康度 + 待处理卡点 |
| 3 | Campaigns 管理 | `far fa-file-alt` | 普通 nav | 项目列表 + 详情抽屉 |
| 4 | Tracking 竞品追踪 | `fa-binoculars` | 普通 nav | 跟踪竞品 campaign / 达人 / 内容 |
| 5 | Context Lab | `fa-flask` | 普通 nav | 合作达人视频内容档案与拆解 |
| 6 | 私域达人池 | `fa-users` | 普通 nav | 已合作达人 CRM |
| 7 | 邮件中心 | `far fa-envelope` | 普通 nav，右侧未读小红点 | 收发邮件 + 数据统计 |
| ── | 分割线 | `border-t border-border` + `my-3` | —— | 业务 / 员工边界 |
| 8 | **数字员工** | `far fa-smile` | 普通 nav + 在线小绿点 | 进入员工空间（**整体替换侧边栏**） |

**底部不动**：保留品牌 Logo、当前账户、Settings/Notification/Logout。

**视觉规则**：
- 当前选中项沿用现有 `bg-soft-pink text-brand` 模式。
- "新建任务" 因为是 CTA，永远是品牌色（不参与选中态高亮）。

---

## 2. 新建任务 · Chat 抽屉

### 触发与布局
- 点击侧边栏顶部"新建任务"，**从右侧滑入**一个 chat 抽屉，宽度 `min(720px, 45vw)`。
- **左侧页面不被遮罩**（关键），用户能看到 Campaign 列表实时新增的卡片。
- 抽屉有阴影 + `border-l border-border`，背景 `bg-surface`。

### 结构
```
┌──────────────────────────────────────┐
│ ← 关闭        新建任务         ⋯    │ ← Header (56px)
│ 派给：[ Lucy · 内容运营专员 ▾ ]      │ ← 员工选择条 (44px)
├──────────────────────────────────────┤
│  💬 用户气泡（右对齐，灰底）          │
│  🤖 员工气泡（左对齐，白底+边）      │
│       ┌──────────────────────┐       │
│       │ ✨ 我已创建 "618 美妆" │      │ ← 富预览卡片
│       │ 预算 ¥50k · 5/20 截止 │       │
│       │ [打开 Campaign →]    │       │
│       └──────────────────────┘       │
│  💬 用户："再加个寄样要求"             │
│  🤖 已为 campaign 开启寄样管理 ✓     │
│                                      │
│  ⏳ 员工正在思考…（typing）          │
├──────────────────────────────────────┤
│ 📎 [输入框：说说要做什么…]      ↑ 送出 │
└──────────────────────────────────────┘
```

### 员工气泡的富预览
员工的回复不只是文字，可以渲染**可点击的产物卡片**：
- 新建 Campaign → "campaign 卡"，点击直接打开右侧大抽屉
- 起草邮件 → "邮件卡"，点击跳邮件中心
- 拉达人候选 → "达人卡列表"，可在气泡内 ✓/✗ 快速勾选

### 左侧实时联动
员工每完成一个动作，左侧 Campaign 列表/邮件列表会**实时出现一行新数据**，带 `✨ 新建中` shimmer 高亮 3 秒后归于常态。这是"派活儿"心智的视觉锚点。

### 与"对话任务"的边界（重要）
- **新建任务 Chat 抽屉 = 一次性派活入口**，关闭就结束，对话不持久化在主导航。
- **数字员工空间 · 对话任务** = 历史对话归档，每条都是一次派活记录，可回溯、可继续。
- 抽屉关闭后会询问"保存这次对话到 Lucy 的对话任务？"，默认是。

---

## 3. Dashboard · 总览

定位：**老板视角**，跨所有 campaign 看健康度和卡点。

页面从上到下：

1. **Hero 区**：沿用现有"KOL Ops Employee is working"，但改成总览口径
   - "今天 3 位员工在班，处理中 8 个 campaign，需要你的确认 4 项"
   - 右侧 3 张 KPI 卡复用：本周新触达达人 / 进入合作 / 视频已发布

2. **待处理卡点（最重要）**
   - 跨 campaign 聚合所有"等人工确认"的事项
   - 复用现有 Approval Queue 卡片样式
   - 每行：图标 + 项目名 · 卡点类型（视频审核/合作确认/超预算报价） + 头像组 + Approve/Review/Ask why

3. **Campaign 健康度概览**
   - 3 张状态卡：🟢 健康 N 个 / 🟡 注意 N 个 / 🔴 风险 N 个
   - 点击展开看具体 campaign + 风险原因（如"3 天无回复达人 5 个"）

4. **本周交付节点**
   - 时间轴 mini 图，看本周哪些视频要发、哪些 campaign 要结案

5. **邮件互动统计**
   - 本周发出 / 回复率 / 平均回复时长，3 个数字 + 折线小图
   - 点击进邮件中心

6. **达人漏斗**
   - 私域池 N → 本月触达 N → 进入合作 N → 已交付 N
   - 漏斗图形式

7. **底部**：保留 Creator Opportunities 推荐入池

---

## 4. Campaigns · 管理

### 列表视图
顶部工具条：
- 左：状态 filter chips（全部 / 进行中 / 暂停 / 已完成）+ 负责员工筛选 + 时间范围
- 中：搜索框
- 右：`+ 新建` 按钮（也唤起 Chat 抽屉）

表格列：

| Campaign 名称 | 状态 | 时间 | 负责人 | 提报 | 合作中 | 已交付 | 最后更新 |
|---|---|---|---|---|---|---|---|
| 618 美妆联名 ✨ | `Live` (绿) | 5/20–6/30 | 👤 Lucy | 32 | 18 | 7 | 12 分钟前 |
| 520 礼盒种草 | `Outreach` (蓝) | 4/15–5/25 | 👤 Mia | 56 | 12 | 0 | 2 小时前 |

状态色复用现有 palette：
- 进行中 → `soft-teal / teal-text`
- 外联中 → `soft-blue / blue-text`
- 暂停 → `soft-amber / amber-text`
- 已完成 → 灰
- 风险 → `soft-pink / brand`

**整行可点**，点击从右侧滑出**大抽屉**（见下一节）。

---

## 5. Campaign 详情大抽屉（核心组件）

### 整体布局
- 从右侧滑出，宽度 `calc(100vw - 220px - 32px)`，几乎占满主区
- Sticky Header：← 返回 · Campaign 名 · 状态 pill · mini-pipeline 进度（7 个小圆点） · ⋯ · 关闭
- Body：左右两栏 `grid-cols-[360px_1fr]`，中间 `border-r`

### 左栏 · Campaign 基本信息（360px 固定）
从上到下：

1. **封面 + 名字 + 状态**
2. **关键字段卡**（可点编辑）
   - 预算：¥50,000（已用 ¥32,400）+ 进度条
   - 周期：5/20 – 6/30
   - 负责员工：Lucy 👤
   - 平台：TikTok US / 小红书
3. **Brief 摘要**（折叠，点开看全文）
4. **两个开关**（视觉用 `bg-soft-pink` 卡包起来强调）
   ```
   ┌──────────────────────────────┐
   │ ⚙️ Campaign 能力             │
   │  寄样管理            ⚪️→🟢  │  默认关
   │  视频发布回传 ad code  🟢   │  默认开
   └──────────────────────────────┘
   ```
   开启寄样 → 右侧 step pipeline 出现第 5 步；关闭 ad code → 第 6 步去掉最后一个子 tab
5. **员工工作流（Activity Feed）**
   - 时间倒序，员工每次自动动作 + 用户每次确认都留痕
   - "Lucy 起草 12 封外联邮件 · 等待你审核 →"
   - "你批准了 5 位达人进入合作 · 2h ago"

### 右栏 · 7 步 Pipeline

#### 顶部 Step Tabs
横向 7 个 tab（参考图2的 step 样式）：
```
[ Brief 理解 ✓ ]→[ 达人匹配 ✓ ]→[ 达人建联 ● ]→[ 确认合作 ]→[ 寄样管理 ]→[ 素材产出 ]→[ 效果监控 ]
```
- `✓` 已完成（绿底）
- `●` 当前进行中（品牌色实底）
- 空圆 = 未开始
- **第 5 步**根据"寄样管理"开关存在 / 灰显
- **第 6 步**最后一个子 tab 根据"ad code"开关存在 / 隐藏

#### Step 内容区
每个 step 顶部一张"状态条"：
- 左：员工执行状态 `🤖 Lucy 已自动完成 · 查看产物` / `🤖 Lucy 正在跑（estimated 5 min）`
- 右：操作按钮
  - 自动步骤：`查看产物`（默认完成进下一步）
  - 人工卡点步骤：`✅ 确认并进入下一步`（必须点）

#### 各 Step 内容

**Step 1 · Brief 理解**（自动）
- 员工产物：从 brief 提取的卖点、目标人群、调性、必踩点、绝对不能踩的红线
- 用户可以微调，保存即进入下一步

**Step 2 · 达人匹配**（自动 + 人工批量勾选）
- 顶部 toggle：`⚙️ 从私域达人池优先`（默认开）
- 候选达人卡片网格，每卡：头像 / 粉丝量 / 互动率 / 与 brief 契合度 / "为什么推荐"
- 批量勾选 → 加入下一步外联

**Step 3 · 达人建联**（自动 + 人工卡点 = 转人工时）

- 顶部设置区：
  ```
  💰 报价天花板：¥8,000 / 条     超出自动转人工 ✓
  ```
- 主区 = **左右时间线视图**
  - 左：达人列表（带当前阶段标签：1轮报价 / 2轮 / 最终 / 转人工 / 成单）
  - 右：选中达人的**报价时间线**（垂直），每条是一次报价交互：
    ```
    ●─── 第一轮：员工发出 ¥6,000 → 达人回 ¥9,000   ↑超天花板
    │     [自动转人工 · 等你处理]
    │
    ●─── 第二轮：你发出 ¥7,500 → 达人回 ¥8,000
    │
    ●─── 最终：成单 ¥8,000 ✓
    ```
- 子 tab：第一轮报价 / 第二轮报价 / 最终报价 / 转人工，用于在左侧达人列表上做筛选

**Step 4 · 确认合作**（**人工卡点**）
- 表格：达人 / 最终报价 / 合同状态 / 寄样地址（如开启）
- 批量"✅ 确认合作"按钮，签完合同进入下一步

**Step 5 · 寄样管理**（条件出现）
- 三列卡片：待发出 / 在途 / 已签收
- 每张卡：达人 / 物流单号 / 时间线（含物流轨迹）
- 异常自动飘红：3 天未更新 / 退回

**Step 6 · 素材产出**（混合）
二级 tab：
1. **素材下发** — 给达人发 brief 包 / 拍摄要求 / 参考视频
2. **产出回收** — 达人提交的视频草稿，时间轴展示
3. **视频审核**（**人工卡点**） — 视频播放器 + 批注 + 通过 / 打回
4. **视频发布 ad code 回传**（条件出现，**人工卡点**） — 输入 ad code → 自动绑定到效果监控

**Step 7 · 效果监控**（自动看板）
- 全 campaign 数据：曝光 / 互动 / GMV / ROI
- 每达人单条视频表现 + 与同档达人对比
- 异常预警："3 个视频 ROI 低于 0.5x，要补流量？"

---

## 6. Tracking · 竞品追踪

短描述：跟踪你设置的"竞品品牌 / 竞品 campaign / 竞品达人"，员工每日跑数据。

主结构：
- 左：竞品列表（品牌 logo + 监测维度）
- 右：选中竞品的最新动态时间线（"X 品牌新合作了 5 位美妆达人 / Y 品牌投放新素材"）+ 数据对比图

按需可发起"复制策略"派活给员工。

---

## 7. Context Lab · 合作达人内容档案

短描述：所有合作过的达人的视频素材都沉淀在这里，员工自动拆解。

主结构：
- 顶部筛选：品类 / 平台 / 时间 / ROI 区间
- 主区：视频卡网格，每卡播放器 + AI 拆解标签（开头 hook / 卖点植入位置 / 情绪曲线 / CTA 类型）
- 点击卡片进详情：脚本逐句标注 + 高光帧 + 类似爆款建议
- 顶栏 CTA：`复用 pattern 生成新 brief →` 直接派活给员工创新 campaign

---

## 8. 私域达人池

短描述：合作过的达人 CRM。

表格列：
头像 · 昵称 · 平台 · 粉丝量 · 标签（自动+手动） · 合作 campaign 数 · 历史平均报价 · 平均 ROI · 最近合作 · 关系热度

筛选 / 分组 / 导出。
点击行 → 达人详情抽屉（合作历史、报价记录、内容档案直跳 Context Lab）。

---

## 9. 邮件中心

顶部 Tab：**收件箱 · 草稿 · 已发 · 数据统计**

- 收件箱：三栏布局（文件夹/标签 · 邮件列表 · 邮件正文+AI 起草回复建议）
- 草稿：员工写的待发送邮件，批量 Approve
- 已发：发件记录 + 打开/回复状态
- 数据统计：发送量 / 打开率 / 回复率 / 平均回复时长 / 按 campaign 拆分

---

## 10. 数字员工空间（侧边栏替换模式）

### 入口
业务侧边栏底部"数字员工"→ 进入员工**列表页**（不替换侧边栏）。
点击某一个员工头像/卡片 → **整体侧边栏被替换**为员工侧边栏。

### 员工列表页（中间区域）
- 顶部：`+ 添加员工` （从角色模板选）
- 网格卡片：每张 = 一个员工
  ```
  ┌─────────────────────────┐
  │ 👤 Lucy            🟢   │
  │ 内容运营专员             │
  │ 入职 38 天               │
  │ 在跑 3 个项目            │
  │ ────────────────────    │
  │ 技能：脚本 / 评论 / brief │
  └─────────────────────────┘
  ```

### 员工工作区（参考图1，1:1 还原）

侧边栏替换为：
- ← **返回对话**（最顶，回业务模式）
- 👤 员工名 + 头像
- ─
- 🏠 首页
- 📁 项目
- 🕒 自动任务
- 💬 对话任务
- 🧠 记忆
- ✨ 技能
- 🔌 连接器
- 💬 IM
- 🔒 权限

#### 各页面要点

**首页** = 图1 的样式
- 顶部员工大卡：头像 + 名字 + 角色 + 在线状态 + 入职时间 + 简介 + 编辑
- 工作记录时间线视图（贡献热力图风格）
- 4 个统计数：入职天数 / 自动任务 / 对话任务 / 已创建的项目
- 记忆与积累卡片（最近学会的技能）

**项目** = **项目挂靠 = 权限**
- 表格：项目名 / 角色（owner / 协作） / 加入时间
- `+ 挂靠新项目` 按钮：等于"授予 Lucy 读这个项目所有信息的权限"
- 用户在新建 campaign 时也可直接指派员工，会自动挂靠

**自动任务**
- 员工设置的定时任务（如"每周一拉一次竞品 TOP 视频"）
- 列表：任务名 / 频率 / 上次执行 / 状态

**对话任务**
- 历史 Chat 抽屉对话归档
- 每条 = 一次派活记录（包含产生的产物链接），可继续对话

**记忆**
- 员工对项目 / 偏好 / 历史决策的记忆条目
- 用户可手动加 / 编辑 / 删除

**技能**
- 能力清单（脚本生成 / brief 解析 / 评论回复…）
- 可启停，可加新技能

**连接器**
- 接入的工具：飞书邮箱 / TikTok 后台 / 物流 API …

**IM**
- 即时聊天，比 Chat 抽屉更轻，适合日常沟通

**权限**
- 这位员工能看 / 能改的项目和数据范围

### 返回对话
点击 ← 返回对话，恢复业务侧边栏，回到员工列表页或上一个业务页面。

---

## 11. 三个核心用户动线

### 动线 A：新员工首日 → 落地一个 campaign

1. 用户进入产品，点侧边栏顶部 **新建任务**
2. 右侧 Chat 抽屉滑出，选员工 = Lucy
3. 用户输入："帮我建一个 618 美妆联名 campaign，预算 5 万，5/20 上线"
4. Lucy 回复确认细节，气泡里渲染"campaign 卡"
5. **左侧 Campaign 列表实时多出一行，✨ 高亮**
6. 用户点开新 campaign → 右侧大抽屉打开
7. 看到 Step 1 (Brief 理解) 已自动完成，Step 2 (达人匹配) 正在跑
8. 几分钟后回到 Dashboard，"待处理卡点" 出现"Lucy 推荐 18 位达人，等你审核"
9. 用户批量勾选 12 位 → 进入 Step 3 自动开始外联

### 动线 B：查看进行中 campaign 卡在哪 → 处理卡点

1. 用户进 Dashboard
2. "待处理卡点"区显示 4 项，其中一条是"618 美妆 · 视频审核 3 条"
3. 点击 → 直接打开 618 美妆 campaign 抽屉，定位到 Step 6 → 视频审核子 tab
4. 视频播放器，看 3 条视频
5. 2 条通过 → 自动推进；1 条打回 → 写批注 → 员工自动回复达人改稿
6. 关抽屉回 Dashboard，卡点数 4 → 3

### 动线 C：从 Context Lab 发现 pattern → 复制

1. 用户进 Context Lab
2. 筛 "美妆 + ROI > 3x" → 6 条爆款
3. 点开一条，看 AI 拆解："3 秒 hook + 痛点放大 + 解法 + 价格锚 + 紧迫感"
4. 顶部点 `复用 pattern 生成新 brief →`
5. **自动唤起新建任务 Chat 抽屉**，预填这个 pattern 作为 brief 参考
6. 用户补一句"用在我们 618 美妆上"
7. Lucy 接活，生成新 brief，挂到 618 campaign Step 1

---

## 12. 实施分期

| Phase | 范围 | 目标 |
|---|---|---|
| **P1 · 骨架** | 侧边栏 IA 改造、Dashboard 改总览口径、Campaigns 列表、新建任务 Chat 抽屉（基础版） | 让"派活儿"心智跑通；用户可建 campaign 并看到列表 |
| **P2 · 核心** | Campaign 详情大抽屉 + 7 步 Pipeline 完整体（含两个开关、达人建联时间线、素材产出二级 tab、自动/人工卡点） | KOL 营销主链路闭环 |
| **P3 · 配套** | Tracking、Context Lab、私域达人池、邮件中心、数字员工空间（员工列表 + 单员工工作区） | 完整产品形态，可对外演示 |

---

## 13. 文件结构建议

当前 `index.html` 是单文件 658 行。建议在 P1 阶段就拆分，避免 P2 之后无法维护：

```
creatiscout-app/
├── index.html              # Dashboard 总览（默认入口）
├── pages/
│   ├── campaigns.html      # Campaigns 列表
│   ├── tracking.html
│   ├── context-lab.html
│   ├── pool.html           # 私域达人池
│   ├── mail.html
│   ├── employees.html      # 员工列表
│   └── employee.html       # 员工工作区
├── partials/
│   ├── sidebar-business.html
│   ├── sidebar-employee.html
│   ├── topbar.html
│   ├── drawer-new-task.html       # 新建任务 Chat 抽屉
│   └── drawer-campaign.html       # Campaign 详情大抽屉
├── assets/
│   ├── tokens.css          # 抽出 Tailwind config 里的 brand / soft-* tokens
│   └── ui.js               # 抽屉开关、step 切换、shimmer 动效
└── docs/
    └── product-design.md   # 本文件
```

复用现有 design tokens：
- `brand #FF3F78` / `ink #111827` / `slate #667085` / `soft-pink/teal/blue/amber/lavender`
- 状态 pill 规范、Approval Queue 行、Creator Card 都直接复用

---

## 14. 技术栈

### 框架与运行时
- **Next.js 15 (App Router)** + **React 19** + **TypeScript 5**
- 默认 RSC，交互组件标 `"use client"`；不强追 SSR，原型期主要走 CSR + 静态

### UI 与样式
- **Tailwind CSS** 沿用现有 design tokens（brand / soft-* / text-*）
- **shadcn/ui**（Radix 底座）：Drawer、Dialog、DropdownMenu、Tabs、Switch、Popover、Tooltip、Toast、Avatar、Badge、Select
- **Lucide React** 替代 FontAwesome
- **Framer Motion** 抽屉滑入、Chat 气泡逐条、Step 切换、shimmer

### 状态与数据
- **Zustand** 管全局 UI 状态（抽屉开关、当前选中员工、Chat session）
- **TanStack Query** 管"服务端"状态（campaigns、employees、creators…），原型期接 mock API
- **TanStack Table v8** 用于 Campaigns、私域达人池、邮件列表
- **dnd-kit** 用于 Step Pipeline 内部的看板、邮件附件拖拽

### 后端与 AI
- **Next.js Route Handlers**（`app/api/*`）+ **MSW** 浏览器 mock，原型期不接真后端
- **Vercel AI SDK** + **Anthropic Claude**（数字员工大脑），P3 接入；P1/P2 用脚本化 mock 回复

### 工程化
- **pnpm** 包管理
- **Biome** lint + format（替代 ESLint/Prettier）
- **next-intl** i18n 框架预留（原型期只放中文文案）
- **Husky + lint-staged** 后续加，原型期可缓

### 部署
- **Vercel** 一键部署

### 目录结构

```
creatiscout-app/
├── app/
│   ├── (business)/                # 业务侧边栏布局组
│   │   ├── layout.tsx             # SidebarBusiness + Topbar
│   │   ├── page.tsx               # Dashboard 总览
│   │   ├── campaigns/page.tsx
│   │   ├── tracking/page.tsx
│   │   ├── context-lab/page.tsx
│   │   ├── pool/page.tsx
│   │   └── mail/page.tsx
│   ├── employees/                 # 数字员工列表（共用业务侧边栏）
│   │   └── page.tsx
│   ├── (employee)/                # 员工空间布局组（侧边栏替换）
│   │   ├── layout.tsx             # SidebarEmployee
│   │   └── employee/[id]/
│   │       ├── page.tsx           # 首页
│   │       ├── projects/page.tsx
│   │       ├── auto-tasks/page.tsx
│   │       ├── chats/page.tsx
│   │       ├── memory/page.tsx
│   │       ├── skills/page.tsx
│   │       ├── connectors/page.tsx
│   │       ├── im/page.tsx
│   │       └── permissions/page.tsx
│   ├── api/                       # Mock route handlers
│   ├── globals.css
│   └── layout.tsx                 # Root
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── sidebar/
│   │   ├── business-sidebar.tsx
│   │   └── employee-sidebar.tsx
│   ├── topbar.tsx
│   ├── new-task-drawer/           # 新建任务 Chat 抽屉
│   │   ├── index.tsx
│   │   ├── message-list.tsx
│   │   ├── employee-picker.tsx
│   │   └── rich-cards.tsx
│   ├── campaign-drawer/           # Campaign 详情抽屉
│   │   ├── index.tsx
│   │   ├── info-panel.tsx
│   │   ├── pipeline.tsx
│   │   └── steps/                 # step-1..7
│   └── ...
├── lib/
│   ├── store/                     # Zustand stores
│   ├── mock/                      # Mock 数据
│   ├── types.ts
│   └── utils.ts
├── docs/
├── biome.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── package.json
```

---

## 15. 验证清单（做完后怎么验）

- [ ] 侧边栏从上到下顺序与方案 §1 完全一致，新建任务是品牌色 CTA
- [ ] 点新建任务 → 右侧抽屉滑出，左侧页面不被遮罩
- [ ] 在抽屉内对话创建 campaign → Campaigns 列表实时多一行，带 shimmer
- [ ] 点 campaign 行 → 大抽屉打开，左基本信息、右 7 步 pipeline
- [ ] 切换"寄样管理"开关，Step 5 出现/消失
- [ ] 切换"ad code"开关，Step 6 子 tab 出现/消失
- [ ] Step 3 达人建联：报价超天花板时，达人自动进入"转人工"标签
- [ ] Step 6 视频审核：人工卡点不点不进入下一步
- [ ] 点侧边栏底部"数字员工" → 进员工列表
- [ ] 点某员工 → 整个侧边栏被替换为员工侧边栏（图1 样式）
- [ ] 点"返回对话" → 恢复业务侧边栏
- [ ] 三个核心动线均可端到端跑通
