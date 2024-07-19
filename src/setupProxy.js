const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://data.tipp.page/json_export/data.json',
      changeOrigin: true,
    })
  );
};
