# 短信轰炸

这是一个基于 Cloudflare Pages 的演示项目，包含一个前端页面和一个简单的 CORS 代理服务。

## 项目说明

- `index.html`：SMS 短信压力测试系统的前端页面。
- `functions/[[path]].js`：Cloudflare Pages Functions，提供通用 CORS 代理功能。
- `wrangler.toml`：Cloudflare Pages 配置文件。

## 特点

- 黑暗风格的前端界面，适合展示测试工具。
- 支持通过 `url` 参数或路径直接代理外部请求。
- 对 `OPTIONS` 预检请求返回通用 CORS 头。
- 内置 30 秒超时保护。

## 使用方法

1. 将项目部署到 Cloudflare Pages。
2. 访问根目录页面查看前端。
3. 使用 代理服务转发请求。

## 部署

1. 登录 Cloudflare。
2. 新建 Pages 项目并连接仓库。
3. 将 `publish` 目录设置为当前项目根目录。
4. 点击部署。

## 推荐网站

如果你喜欢这个项目，也可以访问我的另一个网站：

-https://aur.ccwu.cc

这个网站也包含了更多有趣的内容和项目分享，欢迎查看。

---


> 备注：请在使用本项目时遵守相关法律法规，合理使用网络测试工具。
