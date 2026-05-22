import IncomeBreakdown from './IncomeBreakdown';

const KPI_CARDS = [
  { key: 'finalHourlyRate', label: '真实时薪', unit: '元/时', icon: '⏱️', highlight: true },
  { key: 'yearlyAfterRent', label: '年薪去房租', unit: '元/年', icon: '🎯', highlight: true },
  { key: 'monthlyAfterTax', label: '月薪到手', unit: '元/月', icon: '💵' },
  { key: 'monthlyAfterRent', label: '月薪去房租', unit: '元/月', icon: '🏠' },
];

const DETAIL_ROWS = [
  { key: 'yearlyAfterTax', label: '年薪到手' },
  { key: 'socialInsurance', label: '月五险一金', monthly: true },
  { key: 'monthlyTax', label: '月个人所得税', monthly: true },
  { key: 'bonusTax', label: '年终奖个税', yearly: true },
  { key: 'averageRent', label: '参考月租', monthly: true },
];

const COMPARE_METRICS = [
  { key: 'finalHourlyRate', label: '真实时薪', unit: '元/时', better: 'high' },
  { key: 'yearlyAfterRent', label: '年薪去房租', unit: '元/年', better: 'high' },
  { key: 'monthlyAfterTax', label: '月薪到手', unit: '元/月', better: 'high' },
  { key: 'monthlyAfterRent', label: '月薪去房租', unit: '元/月', better: 'high' },
  { key: 'yearlyAfterTax', label: '年薪到手', unit: '元/年', better: 'high' },
];

function formatMoney(value, fraction = 2) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });
}

function getWinner(values, better = 'high') {
  if (values[0] === values[1]) return -1;
  return better === 'high'
    ? values[0] > values[1] ? 0 : 1
    : values[0] < values[1] ? 0 : 1;
}

function ResultCard({ result, index, inputData }) {
  const theme = index === 0 ? 'theme-blue' : 'theme-purple';

  return (
    <article className={`result-card ${theme}`}>
      <header className="result-card-header">
        <span className="group-index">{index + 1}</span>
        <div>
          <h3>方案 {index + 1}</h3>
          <span className="region-tag">{result.region}</span>
        </div>
      </header>

      <div className="kpi-grid">
        {KPI_CARDS.map(({ key, label, unit, icon, highlight }) => (
          <div
            key={key}
            className={`kpi-card ${highlight ? 'kpi-card--highlight' : ''}`}
          >
            <span className="kpi-icon">{icon}</span>
            <span className="kpi-label">{label}</span>
            <strong className="kpi-value">{formatMoney(result[key])}</strong>
            <span className="kpi-unit">{unit}</span>
          </div>
        ))}
      </div>

      <IncomeBreakdown
        result={result}
        monthlySalary={inputData?.monthlySalary}
      />

      <div className="detail-panel">
        <h4>明细拆解</h4>
        <dl className="detail-list">
          {DETAIL_ROWS.map(({ key, label }) => (
            <div key={key} className="detail-row">
              <dt>{label}</dt>
              <dd>¥{formatMoney(result[key])}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function ComparisonView({ results }) {
  const hourlyWinner = getWinner(
    [results[0].finalHourlyRate, results[1].finalHourlyRate]
  );
  const yearlyWinner = getWinner(
    [results[0].yearlyAfterRent, results[1].yearlyAfterRent]
  );

  return (
    <div className="comparison-view">
      <div className="comparison-summary">
        <div className={`summary-card ${hourlyWinner >= 0 ? 'winner' : ''}`}>
          <span className="summary-label">时薪更高</span>
          <strong>
            {hourlyWinner === -1
              ? '持平'
              : `方案 ${hourlyWinner + 1}`}
          </strong>
          {hourlyWinner >= 0 && (
            <span className="summary-diff">
              +¥{formatMoney(
                Math.abs(results[1].finalHourlyRate - results[0].finalHourlyRate)
              )}/时
            </span>
          )}
        </div>
        <div className="summary-vs">VS</div>
        <div className={`summary-card ${yearlyWinner >= 0 ? 'winner' : ''}`}>
          <span className="summary-label">年薪去房租更高</span>
          <strong>
            {yearlyWinner === -1
              ? '持平'
              : `方案 ${yearlyWinner + 1}`}
          </strong>
          {yearlyWinner >= 0 && (
            <span className="summary-diff">
              +¥{formatMoney(
                Math.abs(results[1].yearlyAfterRent - results[0].yearlyAfterRent),
                0
              )}
            </span>
          )}
        </div>
      </div>

      <div className="comparison-bars">
        {COMPARE_METRICS.map(({ key, label, unit, better }) => {
          const v0 = results[0][key];
          const v1 = results[1][key];
          const max = Math.max(v0, v1, 1);
          const winner = getWinner([v0, v1], better);

          return (
            <div key={key} className="compare-metric">
              <div className="compare-metric-header">
                <span>{label}</span>
                <span className="unit">{unit}</span>
              </div>
              <div className="compare-bar-row">
                <div className="compare-bar-group">
                  <div className="compare-bar-label">
                    方案 1
                    {winner === 0 && <span className="win-badge">优</span>}
                  </div>
                  <div className="compare-bar-track">
                    <div
                      className="compare-bar-fill theme-blue-fill"
                      style={{ width: `${(v0 / max) * 100}%` }}
                    />
                  </div>
                  <span className="compare-bar-value">¥{formatMoney(v0)}</span>
                </div>
                <div className="compare-bar-group">
                  <div className="compare-bar-label">
                    方案 2
                    {winner === 1 && <span className="win-badge">优</span>}
                  </div>
                  <div className="compare-bar-track">
                    <div
                      className="compare-bar-fill theme-purple-fill"
                      style={{ width: `${(v1 / max) * 100}%` }}
                    />
                  </div>
                  <span className="compare-bar-value">¥{formatMoney(v1)}</span>
                </div>
              </div>
              <div className="compare-diff">
                差额：
                <span className={v1 - v0 > 0 ? 'positive' : v1 - v0 < 0 ? 'negative' : 'neutral'}>
                  {v1 - v0 > 0 ? '+' : ''}
                  {formatMoney(v1 - v0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rent-note">
        参考月租：{results[0].region} ¥{formatMoney(results[0].averageRent, 0)} ·{' '}
        {results[1].region} ¥{formatMoney(results[1].averageRent, 0)}
      </div>
    </div>
  );
}

export default function ResultDisplay({ results, groups }) {
  if (!results || results.length === 0) {
    return (
      <section className="results-empty">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>填写方案并计算</h3>
          <p>结果将展示税后收入、去房租剩余、真实时薪及详细拆解</p>
        </div>
      </section>
    );
  }

  const showComparison = results.length === 2;

  return (
    <section className="results">
      <div className="results-header">
        <h2>{showComparison ? '方案对比结果' : '计算结果'}</h2>
        <p>
          {showComparison
            ? '综合时薪与生活成本，帮你判断哪个 offer 更划算'
            : '以下为你的薪资真实购买力分析'}
        </p>
      </div>

      {showComparison ? (
        <ComparisonView results={results} />
      ) : (
        <div className="result-cards">
          {results.map((result, index) => (
            <ResultCard
              key={index}
              result={result}
              index={index}
              inputData={groups?.[index]}
            />
          ))}
        </div>
      )}
    </section>
  );
}
