---
title: UV2
---


> 汉化标题：通用 – UV2  
> 原文页面：General-–-UV2  
> 原文锚点：a960907  
> 汉化时间：2026-09-12T19:00:00+08:00  

现在你可以为某些网格添加第二套 UV 映射，并将其用于叠加纹理，以获得更多细节。举个例子，假设你正在制作一辆 F1 赛车，并且已经对车身网格做了展开，以便烘焙出细节均匀分布的漂亮 AO。你还想在上面加一些贴纸，但 AO 纹理只有 2K 分辨率的话，贴纸看起来会很寒酸，而 4K 又可能有点过头。有了 UV2，你可以专门为贴纸单独做一次展开，让它们独立的纹理可以更高效地利用空间。

### 如何向 KN5 添加 UV2

目前，以现有的 KN5 格式还没有什么好办法直接向模型添加 UV2，不过与 VAO 补丁类似，你可以生成一个额外的二进制文件，供 CSP 读取并从中加载 UV2。只需使用 Content Manager：Content/Tools/Creator 中有一个工具，可以读取 FBX 文件，筛选出具有两套独立 UV 的网格，并生成一个新的“.uv2”文件，你可以将它保存到 KN5 文件旁边（使用相同的文件名）。

### 如何在材质中使用 UV2

目前最简单的方式是使用着色器替换，并从中加载纹理（如果你不想让“extension”文件夹里最终塞满成百上千张纹理，请记住你随时可以把它们全部放进一个 zip 文件，然后用“SOMETHING = textures.zip::path/in/zip.dds”的方式引用）。

目前有三个支持 UV2 的着色器：
- `nePerPixelMultiMap_AT_NMDetail_stickers`；
- `smCarPaint`（及其衍生版本）；
- `stPerPixelMultiMap_specular`（以及 stPerPixelMultiMap_specular_damage_dirt）。

着色器 `smCarPaint` 用“materials_carpaint.ini”配置起来更容易，其中也包括贴纸。只需查找 StickersTexture、StickersMapsTexture 和 StickersCoverDetails 参数（提醒一下，对于这些 material_… 文件，你随时可以打开文件本身查看，它们的前半部分都有完整的文档说明）。

对于其他着色器，着色器替换可能长这样：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = …
SHADER = nePerPixelMultiMap_AT_NMDetail_stickers
PROP_... = extStickersMode, 1
RESOURCE_0 = txStickers
RESOURCE_FILE_0 = my_texture_pack.zip::stickers.dds
```

属性 `extStickersMode` 是一组标志，也就是说，只需把你需要的值相加即可得到所需的行为。目前支持：

- `1`：激活贴纸层（不过其他任何标志也会激活它，而且在使用 `nePerPixelMultiMap_AT_NMDetail_stickers` 着色器时它始终处于激活状态）；
- `2`：贴纸的 Alpha 也会影响漫反射纹理的 Alpha，也就是说细节纹理会被贴纸遮挡；
- `4`：使用额外的 `txStickersMaps` 槽位来同时修改 `txMaps`（仅在 `txStickersMaps` 的 Alpha 非零的地方生效）；
- `8`：仅 `nePerPixelMultiMap_AT_NMDetail_stickers` 可用，使用额外的 `txStickersNormals` 槽位来修改 `txNormal`，添加于 v0.1.80-preview446。

因此，举例来说，如果你想同时使用细节遮挡和 `txStickersMaps`，把它们全部相加即可，得到 `1+2+4=7`。如果只需要细节遮挡，使用 `1+2=3`。

### 已知限制

- 虽然 CM 中的车辆 LOD 生成器支持 UV2，但仍可能出现一些混乱，请谨慎使用。某些模型甚至可能需要进一步调整 Simplygon 规则。
- UV2 使用半精度，在 0…1 范围内应该没问题，但超出该范围太远可能会引入伪影。

### 用例提示

- 在查找 UV2 补丁文件时，CSP 会首先检查涂装文件夹，因此可以利用这一点来制作一些高级涂装。

