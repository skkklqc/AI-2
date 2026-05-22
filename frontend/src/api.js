const emptyGroup = () => ({
  monthlySalary: '',
  yearEndBonus: '',
  socialInsuranceRatio: '22',
  averageWorkHours: '8',
  province: '北京市',
  city: '北京市',
});

export async function calculateSalary(items) {
  const payload = {
    items: items.map((item) => ({
      monthlySalary: Number(item.monthlySalary),
      yearEndBonus: Number(item.yearEndBonus),
      socialInsuranceRatio: Number(item.socialInsuranceRatio),
      averageWorkHours: Number(item.averageWorkHours),
      region: `${item.province}-${item.city}`,
    })),
  };

  const response = await fetch('/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || '计算失败');
  }

  return data.results;
}

export { emptyGroup };
