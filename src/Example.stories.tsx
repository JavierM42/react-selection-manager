import { SelectableId, useClearSelection, useSelectionEvent } from "./store";
import { useIsSelected } from "./queries";
import { MouseEventHandler } from "react";

const orderedXs = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

const SelectableBox = ({
  id,
  type,
  orderedIds,
}: {
  id: SelectableId;
  type: string;
  orderedIds?: SelectableId[];
}) => {
  const isSelected = useIsSelected(id);
  const onSelect = useSelectionEvent();

  const toggleSelection: MouseEventHandler = (event) =>
    onSelect({
      id,
      type,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
      orderedIds,
    });

  return (
    <div
      style={{
        margin: "8px 16px",
        border: "1px solid black",
        width: "140px",
        height: "60px",
        background: isSelected ? "yellow" : "white",
      }}
      onClick={toggleSelection}
    >
      <div>
        {id} (type {type})
      </div>
    </div>
  );
};

export const Story = () => {
  const clearSelection = useClearSelection();

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            overflow: "auto",
            height: "500px",
            border: "1px solid gray",
            borderRight: 0,
          }}
        >
          <SelectableBox id="a" type="X" orderedIds={orderedXs} />
          <SelectableBox id="b" type="X" orderedIds={orderedXs} />
          <SelectableBox id="c" type="X" orderedIds={orderedXs} />
          <SelectableBox id="d" type="X" orderedIds={orderedXs} />
          <SelectableBox id="e" type="X" orderedIds={orderedXs} />
          <SelectableBox id="f" type="X" orderedIds={orderedXs} />
          <SelectableBox id="g" type="X" orderedIds={orderedXs} />
          <SelectableBox id="h" type="X" orderedIds={orderedXs} />
          <SelectableBox id="i" type="X" orderedIds={orderedXs} />
        </div>
        <div
          style={{ flex: "1", border: "1px solid gray", position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              left: "0%",
              top: "0%",
              right: "0%",
              bottom: "0%",
            }}
            onClick={clearSelection}
          />
          <div style={{ position: "absolute", left: "30%", top: "10%" }}>
            <SelectableBox id="unordered_a" type="Y" />
          </div>
          <div style={{ position: "absolute", left: "50%", top: "70%" }}>
            <SelectableBox id="unordered_b" type="Y" />
          </div>
          <div style={{ position: "absolute", left: "20%", top: "40%" }}>
            <SelectableBox id="unordered_c" type="Y" />
          </div>
          <div style={{ position: "absolute", left: "10%", top: "60%" }}>
            <SelectableBox id="unordered_d" type="Y" />
          </div>
        </div>
      </div>
      <p>
        The elements on the sidebar are ordered. Try using shift and control to
        select multiple elements.
      </p>
      <p>
        The elements on the main area are unordered. Using shift or control will
        be equivalent.
      </p>
      <p>Elements of different type cannot coexist on the same selection.</p>
      <p>Clicking the main area will clear the selection.</p>
    </div>
  );
};
