---
title: 扩展物理通用选项
---

# 扩展物理通用选项

## 启用扩展物理

为确保所有人在相同条件下比赛，使用扩展赛道物理的任何功能前，需要先启用扩展物理。为此，打开 `surfaces.ini`，找到 `[SURFACE_0]` 部分的 `WAV_PITCH`，在其值前添加 `extended-`，如下所示：

```ini
[SURFACE_0]
KEY=PITS
…
WAV_PITCH=extended-0
…
```

其原理是：原始 AC 如果遇到这个 `WAV_PITCH` 值会崩溃（因为它无法将此值解析为整数）。而 Custom Shaders Patch 会捕获此值，阻止 AC 崩溃并标记该赛道可以使用扩展物理。这是大多数在线服务器检查完整性的文件。

## 通用扩展物理选项

以下所有选项都在 `surfaces.ini` 中：

```ini
[_EXTENSION]
REQUIRED_VERSION = 2000  ; 赛道可以设置为需要特定版本的 CSP。如果你依赖某个
                         ; 较新版本中添加的 CSP 功能，请使用它。
```

### 时区和坐标

为了让 Weather FX 正确运行，在 `surfaces.ini` 中设置赛道坐标和时区总是非常有帮助的。否则，CSP 会尝试猜测，但有时根本不可能，这可能导致在线时间不同步。

```ini
[WEATHER_FX]
LATITUDE = 36.25            ; 纬度（度），使用数字（所以 36° 15' 变为 36.25）
LONGITUDE = 121.5           ; 经度（度），同样使用数字

; 使用时区名称：
TIMEZONE_ID = Europe/Paris  ; 时区 ID（TZ 数据库名称）。这样设置时，DST 将
                             ; 根据当前日期自动计算，并考虑可能的未来更新。

; 或者，时区的显式偏移：
TIMEZONE = 0                ; 从 UTC 的偏移量（秒）；如果需要 DST，在此添加。对于赛道，
                             ; 设置 ID 是更好的选择。
```

这些在 `surfaces.ini` 中的设置将覆盖赛道配置中的设置或 CSP 可能附带的任何设置，是使整体更健壮的好方法。与其他提到的选项不同，此选项完全不需要启用扩展物理。

### 默认值

这些选项默认启用，但如果需要可以禁用：

```ini
[_EXTENSION]
REAL_MASS_ONLINE = 1                    ; 在线远程车辆使用真实质量刚体
ALIGNED_CARS_POSITIONING = 1            ; 定位时沿表面法线方向定位车辆（提高
                                         ; 倾斜表面上的稳定性）
RANDOMIZED_CARS_POSITIONING = 0.1, 0.1  ; 定位时轻微随机化车辆位置和方向。
                                         ; 第一个值（米）随机化位置，
                                         ; 第二个值随机化方向。

PIT_ALTITUDE = 0          ; 基于维修区，设置赛道的真实海拔（米），参见末尾的另一种方法
```

此外，启用自定义赛道物理会自动激活[动态物理对象](./dynamic-physics-objects.md)的盒形碰撞器检测。

### 基础碰撞调整（默认禁用）

```ini
[_EXTENSION]
RIGID_FLOOR_COLLISIONS = 0  ; 使用刚性（硬）地面碰撞
RIGID_WALLS_COLLISIONS = 0  ; 使用刚性（硬）墙壁碰撞
RIGID_DIRT_COLLISIONS = 0   ; 使用刚性（硬）泥地面碰撞
```

使用这些选项不是个好主意，但可能有助于车辆穿过地面的问题。有关更精确的配置，请参阅[碰撞参数](./collision-parameters.md)。

### 完整性验证

赛道可以验证其某些文件的完整性：

```ini
[_VERIFY_INTEGRITY_...]
ONLINE_ONLY = 0   ; 设为 1 仅在线比赛中验证文件
FILE = …          ; 相对于赛道数据文件夹的文件路径
CHECKSUM = …      ; SHA256 校验和
```

可以使用[在线工具](https://emn178.github.io/online-tools/sha256_checksum.html)生成校验和。

### 权限

启用扩展物理的赛道可以向其他内容（如 Lua 脚本）授予额外权限：

```ini
[_SCRIPTING_PHYSICS]
ALLOW_TRACK_SCRIPTS = 0     ; 允许赛道脚本访问物理 API
ALLOW_DISPLAY_SCRIPTS = 0   ; 允许赛道显示脚本访问物理 API
ALLOW_NEW_MODE_SCRIPTS = 0  ; 允许新模式脚本访问物理 API
ALLOW_TOOLS = 0             ; 允许工具脚本访问物理 API
ALLOW_APPS = 0              ; 允许 Lua 应用访问物理 API
ALLOW_TRACK_SCRIPTS_DYNAMIC_OBJECTS = 0  ; 设为 1 允许任何脚本创建和操作刚体
                                          ; 仅限刚体（不太容易作弊）

[_EXTRA_PERMISSIONS]
ALLOW_CUSTOM_AI_MANIPULATION = 0  ; 设为 1 允许此赛道上的自定义 AI
```

### 杂项

为了娱乐可以改变重力，但目前该更改不会在线应用以确保公平：

```ini
[_EXTENSION]
GRAVITY = -9.8
```

### 赛道海拔

```ini
[ALTITUDE]
BASE = 0   ; 设置真实海拔（米），同样基于 pit0 位置
```

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-General-extended-physics-options) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
