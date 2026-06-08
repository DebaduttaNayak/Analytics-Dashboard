import { useState, useMemo, useRef, useEffect } from "react";
import { CSVLink } from "react-csv";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart,
} from "recharts";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  RefreshCw, ArrowUp, ArrowDown, ChevronDown, Check, Sun, Moon, Download, Printer,
  LayoutDashboard, BarChart2, Users, Settings, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, Bell, Search,
} from "lucide-react";

// ─── Static Data ─────────────────────────────────────────────────────────────

const KPI_DATA = {
  totalRevenue: 3278000,
  totalOrders: 4821,
  averageOrderValue: 679.9,
  conversionRate: 4.82,
  newCustomers: 2847,
  revenueChange: 14.2,
  ordersChange: 8.7,
  aovChange: 5.1,
  conversionChange: 0.8,
  newCustomersChange: 21.3,
};

const REVENUE_DATA = [
  { month: "Jan", revenue: 182000, profit: 54000, expenses: 128000 },
  { month: "Feb", revenue: 195000, profit: 61000, expenses: 134000 },
  { month: "Mar", revenue: 178000, profit: 49000, expenses: 129000 },
  { month: "Apr", revenue: 221000, profit: 74000, expenses: 147000 },
  { month: "May", revenue: 243000, profit: 85000, expenses: 158000 },
  { month: "Jun", revenue: 267000, profit: 98000, expenses: 169000 },
  { month: "Jul", revenue: 289000, profit: 109000, expenses: 180000 },
  { month: "Aug", revenue: 312000, profit: 124000, expenses: 188000 },
  { month: "Sep", revenue: 298000, profit: 115000, expenses: 183000 },
  { month: "Oct", revenue: 334000, profit: 138000, expenses: 196000 },
  { month: "Nov", revenue: 358000, profit: 152000, expenses: 206000 },
  { month: "Dec", revenue: 401000, profit: 178000, expenses: 223000 },
];

const CATEGORIES_DATA = [
  { category: "Electronics", revenue: 842000, orders: 3410, growth: 12.4 },
  { category: "Apparel", revenue: 534000, orders: 6820, growth: 7.8 },
  { category: "Home & Garden", revenue: 421000, orders: 2190, growth: 15.2 },
  { category: "Sports", revenue: 378000, orders: 2940, growth: 22.1 },
  { category: "Beauty", revenue: 295000, orders: 4380, growth: 9.3 },
  { category: "Books", revenue: 187000, orders: 7120, growth: -3.4 },
  { category: "Toys", revenue: 264000, orders: 3560, growth: 18.7 },
];

const TRAFFIC_DATA = [
  { week: "Wk 1", visitors: 14820, sessions: 22410, conversions: 890, bounceRate: 42.1 },
  { week: "Wk 2", visitors: 16340, sessions: 25180, conversions: 1020, bounceRate: 39.8 },
  { week: "Wk 3", visitors: 15100, sessions: 23560, conversions: 940, bounceRate: 41.3 },
  { week: "Wk 4", visitors: 18920, sessions: 29400, conversions: 1240, bounceRate: 37.2 },
  { week: "Wk 5", visitors: 21340, sessions: 33780, conversions: 1510, bounceRate: 35.4 },
  { week: "Wk 6", visitors: 19800, sessions: 30100, conversions: 1380, bounceRate: 36.9 },
  { week: "Wk 7", visitors: 23560, sessions: 37200, conversions: 1720, bounceRate: 33.1 },
  { week: "Wk 8", visitors: 25100, sessions: 39800, conversions: 1890, bounceRate: 31.8 },
];

