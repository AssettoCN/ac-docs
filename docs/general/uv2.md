---
title: UV2 贴图
---

# UV2 贴图

对于一些额外的细节，你现在可以为某些网格添加二级 UV 映射，并将其用于叠加纹理。例如，假设你正在制作一辆 F1 赛车，并且已经将其车身网格展开了，以便进行具有均匀分布细节的良好 AO 烘焙。你还想在上面添加一些贴纸，但对于 AO 纹理使用 2K 分辨率时贴纸看起来不够清晰，4K 又可能太多了。使用 UV2，你可以拥有一个完全专注于贴纸的独立展开，这样它们独立的纹理可以更高效地利用空间。

## 如何向 KN5 添加 UV2

目前，在现有的 KN5 格式中没有直接向模型添加 UV2 的好方法，但类似于 VAO 补丁，你可以生成一个额外的二进制文件供 CSP 读取和加载 UV2。只需使用 Content Manager：在 Content/Tools/Creator 中有一个工具，可以接收 FBX 文件，过滤出具有两个独立 UV 集的网格，并生成一个新的 `.uv2` 文件，你可以将其保存在 KN5 文件旁边（命名相同）。

## 如何在材质中使用 UV2

目前最简单的方法是使用着色器替换并从那里加载纹理（如果你不想让 `extension` 文件夹里有数百个纹理，请记住你始终可以将它们全部放入一个 zip 文件中，并以 `SOMETHING = textures.zip::path/in/zip.dds` 的方式引用）。

目前有三个着色器支持 UV2：
- `nePerPixelMultiMap_AT_NMDetail_stickers`
- `smCarPaint`（及其衍生版本）
- `stPerPixelMultiMap_specular`（以及 stPerPixelMultiMap_specular_damage_dirt）

着色器 `smCarPaint` 使用 `materials_carpaint.ini` 配置更容易，其中也包括贴纸。只需查找 StickersTexture、StickersMapsTexture 和 StickersCoverDetails 参数（提醒一下，使用那些 material_… 文件时，你始终可以打开文件本身，它们在前半部分都有完整文档）。

对于其他着色器，着色器替换可能看起来像这样：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = …
SHADER = nePerPixelMultiMap_AT_NMDetail_stickers
PROP_... = extStickersMode, 1
RESOURCE_0 = txStickers
RESOURCE_FILE_0 = my_texture_pack.zip::stickers.dds
```

属性 `extStickersMode` 是一组标志，也就是说，只需将你需要的值相加即可获得所需的行为。目前支持：

- `1`：激活贴图层（尽管任何其他标志也会激活它，而且使用 `nePerPixelMultiMap_AT_NMDetail_stickers` 着色器时它总是激活的）
- `2`：贴纸的 Alpha 也会影响漫反射纹理的 Alpha，这意味着细节纹理会被贴纸隐藏
- `4`：使用额外的 `txStickersMaps` 槽位来同时修改 `txMaps`（仅在 `txStickersMaps` 的 Alpha 非零的位置）
- `8`：仅 `nePerPixelMultiMap_AT_NMDetail_stickers` 可用，使用额外的 `txStickersNormals` 槽位来修改 `txNormal`，v0.1.80-preview446 新增

所以例如，如果你想同时使用细节隐藏和 `txStickersMaps`，只需将它们相加得到 `1+2+4=7`。如果你只需要细节隐藏，使用 `1+2=3`。

## 已知限制

- 虽然 CM 中的车辆 LOD 生成器支持 UV2，但可能仍然会有些混乱，请谨慎使用。某些模型甚至可能需要进一步调整 Simplygon 规则。
- UV2 使用半精度，在 0…1 范围内应该没问题，但如果超出该范围太多可能会引入伪影。

## 用例提示

- 在查找 UV2 补丁文件时，CSP 会首先检查皮肤文件夹，因此这可以用于创建一些高级皮肤。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-UV2) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
