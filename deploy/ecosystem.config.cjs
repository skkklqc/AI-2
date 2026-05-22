module.exports = {
  apps: [
    {
      name: 'salary-calculator',
      script: 'backend/index.js',
      cwd: '/home/ubuntu/salary-calculator',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '200M',
    },
  ],
};
