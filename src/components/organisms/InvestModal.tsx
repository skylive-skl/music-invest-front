import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, TrendingUp, Wallet } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "../../types/project.types";
import { investmentsApi } from "../../lib/api/investments.api";
import { useAuthStore } from "../../store/auth.store";
import { formatCurrency } from "../../lib/utils";

interface InvestModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
}

type Step = "input" | "confirm" | "success" | "error";

export function InvestModal({
  project,
  isOpen,
  onClose,
  walletBalance,
}: InvestModalProps) {
  const [step, setStep] = useState<Step>("input");
  const [amount, setAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const parsedAmount = parseFloat(amount) || 0;
  const remaining = project.fundingGoal - project.currentFunding;
  const sharePercent =
    project.fundingGoal > 0
      ? (
          (parsedAmount / project.fundingGoal) *
          project.revenueSharePercent
        ).toFixed(3)
      : "0";

  const isAmountValid =
    parsedAmount >= 100 &&
    parsedAmount <= walletBalance &&
    parsedAmount <= remaining;

  const { mutate: invest, isPending } = useMutation({
    mutationFn: () =>
      investmentsApi.invest({ projectId: project.id, amount: parsedAmount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-investments"] });
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setStep("success");
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message ?? "Ошибка при инвестировании");
      setStep("error");
    },
  });

  const handleClose = () => {
    setStep("input");
    setAmount("");
    setErrorMsg("");
    onClose();
  };

  const quickAmounts = [1000, 5000, 10000, 50000].filter(
    (a) => a <= Math.min(walletBalance, remaining),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-bg-card rounded-3xl border border-border shadow-card overflow-hidden">
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 border-b border-border">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  <X size={18} />
                </button>
                <h2 className="text-xl font-bold text-text-primary">
                  Инвестировать
                </h2>
                <p className="text-sm text-text-secondary mt-1 pr-8 truncate">
                  {project.title}
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Step: input */}
                {(step === "input" || step === "confirm") && (
                  <>
                    {/* Project info */}
                    <div className="flex items-center justify-between p-3 bg-bg-elevated rounded-2xl">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <TrendingUp className="w-4 h-4 text-accent-cyan" />
                        <span>Доля от выручки</span>
                      </div>
                      <span className="text-sm font-bold text-accent-cyan">
                        {project.revenueSharePercent}%
                      </span>
                    </div>

                    {/* Wallet balance */}
                    <div className="flex items-center justify-between p-3 bg-bg-elevated rounded-2xl">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Wallet className="w-4 h-4 text-accent-purple" />
                        <span>Баланс кошелька</span>
                      </div>
                      <span className="text-sm font-bold text-text-primary">
                        {formatCurrency(walletBalance)}
                      </span>
                    </div>

                    {/* Input */}
                    {step === "input" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-2">
                            Сумма инвестиции
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="Введите сумму"
                              min={100}
                              max={Math.min(walletBalance, remaining)}
                              className="w-full px-4 py-3 pr-12 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                              ₸
                            </span>
                          </div>

                          {/* Validation message */}
                          {parsedAmount > 0 && (
                            <div className="mt-1.5 text-xs">
                              {parsedAmount < 100 && (
                                <p className="text-danger">
                                  Минимальная сумма — 100 ₸
                                </p>
                              )}
                              {parsedAmount > walletBalance && (
                                <p className="text-danger">
                                  Недостаточно средств на кошельке
                                </p>
                              )}
                              {parsedAmount > remaining &&
                                parsedAmount <= walletBalance && (
                                  <p className="text-danger">
                                    Превышает оставшуюся сумму (
                                    {formatCurrency(remaining)})
                                  </p>
                                )}
                            </div>
                          )}
                        </div>

                        {/* Quick amounts */}
                        {quickAmounts.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {quickAmounts.map((a) => (
                              <button
                                key={a}
                                onClick={() => setAmount(String(a))}
                                className="px-3 py-1.5 text-xs font-medium bg-bg-elevated border border-border rounded-full text-text-secondary hover:border-accent-purple hover:text-accent-purple-light transition-colors"
                              >
                                {formatCurrency(a)}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Preview */}
                        {isAmountValid && (
                          <div className="p-3 bg-accent-purple/8 border border-accent-purple/20 rounded-2xl">
                            <p className="text-xs text-text-secondary">
                              Ваша доля от выручки составит:
                            </p>
                            <p className="text-lg font-bold text-accent-purple-light mt-0.5">
                              {sharePercent}%
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              = {parsedAmount.toLocaleString("ru-RU")} ₸ /{" "}
                              {formatCurrency(project.fundingGoal)} цель
                            </p>
                          </div>
                        )}

                        <button
                          disabled={!isAmountValid || !isAuthenticated}
                          onClick={() => setStep("confirm")}
                          className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-purple disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                          {!isAuthenticated
                            ? "Войдите чтобы инвестировать"
                            : "Продолжить"}
                        </button>
                      </>
                    )}

                    {/* Confirm step */}
                    {step === "confirm" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-bg-elevated rounded-2xl space-y-2.5">
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Проект</span>
                            <span className="text-text-primary font-medium truncate max-w-[160px]">
                              {project.title}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Сумма</span>
                            <span className="text-text-primary font-bold">
                              {formatCurrency(parsedAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">
                              Доля от выручки
                            </span>
                            <span className="text-accent-cyan font-bold">
                              {sharePercent}%
                            </span>
                          </div>
                          <div className="border-t border-border pt-2.5 flex justify-between text-sm">
                            <span className="text-text-secondary">
                              Остаток баланса
                            </span>
                            <span className="font-medium text-text-primary">
                              {formatCurrency(walletBalance - parsedAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setStep("input")}
                            className="py-3 rounded-2xl font-semibold text-text-secondary bg-bg-elevated hover:bg-bg-hover transition-colors"
                          >
                            Назад
                          </button>
                          <button
                            disabled={isPending}
                            onClick={() => invest()}
                            className="py-3 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity disabled:opacity-60"
                          >
                            {isPending ? "Обработка..." : "Подтвердить"}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Step: success */}
                {step === "success" && (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        Инвестиция принята!
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        Вы инвестировали {formatCurrency(parsedAmount)} в проект
                        «{project.title}»
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity"
                    >
                      Отлично!
                    </button>
                  </div>
                )}

                {/* Step: error */}
                {step === "error" && (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-danger/15 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8 text-danger" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        Ошибка
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {errorMsg}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep("input")}
                      className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity"
                    >
                      Попробовать снова
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
