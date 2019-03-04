DATA_objects = [{
  "name": "z",
  "value": 5,
  "position": ["68px", "253px"],
  "type": "math-variable",
  "id": "0"
}, {
  "name": "f",
  "expression": "2cos(((x)/(3)))",
  "latex": "2\\cos\\left(\\frac{x}{3}\\right)",
  "position": ["50px", "64px"],
  "type": "math-function",
  "id": "1"
}, {
  "name": "g",
  "expression": "10z^(2-x)",
  "latex": "10z^{2-x}",
  "position": ["53px", "167px"],
  "type": "math-function",
  "id": "2"
}, {
  "inputHeaders": ["x", "y", "a", "b"],
  "inputTable": [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
    [4, 5, 6, 7],
    [5, 6, 7, 8]
  ],
  "outputHeaders": ["f", "g"],
  "outputTable": [
    ["1.89", "50"],
    ["1.572", "10"],
    ["1.081", "2"],
    ["0.4705", "0.4"],
    ["-0.1914", "0.08"]
  ],
  "position": ["214px", "55px"],
  "type": "math-table",
  "id": "3"
}, {
  "position": ["65px", "335px"],
  "width": 700,
  "height": 500,
  "type": "math-graph",
  "id": "4",
  "xaxis": "x",
  "yaxis": "f"
}, {
  "value": "The web maths IDE.\n\nRight click anywhere to see different options. Drag things around. Saves are logged to the console (ctrl + shift + i).\n\nAt this point in time, it's functions, tables and some basic graphs.\n\nNote: Not all functions will work as I've needed to parse latex into ascii for evaluation.",
  "width": "436px",
  "height": "259px",
  "position": ["462px", "39px"],
  "type": "base-text",
  "id": "5"
}]