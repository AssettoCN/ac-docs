---
title: 变量系统
---

# 变量系统

变量用于减少配置中的重复内容。变量可以在单个 INI 文件中定义为默认值（所有包含的文件都会继承），也可以在节内定义。`[INCLUDE]` 节可以为被包含文件设置变量，而不会影响主文件。

参见：[文件包含](./include)

## 基本用法

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

如上所示，变量的定义方式与普通值相同。换言之，任何值都可以作为变量被引用，只要在引用前已定义。默认情况下，INIpp 会在引用后移除原始值以保持输出整洁，可通过 `[@INIPP] @ERASE_REFERENCED = 0` 改变此行为。

## 变量引用语法

使用 `$` 前缀引用变量，如 `$Variable`。也可以使用花括号 `${Variable}` 以更清晰地标识变量。

- `$Variable` — 如果变量不存在，将原样保留为 `$Variable`
- `${Variable}` — 如果变量不存在，将解析为空值

```ini
[SECTION_1]
VALUE_0 = $MissingValue    ; will resolve into "$MissingValue"
VALUE_1 = ${MissingValue}  ; will resolve into empty value
```

## 变量展开与列表

变量可以是列表，其引用也会被展开为列表。在花括号语法中，还可以使用列表中的特定项、子集，或获取列表属性。索引从 1 开始。

### 子集语法

- `${Var:N}` — 获取第 N 个元素
- `${Var:N:Len}` — 从第 N 个元素开始取 Len 个
- `${Var:N::M}` — 从第 N 个元素取到第 M 个元素（不含 M）
- `${Var:-1}` — 获取最后一个元素

### 修饰符

- `:count` — 返回值的数量
- `:length` — 返回值的字符串长度（多个值则返回总长度）
- `:exists` — 如果值存在返回 1，否则返回 0
- `:vec2`、`:vec3`、`:vec4` — 将值转换为向量：强制特定长度，非数字值转为 0，用于输入清理（参见[表达式](./expressions)）
- `:required` 或 `:?` — 如果变量（或其子集）不存在，则丢弃整个值

## 子集示例

### Before

```ini
[DEFAULTS]
PointInSpace = 12.3, 14.6, -25.2

[SECTION_0]
POINT = $PointInSpace

; Notice how indices are starting with 1. Older versions were using 0,
; but now we got Lua onboard and it uses 1. Also, it's just nicer this way.
; Usually I wouldn't do something so breaking, but it seems like there is not
; a lot of INIpp stuff yet and this is really annoying to have that difference.
COORD_X = ${PointInSpace:1}
COORD_Y = ${PointInSpace:2}
COORD_Z = ${PointInSpace:3}

[SECTION_1]
NUMBER_OF_DIMENSIONS = ${PointInSpace:count}

HAS_SECOND_DIMENSION = ${PointInSpace:2:exists}
HAS_THIRD_DIMENSION = ${PointInSpace:3:exists}
HAS_FOURTH_DIMENSION = ${PointInSpace: 4: exists} ; feel free to use as many spaces as you like
COORD_LAST = ${PointInSpace:-1}

; Four different ways of taking X and Y values (for three-dimensional value):
COORDS_XY_0 = ${PointInSpace::2}     ; just take first two elements
COORDS_XY_1 = ${PointInSpace:1:2}    ; taking two elements from 1th forward
COORDS_XY_2 = ${PointInSpace: 1 :: 3}   ; taking from 1th to 3th element excluding 3th
COORDS_XY_3 = ${PointInSpace: 1 :: -1}  ; taking from 0th to 1th element from the end excluding it

COORDS_XY_LENGTH = ${PointInSpace:1:2:length} ; total length of a strings of first two values
COORDS_XZ = ${PointInSpace:1}, ${PointInSpace:3}
```

### After

```ini
[SECTION_0]
COORD_X = 12.3
COORD_Y = 14.6
COORD_Z = -25.2
POINT = 12.3,14.6,-25.2

[SECTION_1]
COORDS_XY_0 = 12.3,14.6
COORDS_XY_1 = 12.3,14.6
COORDS_XY_2 = 12.3,14.6
COORDS_XY_3 = 12.3,14.6
COORDS_XY_LENGTH = 8
COORDS_XZ = 12.3,-25.2
COORD_LAST = -25.2
HAS_FOURTH_DIMENSION = 0
HAS_SECOND_DIMENSION = 1
HAS_THIRD_DIMENSION = 1
NUMBER_OF_DIMENSIONS = 3
```

## 变量在复杂值中的替换

变量替换在更复杂的值中同样有效。双引号字符串中会进行变量替换，但单引号字符串中不会（类似 PHP 的行为）。

```ini
[DEFAULTS]
Prefix = ello

[SECTION_1]
GREETING_0 = H${Prefix} World   ; works either with curly braces
GREETING_1 = "H$Prefix World"   ; or with double quotes
GREETING_2 = H$Prefix World     ; or even without quotes
GREETING_FAILED_1 = 'H${Prefix} World'  ; but not with single quotes
```

```ini
[DEFAULTS]
SomeVariable = A, B
OtherVariable = $SomeVariable, "[$SomeVariable]"

[SECTION_1]
LETTERS_WITH_ZEROS = ${SomeVariable}0 ; A0, B0
LETTERS_AND_LETTERS_IN_BRACKETS = prefix $OtherVariable ; prefix A, prefix B, prefix [A], prefix [B]
```

::: warning 注意
建议使用 CamelCase（驼峰命名）为变量命名。CSP 与大多数应用一样，期望值为大写，使用 CamelCase 可以大幅减少命名冲突。
:::

## 作用域

变量查找有一套作用域机制，包含继承等特性，在大多数情况下能合理运行。但仍然建议优先使用参数的原始名称，因为自动推断并不总是可靠。

一般规则：
- `[DEFAULTS]` 中的参数优先级最低
- 为 Mixin 和 Template 显式设置的参数优先级最高
- 目标节中的值介于两者之间

更多关于 Template 和 Mixin 的内容请参考[模板](./templates)和 [Mixin 与生成器](./mixins-generators)。

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
