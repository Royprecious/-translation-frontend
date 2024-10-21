import { useContext, useEffect, useState } from "react";
import { PoContext /*, VersionsContext*/ } from "../PoContext";
import ISO6391 from "iso-639-1";
import { deepMerge, poToJson } from "../services/poService";
import { API_HOST, API_PORT } from "../apiEnv";

export default function ImportPo() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>("Turkish");
  const [languageCode, setLanguageCode] = useState<string>("tr");

  const poData = useContext(PoContext);
  // const versions = useContext(VersionsContext);

  async function handleChange(event: any) {
    setFile(event.target.files[0]);
    const fileName: string = event.target.files[0].name;

    // const fileLanguage: string = ISO6391.getName(fileName.slice(0, 2));

    // if (fileLanguage.length > 0) {
    //   setLanguage(fileLanguage);
    // }

    console.log(fileName);
  }

  async function handleLanguageChange(event: any) {
    setLanguage(event.target.value);
  }

  useEffect(() => {
    console.log(language);
    if (language.length > 0) {
      setLanguageCode(ISO6391.getCode(language));
    }
  }, [language]);

  useEffect(() => {
    console.log(languageCode);
  }, [languageCode]);

  async function handleImport(event: any) {
    event.preventDefault();
   
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;

        poData.setData(
          deepMerge(poToJson(fileContent, languageCode), poData.data)
        );
      };
      reader.readAsText(file);

      console.log(file.name);

      console.log(file);
    }
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    console.log(JSON.stringify(poData.data));

    if (file) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poData.data),
      };
      await fetch(`http://${API_HOST}:${API_PORT}/api/save`, requestOptions)
        .then((response) => response.json())
        .then((json) => poData.setData(json.content));
    }
  }

  return (
    <div>
      {}
      <form
        onSubmit={handleSubmit}
        className=" border w-1/2 content-center m-auto rounded-md my-10 flex flex-col justify-center items-center"
      >
        <h1 className="font-bold">Upload PO file:</h1>
        <input
          className=""
          type="file"
          key={language == "" ? "notfile" : "filename"}
          onChange={handleChange}
        />{" "}
        <label>
          Select Language:
          <select
            onChange={handleLanguageChange}
            name="selectedLanguage"
            value={language}
          >
            {ISO6391.getAllNames().map((lang: string, index: number) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={handleImport}
          className="m-2 border text-white bg-blue-500 hover:bg-blue-700 rounded-md px-2 justify-end self-end"
          type="button"
        >
          Import
        </button>
        <button
          className="m-2 border text-white bg-blue-500 hover:bg-blue-700 rounded-md px-2 justify-end self-end"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
}
