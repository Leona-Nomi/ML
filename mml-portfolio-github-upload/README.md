# MML Portfolio Site

这是 MML 个人作品集静态网站，可直接上传到 GitHub 并导入 Vercel。

## 上传到 GitHub

将本文件夹内的全部内容上传到 GitHub 仓库根目录，确保 `index.html` 和 `assets` 文件夹位于仓库首页，而不是再套一层文件夹。

## Vercel 设置

- Framework Preset：`Other`
- Root Directory：`.`
- Build Command：留空
- Output Directory：留空
- Install Command：留空

## 本地预览

在本文件夹打开 PowerShell，执行：

```powershell
node server.mjs
```

然后打开 `http://127.0.0.1:4177`。

## 重要说明

- `assets` 文件夹必须和 HTML 文件一起上传。
- 不要删除页面引用的图片素材。
- `.gitignore` 已排除 `node_modules` 和日志文件。
- 这是静态网站，Vercel 不需要安装依赖或执行构建命令。
