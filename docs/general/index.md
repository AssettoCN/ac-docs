---
title: 通用功能概览
---

# 通用功能概览

Custom Shaders Patch（CSP）分为多个模块，可以单独禁用。部分选项不属于任何模块，也有一些功能无法被禁用。本章节涵盖了 CSP 的各项通用功能与配置说明。

## 模块说明

### Lighting FX（光照效果）

为赛道和车辆灯光添加动态光照，例如车头灯。赛道灯光由赛道配置设定，车辆灯光可以在配置中定义，如果没有定义，则根据模型、纹理以及制造年份等参数自动推测。使用 [BVH 加速着色](https://worldoffries.wordpress.com/2015/02/19/simple-alternative-to-clustered-shading-for-thousands-of-lights/) 技术加速渲染，支持同时渲染数百个灯光。

支持的灯光类型：
- 点光源（Point light）
- 聚光灯（Spot light）
- 双裁剪聚光灯，用于车头灯（Double trimmed spot light）
- 线光源，用于车身底部霓虹灯等（Line light）

### Extra FX（额外效果）

添加额外的渲染通道以获取更多场景信息，如法线贴图、深度或运动缓冲区。基于这些信息，可以实现以下新效果：

- 局部反射（SSLR）
- 环境光遮蔽（SSAO 或 HBAO+）
- 新版运动模糊
- 时间抗锯齿（TAA）
- 简单局部光线反弹（SSGI）
- [场景光线反弹](https://youtu.be/R9gsC5vB1Eg)（非屏幕空间）
- 体积光（Volumetric lights）
- 雾气模糊

<!-- Image: https://i.imgur.com/as1FEAj.png — 体积光效果截图 -->

## 本章节目录

| 页面 | 说明 |
|------|------|
| [故障排除](./troubleshooting) | 常见问题及解决方法 |
| [过滤规则](./filtering) | 配置中实体过滤、遮罩与扩展过滤语法 |
| [线性色彩空间](./linear-color-space) | 线性色彩空间功能详解（v0.2.3 新增） |
| [着色器替换](./shader-replacements) | 静态替换着色器、材质参数、纹理及对象属性 |
| [模型替换](./model-replacements) | 移除、替换或插入 3D 模型片段 |
| [场景查询](./scene-queries) | 节点和网格的高级查询语法 |
| [Extra FX 标志](./extra-fx-flags) | Extra FX 透明度、运动模糊与 TAA 相关标志 |
| [Extra FX 自发光](./extra-fx-emissive) | 自发光网格向周围几何体投射实际光照 |
| [UV2 贴图](./uv2) | 二级 UV 映射与贴花纹理叠加 |
| [网格调整](./mesh-adjustment) | 调整网格对象属性，如可见性、层级等 |
| [截图命名格式](./screenshots-name-format) | 自定义截图文件名格式（v0.1.60 新增） |

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-CSP-features) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
