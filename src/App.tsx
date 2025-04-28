import { useState } from "react";
import "./App.css";

import { getEntriesFromMds, getEntryFromLocal } from "./utils/mds";
import type { AAGUID } from "./utils/types";

function App() {
  const [aaguid, setAaguid] = useState<AAGUID>(
    `ee041bce-25e5-4cdb-8f86-897fd6418464`
  );

  const [entriesFromMetadataService, setEntriesFromMetadataService] =
    useState<string>(``);
  const [entryFromLocal, setEntryFromLocal] = useState<string>();

  const [authenticatorName, setAuthenticatorName] = useState<
    string | undefined
  >(``);
  const [authenticatorIcon, setAuthenticatorIcon] = useState<
    string | undefined
  >(``);

  const fetchEntriesFromMds = async () => {
    const mds = await getEntriesFromMds();
    const mdsStringify = JSON.stringify(mds.payload, null, 2);
    console.log(`MDS: ${mdsStringify}`);
    setEntriesFromMetadataService(mdsStringify);
  };

  const fetchEntryFromLocal = async (aaguid: AAGUID) => {
    const mdsEntry = await getEntryFromLocal(aaguid);
    const mdsEntryStringify = JSON.stringify(mdsEntry, null, 2);
    console.log(`mdsEntry: ${mdsEntryStringify}`);
    setEntryFromLocal(mdsEntryStringify);

    setAuthenticatorName(mdsEntry?.metadataStatement?.description);
    setAuthenticatorIcon(mdsEntry?.metadataStatement?.icon);
  };

  const handleAaguidChange = (input: string) => {
    setAaguid(input);
    try {
      if (input.length !== 36) {
        throw new Error(`Is not valid AAGUID`);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const errMsgFull = `Invalid AAGUID: ${errMsg}`;
      console.error(errMsgFull);
    }
  };

  return (
    <>
      <h1>Fetch MDS</h1>
      <div className="card">
        <button onClick={fetchEntriesFromMds}>Fetch MDS</button>
      </div>
      <div>
        <label htmlFor="aaguid">AAGUID:</label>{" "}
        <input
          id="aaguid"
          type="text"
          style={{ width: "350px" }}
          value={aaguid}
          onChange={(e) => handleAaguidChange(e.target.value)}
          placeholder="Enter AAGUID"
        />
      </div>
      <div className="card">
        <button
          onClick={() => {
            fetchEntryFromLocal(aaguid);
          }}
        >
          Fetch MDS Entry From Local
        </button>
      </div>
      <div>
        Authenticator:
        {authenticatorName && authenticatorIcon && (
          <>
            <div>Name: {authenticatorName}</div>
            <div>
              Icon: <img src={authenticatorIcon} alt={authenticatorName} />
            </div>
          </>
        )}
      </div>
      <div>
        MDS Entry:
        {entryFromLocal && (
          <pre
            style={{
              color: "white",
              textAlign: "left",
            }}
          >
            {entryFromLocal}
          </pre>
        )}
      </div>
    </>
  );
}

export default App;
