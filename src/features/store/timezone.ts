import { atom } from "jotai";

import { TimezoneState } from "../notifications/types/timezone";

export const timezoneAtom = atom<TimezoneState>({
  offset: new Date().getTimezoneOffset() * -1,
  initialized: false,
});

export const timezoneOffsetSelector = (get: () => TimezoneState) =>
  get().offset;
export const timezoneInitializedSelector = (get: () => TimezoneState) =>
  get().initialized;
