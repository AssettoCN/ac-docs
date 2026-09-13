---
title: 水着色器
---


> 汉化标题：赛道 – 水着色器  
> 原文页面：Tracks-–-Water-shader  
> 原文锚点：a6b45a9  
> 汉化时间：2026-09-12T00:00:00+08:00  

### 水着色器

<img src="https://files.acstuff.ru/shared/SOUG/20220611-180033.png" width=380>

要使用新的 CSP 水着色器，添加：

```ini
[INCLUDE: common/materials_track.ini]

[Material_Water]
Materials = your_water_material
Type = POND                     ; 可用值：LAKE、POND、POOL、SEA、OCEAN
```

更多参数及详细文档请打开 “extension/config/tracks/common/materials_track.ini” 并查找 “[TEMPLATE: Material_Water]”：所有新参数都会在那里附带详细说明。

### 排水口

<img src="https://files.acstuff.ru/shared/hpXF/20220611-175637.png" width=380>

对于会随降雨积水的排水口，使用同一 “extension/config/tracks/common/materials_track.ini” 中的 `[Material_WaterDrain]`。更多说明见：https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/28463fa401fc91a0841a5757db431fd3ad9970ec/config/tracks/common/materials_track.ini#L399

### 焦散

要激活从水面弹回的光线，请设置 `[BOUNCED_LIGHT] CAUSTICS = 1`（需要 Extra FX 的反射光处于启用状态）。

