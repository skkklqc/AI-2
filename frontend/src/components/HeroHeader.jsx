const FEATURES = [
  { icon: '💰', title: '税后到手', desc: '五险一金 + 个税精算' },
  { icon: '🏠', title: '扣除房租', desc: '按城市估算生活成本' },
  { icon: '⏱️', title: '真实时薪', desc: '换算你的时间价值' },
];

export default function HeroHeader() {
  return (
    <header className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <span className="hero-badge">Salary Calculator</span>
        <h1>
          薪资计算器
          <span className="hero-highlight">看清真实收入</span>
        </h1>
        <p className="hero-desc">
          不只看税前数字。一键算清税后到手、去房租剩余、以及每工作一小时的真正价值。
          支持两组 offer 对比，帮你做更聪明的职业选择。
        </p>
        <div className="feature-strip">
          {FEATURES.map((item) => (
            <div key={item.title} className="feature-pill">
              <span className="feature-icon">{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
