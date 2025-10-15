module.exports = {
  apps: [
    {
      name: "go2frontend",
      script: "npm",
      args: "start",
      env: {
        PORT: 3001,
        NODE_ENV: "production",
        NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT: "https://go2njemacka.de/graphql"
      }
    }
  ]
};

