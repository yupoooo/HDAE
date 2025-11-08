import type { VerifiableCredential } from './types';

export const MOCK_CREDENTIALS: VerifiableCredential[] = [
  {
    id: 'vc-001',
    issuer: 'مستشفى المدينة العام',
    type: 'تقرير أمراض القلب',
    date: '2024-05-15',
  },
  {
    id: 'vc-002',
    issuer: 'مختبرات العافية',
    type: 'فحص سكر الدم',
    date: '2024-06-01',
  },
  {
    id: 'vc-003',
    issuer: 'عيادة إعادة التأهيل العصبي',
    type: 'تقييم العلاج الطبيعي',
    date: '2024-06-10',
  },
  {
    id: 'vc-004',
    issuer: 'مستشفى المدينة العام',
    type: 'نتائج فحص الرنين المغناطيسي',
    date: '2024-06-22',
  },
];
