---
title: 水面着色器
---

# 水面着色器

## 水面着色器

要使用新的 CSP 水面着色器，添加：

```ini
[INCLUDE: common/materials_track.ini]

[Material_Water]
Materials = your_water_material
Type = POND                     ; 可用值：LAKE、POND、POOL、SEA、OCEAN
```

有关更多参数和详细文档，打开 "extension/config/tracks/common/materials_track.ini" 并查找 `[TEMPLATE: Material_Water]`：所有新参数都会在那里显示并附有详细说明。

## 排水系统

对于随雨水填充的排水系统，使用同一文件 "extension/config/tracks/common/materials_track.ini" 中的 `[Material_WaterDrain]`。

详见：[GitHub 链接](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/28463fa401fc91a0841a5757db431fd3ad9970ec/config/tracks/common/materials_track.ini#L399)

## 焦散效果

要激活水面反射回来的光线，设置 `[BOUNCED_LIGHT] CAUSTICS = 1`（需要 Extra FX 的反射光功能处于激活状态）。

参见：[反射光（Bounced Light）](./bounced-light.md)

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Water-shader) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
