// src/features/cv/hooks/useCvManager.js
import { useState, useEffect, useCallback } from "react";
import { cvService } from "../services/cvService";

export const useCvManager = () => {
  const [cvList, setCvList] = useState([]);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const [selectedCvsForCompare, setSelectedCvsForCompare] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [compareResult, setCompareResult] = useState(null);

  const fetchMyCvs = async () => {
    try {
      const response = await cvService.getMyCvs();
      setCvList(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Error fetching CVs", error);
    }
  };

  useEffect(() => {
    fetchMyCvs();
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    try {
      await cvService.uploadCv(file, cvList.length === 0);
      setStatusMsg({ type: "success", text: "CV uploaded successfully!" });
      setFile(null);
      await fetchMyCvs();
    } catch (error) {
      setStatusMsg({ type: "error", text: "Failed to upload." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedCvsForCompare.length !== 2) {
      setStatusMsg({ type: "error", text: "Please select exactly 2 CVs." });
      return;
    }

    setIsComparing(true);
    setCompareResult(null);
    try {
      // 💡 التأكد من إرسال مصفوفة أرقام نظيفة[cite: 30]
      const cleanIds = selectedCvsForCompare
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));

      const response = await cvService.compareCvs(cleanIds);
      let rawData = response.data?.data || response.data;

      // 💡 تحويل النص القادم من الـ AI إلى Object حقيقي[cite: 33]
      if (typeof rawData === "string") {
        try {
          const cleaned = rawData
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          rawData = JSON.parse(cleaned);
        } catch (e) {
          console.error("Parse error", e);
        }
      }
      setCompareResult(rawData);
    } catch (error) {
      console.error("Compare failed", error);
      setStatusMsg({
        type: "error",
        text: "Comparison failed. Check your data.",
      });
    } finally {
      setIsComparing(false);
    }
  };

  const toggleCvSelection = (cvId) => {
    setSelectedCvsForCompare((prev) => {
      if (prev.includes(cvId)) return prev.filter((id) => id !== cvId);
      if (prev.length >= 2) return prev;
      return [...prev, cvId];
    });
  };

  return {
    cvList,
    file,
    isDragging,
    isLoading,
    statusMsg,
    selectedCvsForCompare,
    isComparing,
    compareResult,
    onDragOver,
    onDragLeave,
    onDrop,
    onFileChange: (e) => setFile(e.target.files[0]),
    handleUpload,
    handleDelete: async (id) => {
      await cvService.deleteCv(id);
      fetchMyCvs();
    },
    handleSetPrimary: async (id) => {
      await cvService.setPrimary(id);
      fetchMyCvs();
    },
    setFile,
    toggleCvSelection,
    handleCompare,
    closeCompareResult: () => setCompareResult(null),
  };
};
