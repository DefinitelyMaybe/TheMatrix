/// <reference lib="dom" />
// graph library
// https://github.com/c3js/c3

// variables used in calculation
// default values
let resultValue = 0.0

let interestRate = 0.01
let initialAmount = 0.01
let periodInterestRate = 0.01 // interestRate / peroidsPerYear
let periodsPerYear = 12
let totalPeriods = 1
let extra = 10.0

// All inputs
const yearlyInterestRateInput = document.querySelector("input#interestRate")! as HTMLInputElement
const peroidInput = document.querySelector("select#peroid")! as HTMLSelectElement
const initialAmountInput = document.querySelector("input#interestRate")! as HTMLInputElement
const extraContributionsInput = document.querySelector("input#extraContributions")!
const extraAmountInput = document.querySelector("div#extraAmount")!
const termInput = document.querySelector("input#term")! as HTMLInputElement
const termInputNumber = document.querySelector("label#termNumberLabel")!
const resultOutput = document.querySelector("output#result")!

// functionality
function compute() {
  // https://money.stackexchange.com/questions/16507/calculate-future-value-with-recurring-deposits/26187
  let newValue = NaN
  if (extraAmountInput.getAttribute("hidden")) {
    newValue = initialAmount * (1 + periodInterestRate) ** totalPeriods
  } else {
    const twoT = (1 + periodInterestRate) ** (periodsPerYear * totalPeriods)
    newValue = initialAmount * twoT + extra * ((twoT-1)/(periodInterestRate)) * (1 + periodInterestRate)
  }
  if (newValue) {
    resultValue = Math.round(newValue * 100 ) / 100
    resultOutput.innerHTML = `result: $${resultValue}`
  }
}

// attach listeners to html elements
yearlyInterestRateInput.addEventListener("change", () => {
  interestRate = parseFloat(yearlyInterestRateInput.value);
  const max = parseFloat(yearlyInterestRateInput.getAttribute("max")!)
  const min = parseFloat(yearlyInterestRateInput.getAttribute("min")!)
  if (interestRate > max) {
    interestRate = max
    yearlyInterestRateInput.value = interestRate.toString()
  } else if (interestRate < min) {
    interestRate = min
    yearlyInterestRateInput.value = interestRate.toString()
  }
  periodInterestRate = interestRate / periodsPerYear
})

extraContributionsInput.addEventListener("click", (e: any) => {
  if (e.target.checked) {
    extraAmountInput.removeAttribute("hidden")
  } else {
    extraAmountInput.setAttribute("hidden", "true")
  }
})

termInput.addEventListener("change", () => {
  totalPeriods = parseFloat(termInput.value)
  termInputNumber.innerHTML = termInput.value
})

peroidInput.addEventListener("change", () => {
  periodsPerYear = parseInt(peroidInput.value)
  periodInterestRate = interestRate / periodsPerYear
})

// setup global events
document.addEventListener("change", () => {
  compute()
})

window.addEventListener("load", () => {
  // either set values to loaded values
  // or init the defaults
  initialAmount = parseFloat(initialAmountInput.value)
  periodsPerYear = parseInt(peroidInput.value)
  termInputNumber.innerHTML = `${termInput.value}`
  compute()
})

