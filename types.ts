
export enum PlanItemCategory {
  EXERCISE = 'تمرين',
  DIET = 'نظام غذائي',
  MINDFULNESS = 'صفاء ذهني',
  MONITORING = 'مراقبة',
}

export interface HealthPlanItem {
  title: string;
  category: PlanItemCategory;
  description: string;
  duration?: string;
  completed: boolean;
}

export interface UserMetrics {
  sleepQuality: number;
  stressLevel: number;
  painLevel: number;
}

export interface VerifiableCredential {
  id: string;
  issuer: string;
  type: string;
  date: string;
  sharedWith?: {
    recipient: string;
    expiry: string;
  };
}

export type MessageAuthor = 'user' | 'model';

export interface ChatMessage {
    author: MessageAuthor;
    text: string;
}
