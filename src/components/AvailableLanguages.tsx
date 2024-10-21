import React from "react";

interface AvailableLanguagesProps {
  languages: string[];
  selectedLanguage: string;
  onLanguageChange: (languages: string) => void;
}

const AvailableLanguages: React.FC<AvailableLanguagesProps> = ({
  languages,
  selectedLanguage,
  onLanguageChange,
}) => {
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onLanguageChange(event.target.value);
  };

return (
    <select className="flex justify-center border border-black mb-4 mt-4" value={selectedLanguage} onChange={handleLanguageChange}>
        <option value="">Select a language</option>
        {languages.map((language) => (
            <option key={language} value={language}>
                {language}
            </option>
        ))}
    </select>
);
};

export default AvailableLanguages;
