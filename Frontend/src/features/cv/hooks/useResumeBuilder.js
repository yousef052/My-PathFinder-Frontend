import { useState } from "react";
import { resumeBuilderService } from "../services/resumeBuilderService";

export const useResumeBuilder = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateAndDownloadResume = async (pdfData) => {
    setIsGenerating(true);
    setError(null);
    try {
      const blob = await resumeBuilderService.generatePdf(pdfData);

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" }),
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Resume_${pdfData.targetJobTitle.replace(/\s+/g, "_")}.pdf`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error("PDF Generation Error:", err);
      setError(
        "فشل في توليد السيرة الذاتية. تأكد من إيقاف AdBlocker واستكمال بيانات البروفايل.",
      );
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateAndDownloadResume, isGenerating, error };
};
