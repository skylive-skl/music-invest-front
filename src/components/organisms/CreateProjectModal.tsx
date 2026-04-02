import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, TrendingUp, FileText, DollarSign, Clock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../../lib/api/projects.api';
import type { CreateProjectDto } from '../../types/project.types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'form' | 'success' | 'error';

const initialForm: CreateProjectDto = {
  title: '',
  description: '',
  fundingGoal: 0,
  revenueSharePercent: 10,
  durationMonths: 12,
};

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [form, setForm] = useState<CreateProjectDto>(initialForm);
  const [step, setStep] = useState<Step>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  const update = <K extends keyof CreateProjectDto>(key: K, value: CreateProjectDto[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.title.trim().length >= 3 &&
    form.description.trim().length >= 10 &&
    form.fundingGoal >= 1000 &&
    form.revenueSharePercent >= 1 &&
    form.revenueSharePercent <= 100 &&
    form.durationMonths >= 1;

  const { mutate, isPending } = useMutation({
    mutationFn: () => projectsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setStep('success');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message ?? 'Ошибка при создании проекта');
      setStep('error');
    },
  });

  const handleClose = () => {
    setForm(initialForm);
    setStep('form');
    setErrorMsg('');
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
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg bg-bg-card rounded-3xl border border-border shadow-card overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">Новый проект</h2>
                  <p className="text-sm text-text-secondary mt-0.5">Создайте краудфандинг-кампанию</p>
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
                {step === 'form' && (
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
                        onChange={(e) => update('title', e.target.value)}
                        placeholder="Мой дебютный альбом..."
                        maxLength={100}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                      />
                      <p className="text-xs text-text-muted mt-1 text-right">{form.title.length}/100</p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                        <FileText size={14} />
                        Описание
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => update('description', e.target.value)}
                        placeholder="Расскажите о своём проекте, планах и как будут использованы средства..."
                        rows={4}
                        maxLength={1000}
                        className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors resize-none"
                      />
                      <p className="text-xs text-text-muted mt-1 text-right">{form.description.length}/1000</p>
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
                          value={form.fundingGoal || ''}
                          onChange={(e) => update('fundingGoal', Number(e.target.value))}
                          placeholder="500000"
                          min={1000}
                          className="w-full px-4 py-3 pr-10 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">₸</span>
                      </div>
                      {form.fundingGoal > 0 && form.fundingGoal < 1000 && (
                        <p className="text-xs text-danger mt-1">Минимальная цель — 1 000 ₸</p>
                      )}
                      {/* Quick presets */}
                      <div className="flex gap-2 mt-2">
                        {[50000, 200000, 500000, 1000000].map((v) => (
                          <button
                            key={v}
                            onClick={() => update('fundingGoal', v)}
                            className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                              form.fundingGoal === v
                                ? 'border-accent-purple text-accent-purple'
                                : 'border-border text-text-muted hover:border-border-light'
                            }`}
                          >
                            {v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Revenue Share + Duration in grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-1.5">
                          <TrendingUp size={14} />
                          Доля выручки (%)
                        </label>
                        <input
                          type="number"
                          value={form.revenueSharePercent || ''}
                          onChange={(e) => update('revenueSharePercent', Number(e.target.value))}
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
                          value={form.durationMonths || ''}
                          onChange={(e) => update('durationMonths', Number(e.target.value))}
                          placeholder="12"
                          min={1}
                          max={120}
                          className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 transition-colors"
                        />
                        <p className="text-xs text-text-muted mt-1">Срок кампании</p>
                      </div>
                    </div>

                    {/* Preview card */}
                    {isValid && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-accent-purple/8 border border-accent-purple/20 rounded-2xl space-y-2"
                      >
                        <p className="text-xs font-semibold text-accent-purple uppercase tracking-wider">Предпросмотр</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Цель</span>
                          <span className="font-bold text-text-primary">{form.fundingGoal.toLocaleString('ru-RU')} ₸</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Доля инвесторам</span>
                          <span className="font-bold text-accent-cyan">{form.revenueSharePercent}% выручки</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">Срок</span>
                          <span className="font-bold text-text-primary">{form.durationMonths} мес.</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {step === 'success' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">Проект создан!</h3>
                      <p className="text-sm text-text-secondary mt-1">
                        «{form.title}» успешно добавлен. Теперь вы можете загрузить обложку.
                      </p>
                    </div>
                  </div>
                )}

                {step === 'error' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-danger/15 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8 text-danger" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">Ошибка</h3>
                      <p className="text-sm text-text-secondary mt-1">{errorMsg}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex-shrink-0">
                {step === 'form' && (
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
                      {isPending ? 'Создание...' : 'Создать проект'}
                    </button>
                  </div>
                )}
                {(step === 'success' || step === 'error') && (
                  <button
                    onClick={step === 'success' ? handleClose : () => setStep('form')}
                    className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-purple hover:opacity-90 transition-opacity"
                  >
                    {step === 'success' ? 'Готово' : 'Попробовать снова'}
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
