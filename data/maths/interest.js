DATA_objects = [{
  "name": "compound interest",
  "latex": "P\\cdot\\left(1+\\frac{r}{n}\\right)^{n\\cdot t}",
  "position": ["258px", "204px"],
  "type": "object-function",
  "id": "1"
}, {
  "value": "P = initial value\nr = annual interest rate\nn = number of times interest added each year\nt = years",
  "width": "427px",
  "height": "102px",
  "position": ["193px", "315px"],
  "type": "object-text",
  "id": "2"
}, {
  "inputHeaders": ["P", "r", "n", "t"],
  "inputTable": [
    ["100", "0.015", "12", "1"],
    ["200", "0.015", "12", "2"],
    ["300", "0.015", "12", "3"],
    ["400", "0.015", "12", "4"],
    ["500", "0.015", "12", "5"]
  ],
  "outputHeaders": ["compound interest"],
  "outputTable": [
    ["101.5"],
    ["206.1"],
    ["313.8"],
    ["424.7"],
    ["538.9"]
  ],
  "position": ["233px", "484px"],
  "type": "object-table",
  "id": "3"
}]