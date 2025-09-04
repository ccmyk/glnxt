import { create } from "zustand";

type NavState = {
  open: boolean;
  invert: boolean;
  setOpen: (v: boolean) => void;
  setInvert: (v: boolean) => void;
};

export const useNavStore = create<NavState>((set) => ({
  open: false,
  invert: false,
  setOpen: (v) => set({ open: v }),
  setInvert: (v) => set({ invert: v }),
}));
