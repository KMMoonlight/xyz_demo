import { createProxyMiddleware } from 'http-proxy-middleware'
export default function (req, res) {
  let target = ''
  let rewrite = () => {}

  if (req.url.startsWith('/api')) {
    target = 'https://api.xiaoyuzhoufm.com'
    rewrite = (path) => path.replace(/^\/api/, '')
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: rewrite,
  })(req, res)
}
