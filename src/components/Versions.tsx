import React, { useContext, useEffect, useState } from "react";
import { PoContext, VersionsContext } from "../PoContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ExportButton from "./ExportButton";
import { deleteData, fetchData, GetVersionList } from "../services/poService";
import AvailableLanguages from "./AvailableLanguages";
import { API_HOST, API_PORT } from "../apiEnv";

const Versions: React.FC = () => {
  const { setData } = useContext(PoContext);
  const { versions, setVersions } = useContext(VersionsContext);

  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const [version, setVersion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    GetVersionList()
      .then((versionList) => {
        setVersions(versionList);
        if (versionList.length > 0) {
          setVersion(versionList[0]);
          getData(versionList[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function getData(version: string) {
    fetchData(version)
      .then((data) => {
        if (data) {
          setData(data);
          const uniqueLanguages = Array.from(
            new Set(Object.keys(data).flatMap((key) => Object.keys(data[key])))
          );
          setAvailableLanguages(uniqueLanguages);
          setSelectedLanguage(uniqueLanguages[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTitleClick(version: string): void {
    setVersion(version);
    getData(version);
  }

  function handleDelete(v2: string) {
    deleteData(v2)
      .then((response) => {
        if (response.ok) {
          setVersions(versions.filter((v) => v !== v2));
          if (v2 === versions[0]) {
            if (versions.length > 1) {
              setVersion(versions[1]);
              getData(versions[1]);
            } else {
              setVersion("");
              setData(null);
            }
          }
        } else {
          console.error("Failed to delete the version");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleLanguageChange(language: string): void {
    setSelectedLanguage(language);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Versions</h1>
      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.411 0 8-3.589 8-8h-2c0 3.309-2.691 6-6 6s-6-2.691-6-6H6c0 3.309 2.691 6 6 6z"
              />
            </svg>
          </div>
        ) : (
          versions.map((v, index) => (
            <div
              key={index}
              className={`flex items-center group cursor-pointer p-2 rounded ${
                version === v ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => {
                handleTitleClick(v);
                console.log('this is the version', v)
              }}
            >
              
              <span>{v}</span>
              <FontAwesomeIcon
                icon={faTrash}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(v);
                }}
              />
            </div>
          ))
        )}
      </div>
      <AvailableLanguages
        languages={availableLanguages}
        onLanguageChange={handleLanguageChange}
        selectedLanguage={selectedLanguage}
      />
      <ExportButton version={version} selectedLanguage={selectedLanguage} />
    </div>
  );
};

export default Versions;
