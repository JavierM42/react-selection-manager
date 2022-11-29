# react-selection-manager

A React library to manage selection of arbitrary objects in web apps, with support for range (shift key) and toggle (control key) selection.

## Installation

```
npm install --save react-selection-manager
```

## Usage

Items you want to select must have a _unique_ `id` (number or string), as well as a string `type` that's used to enforce that items of different types cannot be selected simultaneously.

```js
import { SOME_HOOK_OR_FUNCTION } from "react-line-wrapping-input";
```

The main hooks you'll need are:

- `useIsSelected(id)`: Reactively queries if an element is selected.

- `useSelectionEvent({...})`: Returns an event handler for selection events. The handler takes an object parameter with these keys:

  - `id`: the id of the clicked element.
  - `type`: the type of the clicked element.
  - `metaKey`: if the control/command key was pressed when the user clicked (you can get this from the click event's `metaKey` property) .
  - `shiftKey`: if the shift key was pressed when the user clicked (you can get this from the click event's `shiftKey` property) .
  - `orderedIds` (optional): if the clicked element belongs to an ordered collection of elements, an ordered list of the ids in that collection (this is used for range selection).

- `useClearSelection()`: Returns a function that takes no parameters and empties the selection when called.

Additionally, there's some other helper hooks:

- `useSelectionSize()`: returns the number of currently selected elemetnts.
- `useIsSelectionEmpty()`: returns `true` if the selection is empty.
- `useIsSingleSelection()`: returns `true` if the selection has exactly one element.
- `useIsMultiSelection()`: returns `true` if there are multiple selected elements.

A non-reactive `getSelection()` function is also exported. Use this function inside event handlers to get the entire selection in order to operate with it. A reactive way to subscribe to the whole selection is not provided because it can easily harm performance.

## Why do I need a library for this?

You don't, but it can save you some trouble because the rules for selection on most apps are both fairly standard and complex.

Here's the full list of rules the library adheres to in case you're curious or need it:

- When you click an object without holding the shift or meta keys OR if the object odes not match the type of the current selection, it becomes selected and replaces the current selection.
- When you click an object of the same type while holding the meta key, that object's selected state gets toggled.
- When you click an unordered object of the same type while holding the shift key, it behaves exactly the same as with the meta key.
- For ordered objects, it gets tricky:
  - We define the `pivot` element as the last element that was selected without holding the shift key.
  - If the `pivot` becomes deselected (usually through the meta key), the next selected element becomes the pivot. If there's no next selected element, the first selected element becomes the pivot.
  - When you click an ordered object of the same type while holding the shift key, the pivot and all contiguously selected elements become deselected, then every element between the pivot and the clicked element becomes selected (including them both).

_This behavior was taken from the Mac Notes App, and also closely resembles how Google Slides works (except when the pivot becomes deselected, Google's rules are a bit more obscure on that case)._
