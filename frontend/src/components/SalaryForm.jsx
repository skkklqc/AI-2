import { REGIONS } from '../data/regions';

const PRESETS = [
  {
    label: '北京 · 互联网',
    data: {
      monthlySalary: '30000',
      yearEndBonus: '80000',
      socialInsuranceRatio: '22',
      averageWorkHours: '10',
      province: '北京市',
      city: '北京市',
    },
  },
  {
    label: '深圳 · 金融',
    data: {
      monthlySalary: '25000',
      yearEndBonus: '50000',
      socialInsuranceRatio: '22',
      averageWorkHours: '9',
      province: '广东省',
      city: '深圳市',
    },
  },
  {
    label: '成都 · 国企',
    data: {
      monthlySalary: '12000',
      yearEndBonus: '20000',
      socialInsuranceRatio: '22',
      averageWorkHours: '8',
      province: '四川省',
      city: '成都市',
    },
  },
];

const GROUP_THEMES = ['theme-blue', 'theme-purple'];

function SalaryFormGroup({ index, data, onChange, showRemove, onRemove }) {
  const cities = REGIONS[data.province] || [];
  const theme = GROUP_THEMES[index] || GROUP_THEMES[0];

  const update = (field, value) => {
    onChange(index, { ...data, [field]: value });
  };

  const handleProvinceChange = (province) => {
    const nextCities = REGIONS[province] || [];
    onChange(index, {
      ...data,
      province,
      city: nextCities[0] || '',
    });
  };

  const applyPreset = (preset) => {
    onChange(index, { ...data, ...preset.data });
  };

  return (
    <div className={`form-group-card ${theme}`}>
      <div className="form-group-header">
        <div className="form-group-title">
          <span className="group-index">{index + 1}</span>
          <div>
            <h3>方案 {index + 1}</h3>
            <p>{data.province} · {data.city || '请选择城市'}</p>
          </div>
        </div>
        {showRemove && (
          <button type="button" className="btn-text" onClick={() => onRemove(index)}>
            移除方案
          </button>
        )}
      </div>

      <div className="preset-row">
        <span>快速填充</span>
        <div className="preset-buttons">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-btn"
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-sections">
        <section className="form-section">
          <h4>💼 收入信息</h4>
          <div className="form-grid">
            <label>
              <span>月薪（税前）</span>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={data.monthlySalary}
                  onChange={(e) => update('monthlySalary', e.target.value)}
                  placeholder="20000"
                  required
                />
                <em>元/月</em>
              </div>
            </label>

            <label>
              <span>年终奖</span>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={data.yearEndBonus}
                  onChange={(e) => update('yearEndBonus', e.target.value)}
                  placeholder="50000"
                  required
                />
                <em>元/年</em>
              </div>
            </label>
          </div>
        </section>

        <section className="form-section">
          <h4>📋 扣款比例</h4>
          <div className="form-grid">
            <label>
              <span>五险一金比例</span>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={data.socialInsuranceRatio}
                  onChange={(e) => update('socialInsuranceRatio', e.target.value)}
                  placeholder="22"
                  required
                />
                <em>%</em>
              </div>
              <small>一般约为 17%–23%，含个人与公司部分的个人缴纳项</small>
            </label>
          </div>
        </section>

        <section className="form-section">
          <h4>🕐 工作强度</h4>
          <div className="form-grid">
            <label>
              <span>平均工作时长</span>
              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={data.averageWorkHours}
                  onChange={(e) => update('averageWorkHours', e.target.value)}
                  placeholder="8"
                  required
                />
                <em>小时/天</em>
              </div>
              <small>含加班的平均值，用于换算真实时薪</small>
            </label>
          </div>
        </section>

        <section className="form-section">
          <h4>📍 生活城市</h4>
          <div className="form-grid">
            <label>
              <span>省份</span>
              <select
                value={data.province}
                onChange={(e) => handleProvinceChange(e.target.value)}
              >
                {Object.keys(REGIONS).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>城市</span>
              <select
                value={data.city}
                onChange={(e) => update('city', e.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SalaryForm({ groups, onGroupsChange, onSubmit, loading }) {
  const canAddSecond = groups.length < 2;

  const handleChange = (index, nextData) => {
    const next = [...groups];
    next[index] = nextData;
    onGroupsChange(next);
  };

  const handleAdd = () => {
    if (canAddSecond) {
      onGroupsChange([
        ...groups,
        {
          monthlySalary: '',
          yearEndBonus: '',
          socialInsuranceRatio: '22',
          averageWorkHours: '8',
          province: '上海市',
          city: '上海市',
        },
      ]);
    }
  };

  const handleRemove = (index) => {
    onGroupsChange(groups.filter((_, i) => i !== index));
  };

  return (
    <form
      className="salary-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="form-intro">
        <h2>填写薪资方案</h2>
        <p>输入你的 offer 信息，或点击快速填充体验示例数据</p>
      </div>

      <div className={`form-groups ${groups.length > 1 ? 'form-groups--dual' : ''}`}>
        {groups.map((group, index) => (
          <SalaryFormGroup
            key={index}
            index={index}
            data={group}
            onChange={handleChange}
            showRemove={groups.length > 1}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="form-actions">
        {canAddSecond && (
          <button type="button" className="btn-secondary" onClick={handleAdd}>
            <span className="btn-icon">+</span>
            添加对比方案
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              计算中...
            </>
          ) : (
            <>
              <span className="btn-icon">✦</span>
              开始计算
            </>
          )}
        </button>
      </div>
    </form>
  );
}
