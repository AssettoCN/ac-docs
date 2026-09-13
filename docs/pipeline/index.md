---
title: AC 官方车辆管线 R2.0
---

# Assetto Corsa Pipeline for Community Modders R2.0

> 本文档提取自官方 SDK `sdk/dev/car_pipeline_2.0rev/AC_Pipeline_PUB_Rev2.0.pdf`（[英文原版](/en/pipeline/)）。

## 目录

- [1. 需求](01-requirements)
- [2. 基础准则](02-basic-guidelines)
- [3. 场景结构](03-scene-structure)
- [4. 功能网格元素](04-functional-mesh-elements)
- [5. 功能纹理](05-functional-textures)
- [6. 贴图准则](06-texturing-guidelines)
- [7. 动画](07-animations)
- [8. 材质与 AC 编辑器](08-materials-ac-editor)
- [9. 游戏内控制台命令](09-console-commands)

**开始之前：**

这是随游戏最初发布一同推出的 car-pipeline-1.03 文档的更新版。此后车辆生产管线经历了巨大变化，原版游戏收录的车辆与当前版本的要求差异极大，因此更新早已势在必行。
本文档所含信息与自 Japanese Pack DLC、经 Porsche Packs 到最近的 Ready To Race DLC 以来 KUNOS 官方发布的质量要求一致。可以说在 Assetto Corsa 剩余的生命周期内，这些要求不太可能再改变。
不过，一些新功能（尤其是数字仪表脚本等）仍可能继续增加，因此建议你关注官方支持论坛，随时了解这方面的进展。
由于开发周期的性质，我们持续向模拟器中加入新功能与新特性，所以本文档并非面面俱到。但每一节都会附上官方支持论坛中最相关的社区帖子链接，社区美术作者可以在那里找到支持，也可以为各自的项目寻求帮助。由于核心引擎没有变化，文档的部分内容（如动画和一般模型管理）保持不变。
出于兼容性考虑，旧 SDK 的内容仍可以在新 SDK 文件夹内的一个归档中找到。
注意：本文档中的大部分建议是面向我们内部的专业美术作者的。自然地，社区内容的创作没有这么严格，你愿意遵循多少取决于你自己的偏好与预期。
另请注意：Kunos 的美术人员不使用 Blender，因此这些准则与规则并不总能正确套用到该软件上，我们也无法协助你找到用 Blender 创作社区内容的正确方法。再次强烈建议你访问官方支持论坛的模组版块查找 Blender 相关信息。
重要：除本文档外，sdk/dev 文件夹还包含若干有用的文件夹，其中有场景层级、各类动画的示例与指南，以及一个供 3ds Max 使用的驾驶员绑定骨架。
