---
title: 故障排除
---


> 汉化标题：通用 – 故障排除  
> 原文页面：General-–-Troubleshooting  
> 原文锚点：ffdafde  
> 汉化时间：2026-09-12T19:00:00+08:00  

作为通用解决方案，可以考虑运行 Steam 完整性检查。它不会删除你已安装的新车辆或赛道，只会将修改过的 Assetto Corsa 文件还原。

### 找不到 “\python33\\PyObject_CallFunction”

请确保已安装 [Microsoft Visual C++ 2010 Redistributable Package (x64)](https://www.microsoft.com/en-gb/download/details.aspx?id=14632)（[直链](https://files.acstuff.ru/shared/iJVd/vcredist_x64_2010.exe)）。如果已经安装过，重新安装一次也可能有帮助。

### 图像被翻转，或被切成两个翻转的巨大三角形

如果你使用 AMD 显卡，请务必在 Extra FX 设置中启用 “Resolve MSAA for color”。

### 提示 “GPU May be overheating or overclocked”

在 Custom Shaders Patch 的通用（General）设置中禁用 “Use DXGI Flip Model”。

### 赛道或车辆的某些部分轻微闪烁

在 Reflections FX 模块中禁用 “Use proper physically-based sampling”。

