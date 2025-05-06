import { jwtDecode } from "jwt-decode";

import type {
  AAGUID,
  Jwt,
  MetadataBLOBPayload,
  MetadataBLOBPayloadEntry,
} from "./types";

export const getEntriesFromMds = async (): Promise<Jwt> => {
  // const response = await fetch("https://mds3.fidoalliance.org");
  const response = await fetch("/api");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch blob.jwt: ${response.status} ${response.statusText}`
    );
  }

  const jwtB64 = await response.text(); // blob.jwt 是純文字格式（JWT）

  const jwtHeader = jwtDecode(jwtB64, { header: true });
  const jwtPayload = jwtDecode<MetadataBLOBPayload>(jwtB64, { header: false });
  const jwtSignature = jwtB64.split(".")[2];

  return {
    header: jwtHeader,
    payload: jwtPayload as MetadataBLOBPayload,
    signature: jwtSignature,
  };
};

let payloadCache: MetadataBLOBPayload | null = null;

export const getEntryFromLocal = async (
  aaguid: AAGUID
): Promise<MetadataBLOBPayloadEntry | undefined> => {
  if (!payloadCache) {
    const { default: payload } = (await import("./mds.json")) as {
      default: MetadataBLOBPayload;
    };
    payloadCache = payload;
  }

  return payloadCache.entries.find((entry) => entry.aaguid === aaguid);
};

// 新增下載 JSON 檔案的函數
export const downloadJsonFile = (
  jsonContent: string,
  fileName: string = "data.json"
) => {
  // 建立一個 Blob 物件
  const blob = new Blob([jsonContent], { type: "application/json" });

  // 建立一個暫時的 URL
  const url = URL.createObjectURL(blob);

  // 建立一個下載連結，並明確設定其屬性
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.setAttribute("download", fileName);
  downloadLink.setAttribute("target", "_blank");
  downloadLink.style.display = "none";

  // 將連結加入文件並模擬點擊
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // 短暫延遲後再清理，確保下載開始
  setTimeout(() => {
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }, 100);
};
