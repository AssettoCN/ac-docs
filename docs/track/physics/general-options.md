---
title: 通用扩展物理选项
---


> 汉化标题：赛道 – 通用扩展物理选项  
> 原文页面：Tracks-–-General-extended-physics-options  
> 原文锚点：0df9d4c  
> 汉化时间：2026-09-11T23:59:00+08:00  

一些通用的扩展物理选项。以下所有选项均用于 “surfaces.ini”：

```ini
[_EXTENSION]
REQUIRED_VERSION = 2000  ; 可将赛道设置为要求特定版本的 CSP。如果你依赖
                         ; 某个较新版本才加入的 CSP 功能，请使用此选项。
```

### 时区与坐标

为了让 Weather FX 正确运行，在 “surfaces.ini” 中设置赛道坐标和时区总是大有帮助。否则 CSP 会尝试猜测，但有时根本无从猜起，这可能导致线上的时间不同步。

```ini
[WEATHER_FX]
LATITUDE = 36.25            ; 纬度，单位为度，请使用数字（例如 36° 15' 应写作 36.25）
LONGITUDE = 121.5           ; 经度，单位为度，同样使用数字

; 可以使用时区名称：
TIMEZONE_ID = Europe/Paris  ; 时区 ID（TZ 数据库名称）。如此设置后，夏令时会根据当前日期
                            ; 自动计算，并考虑未来可能的更新。

; 或者，显式指定时区偏移：
TIMEZONE = 0                ; 相对 UTC 的偏移，单位为秒；如需夏令时，请在此计入。对赛道来说，设置 ID
                            ; 是更好的选择。
```

这些在 “surfaces.ini” 中进行的设置会覆盖赛道配置中的设置，以及 CSP 可能自带的任何设置，是让整体更加稳健的好方法。而且与上文提到的其他选项不同，这一项完全不需要启用扩展物理。

### 默认值

这些选项默认启用，但如有需要可以禁用：

```ini
[_EXTENSION]
REAL_MASS_ONLINE = 1                    ; 在线模式下为远程车辆的刚体使用真实质量
ALIGNED_CARS_POSITIONING = 1            ; 定位车辆时使其沿表面法线方向对齐（可提升
                                        ; 倾斜表面上的稳定性）
RANDOMIZED_CARS_POSITIONING = 0.1, 0.1  ; 定位时对车辆的位置和朝向进行轻微随机化。
                                        ; 第一个值以米为单位随机化位置，
                                        ; 第二个值用于朝向。

PIT_ALTITUDE = 0          ; 基于维修区位置，以米为单位设置赛道的真实海拔，另一种方法见文末
```

此外，启用自定义赛道物理会自动为[动态物理对象](/track/physics/dynamic-physics-objects)启用盒形碰撞体检测。

### 基础碰撞调整（默认禁用）

```ini
[_EXTENSION]
RIGID_FLOOR_COLLISIONS = 0  ; 与地面采用刚性（硬）碰撞
RIGID_WALLS_COLLISIONS = 0  ; 与墙体采用刚性（硬）碰撞
RIGID_DIRT_COLLISIONS = 0   ; 与泥土区域采用刚性（硬）碰撞
```

使用其中任何一项都不是什么好主意，但它们可能有助于解决车辆穿地的问题。如需更精细的配置，请参阅[关于碰撞参数详细配置的单独文章](/track/physics/collision-parameters)。

### 完整性校验

赛道可以校验其部分文件的完整性：

```ini
[_VERIFY_INTEGRITY_...]
ONLINE_ONLY = 0   ; 设为 1 表示仅在联机比赛中校验该文件
FILE = …          ; 相对于赛道数据文件夹的文件路径
CHECKSUM = …      ; SHA256 校验和
```

你可以使用[这样的在线工具]( https://emn178.github.io/online-tools/sha256_checksum.html)来生成校验和。

### 权限

启用扩展物理的赛道可以向 Lua 脚本等其他对象授予额外权限：

```ini
[_SCRIPTING_PHYSICS]
ALLOW_TRACK_SCRIPTS = 0     ; 允许赛道脚本访问物理 API
ALLOW_DISPLAY_SCRIPTS = 0   ; 允许赛道显示脚本访问物理 API
ALLOW_NEW_MODE_SCRIPTS = 0  ; 允许新模式脚本访问物理 API
ALLOW_TOOLS = 0             ; 允许工具脚本访问物理 API
ALLOW_APPS = 0              ; 允许 Lua 应用访问物理 API
ALLOW_TRACK_SCRIPTS_DYNAMIC_OBJECTS = 0  ; 设为 1 时，允许任意脚本创建和操纵刚体
                                         ;（仅限刚体——我怀疑利用这些作弊并不容易）

[_EXTRA_PERMISSIONS]
ALLOW_CUSTOM_AI_MANIPULATION = 0  ; 设为 1 允许在此赛道上使用自定义 AI
```

有关自定义 AI 的更多信息请见[这里](/custom-ai/index)。

### 杂项

出于娱乐目的，你可以更改重力，不过目前为了确保公平，该更改不会在线上生效：

```ini
[_EXTENSION]
GRAVITY = -9.8
```

### 赛道海拔

```ini
[ALTITUDE]
BASE = 0   ; 以米为单位设置真实海拔，同样基于 pit0 位置
```

