---
title: 应用图标
---

为了更方便地分发应用，CSP 现在允许将应用图标保存在应用文件夹内。

将 PNG 文件存储在 "apps/python/\<appfolder\>/icons" 中，格式为 PNG。CSP 会查找与应用名称（在 `ac.newApp()` 中使用的名称）同名的文件，如果找不到，则会尝试加载 "app.png"。

::: tip 提示
与原始 AC 图标需要同时提供激活和未激活两个版本不同，这里只需要一个版本。也不要使用圆形裁剪，直接使用覆盖整个区域的常规图片即可。CSP 会在需要时自动生成其余部分（当新任务栏样式被禁用时）。
:::

以下是图标的外观示例及其文件位置：

<img src="https://i.imgur.com/Ph3nYgr.png" />

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Python-Apps-–-App-icons) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
