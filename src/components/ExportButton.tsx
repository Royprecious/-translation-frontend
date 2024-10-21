import React from "react";
import { exportPo } from "../services/poService";

interface ExportButtonProps {
  version: string;
  selectedLanguage: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  version,
  selectedLanguage,
}) => {
  const handleDownload = async () => {
    try {
      
      const po = await exportPo(version, selectedLanguage);
      if (po) {
        const poData = po.toString();
        const blob = new Blob([poData], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${selectedLanguage}.po`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleDownload}
    >
      Export
    </button>
  );
};

export default ExportButton;
