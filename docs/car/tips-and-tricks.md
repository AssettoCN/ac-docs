---
title: 技巧和提示
---


> 汉化标题：车辆 – 技巧和提示  
> 原文页面：Cars-–-Tips-and-tricks  
> 原文锚点：f6bf930  
> 汉化时间：2026-09-12T19:00:00+08:00  

这里有一些内容或许能帮助你为 Custom Shaders Patch 设置车辆，或者总体上对制作新车有所帮助。就像我以前那个旧博客里那些旧帖子的延续。:)

# 通用技巧

- 根据 PBR 公式，`ksFresnelEXP` 的最佳值为 5，并且可以将 `ksFresnelMaxLevel` 计算为 `min(1, ksFresnelC * 50)`（[来源](https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf)，第 78 页）。不确定它是否适用于所有情况，但对于塑料、玻璃或铬之类的某些材质，我建议使用这些值。

- 如果你知道某个网格不会渲染在背景之上（比如并没有那么凸出的大灯玻璃），不使用 `IsTransparent` 标志可能更好；相反，只需通过调整优先级把它移到最后，就能省下一点 FPS 并改善整体观感（另外，如果你有多层叠加内容，这样做也会让正确设置容易得多）。

- 即使你不打算设置损坏或泥土效果，也请为车漆使用 `ksPerPixelMultiMap_damage_dirt` 着色器（只需用透明纹理填满那些槽位）。总的来说，我建议让事情尽量与 Kunos 的做法保持一致。

# Custom Shaders Patch

- 务必确保有正确的 `COCKPIT_HR` 节点：补丁一直在用它来区分车内与车外，例如猜测灯光的作用、应用内部遮罩、调整后视镜中的反射等等。

- 使用 `DOUBLE_FACE_SHADOW_BIASED` 让表面从两侧投射阴影：

  ```ini
  [SHADER_REPLACEMENT_...]
  MESHES = tailight_SUB0, taillight_emissiveA, taillight_emissive, body, body_top, boot_cover,\
    material:needle_body, bouton_dashboard
  DOUBLE_FACE_SHADOW_BIASED = 1
  ```

  还有一个 `DOUBLE_FACE_SHADOW` 选项，但 `DOUBLE_FACE_SHADOW_BIASED` 会自动添加少量偏置来减少自阴影。不过不要过度使用此选项，因为它可能会增加绘制阴影的时间（要画两个面）。

- 下面这段配置可将 SSLR 反射的锐度提高 80%：

  ```ini
  [SHADER_REPLACEMENT_...]
  MATERIALS = EXT_Lights_base
  PROP_0 = extExtraSharpLocalReflections, 0.8
  ```

  适合某些反射不够锐利的铬质部件，让它们看起来不那么怪异，同时又能受益于锐利的局部反射。

- 使用 `SHADER_REPLACEMENT` 节时，请尽量引用材质而非网格。如果你在其中修改材质属性或纹理，每个网格都会创建一份新材质。

