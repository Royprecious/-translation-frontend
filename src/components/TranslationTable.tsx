import { useContext, useEffect, useState } from "react";
import { PoContext } from "../PoContext";
import { TranslationData } from "../models/types";

export default function TranslationTable() {
  const data = useContext(PoContext);
  const translationData: TranslationData | null = data.data;

  let keyList: string[] = [];
  //let langList: string[] = [];
  let langSet = new Set<string>();
  const [langList, setLangList] = useState<string[]>([]);
  useEffect(() => {
    if (translationData) {
      keyList = Object.keys(translationData);
      // langList = Object.keys(Object.values(translationData)[1]);

      keyList.forEach((value) =>
        Object.keys(translationData[value]).forEach((lang) => {
          console.log(lang);
          langSet.add(lang);
        })
      );
      // setLangList(Array.from(langSet));
      // Object.keys(Object.values(translationData)[1]);
      console.log(langList);
      console.log("lang:" + langList);
    }
  }, [data]);

  return (
    <div className="flex border rounded-md content-center items-center justify-center m-auto p-2 w-3/4">
      <table className="  table-auto mx-0 m-auto  p-2 w-screen">
        <thead className="border-b m-auto p-1">
          <tr className="text-center">
            <th>Key</th>
            {translationData
              ? langList.map((lang, index) => <th key={index}>{lang}</th>)
              : null}
          </tr>
        </thead>
        <tbody className="m-1 text-center">
          {translationData
            ? Object.keys(translationData).map(
                (value: string, index: number) => (
                  <tr className="border-b" key={index}>
                    <td>{value}</td>
                    {langList.map((lang, index) => (
                      <td key={index}>{translationData[value][lang]}</td>
                    ))}
                  </tr>
                )
              )
            : null}
        </tbody>
      </table>
    </div>
  );
}
