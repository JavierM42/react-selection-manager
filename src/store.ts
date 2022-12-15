import create from "zustand";

export type SelectableId = string | number;
type SelectableType = string;

type SelectionState = {
  selection: Set<SelectableId>;
  type: SelectableType | null;
  pivot: SelectableId | null;
};

type SelectionActions = {
  selectionEvent: (params: {
    id: SelectableId;
    type: SelectableType;
    metaKey?: boolean;
    shiftKey?: boolean;
    orderedIds?: SelectableId[];
  }) => void;
  clear: () => void;
};

const useSelectionStore = create<SelectionState & SelectionActions>((set) => ({
  selection: new Set(),
  type: null,
  pivot: null,
  selectionEvent: ({ id, type, metaKey, shiftKey, orderedIds }) =>
    // TODO the orderedIds could be preloaded into the store to avoid re-renders
    set((state) => {
      if (orderedIds) {
        if (state.type !== type) {
          return { selection: new Set([id]), type, pivot: id };
        } else {
          if (shiftKey) {
            const selection = state.selection;
            const pivot = state.pivot;
            if (pivot !== null) {
              // find largest contiguous block of selected elements with pivot
              const pivotIndex = orderedIds.indexOf(pivot);
              let removeRangeStart = pivotIndex;
              while (
                selection.has(orderedIds[removeRangeStart]) &&
                removeRangeStart >= 0
              ) {
                removeRangeStart--;
              }
              removeRangeStart++;
              let removeRangeEnd = pivotIndex;
              while (
                selection.has(orderedIds[removeRangeEnd]) &&
                removeRangeEnd < orderedIds.length
              ) {
                removeRangeEnd++;
              }
              removeRangeEnd--;
              for (let i = removeRangeStart; i <= removeRangeEnd; i++) {
                selection.delete(orderedIds[i]);
              }
              const clickedIndex = orderedIds.indexOf(id);
              const [addRangeStart, addRangeEnd] = [
                clickedIndex,
                pivotIndex,
              ].sort((a, b) => a - b);
              for (let i = addRangeStart; i <= addRangeEnd; i++) {
                selection.add(orderedIds[i]);
              }
              return {
                selection: new Set(Array.from(selection)),
              };
            } else {
              return { selection: new Set([id]), pivot: id };
            }
          } else if (metaKey) {
            if (state.selection.has(id)) {
              state.selection.delete(id);
              const pivot = state.pivot;
              const isPivot = pivot === id;
              if (isPivot) {
                const pivotIndex = orderedIds.indexOf(pivot);
                return {
                  selection: new Set(Array.from(state.selection)),
                  pivot:
                    orderedIds.find(
                      (id, index) =>
                        index > pivotIndex && state.selection.has(id)
                    ) || orderedIds.find((id) => state.selection.has(id)),
                };
              } else {
                return {
                  selection: new Set(Array.from(state.selection)),
                };
              }
            } else {
              state.selection.add(id);
              return {
                selection: new Set(Array.from(state.selection)),
                pivot: id,
              };
            }
          } else {
            return { selection: new Set([id]), pivot: id };
          }
        }
      } else {
        if (state.type !== type) {
          return { selection: new Set([id]), type, pivot: null };
        } else {
          if (metaKey || shiftKey) {
            if (state.selection.has(id)) {
              state.selection.delete(id);
            } else {
              state.selection.add(id);
            }
            return {
              selection: new Set(Array.from(state.selection)),
              pivot: null,
            };
          } else {
            return { selection: new Set([id]), pivot: null };
          }
        }
      }
    }),
  clear: () => set(() => ({ selection: new Set(), type: null })),
}));

const useClearSelection = () => useSelectionStore((state) => state.clear);

const useSelectionEvent = () =>
  useSelectionStore((state) => state.selectionEvent);

const getSelection = () => useSelectionStore.getState().selection;

const useSelection = () => useSelectionStore((state) => state.selection);

export {
  useSelectionStore,
  useSelection,
  useClearSelection,
  useSelectionEvent,
  getSelection,
};
