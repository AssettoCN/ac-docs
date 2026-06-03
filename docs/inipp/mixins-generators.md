---
title: Mixin 与生成器
---

# Mixin 与生成器

## Mixin

Mixin 与模板类似，但可以通过条件来激活或停用，使其在特定场景下非常有用。

例如，模板可能接收 mesh 列表或 material 列表，需要分别设置 `MESHES = ${Meshes}` 或 `MATERIALS = ${Materials}`，但空列表不应设置该值（因为 `MESHES = ` 可能意味着不应用于任何 mesh）。使用 Mixin 可以轻松实现：

```ini
[MIXIN: _MeshesFilter]
@ACTIVE = ${Meshes:count}
MESHES = ${Meshes}

[MIXIN: _MaterialsFilter]
@ACTIVE = ${Materials:count}
MATERIALS = ${Materials}

[TEMPLATE: Material_DigitalScreen]
@OUTPUT = SHADER_REPLACEMENT_0_SCREEN_...
ACTIVE = $" ${Meshes:count} + ${Materials:count} "
@MIXIN = _MeshesFilter
@MIXIN = _MaterialsFilter
```

### Mixin 特性

- 不仅模板，任何节都可以引用 Mixin
- Mixin 可以包含其他 Mixin
- Mixin 支持 `extends` 关键字，可以在其他 Mixin 基础上构建（类似模板）
- Mixin 在被引用时立即生效：可以通过重复 `@MIXIN` 并在第二次调用前重新定义参数，来以不同参数调用同一个 Mixin

## 生成器（Generators）

生成器允许模板生成多个节。

### 基本示例

```ini
[TEMPLATE: _SimpleGenerator_0]
@OUTPUT = SIMPLE_GENERATOR_0
KEY_0 = $Value

[TEMPLATE: _SimpleGenerator_1]
@OUTPUT = SIMPLE_GENERATOR_1
KEY_1 = $" 2 * $Value "

[TEMPLATE: SimpleGenerator]
Value = 1 ; default value could be set as well
@GENERATOR = _SimpleGenerator_0
@GENERATOR = _SimpleGenerator_1

[SimpleGenerator]
Value = 5
```

输出：

```ini
[SIMPLE_GENERATOR_0]
KEY_0 = 5

[SIMPLE_GENERATOR_1]
KEY_1 = 10
```

### 向子模板传递不同参数

同一子模板可以多次使用，主生成模板可以向每个子模板传递不同参数：

```ini
[TEMPLATE: _SimpleGenerator]
@OUTPUT = SIMPLE_GENERATOR_...
KEY_0 = $Value

[TEMPLATE: SimpleGenerator]
@GENERATOR_0 = _SimpleGenerator
@GENERATOR_0:Value = hello
@GENERATOR_1 = _SimpleGenerator
@GENERATOR_1:Value = world

[SimpleGenerator]
```

输出：

```ini
[SIMPLE_GENERATOR_0]
KEY_0 = hello

[SIMPLE_GENERATOR_1]
KEY_0 = world
```

### 多次生成的子模板

一条生成器指令可以生成多个节，使用 `$1` 引用当前索引：

```ini
[TEMPLATE: _NotSoSimpleGenerator]
@OUTPUT = SIMPLE_GENERATOR_...
KEY_0 = $1

[TEMPLATE: NotSoSimpleGenerator]
@GENERATOR = _NotSoSimpleGenerator, 2

[NotSoSimpleGenerator]
```

注意 `$1` 会变为索引值：

```ini
[SIMPLE_GENERATOR_0]
KEY_0 = 0

[SIMPLE_GENERATOR_1]
KEY_0 = 1
```

### 多维生成器

支持多维度生成：

```ini
[TEMPLATE: _NotSoSimpleGenerator]
@OUTPUT = $" 'SIMPLE_GENERATOR_' .. $1 .. '_' .. $2 .. '_' .. $3 "
KEY_0 = $1, $2, $3

[TEMPLATE: NotSoSimpleGenerator]
@GENERATOR = _NotSoSimpleGenerator, 2, 2, 2

[NotSoSimpleGenerator]
```

输出：

```ini
[SIMPLE_GENERATOR_0_0_0]
KEY_0 = 0,0,0

[SIMPLE_GENERATOR_0_0_1]
KEY_0 = 0,0,1

[SIMPLE_GENERATOR_0_1_0]
KEY_0 = 0,1,0

[SIMPLE_GENERATOR_0_1_1]
KEY_0 = 0,1,1

[SIMPLE_GENERATOR_1_0_0]
KEY_0 = 1,0,0

[SIMPLE_GENERATOR_1_0_1]
KEY_0 = 1,0,1

[SIMPLE_GENERATOR_1_1_0]
KEY_0 = 1,1,0

[SIMPLE_GENERATOR_1_1_1]
KEY_0 = 1,1,1
```

## 额外技巧

- 更多有趣的示例可在源码的 `tests/auto` 文件夹中找到。
- 单个节可以同时实现多个模板：`[Template1, Template2]`，或 `[EXPLICIT_NAME : Template1, Template2]`。
  - 也可以多次使用同一模板：`[EXPLICIT_NAME : Template, Template]`，配合键的自动索引可能很有用。
  - 模板可以同时继承多个模板：`[TEMPLATE: Template1 EXTENDS Template2, Template3]`。
- 如果节被拆分为多个部分，每个部分带有不同的 `: Template`，模板会被处理多次。
- 如果 `${VariableWithCurlyBrackets}` 未定义，会解析为空。
- 如果 `$SimpleVariable` 不存在，会保持原样为 `$SimpleVariable`。
- Mixin 或普通节也可以使用生成器。
- 模板也可以使用 `@ACTIVE` 标志（类似 Mixin）。
- Mixin 在被引用时立即添加：可以通过重复 `@MIXIN` 并在第二次调用前重新定义参数，以不同参数调用同一 Mixin。
- 可以混合使用 `KEY_…=1`、`KEY_…=2`、`KEY_0=3`，三个值都会保留（前两个会变为 `KEY_1` 和 `KEY_2` 以避免与后面的 `KEY_0` 冲突）。
  - 为此，自动索引键的值在最终阶段之前会处于中间状态，因此不要在替换和表达式中引用它们，这不会正常工作。
- 向 Mixin 传递参数的另一种语法：`@MIXIN = MixinName, Key1 = Value1, Key2 = Value2`（但此方式有限制）。
  - 生成器也支持此语法，同样有限制（不支持列表）。
- 当某个键已被设置时，新赋值会覆盖旧值。
  - 但模板和 Mixin 不能覆盖主节设置的值，即使它们在主节之后运行（因为需要为主节提供参数）。
  - 不过模板和 Mixin 可以覆盖自身之前设置的参数。
  - 这允许创建计数器来追踪 Mixin 在当前节中被调用的次数：`Count = $" $Count == nil and 1 or $Count + 1 "`。
- 当使用模板时，如果节名被显式设置，可以通过 `$TARGET` 访问。
- 引用生成器中的子模板时可以使用表达式。
- 在生成器中为子模板设置参数时可以使用索引变量。
- 早期版本中（在引号功能之前）添加了一个兼容性功能，允许使用[不带引号的 Base64 编码 PNG 图像](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Post-processing-%E2%80%93-More-about-color-grading)，建议避免使用，常规引号更好。
- 在编辑 CSP 配置时，添加 `[__DEBUG] DUMP_FLATTEN_INI = 1` 可以查看展开后的配置（保存在附近；这不是预处理器的功能）。

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
