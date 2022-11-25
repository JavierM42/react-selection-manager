import { SelectableId, useSelectionStore } from "./store";

const useIsSelected = (id: SelectableId) =>
  useSelectionStore((state) => state.selection.has(id));

const useIsSelectionEmpty = () =>
  useSelectionStore((state) => state.selection.size === 0);

const useIsMultiselection = () =>
  useSelectionStore((state) => state.selection.size > 1);

const useIsSingleSelection = () =>
  useSelectionStore((state) => state.selection.size === 1);

const useSelectionSize = () =>
  useSelectionStore((state) => state.selection.size);

export {
  useIsSelected,
  useIsSelectionEmpty,
  useIsMultiselection,
  useIsSingleSelection,
  useSelectionSize,
};
