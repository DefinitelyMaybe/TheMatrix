/// <reference lib="dom" />
// https://github.com/c3js/c3

// variables used in calculation
let resultValue = 0.0

let interestRate = 0.01
let initialAmount = 0.01
let periodInterestRate = 0.01 // interestRate / peroidsPerYear
let periodsPerYear = 12
let totalPeriods = 1.0
let extra = 10.0

// find all the inputs and attach listeners
const interestRateInput = document.querySelector("input#interestRate")! as HTMLInputElement
interestRateInput.addEventListener("change", () => {
  console.log("changed the interest rate");
  interestRate = parseFloat(interestRateInput.value);
  const max = parseFloat(interestRateInput.getAttribute("max")!)
  const min = parseFloat(interestRateInput.getAttribute("min")!)
  if (interestRate > max) {
    interestRate = max
  } else if (interestRate < min) {
    interestRate = min
  }
  periodInterestRate = interestRate / periodsPerYear
})
const extraAmount = document.querySelector("div#extraAmount")!
const extraContributions = document.querySelector("input#extraContributions")!


extraContributions.addEventListener("click", (e: any) => {
  if (e.target.checked) {
    extraAmount.removeAttribute("hidden")
  } else {
    extraAmount.setAttribute("hidden", "true")
  }
})

const result = document.querySelector("output#result")!

document.addEventListener("change", () => {
  compute()
})

function compute() {
  let newValue = NaN
  if (extraAmount.getAttribute("hidden")) {
    console.log("no extra contributions");
  } else {
    const twoT = (1 + periodInterestRate) ** (periodsPerYear * totalPeriods)
    newValue = initialAmount * twoT + extra * ((twoT-1)/(periodInterestRate)) * (1 + periodInterestRate)
    console.log(newValue);
  }
  if (newValue) {
    resultValue = Math.round(newValue * 1000 ) / 1000
    result.innerHTML = `result: ${resultValue}`
  }
}
