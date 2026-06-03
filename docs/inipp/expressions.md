---
title: 表达式
---

# 表达式（Expressions）

在值前添加 `$"` 前缀，该值将通过 Lua 解释器计算。单独使用时可能用处不大，但结合变量后会非常方便。

## 基本用法

### √2

```ini
[TEST]
SQUARE_ROOT_OF_TWO = $" sqrt(2) " ; `math.` functions copied to global scope
```

## 变量替换规则

表达式中的变量替换与普通值不同：

- 字符串会被自动包裹引号
- 缺失值会变为 `nil`
- 如果变量是列表，会作为 table 传入
- 如果变量长度为 2、3 或 4 且全部为有效数字，会作为向量传入（支持运算符操作的 table）
- 如果表达式返回 table，会转换为列表

## 向量

可以在 Lua 中使用以下函数创建向量：

- `vec2(x, y)`
- `vec3(x, y, z)`
- `vec4(x, y, z, w)`

向量支持的方法：

- `vec2(x, y):length()` — 向量长度
- `vec2(x, y):normalize()` — 归一化
- `dot(vec2(x, y), vec2(z, w))` — 点积

## 实用示例

```ini
[DEFAULTS]
LightsIntensity = 2
LightsDirection = 0.5, 0.5, 1

; Basic maths and flags
[LIGHT_...]
INTENSITY = $" 2 * $LightsIntensity "
ACTIVE = $" $LightsIntensity > 1 " ; boolean values will produce either 1 or 0

; Strings, tables and vectors
[LIGHT_...]
DESCRIPTION = $" 'Light with the intensity: ' .. (2 * $LightsIntensity) "
COLOR = $" { $LightsIntensity * 0.2, $LightsIntensity * 0.3, $LightsIntensity * 0.4 } " ; tables will turn into lists
DIRECTION = $" ${LightsDirection:vec3}:normalize() " ; ":vec3" is not required, but it'll make sure expression will work even if LightsDirection doesn't have any numbers in it

; Example of default values
[EXAMPLE]
KEY = $" def($Variable, 10) " ; if $Variable is not set, uses 10
KEY_2 = $" def2($Variable, 10, 15) " ; if $Variable is not set, uses (10, 15)
```

## 特殊函数

- `discard()` — 丢弃整个值
- `def(X, Y)` — 如果 X 为 `nil` 则返回 Y，适合设置默认值
- `def2(X, Y, Z)` — 类似 `def`，但返回多个值

::: tip 提示
表达式中可以使用 `${Var:vec3}` 等修饰符来确保变量被正确转换为向量。更多修饰符参见[变量系统](./variables)。
:::

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
