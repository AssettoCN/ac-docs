---
title: 故障排除
---

# 故障排除

作为通用解决方案，建议运行 Steam 完整性检查。这不会删除你已安装的新车辆或赛道，只会将被修改的 Assetto Corsa 文件恢复为原始状态。

## 找不到 "\python33\PyObject_CallFunction"

请确保已安装 [Microsoft Visual C++ 2010 Redistributable Package (x64)](https://www.microsoft.com/en-gb/download/details.aspx?id=14632)（[直接下载链接](https://files.acstuff.ru/shared/iJVd/vcredist_x64_2010.exe)）。如果已经安装，重新安装一遍也可能有帮助。

## 图像翻转或分裂为两个翻转的大三角形

如果你使用的是 AMD 显卡，请确保在 Extra FX 设置中启用"Resolve MSAA for color"。

## 提示"GPU May be overheating or overclocked"

在 Custom Shaders Patch 的 General 设置中禁用"Use DXGI Flip Model"。

## 赛道或车辆某些部分轻微闪烁

在 Reflections FX 模块中禁用"Use proper physically-based sampling"。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-Troubleshooting) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
