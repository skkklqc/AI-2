import { useState } from 'react';
import HeroHeader from './components/HeroHeader';
import SalaryForm from './components/SalaryForm';
import ResultDisplay from './components/ResultDisplay';
import { calculateSalary, emptyGroup } from './api';

export default function App() {
  const [groups, setGroups] = useState([emptyGroup()]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const data = await calculateSalary(groups);
      setResults(data);
    } catch (err) {
      setResults([]);
      setError(err.message || '计算失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <HeroHeader />

      <main className="app-main">
        <SalaryForm
          groups={groups}
          onGroupsChange={setGroups}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <ResultDisplay results={results} groups={groups} />
      </main>

      <footer className="app-footer">
        <p>个税按中国现行累计预扣法估算 · 房租数据来自城市均值参考</p>
      </footer>
    </div>
  );
}
