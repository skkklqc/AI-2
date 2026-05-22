const MONTHLY_DEDUCTION = 5000;
const WORKING_DAYS_PER_YEAR = 250;

const MONTHLY_BRACKETS = [
  { max: 3000, rate: 0.03, quickDeduction: 0 },
  { max: 12000, rate: 0.1, quickDeduction: 210 },
  { max: 25000, rate: 0.2, quickDeduction: 1410 },
  { max: 35000, rate: 0.25, quickDeduction: 2660 },
  { max: 55000, rate: 0.3, quickDeduction: 4410 },
  { max: 80000, rate: 0.35, quickDeduction: 7160 },
  { max: Infinity, rate: 0.45, quickDeduction: 15160 },
];

function getTaxByTaxableIncome(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  for (const bracket of MONTHLY_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return taxableIncome * bracket.rate - bracket.quickDeduction;
    }
  }

  return 0;
}

function calculateMonthlyTax(monthlySalary, socialInsurance) {
  const taxableIncome = monthlySalary - socialInsurance - MONTHLY_DEDUCTION;
  return Math.max(0, getTaxByTaxableIncome(taxableIncome));
}

function calculateBonusTax(yearEndBonus) {
  if (yearEndBonus <= 0) return 0;

  const monthlyEquivalent = yearEndBonus / 12;

  for (const bracket of MONTHLY_BRACKETS) {
    if (monthlyEquivalent <= bracket.max) {
      return Math.max(
        0,
        yearEndBonus * bracket.rate - bracket.quickDeduction
      );
    }
  }

  return 0;
}

function calculateSalary(input) {
  const {
    monthlySalary,
    yearEndBonus,
    socialInsuranceRatio,
    averageWorkHours,
  } = input;

  const ratio =
    socialInsuranceRatio > 1
      ? socialInsuranceRatio / 100
      : socialInsuranceRatio;

  const socialInsurance = monthlySalary * ratio;
  const monthlyTax = calculateMonthlyTax(monthlySalary, socialInsurance);
  const bonusTax = calculateBonusTax(yearEndBonus);

  const monthlyAfterTax = monthlySalary - socialInsurance - monthlyTax;
  const yearlyAfterTax = monthlyAfterTax * 12 + (yearEndBonus - bonusTax);
  const yearlyWorkHours = averageWorkHours * WORKING_DAYS_PER_YEAR;

  return {
    socialInsurance,
    monthlyTax,
    bonusTax,
    monthlyAfterTax,
    yearlyAfterTax,
    yearlyWorkHours,
  };
}

module.exports = {
  calculateSalary,
  WORKING_DAYS_PER_YEAR,
};
