import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord } from "../types";

// ✅ Correct way for Vite (browser)
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

export const analyzeAttendance = async (
  records: AttendanceRecord[]
): Promise<string> => {

  if (records.length === 0) {
    return "No attendance records available to analyze.";
  }

  try {
    const dataSummary = records
      .map(r => `${r.date}: ${r.studentName} was ${r.status}`)
      .join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a helpful teaching assistant. Analyze the following attendance data.
Identify patterns, such as students with frequent absences or perfect attendance.
Provide a concise summary report for the teacher.

Data:
${dataSummary}`,
      config: {
        maxOutputTokens: 500,
        temperature: 0.4
      }
    });

    return response.text?.trim() || "Could not generate analysis.";
  } catch (error) {
    console.error("Error analyzing attendance with Gemini:", error);
    return "Sorry, I couldn't analyze the attendance data at this moment.";
  }
};

export const refineMessage = async (
  message: string
): Promise<string> => {

  if (!message.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a professional editor. Rewrite the following message to be more professional, polite, and concise, while preserving the original intent. Return only the refined message.

Original Message: "${message}"`,
      config: {
        temperature: 0.3
      }
    });

    return response.text?.trim() || message;
  } catch (error) {
    console.error("Error refining message with Gemini:", error);
    return message;
  }
};
