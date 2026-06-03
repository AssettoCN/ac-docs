---
title: 颈部效果
---

# 颈部效果（Neck FX）

使用这些选项，你可以调整第一人称视角中驾驶员头部的移动方式（需启用 Neck FX）。

## 语法

```ini
[NECK]
HELMET_OFFSET = 0, 0, 0             ; 添加此选项以设置自定义头盔偏移（如果已启用）
BOUNDS_HORIZONAL = -130, 130        ; 头部在 Y 轴上允许旋转的角度范围
BOUNDS_VERTICAL = -50, 50           ; 头部在 X 轴上允许旋转的角度范围
LOOK_BACK_OFFSET = 0.24, 0.0, 0.15  ; 回头看时的头部偏移（减少被车辆遮挡：例如，在 F1 赛车中，
                                     ; 你可能想要增加 Y 值）
PAN_LIMIT = 0.15, 0.1               ; 平移的边界，X 和 Y 方向，单位为米
```

你可以在比赛或回放期间更改这些设置，以便更精确地调整。

## 自动猜测

开放式车轮的 `LOOK_BACK_OFFSET` 的 Y 值默认为 0.07。此外，`PAN_LIMIT` 为 0.08, 0.06。其他所有设置与语法部分中显示的一致。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Neck-FX) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
