
import React, { useState, useCallback } from 'react';
import type { HealthPlanItem, UserMetrics } from '../types';
import { PlanItemCategory } from '../types';
import { generateAdaptivePlan } from '../services/geminiService';
import { PlanCard } from './PlanCard';
import { UserIcon, ActivityIcon, BrainCircuitIcon, ScaleIcon, ShieldCheckIcon, SunIcon, ZapIcon, AlertTriangleIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';

const initialPlan: HealthPlanItem[] = [
  { title: "جولة مشي صباحية", category: PlanItemCategory.EXERCISE, description: "مشي سريع لمدة 30 دقيقة في الهواء الطلق.", duration: "30 دقيقة", completed: false },
  { title: "فطور متوازن", category: PlanItemCategory.DIET, description: "شوفان مع التوت والمكسرات.", completed: false },
  { title: "فحص سكر الدم", category: PlanItemCategory.MONITORING, description: "سجل قراءتك الصباحية.", completed: false },
  { title: "تأمل موجه", category: PlanItemCategory.MINDFULNESS, description: "جلسة لمدة 10 دقائق باستخدام تطبيق.", duration: "10 دقائق", completed: false },
  { title: "علاج طبيعي", category: PlanItemCategory.EXERCISE, description: "أكمل تمارين تقوية الساق الموصوفة.", duration: "20 دقيقة", completed: false },
];

const MetricSlider: React.FC<{ label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode }> = ({ label, value, onChange, icon }) => (
  <div className="flex flex-col space-y-2">
    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
      {icon}
      <span className="mr-2">{label}</span>
    </label>
    <div className="flex items-center space-x-2 sm:space-x-4">
      <input type="range" min="1" max="10" value={value} onChange={onChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-teal-500" />
      <span className="font-semibold text-teal-600 dark:text-teal-400 w-6 text-center">{value}</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({ sleepQuality: 7, stressLevel: 5, painLevel: 3 });
  const [plan, setPlan] = useState<HealthPlanItem[]>(initialPlan);
  const [explanation, setExplanation] = useState<string>("هذه هي خطتك المبدئية لليوم. سجل مقاييسك اليومية للحصول على تحديث شخصي وتكيفي!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleMetricChange = (metric: keyof UserMetrics) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMetrics(prev => ({ ...prev, [metric]: Number(e.target.value) }));
  };

  const updatePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { explanation: newExplanation, plan: newPlanItems } = await generateAdaptivePlan(userMetrics, plan);
      setExplanation(newExplanation);
      setPlan(newPlanItems.map(item => ({ ...item, completed: false })));
    } catch (err) {
      setError("فشل تحديث الخطة. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userMetrics, plan]);

  const toggleTaskCompletion = (index: number) => {
    setPlan(prevPlan => {
      const newPlan = [...prevPlan];
      newPlan[index].completed = !newPlan[index].completed;
      return newPlan;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">أهلاً بك مجدداً، {user?.name.split(' ')[0]}!</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">هذه هي خطتك الصحية التكيفية لليوم.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metrics and Controls */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 h-fit">
          <h2 className="text-xl font-semibold flex items-center"><ZapIcon className="w-5 h-5 ml-2 text-teal-500"/>تسجيل الوصول اليومي</h2>
          <MetricSlider label="جودة النوم" value={userMetrics.sleepQuality} onChange={handleMetricChange('sleepQuality')} icon={<SunIcon className="w-5 h-5 text-yellow-500" />} />
          <MetricSlider label="مستوى التوتر" value={userMetrics.stressLevel} onChange={handleMetricChange('stressLevel')} icon={<BrainCircuitIcon className="w-5 h-5 text-purple-500" />} />
          <MetricSlider label="الألم/الانزعاج" value={userMetrics.painLevel} onChange={handleMetricChange('painLevel')} icon={<ActivityIcon className="w-5 h-5 text-red-500" />} />
          <button
            onClick={updatePlan}
            disabled={isLoading}
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin -mr-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "تحديث خطتي"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Right Column: Plan and Explanation */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-teal-50 dark:bg-teal-900/30 border-r-4 border-l-0 border-teal-500 text-teal-800 dark:text-teal-200 p-4 rounded-l-lg" role="alert">
                <p className="font-bold flex items-center"><ShieldCheckIcon className="w-5 h-5 ml-2"/>ملاحظة من الرفيق الذكي</p>
                <p>{explanation}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center"><ScaleIcon className="w-5 h-5 ml-2 text-teal-500" />خطة اليوم</h2>
                {plan.length > 0 ? (
                    <div className="space-y-3">
                    {plan.map((item, index) => (
                        <PlanCard key={index} item={item} onToggle={() => toggleTaskCompletion(index)} />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <AlertTriangleIcon className="w-12 h-12 mx-auto text-yellow-500 mb-2"/>
                        <p>لا توجد عناصر في الخطة. قم بتحديث مقاييسك لإنشاء خطة جديدة.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
