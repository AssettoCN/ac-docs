---
title: 虚假阴影特效
---


> 汉化标题：车辆 – 虚假阴影特效  
> 原文页面：Cars-–-Fake-Shadows-FX  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

自 v0.1.37 起，Custom Shaders Patch 的虚假阴影特效（Fake Shadows FX）会在首次加载时即时烘焙车辆阴影（原版 AC 中存储为 “body_shadow.png”），以确保阴影以正确的设置烘焙。为节省时间，它还会将阴影存入缓存。

默认情况下，CSP 按车辆缓存阴影（即所有涂装共用同一阴影），并使用所有非透明的投影网格进行烘焙。

### 语法

```ini
[FAKE_SHADOWS_FX]
DISALLOW_REBAKING = 0 ; 设为 1 可阻止 CSP 生成新的虚假阴影（不推荐）
CUSTOM_SKIN_SHADOWS = 0 ; 改为 1 可让 CSP 为不同涂装分别缓存阴影（可用于
                        ; 单一涂装的扩展配置），适用于带有自定义几何的涂装
EXCLUDE_FROM_BAKING = material:EXT_glass ; 要从烘焙中排除的节点和网格列表
```

设置就这么多！这次我真的希望所有车辆的阴影看起来都一致。

