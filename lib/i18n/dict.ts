export type Locale = "zh" | "en";

/** Bilingual text used across mock data and page-local dictionaries. */
export type LText = { zh: string; en: string };

export function loc(t: LText | string, locale: Locale): string {
  return typeof t === "string" ? t : t[locale];
}

export const dict = {
  // Sidebar nav
  nav: {
    dashboard: { zh: "总览", en: "Dashboard" },
    campaigns: { zh: "项目管理", en: "Campaigns" },
    creators: { zh: "达人发现", en: "Creators" },
    collaborations: { zh: "合作管理", en: "Collaboration" },
    tracking: { zh: "竞品追踪", en: "Tracking" },
    contextLab: { zh: "内容工坊", en: "Context Lab" },
    pool: { zh: "私域达人池", en: "Private Pool" },
    mail: { zh: "邮件中心", en: "Outreach Inbox" },
    employees: { zh: "数字员工", en: "Digital Employee" },
  },
  // Common
  common: {
    newTask: { zh: "新建任务", en: "New Task" },
    ask: { zh: "Ask", en: "Ask" },
    askEmployee: { zh: "问数字员工", en: "Ask Digital Employee" },
    askShortcutHint: { zh: "⌘K 询问数字员工", en: "⌘K Ask Digital Employee" },
    cancel: { zh: "取消", en: "Cancel" },
    save: { zh: "保存", en: "Save" },
    send: { zh: "发送", en: "Send" },
    search: { zh: "搜索…", en: "Search…" },
    approve: { zh: "通过", en: "Approve" },
    review: { zh: "审核", en: "Review" },
    edit: { zh: "编辑", en: "Edit" },
    delete: { zh: "删除", en: "Delete" },
    confirm: { zh: "确认", en: "Confirm" },
    next: { zh: "下一步", en: "Next" },
    back: { zh: "返回", en: "Back" },
    loading: { zh: "加载中…", en: "Loading…" },
    all: { zh: "全部", en: "All" },
    today: { zh: "今天", en: "Today" },
    pending: { zh: "待处理", en: "Pending" },
  },
  // Topbar
  topbar: {
    contextPrefix: { zh: "✨", en: "✨" },
    live: { zh: "进行中", en: "Live" },
  },
  // Account menu
  account: {
    free: { zh: "免费版", en: "Free" },
    creditsUsage: { zh: "Credits 用量", en: "Credits Usage" },
    manage: { zh: "管理", en: "Manage" },
    upgrade: { zh: "升级", en: "Upgrade" },
    accountSettings: { zh: "账户设置", en: "Account Settings" },
    messageCenter: { zh: "消息中心", en: "Message Center" },
    language: { zh: "语言", en: "Language" },
    languageChinese: { zh: "中文", en: "中文" },
    languageEnglish: { zh: "English", en: "English" },
    logout: { zh: "退出登录", en: "Log out" },
  },
  // Automation
  automation: {
    label: { zh: "自动化模式", en: "Automation Mode" },
    full: { zh: "全自动", en: "Full Auto" },
    fullDesc: {
      zh: "数字员工自动跑通所有 step，仅在卡点时通知你",
      en: "Digital employee runs every step automatically and notifies you only at blockers",
    },
    semi: { zh: "半自动", en: "Semi-Auto" },
    semiDesc: {
      zh: "员工自动推进，关键节点需要你审核确认",
      en: "Employee advances automatically; key checkpoints need your approval",
    },
    manual: { zh: "人工介入", en: "Manual" },
    manualDesc: {
      zh: "员工仅整理资料，每一步都由你手动推进",
      en: "Employee only prepares artifacts; every step is moved forward by you",
    },
    viewLogs: { zh: "查看完整运行记录", en: "View full run history" },
    exportReport: { zh: "导出 campaign 报告", en: "Export campaign report" },
    archive: { zh: "归档 campaign", en: "Archive campaign" },
  },
  // Dashboard
  dashboard: {
    heroTitle: { zh: "数字员工正在工作", en: "KOL Ops Employee is working" },
    heroSub: {
      zh: "正在扫描达人 · 准备外联 · 今天有 4 项决策等你拍板",
      en: "Scanning creators · preparing outreach · 4 decisions need your approval today",
    },
    kpiScanned: { zh: "扫描达人", en: "Scanned" },
    kpiMatched: { zh: "匹配达人", en: "Matched" },
    kpiApprovals: { zh: "待你确认", en: "Approvals" },
    kpiToday: { zh: "今日", en: "Today" },
    kpiPending: { zh: "待处理", en: "Pending" },
    askPlaceholder: {
      zh: "问问数字员工今天最重要的事…",
      en: "Ask what needs approval today",
    },
    queueAgent: { zh: "任务列表", en: "Agent Tasks" },
    queueHuman: { zh: "人工审核", en: "Human Review" },
    viewAll: { zh: "查看全部", en: "View all" },
    capacity: { zh: "数字员工产能", en: "Employee Capacity" },
    capacitySub: { zh: "本周任务承接 / 单员工容量上限", en: "Tasks this week / capacity ceiling" },
    roi: { zh: "进行中 Campaign · ROI", en: "Running Campaigns · ROI" },
    roiSub: { zh: "实时 GMV / 投放成本 · 与昨日对比", en: "Live GMV vs spend · vs yesterday" },
  },
  // Mail
  mail: {
    emailBox: { zh: "邮件收件箱", en: "Email Box" },
    emailTemplate: { zh: "邮件模板", en: "Email Template" },
    emailMetrics: { zh: "邮件数据", en: "Email Metrics" },
    inbox: { zh: "收件箱", en: "Inbox" },
    drafts: { zh: "草稿箱", en: "Drafts" },
    systemLabels: { zh: "系统标签", en: "System Labels" },
    myTags: { zh: "我的标签", en: "My Tags" },
    noCustomTags: { zh: "暂无自定义标签", en: "No custom tags" },
    noSessions: { zh: "暂无邮件会话", en: "No email sessions" },
    selectSession: { zh: "选择一个会话查看详情", en: "Select a session to view details" },
    selectSessionHint: {
      zh: "从左侧列表选择一个邮件会话",
      en: "Select an email session from the list on the left",
    },
    sessions: { zh: "会话", en: "sessions" },
    labels: {
      outreaching: { zh: "外联中", en: "Outreaching" },
      collaborating: { zh: "合作中", en: "Collaborating" },
      notCooperated: { zh: "未合作", en: "Not Cooperated" },
      cooperationCompleted: { zh: "已完成合作", en: "Cooperation Completed" },
      cannotCollaborate: { zh: "无法合作", en: "Cannot Collaborate" },
      starred: { zh: "星标", en: "Starred" },
      unread: { zh: "未读", en: "Unread" },
    },
    filters: {
      allSubmissions: { zh: "全部提报", en: "All Submissions" },
      allGroups: { zh: "全部分组", en: "All Groups" },
      allModes: { zh: "全部模式", en: "All Modes" },
      allReadStatus: { zh: "全部已读状态", en: "All Read Status" },
      allReplyStatus: { zh: "全部回复状态", en: "All Reply Status" },
      searchSessions: { zh: "搜索会话…", en: "Search sessions..." },
    },
  },
} as const;

type Dict = typeof dict;

type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends { zh: string; en: string }
    ? K
    : T[K] extends object
      ? `${K}.${Path<T[K]>}`
      : never
  : never;

export type DictKey = Path<Dict>;

export function lookup(key: string, locale: Locale): string {
  const parts = key.split(".");
  let node: any = dict;
  for (const p of parts) {
    if (node && typeof node === "object" && p in node) node = node[p];
    else return key;
  }
  if (node && typeof node === "object" && locale in node) {
    return (node as Record<Locale, string>)[locale];
  }
  return key;
}
