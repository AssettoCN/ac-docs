---
title: 基础语法
---

# 基础语法

INIpp 在标准 INI 格式上扩展了多项便捷语法，包括自动索引、多节赋值、引号值和多行列表。

## 自动索引节和值

使用 `...`（或 `…`）作为占位符，解析器会自动为每个节查找下一个可用的索引并按顺序排列。你也可以混合使用固定索引和自动索引。值也支持同样的自动索引机制。

### Before

```ini
[SECTION_...]
PROP_... = value 1
PROP_... = value 1

[SECTION_...]
PROP_... = value 1
```

### After

```ini
[SECTION_0]
PROP_0 = value 1
PROP_1 = value 1

[SECTION_1]
PROP_0 = value 1
```

## 多节同时赋值

不同节需要包含相同值时，可以在方括号中用逗号分隔列出多个节名，所有值将同时赋给列表中的每个节。

### Before

```ini
[SECTION_0]
KEY = 0

[SECTION_1]
KEY = 1

[SECTION_0, SECTION_1]
KEY_SHARED = VALUE
```

### After

```ini
[SECTION_0]
KEY = 0
KEY_SHARED = VALUE

[SECTION_1]
KEY = 1
KEY_SHARED = VALUE
```

## 引号值

在标准 INI 文件中，无法直接使用多行值或包含 `[`、`]`、`;`、`,`、`//` 等符号的值。INIpp 允许使用双引号 `"` 或单引号 `'` 包裹值，同时支持字符转义。

```ini
[SECTION]
KEY_0 = "value, with; \"all\" [sorts] of=//symbols"
KEY_1 = \"here, quotes do nothing"
KEY_2 = as well as "here"
KEY_3 = and\, this\, is\, a\, single\, value
KEY_4 = "easy to create
multiline strings too"
```

## 多行列表

对于较长的值，可以在行尾使用 `\` 续行，解析器会将其视为同一行。注意：如果值已被引号包裹，则续行符不会生效。

```ini
[GRASS_FX]
GRASS_MATERIALS = grass, grass_ext, sbancamento, grass_ext_flat, \
  gras_brd_ext, grs-brd
```

## 节跳过（Skipping）

可以通过设置 `ACTIVE = 0` 来强制 INIpp 移除整个节的内容。如果该值被设置，解析器会在最终阶段清除节中的所有其他值，适用于控制可选功能。

```ini
[SHADER_REPLACEMENT_...]
ACTIVE = $UseSpecificReplacement  ; skip section if variable wasn't set to 1
MATERIALS = $SomeMaterialsToTweak
SHADER = ksPerPixel

[SHADER_REPLACEMENT_...]
ACTIVE = ${OtherMaterialsToTweak:count}  ; if materials are not set, whole section will be skipped
MATERIALS = $OtherMaterialsToTweak
SHADER = ksPerPixelNM
```

::: tip 提示
更多关于变量（如 `$UseSpecificReplacement`、`${OtherMaterialsToTweak:count}`）的用法请参考[变量系统](./variables)。
:::

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
