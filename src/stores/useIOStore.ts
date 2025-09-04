import { create } from "zustand";

type IOState = {
  map: Map<string, boolean>;
  setInView: (id: string, value: boolean) => void;
  inView: (id: string) => boolean;
  clear: () => void;
};

export const useIOStore = create<IOState>((set, get) => ({
  map: new Map(),
  setInView: (id, value) =>
    set((state) => {
      const next = new Map(state.map);
      const prev = next.get(id);
      if (prev === value) return state;
      next.set(id, value);
      return { map: next };
    }),
  inView: (id) => get().map.get(id) === true,
  clear: () => set({ map: new Map() }),
}));
