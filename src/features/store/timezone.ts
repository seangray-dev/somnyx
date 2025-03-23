import { atom } from "jotai";

import { TimezoneState } from "../notifications/types/timezone";

// Create a function to get the current timezone offset
const getCurrentTimezoneOffset = () => new Date().getTimezoneOffset() * -1;

// Create an atom that updates the timezone offset
export const timezoneAtom = atom<TimezoneState>({
  offset: getCurrentTimezoneOffset(),
  initialized: false,
});

// Create a derived atom that automatically updates the offset when daylight savings changes
export const dynamicTimezoneAtom = atom(
  (get) => get(timezoneAtom),
  (get, set, _update: void) => {
    const current = get(timezoneAtom);
    const newOffset = getCurrentTimezoneOffset();

    if (current.offset !== newOffset) {
      set(timezoneAtom, {
        offset: newOffset,
        initialized: true,
      });
    }
  }
);

export const timezoneOffsetSelector = (get: () => TimezoneState) =>
  get().offset;
export const timezoneInitializedSelector = (get: () => TimezoneState) =>
  get().initialized;
