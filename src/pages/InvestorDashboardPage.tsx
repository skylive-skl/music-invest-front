import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Wallet, BarChart3, Trophy, ArrowUp } from "lucide-react";
import { investmentsApi } from "../lib/api/investments.api";
import { usersApi } from "../lib/api/users.api";
import { payoutsApi } from "../lib/api/payouts.api";
import { InvestmentCard } from "../components/molecules/InvestmentCard";
import { RevenueChart } from "../components/molecules/RevenueChart";
import { Spinner } from "../components/atoms/Spinner";
import { Link } from "react-router-dom";
import { formatCurrency } from "../lib/utils";

export function InvestorDashboardPage() {
  const { data: investments, isLoading } = useQuery({
    queryKey: ["my-investments"],
    queryFn: investmentsApi.getMyInvestments,
  });

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: usersApi.getWallet,
  });

  const { data: payoutHistory } = useQuery({
    queryKey: ["payout-history"],
    queryFn: payoutsApi.getHistory,
  });

  // Aggregate stats
  const totalInvested =
    investments?.reduce((acc, inv) => acc + inv.amount, 0) ?? 0;
  const totalPayouts =
    investments?.reduce(
      (acc, inv) => acc + (inv.payouts?.reduce((s, p) => s + p.amount, 0) ?? 0),
      0,
    ) ?? 0;
  const totalProfit = totalPayouts - totalInvested;
  const roi =
    totalInvested > 0 ? ((totalPayouts / totalInvested) * 100).toFixed(1) : "0";

  // Chart data from payout history (group by month)
  const chartData = (() => {
    if (!payoutHistory || payoutHistory.length === 0) {
      const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
      return months.map((label) => ({ label, value: 0 }));
    }
    const byMonth: Record<string, number> = {};
    payoutHistory.forEach((p) => {
      const date = new Date(p.createdAt);
      const key = date.toLocaleDateString("ru-RU", { month: "short" });
      byMonth[key] = (byMonth[key] ?? 0) + p.amount;
    });
    return Object.entries(byMonth).map(([label, value]) => ({ label, value }));
  })();

  const stats = [
    {
      icon: <Wallet className="w-5 h-5" />,
      label: "Баланс кошелька",
      value: formatCurrency(wallet?.balance ?? 0),
      color: "text-accent-purple",
      bg: "bg-accent-purple/10 border-accent-purple/20",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Всего вложено",
      value: formatCurrency(totalInvested),
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10 border-accent-cyan/20",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Получено выплат",
      value: formatCurrency(totalPayouts),
      color: "text-success",
      bg: "bg-success/10 border-success/20",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "ROI",
      value: `${roi}%`,
      color: totalProfit >= 0 ? "text-success" : "text-danger",
      bg:
        totalProfit >= 0
          ? "bg-success/10 border-success/20"
          : "bg-danger/10 border-danger/20",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-4 md:px-8 md:py-8 space-y-6 md:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary">
          Дашборд инвестора
        </h1>
        <p className="text-text-secondary mt-1">
          Управляйте своим портфелем и отслеживайте выплаты
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`p-5 rounded-2xl border bg-bg-card ${stat.bg}`}
          >
            <div className={`${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-xs text-text-muted mb-1">{stat.label}</p>
            <p className={`text-2xl font-extrabold ${stat.color}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent-purple" />
            История выплат
          </h2>
          {totalProfit !== 0 && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${totalProfit >= 0 ? "text-success" : "text-danger"}`}
            >
              <ArrowUp
                className={`w-4 h-4 ${totalProfit < 0 ? "rotate-180" : ""}`}
              />
              {totalProfit >= 0 ? "+" : ""}
              {formatCurrency(totalProfit)}
            </div>
          )}
        </div>
        <RevenueChart data={chartData} height={220} />
      </motion.div>

      {/* Investments list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text-primary">
            Мои инвестиции
            {investments && (
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({investments.length})
              </span>
            )}
          </h2>
          <Link
            to="/"
            className="text-sm text-accent-purple hover:text-accent-purple-light transition-colors flex items-center gap-1"
          >
            <TrendingUp size={14} />
            Найти проекты
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : !investments || investments.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">Нет инвестиций</h3>
            <p className="text-sm mb-6">
              Найдите интересный проект и начните инвестировать
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-purple text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <TrendingUp size={16} />
              Открыть проекты
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {investments.map((inv, i) => (
              <InvestmentCard key={inv.id} investment={inv} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
