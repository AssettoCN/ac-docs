---
title: 函数
---

# 函数（Functions）

为了简化表达式编写，可以定义可复用的函数。

## 定义函数

使用 `[FUNCTION: Name]` 定义函数，其中：

- `ARGUMENTS` — 函数的输入参数
- `PRIVATE` — 如果设为 1，加载下一个文件前会重置 Lua 状态
- `CODE` — 函数的 Lua 代码

### 示例：颜色解析函数

以下函数将颜色从 HEX 或 0–255 格式转换为归一化数值：

```ini
; this function turns color from HEX or 0–255 format into regular normalized numbers
[FUNCTION: ParseColor]
ARGUMENTS = v  ; input arguments to be used in code below
PRIVATE = 0    ; if set to 1, Lua state will be reset before loading next file
CODE = '
  if type(v) == "string" and v:sub(1, 1) == "#" then 
    if #v == 7 then return { tonumber(v:sub(2, 3), 16) / 255, tonumber(v:sub(4, 5), 16) / 255, tonumber(v:sub(6, 7), 16) / 255 } end
    if #v == 4 then return { tonumber(v:sub(2, 2), 16) / 15, tonumber(v:sub(3, 3), 16) / 15, tonumber(v:sub(4, 4), 16) / 15 } end
    error("Invalid color: "..v)
  end
  if type(v) == "table" and #v == 3 and ( v[1] > 1 or v[2] > 1 or v[3] > 1 ) then return { v[1] / 255, v[2] / 255, v[3] / 255 } end
  return v'
  
[DEFAULTS]
ColorHex = #abcdef
ColorHexShort = #f80
ColorRgb = 255, 127, 0
ColorRel = 1, 0.5, 0

[TEST]
VALUE1 = $" ParseColor( $ColorHex ) "       ; 0.67, 0.804, 0.937
VALUE2 = $" ParseColor( $ColorHexShort ) "  ; 1.0, 0.53, 0.0
VALUE3 = $" ParseColor( $ColorRgb ) "       ; 1.0, 0.5, 0.0
VALUE4 = $" ParseColor( $ColorRel ) "       ; 1.0, 0.5, 0.0
```

## 外部 Lua 文件

通用函数可以放在外部 Lua 文件中，通过 `[USE:]` 引入：

```ini
[USE: common/functions_base.lua]  ; search is done the same way as for included INI-files
PRIVATE = 0                       ; again, if set to 1, Lua state will be reset before loading next file
```

- 搜索路径与 `[INCLUDE]` 相同
- `PRIVATE = 1` 会在加载下一个文件前重置 Lua 状态，避免函数污染

::: tip 提示
关于表达式中变量的替换规则，请参考[表达式](./expressions)页面。
:::

## 引用来源

- [INIpp 官方文档](https://github.com/ac-custom-shaders-patch/inipp#readme) — 内容基于 INIpp README.md
- [INIpp 仓库](https://github.com/ac-custom-shaders-patch/inipp) — INIpp 预处理器源码与测试用例
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件与模板
