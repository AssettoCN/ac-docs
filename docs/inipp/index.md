---
title: INIpp 预处理器
---

# INIpp 预处理器

INIpp 是对经典 INI 格式的扩展，专为 Assetto Corsa 的 Custom Shaders Patch (CSP) 设计，旨在简化配置文件的编写。它在标准 INI 格式基础上增加了预处理能力，使复用、参数化和组合配置变得更加容易。

INIpp 预处理器默认以 JSON 格式输出数据（因为并非所有数据都能用标准 INI 表示），也可以通过标志切换行为。

## 核心特性

- **[基础语法](./basic-syntax)** — 自动索引节和键、多节赋值、引号值、多行列表、节跳过
- **[变量系统](./variables)** — `$Var` / `${Var}` 变量引用、子集截取、修饰符（`:count`、`:exists`、`:vec3`、`:required`）、作用域
- **[文件包含](./include)** — `[INCLUDE]` 指令、参数传递、包含机制
- **[表达式](./expressions)** — Lua 表达式 `$"..."`、变量替换、向量运算
- **[函数](./functions)** — `[FUNCTION: Name]` 定义、外部 Lua 文件 `[USE:]`
- **[模板](./templates)** — `[TEMPLATE:]`、`@OUTPUT`、继承（`EXTENDS`）
- **[Mixin 与生成器](./mixins-generators)** — `[MIXIN:]`、`@ACTIVE`、`@MIXIN`、`@GENERATOR`、多维生成器

## 快速示例

以下示例展示了 INIpp 的一些常见用法（同一节名重复使用时，会自动展开为不同的索引节）：

```ini
[INCLUDE: common/materials_carpaint.ini]
CarPaintMaterial = Carpaint

[Material_CarPaint]
Skins = ?
ClearCoatThickness = 0.1

[Material_CarPaint]
Skins = thick
ClearCoatThickness = 0.5

[Material_CarPaint_Gold]
Skins = yellow
```

::: tip 提示
如果你是在为 CSP 编写配置，大部分高级功能（模板、Mixin、生成器等）主要用于可复用的标准包含文件，日常使用中不一定需要深入了解。
:::

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
