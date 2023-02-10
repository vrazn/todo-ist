module.exports = {
  apps: [
    {
      cwd: "./client",
      name: "client",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
    {
      cwd: "./server",
      name: "server",
      script: "npm",
      args: "run start:prod",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
