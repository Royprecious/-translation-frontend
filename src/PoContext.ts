import { createContext } from "react";
import { TranslationData } from "./models/types";

export const PoContext = createContext<{
  data: TranslationData | null;
  setData: React.Dispatch<React.SetStateAction<TranslationData | null>>;
}>({
  data: null,
  setData: () => {},
});

export const VersionsContext = createContext<{
  versions: string[];
  setVersions: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  versions: [],
  setVersions: () => {},
});