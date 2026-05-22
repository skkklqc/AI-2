const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { calculateSalary } = require('./services/taxCalculator');
const { getAverageRent } = require('./services/rentService');

const app = express();
const PORT = process.env.PORT || 3001;
const frontendDist = path.join(__dirname, '../frontend/dist');

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/calculate', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: '请提供至少一组计算数据' });
    }

    const results = [];

    for (const item of items) {
      const {
        monthlySalary,
        yearEndBonus,
        socialInsuranceRatio,
        averageWorkHours,
        region,
      } = item;

      if (
        monthlySalary == null ||
        yearEndBonus == null ||
        socialInsuranceRatio == null ||
        averageWorkHours == null ||
        !region
      ) {
        return res.status(400).json({ error: '请填写完整的薪资信息' });
      }

      const salary = calculateSalary({
        monthlySalary: Number(monthlySalary),
        yearEndBonus: Number(yearEndBonus),
        socialInsuranceRatio: Number(socialInsuranceRatio),
        averageWorkHours: Number(averageWorkHours),
      });

      const rent = await getAverageRent(region);
      const monthlyAfterRent = salary.monthlyAfterTax - rent;
      const yearlyAfterRent =
        monthlyAfterRent * 12 + (Number(yearEndBonus) - salary.bonusTax);
      const finalHourlyRate =
        salary.yearlyWorkHours > 0
          ? yearlyAfterRent / salary.yearlyWorkHours
          : 0;

      results.push({
        region,
        monthlyAfterTax: round2(salary.monthlyAfterTax),
        yearlyAfterTax: round2(salary.yearlyAfterTax),
        monthlyAfterRent: round2(monthlyAfterRent),
        yearlyAfterRent: round2(yearlyAfterRent),
        finalHourlyRate: round2(finalHourlyRate),
        averageRent: rent,
        socialInsurance: round2(salary.socialInsurance),
        monthlyTax: round2(salary.monthlyTax),
        bonusTax: round2(salary.bonusTax),
      });
    }

    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '计算失败，请稍后重试' });
  }
});

function round2(value) {
  return Math.round(value * 100) / 100;
}

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Salary calculator running at http://localhost:${PORT}`);
  if (!fs.existsSync(frontendDist)) {
    console.log('提示: 请先运行 npm run build 构建前端页面');
  }
});
