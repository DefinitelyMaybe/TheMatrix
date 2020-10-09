/// <reference lib="dom" />
// graph library
import * as abc from "./libs/c3.js";

const c3 = abc.default

// variables used in calculation
let yearlyInterestRate = 0.0
let initialAmount = 0.0
let incuredInterestRate = 0.0
let interestCalculationsPerYear = 0.0
let totalYears = 0.0
let totalIncuredInterestEvents = 0.0
let extra = 0.0
let resultValue = 0.0

// All inputs
const yearlyInterestRateInput = document.querySelector("input#interestRate")! as HTMLInputElement
const interestPerInput = document.querySelector("select#peroid")! as HTMLSelectElement
const initialAmountInput = document.querySelector("input#initialAmount")! as HTMLInputElement
const extraContributionsInput = document.querySelector("input#extraContributions")! as HTMLInputElement
const extraAmountInput = document.querySelector("input#extraAmount")! as HTMLInputElement
const totalYearsInput = document.querySelector("input#term")! as HTMLInputElement
const totalYearsInputNumber = document.querySelector("label#termNumberLabel")!
const graph = c3.generate({
  bindto: 'output#graph',
  data: {
    columns: [
      ['data1', 30, 200, 100, 400, 150, 250],
      ['data2', 50, 20, 10, 40, 15, 25]
    ]
  }
})
const resultOutput = document.querySelector("output#result")!

// functionality
function compute() {
  // https://money.stackexchange.com/questions/16507/calculate-future-value-with-recurring-deposits/26187
  let newValue = NaN
  const changeFormula = extraContributionsInput.checked
  if (!changeFormula) {
    newValue = initialAmount * (1 + incuredInterestRate) ** totalIncuredInterestEvents
  } else {
    const twoT = (1 + incuredInterestRate) ** (interestCalculationsPerYear * totalIncuredInterestEvents)
    newValue = initialAmount * twoT + extra * ((twoT-1)/(incuredInterestRate)) * (1 + incuredInterestRate)
  }
  // checking for valid results
  if (newValue) {
    // formatting
    resultValue = Math.round(newValue * 100 ) / 100
    // updating html
    resultOutput.innerHTML = `result: $${resultValue}`
  }
}

// attach listeners to html elements
yearlyInterestRateInput.addEventListener("change", () => {
  yearlyInterestRate = parseFloat(yearlyInterestRateInput.value);
  const max = parseFloat(yearlyInterestRateInput.getAttribute("max")!)
  const min = parseFloat(yearlyInterestRateInput.getAttribute("min")!)
  if (yearlyInterestRate > max) {
    yearlyInterestRate = max
    yearlyInterestRateInput.value = yearlyInterestRate.toString()
  } else if (yearlyInterestRate < min) {
    yearlyInterestRate = min
    yearlyInterestRateInput.value = yearlyInterestRate.toString()
  }
  // convert to [0, 1.0] range
  yearlyInterestRate = yearlyInterestRate / 100
  incuredInterestRate = yearlyInterestRate / interestCalculationsPerYear
})

interestPerInput.addEventListener("change", () => {
  interestCalculationsPerYear = parseInt(interestPerInput.value)
  incuredInterestRate = yearlyInterestRate / interestCalculationsPerYear
  totalIncuredInterestEvents = interestCalculationsPerYear * totalYears
})

initialAmountInput.addEventListener("change", () => {
  initialAmount = parseFloat(initialAmountInput.value)
})

extraContributionsInput.addEventListener("click", (e: any) => {
  if (e.target.checked) {
    extraAmountInput.removeAttribute("hidden")
  } else {
    extraAmountInput.setAttribute("hidden", "true")
  }
})

totalYearsInput.addEventListener("change", () => {
  totalYears = parseFloat(totalYearsInput.value)
  totalYearsInputNumber.innerHTML = totalYearsInput.value
  totalIncuredInterestEvents = interestCalculationsPerYear * totalYears
})


// setup global events
document.addEventListener("change", () => {
  compute()
})

window.addEventListener("load", () => {
  // sync values
  yearlyInterestRate = parseFloat(yearlyInterestRateInput.value) / 100
  interestCalculationsPerYear = parseInt(interestPerInput.value)
  initialAmount = parseFloat(initialAmountInput.value)
  extra = parseFloat(extraAmountInput.value)
  totalYears = parseInt(totalYearsInput.value)
  incuredInterestRate = yearlyInterestRate / interestCalculationsPerYear
  totalIncuredInterestEvents = interestCalculationsPerYear * totalYears
  totalYearsInputNumber.innerHTML = `${totalYearsInput.value}`
  compute()
})

