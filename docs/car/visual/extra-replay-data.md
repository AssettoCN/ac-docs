---
title: 额外回放数据
---


> 汉化标题：车辆 – 额外回放数据  
> 原文页面：Cars-–-Extra-Replay-Data  
> 原文锚点：7b71f9e  
> 汉化时间：2026-09-12T00:00:00+08:00  

车辆脚本可以通过控制器输入写入额外的回放数据。该功能于 **0.2.3** 更新中加入。只需在 car.ini 文件中定义一个架构（schema），然后使用脚本控制器输入读写数据，这些数据便会存储为回放数据。请尽量控制回放输入的数量。

**`car.ini`：**

```ini
[_EXTENSION]
SCRIPT_INPUTS_REPLAY = 100:uint8, 101:unorm8, 102:half
```

```ini
[_EXTENSION]
SCRIPT_INPUTS_REPLAY = 100:uint8, unorm8, half, uint8 ;INDEX == 100, INDEX == 101, INDEX == 102, INDEX == 103
```

回放输入以 `<INDEX>:<TYPE>` 形式添加。也可以仅用 `<TYPE>` 定义输入，其 INDEX 将从上一个显式定义的 INDEX 值开始递增。

已知类型：
- `h`, `half`：2 字节，浮点（大致从 1/65536 到 65536）；
- `f`, `float`：4 字节，浮点；
- `i8`, `int8`, `char`：1 字节，范围 -128 到 127；
- `u8`, `uint8`, `byte`：1 字节，范围 0 到 255；
- `i16`, `int16`, `short`：2 字节，范围 -32768 到 32767；
- `u16`, `uint16`, `ushort`：2 字节，范围 0 到 65535；
- `i32`, `int32`, `int`：4 字节，可为负数；
- `u32`, `uint32`, `uint`：4 字节，仅正整数；
- `unorm8`：1 字节，范围 0 到 1；
- `norm8`：1 字节，范围 -1 到 1；
- `unorm16`：2 字节，范围 0 到 1；
- `norm16`：2 字节，范围 -1 到 1。

_如果您定义的架构发生变化，使用旧架构保存的回放将无法再回放其中记录的额外数据。_

**车辆物理 `script.lua`：**
```lua
function script.update(dt)
  local data = ac.accessCarPhysics()

  -- 写入这些控制器的数据会存储在回放数据中
  data.controllerInputs[100] = 1
  data.controllerInputs[101] = 2
  data.controllerInputs[102] = 3
end
```

