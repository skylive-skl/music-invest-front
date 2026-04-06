import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  DollarSign,
  Clock,
  ImagePlus,
  Music4,
  Upload,
  Trash2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../../lib/api/projects.api";
import type { CreateProjectDto, Project } from "../../types/project.types";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "form" | "success" | "error";

interface CreateProjectResult {
  project: Project;
  warnings: string[];
}

const initialForm: CreateProjectDto = {
  title: "",
  description: "",
  fundingGoal: 0,
  revenueSharePercent: 10,
  durationMonths: 12,
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (typeof err === "object" && err !== null) {
    const response = (err as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message) && message.length > 0) {
      return message.join(", ");
    }
  }

  return fallback;
};

export function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const [form, setForm] = useState<CreateProjectDto>(initialForm);
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const update = <K extends keyof CreateProjectDto>(
    key: K,
    value: CreateProjectDto[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.title.trim().length >= 3 &&
    form.description.trim().length >= 10 &&
    form.fundingGoal >= 1000 &&
    form.revenueSharePercent >= 1 &&
    form.revenueSharePercent <= 100 &&
    form.durationMonths >= 1;

  const { mutate, isPending } = useMutation<CreateProjectResult, unknown>({
    mutationFn: async () => {
      const createdProject = await projectsApi.create(form);
      const warnings: string[] = [];
      let project = createdProject;

      if (coverFile) {
        try {
          project = await projectsApi.uploadCover(createdProject.id, coverFile);
        } catch (err) {
          warnings.push(
            `Не удалось загрузить обложку: ${getErrorMessage(err, "сервер вернул ошибку")}`,
          );
        }
      }

      if (mediaFiles.length > 0) {
        try {
          project = await projectsApi.uploadMedia(createdProject.id, mediaFiles);
        } catch (err) {
          warnings.push(
            `Не удалось загрузить медиафайлы: ${getErrorMessage(err, "сервер вернул ошибку")}`,
          );
        }
      }

      return { project, warnings };
    },
    onSuccess: ({ warnings }) => {
      queryClient.invalidateQueries({ queryKey: ["my-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      if (warnings.length > 0) {
        setSuccessMsg(
          `Проект «${form.title}» создан, но часть файлов не загрузилась. ${warnings.join(" ")}`,
        );
      } else {
        setSuccessMsg(
          `Проект «${form.title}» успешно создан${coverFile || mediaFiles.length > 0 ? " и файлы загружены" : ""}.`,
        );
      }

      setStep("success");
    },
    onError: (err) => {
      setErrorMsg(getErrorMessage(err, "Ошибка при создании проекта"));
      setSuccessMsg("");
      setStep("error");
    },
  });

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCoverFile(file);
    event.target.value = "";
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setMediaFiles((prev) => {
      const existingKeys = new Set(
        prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
      );
      const nextFiles = files.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        return !existingKeys.has(key);
      });

      return [...prev, ...nextFiles];
    });

    event.target.value = "";
  };

  const removeMediaFile = (indexToRemove: number) => {
    setMediaFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClose = () => {
    setForm(initialForm);
    setStep("form");
    setErrorMsg("");
    setSuccessMsg("");
    setCoverFile(null);
    setMediaFiles([]);
    onClose();
  };

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
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-bg-card rounded-3xl border border-border shadow-card overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Новый проект
                  </h2>
                  <p className="text-sm text-text-secondary mt-0.5">
                    Создайте краудфандинг-кампанию
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {step === "form" && (
                  <div className="space-y-5">
                    {/* Title */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                        <FileText size={14} />
                        Название проекта
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        placeholder="Мой дебютный альбом..."
                        maxLength={100}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                      />
                      <p className="text-xs text-text-muted mt-1 text-right">
                        {form.title.length}/100
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                        <FileText size={14} />
                        Описание
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder="Расскажите о своём проекте, планах и как будут использованы средства..."
                        rows={4}
                        maxLength={1000}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors resize-none"
                      />
                      <p className="text-xs text-text-muted mt-1 text-right">
                        {form.description.length}/1000
                      </p>
                    </div>

                    {/* Funding Goal */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                        <DollarSign size={14} />
                        Цель финансирования (₸)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={form.fundingGoal || ""}
                          onChange={(e) =>
                            update("fundingGoal", Number(e.target.value))
                          }
                          placeholder="500000"
                          min={1000}
                          className="w-full px-4 py-3 pr-10 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">
                          ₸
                        </span>
                      </div>
                      {form.fundingGoal > 0 && form.fundingGoal < 1000 && (
                        <p className="text-xs text-danger mt-1">
                          Минимальная цель — 1 000 ₸
                        </p>
                      )}
                      {/* Quick presets */}
                      <div className="flex gap-2 mt-2">
                        {[50000, 200000, 500000, 1000000].map((v) => (
                          <button
                            key={v}
                            onClick={() => update("fundingGoal", v)}
                            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                              form.fundingGoal === v
                                ? "border-accent-purple text-accent-purple"
                                : "border-border text-text-muted hover:border-border-light"
                            }`}
                          >
                            {v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Revenue Share + Duration in grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                          <TrendingUp size={14} />
                          Доля выручки (%)
                        </label>
                        <input
                          type="number"
                          value={form.revenueSharePercent || ""}
                          onChange={(e) =>
                            update(
                              "revenueSharePercent",
                              Number(e.target.value),
                            )
                          }
                          placeholder="10"
                          min={1}
                          max={100}
                          className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                        />
                        <p className="text-xs text-text-muted mt-1">
                          Делится между инвесторами
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                          <Clock size={14} />
                          Срок (месяцев)
                        </label>
                        <input
                          type="number"
                          value={form.durationMonths || ""}
                          onChange={(e) =>
                            update("durationMonths", Number(e.target.value))
                          }
                          placeholder="12"
                          min={1}
                          max={120}
                          className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                        />
                        <p className="text-xs text-text-muted mt-1">
                          Срок кампании
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                          <ImagePlus size={14} />
                          Обложка проекта
                        </label>
                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-bg-elevated px-4 py-3 text-sm text-text-secondary transition-colors hover:border-accent-purple/50 hover:text-text-primary">
                          <div>
                            <p className="font-medium text-text-primary">
                              {coverFile ? coverFile.name : "Выберите изображение"}
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              JPG, PNG, WEBP. Файл загрузится сразу после создания проекта.
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold text-text-primary">
                            <Upload size={12} />
                            Загрузить
                          </span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleCoverChange}
                            className="hidden"
                          />
                        </label>
                        {coverFile && (
                          <div className="mt-2 flex items-center justify-between rounded-2xl border border-border bg-bg-card px-4 py-3 text-sm">
                            <div>
                              <p className="font-medium text-text-primary">
                                {coverFile.name}
                              </p>
                              <p className="text-xs text-text-muted mt-1">
                                {formatBytes(coverFile.size)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCoverFile(null)}
                              className="rounded-xl p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-danger"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                          <Music4 size={14} />
                          Медиафайлы проекта
                        </label>
                        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-bg-elevated px-4 py-3 text-sm text-text-secondary transition-colors hover:border-accent-purple/50 hover:text-text-primary">
                          <div>
                            <p className="font-medium text-text-primary">
                              Добавьте аудио или видеофайлы
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              Можно выбрать несколько файлов. Они отправятся после создания проекта.
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold text-text-primary">
                            <Upload size={12} />
                            Добавить
                          </span>
                          <input
                            type="file"
                            accept="audio/*,video/*"
                            multiple
                            onChange={handleMediaChange}
                            className="hidden"
                          />
                        </label>
                        {mediaFiles.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {mediaFiles.map((file, index) => (
                              <div
                                key={`${file.name}-${file.size}-${file.lastModified}`}
                                className="flex items-center justify-between rounded-2xl border border-border bg-bg-card px-4 py-3 text-sm"
                              >
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-text-primary">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-text-muted mt-1">
                                    {formatBytes(file.size)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeMediaFile(index)}
                                  className="rounded-xl p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-danger"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preview card */}
                    {isValid && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-accent-purple/8 border border-accent-purple/20 rounded-2xl space-y-2"
                      >
                        <p className="text-xs font-semibold text-accent-purple uppercase tracking-wider">
                          Предпросмотр
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Цель</span>
                          <span className="font-bold text-text-primary">
                            {form.fundingGoal.toLocaleString("ru-RU")} ₸
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">
                            Доля инвесторам
                          </span>
                          <span className="font-bold text-accent-cyan">
                            {form.revenueSharePercent}% выручки
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Срок</span>
                          <span className="font-bold text-text-primary">
                            {form.durationMonths} мес.
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {step === "success" && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        Проект создан!
                      </h3>
                      <p className="text-sm text-text-secondary mt-1">
                        {successMsg}
                      </p>
                    </div>
                  </div>
                )}

                {step === "error" && (
                  <div className="text-center py-6 space-y-4">
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
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex-shrink-0">
                {step === "form" && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 py-3 rounded-2xl font-semibold text-text-secondary bg-bg-elevated hover:bg-bg-hover transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      disabled={!isValid || isPending}
                      onClick={() => mutate()}
                      className="flex-1 py-3 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Создание..." : "Создать проект"}
                    </button>
                  </div>
                )}
                {(step === "success" || step === "error") && (
                  <button
                    onClick={
                      step === "success" ? handleClose : () => setStep("form")
                    }
                    className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity"
                  >
                    {step === "success" ? "Готово" : "Попробовать снова"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
