import PO from "pofile";
import { TranslationData, TranslationItem } from "../models/types";
import { API_HOST, API_PORT } from "../apiEnv";

export async function GetVersionList() {
  return await fetch(`http://${API_HOST}:${API_PORT}/api/versions`)
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
}

export function deepMerge(obj1, obj2) {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
        obj1[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
}
export function poToJson(data: string, language: string) {
  const po = PO.parse(data);
  if (!po) {
    return null;
  }

  let translationJson: TranslationData = {};

  po.items.forEach((value) => {
    let translationItem: TranslationItem = {
      en: value.msgid,
      [language]: value.msgstr[0] ?? "",
    };
    if (value.comments.length == 1) {
      translationJson[value.comments[0]] = translationItem;
    }
  });

  return translationJson;
}

export async function fetchData(version: string) {
  return await fetch(`http://${API_HOST}:${API_PORT}/api/fetch/${version}`)
    .then((response) => response.json() as Promise<TranslationData>)
    .catch((error) => {
      console.log(error);
    });
}

export async function saveData(translationJson: TranslationData) {
  return await fetch(`http://${API_HOST}:${API_PORT}/api/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(translationJson),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteData(version: string) {
  return await fetch(`http://${API_HOST}:${API_PORT}/api/delete/${version}`, {
    method: "POST",
  })
    .then((response) => response)
    .catch((error) => {
      console.log(error);
    });
}

export async function exportPo(version: string, selectedLanguage: string) {
  try {
    const data = await fetchData(version);
    if (data) {
      const po = new PO();
      po.headers = {
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Transfer-Encoding": "8bit",
        "Plural-Forms": "nplurals=2; plural=(n != 1);",
        "MIME-Version": "1.0",
        Language: selectedLanguage,
        "X-Source-Language": "en",
      };
      Object.entries(data).forEach(([key, translationItem]) => {
        const item = new PO.Item();
        item.comments = [key];
        if (selectedLanguage === "en") {
          item.msgid = key;
        } else {
          item.msgid = translationItem["en"];
        }
        item.msgstr = [translationItem[selectedLanguage]];
        po.items.push(item);
      });

      return po;
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}
