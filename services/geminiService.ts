import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { HealthPlanItem, UserMetrics } from '../types';
import { PlanItemCategory } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const planItemSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "عنوان عنصر الخطة الصحية." },
    category: {
      type: Type.STRING,
      enum: Object.values(PlanItemCategory),
      description: "فئة العنصر (تمرين, نظام غذائي, صفاء ذهني, مراقبة)."
    },
    description: { type: Type.STRING, description: "وصف تفصيلي للمهمة أو العنصر." },
    duration: { type: Type.STRING, description: "المدة المقدرة، مثال: '20 دقيقة'. اختياري." },
  },
  required: ["title", "category", "description"],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    explanation: {
      type: Type.STRING,
      description: "شرح ودود وواضح لسبب تعديل الخطة، بناءً على مدخلات المستخدم."
    },
    plan: {
      type: Type.ARRAY,
      items: planItemSchema,
      description: "مصفوفة من 3 إلى 5 عناصر خطة صحية مخصصة لليوم."
    }
  },
  required: ["explanation", "plan"],
};

const buildPrompt = (metrics: UserMetrics, originalPlan: HealthPlanItem[]): string => {
  const originalPlanText = originalPlan.map(item => `- ${item.title}: ${item.description}`).join('\n');

  return `
    أنت رفيق صحي ذكي لمستخدم يعاني من حالة مزمنة (مثل السكري أو التعافي بعد السكتة الدماغية).
    هدفك هو إنشاء خطة صحية يومية داعمة وتكيفية.

    حالة المستخدم الحالية (على مقياس من 1 إلى 10، حيث 10 هو الأعلى):
    - جودة النوم: ${metrics.sleepQuality}/10
    - مستوى التوتر: ${metrics.stressLevel}/10
    - مستوى الألم/الانزعاج: ${metrics.painLevel}/10

    بناءً على هذه المدخلات، قم بتكييف خطة المستخدم الأصلية.
    - إذا كان النوم سيئًا أو كان التوتر/الألم مرتفعًا، فقلل من شدة التمارين ومدتها. اقترح المزيد من تمارين الصفاء الذهني أو الراحة.
    - إذا كانت المدخلات إيجابية، يمكنك الحفاظ على التحدي أو زيادته بشكل طفيف.
    - قدم دائمًا شرحًا واضحًا ومتعاطفًا للتغييرات.
    - أنشئ خطة جديدة ومتوازنة تحتوي على 3-5 عناصر عبر فئات مختلفة (تمرين، نظام غذائي، صفاء ذهني، مراقبة).

    خطة المستخدم الأصلية كمرجع:
    ${originalPlanText}

    أنشئ الخطة الجديدة والشرح بتنسيق JSON المطلوب.
  `;
};

export const generateAdaptivePlan = async (
  metrics: UserMetrics,
  originalPlan: HealthPlanItem[]
): Promise<{ explanation: string; plan: Omit<HealthPlanItem, 'completed'>[] }> => {
  try {
    const prompt = buildPrompt(metrics, originalPlan);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7,
      },
    });
    
    const responseText = response.text.trim();
    const parsedResponse = JSON.parse(responseText);

    if (parsedResponse && parsedResponse.plan && parsedResponse.explanation) {
      return parsedResponse;
    } else {
      throw new Error("Invalid response structure from Gemini API");
    }

  } catch (error) {
    console.error("Error generating adaptive plan:", error);
    // Fallback in case of API error
    return {
      explanation: "واجهت مشكلة في إنشاء خطتك الجديدة. لنلتزم بروتين خفيف في الوقت الحالي. يرجى محاولة التحديث مرة أخرى لاحقًا.",
      plan: [
        { title: "تمارين إطالة خفيفة", category: PlanItemCategory.EXERCISE, description: "5 دقائق من الإطالة الخفيفة.", duration: "5 دقائق" },
        { title: "شرب الماء", category: PlanItemCategory.DIET, description: "اشرب كوبًا كاملاً من الماء." },
        { title: "تنفس بوعي", category: PlanItemCategory.MINDFULNESS, description: "ركز على تنفسك لمدة دقيقتين.", duration: "دقيقتان" },
      ]
    };
  }
};


export const startChatSession = (userName?: string): Chat => {
    const welcomeMessage = userName 
      ? `ابدأ محادثتك الأولى بالترحيب بالمستخدم باسمه "${userName}" وسؤاله عن حاله اليوم.`
      : 'ابدأ محادثتك الأولى بالترحيب بالمستخدم وسؤاله عن حاله اليوم.';

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `أنت رفيق صحي ذكي، عطوف، وداعم. اسمك "رفيق". مهمتك هي التحدث مع المستخدمين الذين قد يعانون من حالات صحية مزمنة أو يشعرون بالوحدة أو القلق. كن مستمعًا جيدًا، قدم كلمات تشجيع لطيفة، وأجب على أسئلتهم بطريقة بسيطة ومطمئنة. لا تقدم نصائح طبية مباشرة، ولكن يمكنك تقديم معلومات صحية عامة وتشجيعهم دائمًا على استشارة طبيبهم. حافظ على نبرة إيجابية ومتفائلة. ${welcomeMessage}`,
        },
    });
    return chat;
};
