---
title: 文件包含
---

# 文件包含（Include）

一个 INI 文件可以通过 `[INCLUDE]` 节引用其他文件。被包含的文件会在 `[INCLUDE]` 节的位置加载。`[INCLUDE]` 节中还可以包含传递给被包含文件的参数（参见[变量系统](./variables)）。

## 基本语法

```ini
[INCLUDE]
INCLUDE = common/shared_file.ini

[INCLUDE]
; as a special section, you can define more than one of those, both files
; will be included
INCLUDE = common/another_shared_file.ini

; shorter syntax
[INCLUDE: common/shared_file.ini]
```

## 包含规则

- **单次包含**：每个文件默认只能被包含一次，重复包含会被忽略。
- **不同参数可重复包含**：如果 `[INCLUDE]` 节中的变量不同，同一文件可以被包含多次。
- **值覆盖**：如果被包含文件定义了某个属性 `[SECTION] KEY = VALUE`，可以在主文件中 `[INCLUDE]` 节之后重新定义该值来覆盖它（自动索引的节和键除外）。

## 参数传递

在 `[INCLUDE]` 节中设置的值会作为变量传递给被包含的文件，但不会影响主文件：

### main.ini

```ini
[INCLUDE: extra.ini]
SomeVariable = 10

; value of "SomeVariable" won't be available to "another_extra.ini"
[INCLUDE: another_extra.ini]

[SECTION_3]
LocalVariable = 1
KEY = $LocalVariable
```

### extra.ini

```ini
[SECTION_1]
KEY = $SomeVariable
```

关于变量的详细用法请参考[变量系统](./variables)。

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
