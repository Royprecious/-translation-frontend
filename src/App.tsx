import { useState } from "react";
import TranslationTable from "./components/TranslationTable";
import Versions from "./components/Versions";
import { PoContext, VersionsContext } from "./PoContext";
import { TranslationData } from "./models/types";
import ImportPo from "./components/ImportPo";

function App() {
  const [data, setData] = useState<TranslationData | null>(null);
  const [versions, setVersions] = useState<string[]>([]);

  return (
    <>
      <VersionsContext.Provider value={{ versions, setVersions }}>
          <PoContext.Provider value={{ data, setData }}>
            <div className="flex flex-col md:flex-row">
              <Versions></Versions>
              <div className="content-center m-auto w-5/6 ">
                <ImportPo></ImportPo>
                <TranslationTable></TranslationTable>
              </div>
            </div>
          </PoContext.Provider>
      </VersionsContext.Provider>
      {data && (
        <div>
          <h1>Data:</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default App;