const TOP_PRODUCTS_DATA = [
  { id: 1, name: "Pro Wireless Headphones", category: "Electronics", revenue: 248000, units: 3100, growth: 18.4, status: "trending" },
  { id: 2, name: "Ultra Running Shoes", category: "Sports", revenue: 196000, units: 4900, growth: 24.1, status: "trending" },
  { id: 3, name: "Smart Home Hub", category: "Electronics", revenue: 174000, units: 1740, growth: 11.2, status: "stable" },
  { id: 4, name: "Organic Face Serum", category: "Beauty", revenue: 142000, units: 7100, growth: 9.8, status: "stable" },
  { id: 5, name: "Standing Desk Pro", category: "Home & Garden", revenue: 138000, units: 920, growth: 15.6, status: "trending" },
  { id: 6, name: "Yoga Mat Premium", category: "Sports", revenue: 112000, units: 5600, growth: -2.3, status: "declining" },
  { id: 7, name: "Wireless Charging Pad", category: "Electronics", revenue: 98000, units: 9800, growth: 5.7, status: "stable" },
  { id: 8, name: "Kids Building Set", category: "Toys", revenue: 94000, units: 4700, growth: 21.3, status: "trending" },
  { id: 9, name: "Classic Novel Boxset", category: "Books", revenue: 87000, units: 8700, growth: -4.1, status: "declining" },
  { id: 10, name: "Linen Bedding Set", category: "Home & Garden", revenue: 82000, units: 1640, growth: 13.9, status: "stable" },
];

const REGIONAL_DATA = [
  { region: "North America", revenue: 1240000, orders: 18400, growth: 14.2 },
  { region: "Europe", revenue: 980000, orders: 14200, growth: 10.8 },
  { region: "Asia Pacific", revenue: 720000, orders: 11800, growth: 22.4 },
  { region: "Latin America", revenue: 340000, orders: 5600, growth: 18.1 },
  { region: "Middle East", revenue: 210000, orders: 3200, growth: 28.3 },
  { region: "Africa", revenue: 98000, orders: 1800, growth: 35.7 },
];

const STATUSES = ["completed", "completed", "completed", "pending", "processing", "refunded"];
const CUSTOMERS = [
  "Avery Johnson", "Mia Chen", "Noah Williams", "Olivia Brown", "Liam Davis",
  "Emma Wilson", "James Martinez", "Sophia Taylor", "Benjamin Anderson", "Charlotte Thomas",
  "Ethan Jackson", "Amelia White", "Alexander Harris", "Harper Lewis", "Michael Clark",
  "Evelyn Robinson", "Daniel Walker", "Abigail Hall", "Matthew Allen", "Emily Young",
];
const CATEGORY_LIST = CATEGORIES_DATA.map((c) => c.category);
const REGION_LIST = REGIONAL_DATA.map((r) => r.region);
const PRODUCTS = TOP_PRODUCTS_DATA.map((p) => p.name);

function generateTransactions(count: number) {
  const rows = [];
  for (let i = 1; i <= count; i++) {
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    rows.push({
      id: i,
      orderId: `ORD-${String(10000 + i).padStart(5, "0")}`,
      customer: CUSTOMERS[i % CUSTOMERS.length],
      category: CATEGORY_LIST[i % CATEGORY_LIST.length],
      product: PRODUCTS[i % PRODUCTS.length],
      amount: Math.round((49.99 + (i * 73.41) % 950) * 100) / 100,
      status: STATUSES[i % STATUSES.length],
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      region: REGION_LIST[i % REGION_LIST.length],
    });
  }
  return rows;
}

const ALL_TRANSACTIONS = generateTransactions(200);

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART_COLORS = {
  blue: "#0079F2",
  purple: "#795EFF",
  green: "#009118",
  red: "#A60808",
  pink: "#ec4899",
};
const CHART_COLOR_LIST = [CHART_COLORS.blue, CHART_COLORS.purple, CHART_COLORS.green, CHART_COLORS.red, CHART_COLORS.pink];

