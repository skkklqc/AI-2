function formatMoney(value) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

const SEGMENTS = [
  { key: 'monthlyAfterRent', label: '去房租剩余', color: '#22c55e' },
  { key: 'averageRent', label: '房租', color: '#f59e0b' },
  { key: 'socialInsurance', label: '五险一金', color: '#6366f1' },
  { key: 'monthlyTax', label: '个税', color: '#ef4444' },
];

export default function IncomeBreakdown({ result, monthlySalary }) {
  const total = Number(monthlySalary) || result.monthlyAfterTax + result.socialInsurance + result.monthlyTax + result.averageRent;

  if (total <= 0) return null;

  return (
    <div className="breakdown">
      <div className="breakdown-header">
        <h4>月薪构成</h4>
        <span>税前 ¥{formatMoney(total)}</span>
      </div>
      <div className="breakdown-bar">
        {SEGMENTS.map(({ key, label, color }) => {
          const value = result[key] ?? 0;
          const width = Math.max(0, (value / total) * 100);
          if (width <= 0) return null;

          return (
            <div
              key={key}
              className="breakdown-segment"
              style={{ width: `${width}%`, background: color }}
              title={`${label}: ¥${formatMoney(value)}`}
            />
          );
        })}
      </div>
      <ul className="breakdown-legend">
        {SEGMENTS.map(({ key, label, color }) => (
          <li key={key}>
            <span className="legend-dot" style={{ background: color }} />
            <span>{label}</span>
            <strong>¥{formatMoney(result[key] ?? 0)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
