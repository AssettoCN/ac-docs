---
title: 模板
---

# 模板（Templates）

模板允许你创建自定义的节类型，将其展开为不同的配置。

## 基本用法

使用 `[TEMPLATE: Name]` 定义模板。其他节通过 `: TemplateName` 引用模板：

```ini
[TEMPLATE: Material_CarPaint]   ; prefix "TEMPLATE:" specifies it's a template
SHADER = smCarPaint             ; this property will be copied to any section based on this template
MATERIALS = $CarPaintMaterial   ; templates can have their own variables

[SHADER_REPLACEMENT_... : Material_CarPaint]  ; with ":", it marks section as based on a template
CarPaintMaterial = CarPaint_EXT               ; this is how section can specify template properties
SKINS = new_skin                              ; plus, it can define its own properties
```

展开结果：

```ini
[SHADER_REPLACEMENT_0]
MATERIALS = CarPaint_EXT
SHADER = smCarPaint
SKINS = new_skin
```

::: warning 注意
请使用 CamelCase（驼峰命名）为模板和变量命名。CSP 与大多数应用一样，期望值为大写，使用 CamelCase 可以减少命名冲突。
:::

## 默认输出名称（@OUTPUT）

模板可以通过 `@OUTPUT` 属性指定默认的输出节名。建议在 `@OUTPUT` 中使用 `...` 自动索引，因为模板的主要目的就是能够多次使用。

```ini
[TEMPLATE: Material_CarPaint]
CarPaintShader = smCarPaint                 ; this is how pattern can define value by default
@OUTPUT = SHADER_REPLACEMENT_0CARPAINT_...  ; I highly recommend to use "..." in there: the whole idea 
                                            ; of templates was to be able to use them more than once
SHADER = $CarPaintShader
MATERIALS = $CarPaintMaterial

[Material_CarPaint]
CarPaintMaterial = CarPaint_EXT
```

输出：

```ini
[SHADER_REPLACEMENT_0CARPAINT_0]
MATERIALS = CarPaint_EXT
SHADER = smCarPaint
```

## 模板继承（EXTENDS）

模板可以通过 `EXTENDS` 关键字继承其他模板：

```ini
[TEMPLATE: Material_CarPaint]
@OUTPUT = SHADER_REPLACEMENT_0CARPAINT_...
SHADER = smCarPaint
MATERIALS = $CarPaintMaterial

[TEMPLATE: Material_CarPaint_Old EXTENDS Material_CarPaint]
SHADER = smCarPaint_old

[Material_CarPaint_Old]
CarPaintMaterial = CarPaint_EXT

[Material_CarPaint_Old]  ; notice how we use the same template twice, with different parameters
CarPaintMaterial = CarPaint_EXT2
SKINS = some_skin
```

输出：

```ini
[SHADER_REPLACEMENT_0CARPAINT_0]
MATERIALS = CarPaint_EXT
SHADER = smCarPaint_old

[SHADER_REPLACEMENT_0CARPAINT_1]
MATERIALS = CarPaint_EXT2
SHADER = smCarPaint_old
SKINS = some_skin
```

在日常使用中，模板的定义通常隐藏在被包含的文件中，使用者只需关注参数设置即可。

::: tip 提示
模板还可以使用 `@ACTIVE` 标志（与 Mixin 类似），详见 [Mixin 与生成器](./mixins-generators)。
:::

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
