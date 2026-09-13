---
title: 杂项选项
---


> 汉化标题：赛道 – 杂项选项  
> 原文页面：Tracks-–-Miscellaneous-options  
> 原文锚点：a0afe18  
> 汉化时间：2026-09-12T00:00:00+08:00  

一批可能值得配置的小功能。

### 观众闪光

CSP 0.1.77 更新为赛道观众添加了照相机闪光效果——在有观众的区域，当附近发生有趣的事情时自动触发。要启用它们，可使用类似这样的配置：

```ini
[CONDITION_...]
NAME = CROWD_FLICKERING_NEW
INPUT = SUN
LUT = (|0=0|85=0|85=1|180=1)

[SPECTATORS]
FLASH_INTENSITY = CROWD_FLICKERING_NEW
```

也可以不用条件，直接设置固定值，比如 1。如果你的赛道上不适合出现闪光，就设为 0（或者干脆不设，默认值就是 0）。

### 远景几何体

<img src="https://files.acstuff.ru/shared/QBdC/20220509-185038-shuto_revival_project_beta-ks_audi_a1s1.jpg" width=380>

只需使用 “materials_track.ini” 中的 `[Material_DistantGeometry]`，即可让网格无论多远都可见。不过，如果距离太远，可能出现一些 Z-fighting 问题。这种情况下，只需按正确顺序先绘制这些网格（通过相应地调整绘制顺序），并将深度测试设为 `LESSEQUAL`。

### 彩色折射玻璃

<img src="https://files.acstuff.ru/shared/jGjR/20200728-035856.png" width=380>

只需在 “materials_glass.ini” 中找到 `[Material_Glass]`。`MaskPass` 可以让玻璃带上颜色（与其后的颜色相乘），`Refraction` 参数则添加折射。此外，`RefractionBias` 可用于模糊玻璃后面的内容，实现某种磨砂玻璃效果。仅对带透明标志（transparent flag）的网格有效。

### 夜间光污染

你可以在给定半径内按设定的密度提高夜间的整体环境基础亮度。目前每个赛道配置只支持一个这样的小节。

```ini
[LIGHT_POLLUTION]
RELATIVE_POSITION = 0, 0, 0  ; 除密度/颜色外，所有值都以公里为单位
RADIUS_KM = 0.5
DENSITY = 0.35               ; 百分比/100
COLOR = 0.95, 0.8, 0.7       ; r,g,b
```

### 使树木与下方表面对齐

<a href="https://acstuff.ru/u/comparison/7Nl" title="Click to see the comparison"><img src="https://files.acstuff.ru/shared/MuXY/20220611-185902-la_canyons-ks_bmw_m4.jpg" width=380></a>

如果你的赛道有很多长满植被的山丘，当树木和灌木在山的向阳面和背阴面被均匀照亮时，看起来可能会不协调。使用此功能可将植被的光照与其下方表面的光照关联起来：

```ini
[ALIGN_TREES_...]
SURFACE_MATERIALS = terrain_01
TREE_MATERIALS = shader:ksTree
```

这会略微增加初始加载时间，但之后计算出的数据会被缓存。

### 修复与视线方向对齐的树三角面

<a href="https://acstuff.ru/u/comparison/1FA" title="Click to see the comparison"><img src="https://files.acstuff.ru/shared/wozy/20220611-191114.png" width=380></a>

在新树木系统仍在开发期间，这里有一个廉价而简单的修复方法，可隐藏与摄像机视线对齐、因而看起来像细线的树三角面：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = shader:ksTree?
MATERIAL_FLAG_0 = 1
```

### 双面偏置阴影

如果你发现赛道上的阴影与投射它们的物体分离，一个简单的修复方法是使用双面偏置阴影：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = building?, box?
DOUBLE_FACE_SHADOW_BIASED = 1
```

你可以直接对所有材质使用 “?”，但只对需要的对象应用效果可能更好，避免对大型水平表面或由两个背靠背、中间没有空隙的平面组成的物体设置（该选项可能让这些物体的阴影看起来更糟）。

### 平铺修复

<a href="https://acstuff.ru/u/comparison/UjP" title="Click to see the comparison"><img src="https://files.acstuff.ru/shared/ZvJr/20220611-191813-ks_silverstone1967-ks_bmw_m4.jpg" width=380></a>

厌倦了平铺痕迹明显的纹理？这里有一个从 CSP 最早版本就存在的修复（所以它看起来如此不常规）：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = grass-shad
PROP_... = ksAlphaRef, -193
```

适用于：
- ksMultilayer；
- ksMultilayer_fresnel_nm；
- ksPerPixelMultiMap_NMDetail；
- ksPerPixelMultiMap_AT_NMDetail；
- nePerPixelMultiMap_parallax；
- nePerPixelMultiMap_tessellation。

此外，`ksMultilayer_fresnel_nm4` 和 `ksMultilayer_objsp_nm4` 有单独的选项。如果你正在使用 `ksPerPixel` 并想修复平铺，只需切换到带修复的着色器：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = my_material
SHADER = ksPerPixel_tilingfix
```

### 大型低多边形网格的逐像素雾

目前默认情况下，大多数着色器在顶点着色器中计算雾，如果网格多边形太少，雾看起来会很怪。这些低多边形网格通常使用 `ksPerPixel` 着色器，因此只需切换到带逐像素雾的着色器即可：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = my_material
SHADER = ksPerPixel_ppfog
```

其他使用逐像素雾的着色器：

- ksPerPixel_horizon（由 `[Material_Horizon]` 使用，该材质面向那些环绕赛道的管状网格）；
- ksPerPixel_tilingfix；
- smWaterSurface。

### 聚光灯

如果你有一个用于聚光灯的简单发光网格，有一个选项可以在摄像机正对它时提升其发光强度：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = spotlight_emissive
PROP_... = ksAlphaRef, -193
```

可用于：

- ksPerPixel；
- ksPerPixelAlpha；
- ksPerPixelAT。

### 可燃材质

某些材质可以点燃：

https://github.com/ac-custom-shaders-patch/acc-extension-config/assets/3996502/4d9fe189-7c5c-4784-ab51-4ed6256f0a35

要启用，请在你的 `[SHADER_REPLACEMENT_...]` 中添加：

```ini
ATTRIBUTE_0 = ParticlesFX.Flammable, 1
```

或者直接使用 “materials_track.ini” 中的 `[Material_Bale]`。目前只有干草材质会在燃烧时变暗，如果其他着色器也需要这种效果，请告诉我。另外，最好让可燃网格保持相对简单，因为火焰蔓延之类的事情会用到一些射线检测。

