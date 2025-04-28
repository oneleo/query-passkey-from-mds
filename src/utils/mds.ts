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