const INTERVAL_OPTIONS = [
  { label: "Every 5 min", ms: 5 * 60 * 1000 },
  { label: "Every 15 min", ms: 15 * 60 * 1000 },
  { label: "Every 1 hour", ms: 60 * 60 * 1000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = {
  currency: (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v),
  currencyFull: (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(v),
  percent: (v: number) => `${v.toFixed(1)}%`,
  compact: (v: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v),
  number: (v: number) => new Intl.NumberFormat("en-US").format(v),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#1a1a1a" }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: entry.color, flexShrink: 0, display: "inline-block" }} />
          <span style={{ color: "#555" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600, paddingLeft: 12 }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  if (!payload?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px", fontSize: 12, marginTop: 8 }}>
      {payload.map((e: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: e.color, display: "inline-block", flexShrink: 0 }} />
          <span>{e.value}</span>
        </div>
      ))}
    </div>
  );
}

function KPICard({ title, value, change, isDark }: { title: string; value: string; change: number; isDark: boolean }) {
  const up = change >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold" style={{ color: CHART_COLORS.blue }}>{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {up ? <ArrowUp className="w-3.5 h-3.5 text-green-600" /> : <ArrowDown className="w-3.5 h-3.5 text-red-600" />}
          <span className={`text-sm font-medium ${up ? "text-green-600" : "text-red-600"}`}>{Math.abs(change).toFixed(1)}%</span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

function csvBtn(data: any[], filename: string, isDark: boolean) {
  return (
    <CSVLink
      data={data}
      filename={filename}
      className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border transition-colors hover:opacity-80"
      style={{ background: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2", color: isDark ? "#c8c9cc" : "#4b5563", borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)" }}
    >
      <Download className="w-3.5 h-3.5" />
    </CSVLink>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Analytics",  icon: BarChart2 },
  { label: "Customers",  icon: Users },
  { label: "Settings",   icon: Settings },
  { label: "Help",       icon: HelpCircle },
];

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [selectedIntervalMs, setSelectedIntervalMs] = useState(5 * 60 * 1000);
  const [lastRefreshed, setLastRefreshed] = useState<string>(() => {
    const d = new Date();
    return `${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()} on ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Transaction filters
  const [txSearch, setTxSearch] = useState("");
  const [txStatus, setTxStatus] = useState("all");
  const [txCategory, setTxCategory] = useState("all");
  const [txSorting, setTxSorting] = useState<SortingState>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      const d = new Date();
      setLastRefreshed(`${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()} on ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
    }, selectedIntervalMs);
    return () => clearInterval(id);
  }, [autoRefresh, selectedIntervalMs]);

  const handleRefresh = () => {
    const d = new Date();
    setLastRefreshed(`${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase()} on ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
  };

  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return ALL_TRANSACTIONS.filter((t) => {
      if (txSearch && !t.customer.toLowerCase().includes(txSearch.toLowerCase()) && !t.orderId.toLowerCase().includes(txSearch.toLowerCase()) && !t.product.toLowerCase().includes(txSearch.toLowerCase())) return false;
      if (txStatus !== "all" && t.status !== txStatus) return false;
      if (txCategory !== "all" && t.category !== txCategory) return false;
      return true;
    });
  }, [txSearch, txStatus, txCategory]);

  // Transaction table columns
  const txColumns: ColumnDef<typeof ALL_TRANSACTIONS[0]>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.orderId}</span>,
    },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "product", header: "Product", cell: ({ row }) => <span className="text-sm">{row.original.product}</span> },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => fmt.currencyFull(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const cls: Record<string, string> = {
          completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          refunded: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        };
        return <Badge className={`px-2 py-0.5 text-xs font-medium border-0 rounded ${cls[s] ?? ""}`} variant="outline">{s}</Badge>;
      },
    },
    { accessorKey: "region", header: "Region" },
  ];

  const txTable = useReactTable({
    data: filteredTransactions,
    columns: txColumns,
    state: { sorting: txSorting },
    onSortingChange: setTxSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  // Top Products columns
  const tpColumns: ColumnDef<typeof TOP_PRODUCTS_DATA[0]>[] = [
    { accessorKey: "name", header: "Product" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "units", header: "Units", cell: ({ row }) => fmt.number(row.original.units) },
    { accessorKey: "revenue", header: "Revenue", cell: ({ row }) => fmt.currency(row.original.revenue) },
    {
      accessorKey: "growth",
      header: "Growth",
      cell: ({ row }) => {
        const g = row.original.growth;
        return <span className={g >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{g >= 0 ? "+" : ""}{g}%</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const cls: Record<string, string> = {
          trending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          stable: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          declining: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
        return <Badge className={`px-2 py-0.5 text-xs font-medium border-0 rounded ${cls[s] ?? ""}`} variant="outline">{s}</Badge>;
      },
    },
  ];

  const tpTable = useReactTable({
    data: TOP_PRODUCTS_DATA,
    columns: tpColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const iconBtnStyle = {
    backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
    color: isDark ? "#c8c9cc" : "#4b5563",
    borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
  };

  const sidebarBg = isDark ? "#1a1b2e" : "#ffffff";
  const sidebarBorder = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const sidebarText = isDark ? "#c8c9cc" : "#374151";
  const sidebarMuted = isDark ? "#6b7280" : "#9ca3af";
  const headerBg = isDark ? "#111827" : "#ffffff";

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside
        className="relative flex flex-col shrink-0 transition-all duration-300 print:hidden"
        style={{
          width: sidebarOpen ? 220 : 64,
          background: sidebarBg,
          borderRight: `1px solid ${sidebarBorder}`,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-base whitespace-nowrap" style={{ color: sidebarText }}>Analytics</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 space-y-0.5 mt-1">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const active = activeNav === label;
            return (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium"
                style={{
                  background: active ? (isDark ? "rgba(124,58,237,0.18)" : "#ede9fe") : "transparent",
                  color: active ? "#7c3aed" : sidebarText,
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                }}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }} />
                {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Log out */}
        <div className="px-2 pb-4">
          <div style={{ height: 1, background: sidebarBorder, marginBottom: 8 }} />
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium hover:opacity-80"
            style={{ color: sidebarMuted, justifyContent: sidebarOpen ? "flex-start" : "center" }}
            title={!sidebarOpen ? "Log out" : undefined}
          >
            <LogOut style={{ width: 18, height: 18, flexShrink: 0 }} />
            {sidebarOpen && <span>Log out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="absolute -right-3 top-[68px] w-6 h-6 rounded-full border flex items-center justify-center z-10 transition-colors hover:opacity-90"
          style={{ background: sidebarBg, borderColor: sidebarBorder, color: sidebarMuted }}
        >
          {sidebarOpen ? <ChevronLeft style={{ width: 12, height: 12 }} /> : <ChevronRight style={{ width: 12, height: 12 }} />}
        </button>
      </aside>

      {/* ══════════════════ MAIN AREA ══════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ── Top Header Bar ── */}
        <header
          className="flex items-center justify-end gap-3 px-6 py-3 shrink-0 print:hidden"
          style={{ background: headerBg, borderBottom: `1px solid ${sidebarBorder}`, height: 60 }}
        >
          {/* Search */}
          <button className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-muted" style={{ color: sidebarText }}>
            <Search style={{ width: 18, height: 18 }} />
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-muted" style={{ color: sidebarText }}>
              <Bell style={{ width: 18, height: 18 }} />
            </button>
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1" style={{ background: "#ef4444" }}>
              3
            </span>
          </div>

          {/* Profile chip */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border transition-colors hover:bg-muted"
              style={{ borderColor: sidebarBorder }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                JD
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-sm font-semibold" style={{ color: sidebarText }}>Debadutta Nayak</p>
                <p className="text-xs" style={{ color: sidebarMuted }}>Admin</p>
              </div>
              <ChevronDown style={{ width: 14, height: 14, color: sidebarMuted }} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border p-1.5 z-50 text-sm" style={{ background: isDark ? "#1f2937" : "#fff", borderColor: sidebarBorder, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                <div className="px-3 py-2 border-b mb-1" style={{ borderColor: sidebarBorder }}>
                  <p className="font-semibold" style={{ color: sidebarText }}>Debadutta Nayak</p>
                  <p className="text-xs" style={{ color: sidebarMuted }}>debadutta2020@gmail.com</p>
                </div>
                {["Profile", "Account Settings"].map((item) => (
                  <button key={item} className="w-full text-left px-3 py-1.5 rounded-md hover:bg-muted transition-colors" style={{ color: sidebarText }}>{item}</button>
                ))}
                <div style={{ height: 1, background: sidebarBorder, margin: "4px 0" }} />
                <button className="w-full text-left px-3 py-1.5 rounded-md hover:bg-muted transition-colors text-red-500">Log out</button>
              </div>
            )}
          </div>
        </header>

        {/* ── Scrollable dashboard content ── */}
        <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-8">
      <div className="max-w-[1400px] mx-auto">

        {/* ── Header ── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-bold text-3xl tracking-tight"><center>Analytics Dashboard</center></h1>
            <p className="text-muted-foreground mt-1 text-sm">Business performance overview — 2026</p>
            <p className="text-xs text-muted-foreground mt-2">Last refresh: {lastRefreshed}</p>
          </div>

          <div className="flex items-center gap-2 pt-1 print:hidden">
            {/* Split Refresh */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center rounded-[6px] overflow-hidden h-[30px] text-[12px] border" style={iconBtnStyle}>
                <button onClick={handleRefresh} className="flex items-center gap-1.5 px-2.5 h-full hover:bg-black/5 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
                <div className="w-px h-4 shrink-0" style={{ background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
                <button onClick={() => setDropdownOpen((o) => !o)} className="flex items-center px-1.5 h-full hover:bg-black/5 transition-colors">
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-popover border text-popover-foreground rounded-md p-2 z-50" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                  <div className="flex items-center justify-between px-2 py-1.5 text-sm font-medium border-b mb-1">
                    <span>Auto-refresh</span>
                    <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                  </div>
                  {INTERVAL_OPTIONS.map((opt) => (
                    <button
                      key={opt.ms}
                      onClick={() => { setSelectedIntervalMs(opt.ms); setAutoRefresh(true); setDropdownOpen(false); }}
                      className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted flex items-center justify-between"
                    >
                      {opt.label}
                      {selectedIntervalMs === opt.ms && autoRefresh && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => window.print()} className="flex items-center justify-center w-[30px] h-[30px] rounded-[6px] border transition-colors hover:opacity-80" style={iconBtnStyle}>
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setIsDark((d) => !d)} className="flex items-center justify-center w-[30px] h-[30px] rounded-[6px] border transition-colors hover:opacity-80" style={iconBtnStyle}>
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <KPICard title="Total Revenue" value={fmt.currency(KPI_DATA.totalRevenue)} change={KPI_DATA.revenueChange} isDark={isDark} />
          <KPICard title="Total Orders" value={fmt.number(KPI_DATA.totalOrders)} change={KPI_DATA.ordersChange} isDark={isDark} />
          <KPICard title="Avg Order Value" value={fmt.currencyFull(KPI_DATA.averageOrderValue)} change={KPI_DATA.aovChange} isDark={isDark} />
          <KPICard title="Conversion Rate" value={fmt.percent(KPI_DATA.conversionRate)} change={KPI_DATA.conversionChange} isDark={isDark} />
          <KPICard title="New Customers" value={fmt.number(KPI_DATA.newCustomers)} change={KPI_DATA.newCustomersChange} isDark={isDark} />
        </div>

        {/* ── Charts Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Revenue Trend */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Revenue & Profit Trend</CardTitle>
              {csvBtn(REVENUE_DATA, "revenue-trend.csv", isDark)}
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={280} debounce={0}>
                <ComposedChart data={REVENUE_DATA} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
                  <YAxis tickFormatter={fmt.compact} tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                  <Legend content={<CustomLegend />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" fill="url(#gradRev)" stroke={CHART_COLORS.blue} strokeWidth={2} isAnimationActive={false} />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke={CHART_COLORS.green} strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke={CHART_COLORS.red} strokeWidth={2} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic & Conversions */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Traffic & Conversions</CardTitle>
              {csvBtn(TRAFFIC_DATA, "traffic.csv", isDark)}
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={280} debounce={0}>
                <LineChart data={TRAFFIC_DATA} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
                  <YAxis yAxisId="left" tickFormatter={fmt.compact} tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={fmt.compact} tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend content={<CustomLegend />} />
                  <Line yAxisId="left" type="monotone" dataKey="visitors" name="Visitors" stroke={CHART_COLORS.purple} strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line yAxisId="right" type="monotone" dataKey="conversions" name="Conversions" stroke={CHART_COLORS.pink} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Revenue by Category */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Revenue by Category</CardTitle>
              {csvBtn(CATEGORIES_DATA, "categories.csv", isDark)}
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={280} debounce={0}>
                <BarChart data={CATEGORIES_DATA} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                  <XAxis type="number" tickFormatter={fmt.compact} tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: tickColor }} stroke={tickColor} width={90} />
                  <Tooltip content={<CustomTooltip />} cursor={false} isAnimationActive={false} />
                  <Bar dataKey="revenue" name="Revenue" fill={CHART_COLORS.blue} fillOpacity={0.85} radius={[0, 4, 4, 0]} barSize={22} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Regional Sales */}
          <Card>
            <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">Regional Sales Breakdown</CardTitle>
              {csvBtn(REGIONAL_DATA, "regional.csv", isDark)}
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <ResponsiveContainer width="100%" height={280} debounce={0}>
                <PieChart>
                  <Pie data={REGIONAL_DATA} dataKey="revenue" nameKey="region" cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={2} cornerRadius={2} stroke="none" isAnimationActive={false}>
                    {REGIONAL_DATA.map((_, i) => (
                      <Cell key={i} fill={CHART_COLOR_LIST[i % CHART_COLOR_LIST.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Top Products Table ── */}
        <Card className="mb-4">
          <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold">Top Performing Products</CardTitle>
            {csvBtn(TOP_PRODUCTS_DATA, "top-products.csv", isDark)}
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  {tpTable.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id} className="whitespace-nowrap text-xs">
                          {flexRender(h.column.columnDef.header, h.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {tpTable.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-2 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ── Transactions Table ── */}
        <Card>
          <CardHeader className="px-4 pt-4 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold">
                Recent Transactions
                <span className="ml-2 text-xs font-normal text-muted-foreground">({filteredTransactions.length} records)</span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search orders, customers..."
                  value={txSearch}
                  onChange={(e) => { setTxSearch(e.target.value); txTable.setPageIndex(0); }}
                  className="w-[200px] h-8 text-sm"
                />
                <Select value={txStatus} onValueChange={(v) => { setTxStatus(v); txTable.setPageIndex(0); }}>
                  <SelectTrigger className="w-[130px] h-8 text-sm">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={txCategory} onValueChange={(v) => { setTxCategory(v); txTable.setPageIndex(0); }}>
                  <SelectTrigger className="w-[140px] h-8 text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORY_LIST.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {csvBtn(filteredTransactions, "transactions.csv", isDark)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  {txTable.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead
                          key={h.id}
                          className="whitespace-nowrap text-xs cursor-pointer select-none"
                          onClick={h.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? null}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {txTable.getRowModel().rows.length > 0 ? (
                    txTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-2 text-sm">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={txColumns.length} className="h-20 text-center text-muted-foreground text-sm">
                        No transactions match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                Page {txTable.getState().pagination.pageIndex + 1} of {txTable.getPageCount()} &nbsp;·&nbsp; {filteredTransactions.length} records
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => txTable.previousPage()} disabled={!txTable.getCanPreviousPage()}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => txTable.nextPage()} disabled={!txTable.getCanNextPage()}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
        </main>
      </div>
    </div>
  );
}
