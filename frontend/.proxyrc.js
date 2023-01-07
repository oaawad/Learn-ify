const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/courses/api', {
      target: 'http://localhost:5555/',
      changeOrigin: true,

      pathRewrite: {
        '^/courses/api': '/api',
      },
    })
  );
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:5555/',
      changeOrigin: true,

      pathRewrite: {
        '^/api': '/api',
      },
    })
  );
};
