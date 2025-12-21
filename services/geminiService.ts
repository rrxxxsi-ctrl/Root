
import { GoogleGenAI, Type } from "@google/genai";
import { OCRMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPTS = {
  standard: "استخرج النص من الصورة وقم بفرزه وتصنيفه بدقة إلى مقدمة، جمل مفيدة كاملة، أرقام فقط، ورموز فقط.",
  table: "حلل الجداول في الصورة وقم بفرز محتوياتها إلى نصوص مفيدة وأرقام إحصائية.",
  handwriting: "أنت خبير في فك الخط اليدوي السريع. قم باستخراج النص ثم فرزه بدقة عالية وسرعة.",
  invoice: "استخرج بيانات الفاتورة وصنفها إلى ترويسة، بنود (جمل مفيدة)، قيم عددية، ورموز."
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    introduction: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "العناوين، التحيات، أو أي نص تمهيدي."
    },
    sentences: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "الجمل المفيدة والكاملة المستخرجة."
    },
    numbers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "الأرقام أو التواريخ المذكورة."
    },
    symbols: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "الرموز أو المصطلحات الخاصة."
    },
    fullText: {
      type: Type.STRING,
      description: "النص الكامل المستخرج."
    }
  },
  required: ["introduction", "sentences", "numbers", "symbols", "fullText"]
};

export async function extractTextFromImage(base64Data: string, mode: OCRMode = 'standard'): Promise<{text: string, structured?: any, enhancedImage?: string}> {
  if (!base64Data || !base64Data.includes(',')) {
     throw new Error("Invalid data provided");
  }

  const parts = base64Data.split(',');
  const rawBase64 = parts[1];
  const mimeType = parts[0].split(':')[1].split(';')[0];

  const modelToUse = 'gemini-3-flash-preview';
  const config: any = {
    temperature: 0.1,
    responseMimeType: "application/json",
    responseSchema: responseSchema,
    thinkingConfig: { thinkingBudget: 0 }
  };

  let outputText = "";
  try {
    const response = await ai.models.generateContent({
      model: modelToUse,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: rawBase64 } },
          { text: PROMPTS[mode] }
        ]
      },
      config: config
    });

    outputText = response.text || "";

    const jsonRes = JSON.parse(outputText || "{}");
    return {
      text: jsonRes.fullText || "",
      structured: {
        introduction: jsonRes.introduction || [],
        sentences: jsonRes.sentences || [],
        numbers: jsonRes.numbers || [],
        symbols: jsonRes.symbols || []
      }
    };
  } catch (e) {
    console.error("Gemini Error:", e);
    return { 
      text: outputText || "Error processing file.", 
      structured: {
        introduction: [],
        sentences: outputText ? [outputText] : [], 
        numbers: [],
        symbols: []
      }
    };
  }
}

export async function summarizeText(text: string): Promise<string> {
  if (!text) return "";
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `لخص النص التالي في نقاط موجزة واحترافية:\n\n${text}`,
    config: { thinkingConfig: { thinkingBudget: 0 } }
  });
  return (response.text || "").replace(/[#*_`~]/g, '');
}

export async function analyzeTextMeaning(text: string): Promise<string> {
  if (!text) return "";
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `حلل النص التالي واشرح مضمونه بأسلوب مهني فخم، ثم قدم نصيحة ذكية في النهاية:\n\n${text}`,
    config: { thinkingConfig: { thinkingBudget: 0 } }
  });
  return response.text || "";
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text) return "";
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `ترجم النص التالي إلى ${targetLang} ترجمة احترافية ودقيقة:\n\n${text}`,
    config: { thinkingConfig: { thinkingBudget: 0 } }
  });
  return (response.text || "").replace(/[#*_`~]/g, '');
}
