---
title: 灯光系统
---

# 灯光系统（Lights）

CSP 根据 `lights.ini` 中定义的发光网格和自定义发光为车辆创建动态光源。大多数参数会从模型自动猜测，但你可以手动覆盖所有内容。所有这些设置都放在车辆的扩展配置中。

## 章节命名（Section Naming）

对于每种灯光类型，都有共享章节名称（用作后备）和按索引章节名称。按索引章节中的参数优先。对于索引 0，共享章节用作后备。对于索引 1 及以上，共享章节被忽略。

| 灯光类型 | 共享（索引 0 后备） | 按索引 |
|---|---|---|
| 前大灯 | `LIGHT_HEADLIGHTS` | `LIGHT_HEADLIGHT_0`, `LIGHT_HEADLIGHT_1`, … |
| 刹车灯 | `LIGHT_BRAKES` | `LIGHT_BRAKE_0`, `LIGHT_BRAKE_1`, … |
| 倒车灯 | `LIGHT_REVERSE` | `LIGHT_REVERSE_0`, `LIGHT_REVERSE_1`, … |
| KERS 灯 | `LIGHT_KERS` | `LIGHT_KERS_0`, `LIGHT_KERS_1`, … |
| 开门灯 | `LIGHT_OPENDOORS` | `LIGHT_OPENDOORS_0`, `LIGHT_OPENDOORS_1`, … |
| LED 面板灯 | `LIGHT_LED_PANEL` | `LIGHT_LED_PANEL_0`, `LIGHT_LED_PANEL_1`, … |
| 转向灯（左） | `LIGHT_TURNSIGNALS_LEFT` | `LIGHT_TURNSIGNAL_LEFT_0`, … |
| 转向灯（右） | `LIGHT_TURNSIGNALS_RIGHT` | `LIGHT_TURNSIGNAL_RIGHT_0`, … |
| 弯道灯（左） | `LIGHT_CORNERINGLAMP_LEFT` | `LIGHT_CORNERINGLAMP_LEFT_0`, … |
| 弯道灯（右） | `LIGHT_CORNERINGLAMP_RIGHT` | `LIGHT_CORNERINGLAMP_RIGHT_0`, … |

每种类型最多支持 4 个灯光（索引 0–3）。额外灯光和牌照灯使用不同的命名方案（见下文）。

## 通用参数（Common Parameters）

这些参数适用于上述所有灯光类型：

```ini
[LIGHT_HEADLIGHTS]
; 位置和形状
POSITION = 0, 0.7, 1.8           ; 车辆空间中的灯光位置，未设置时从网格猜测
OFF_POSITION = 0, 0.7, 1.8       ; "关闭" 状态使用的位置，未设置时从网格猜测
MIRROR = 0.7                      ; X 轴上对称对的镜像偏移，0 禁用
OFF_MIRROR = 0.7                  ; "关闭" 状态的镜像偏移
OFFSET = 0, 0, 0                 ; 同时添加到开启和关闭位置
OFF_OFFSET = 0, 0, 0             ; 仅添加到关闭位置
DIRECTION = 0, -0.2, 1           ; 灯光方向
SPOT = 48                        ; 聚光角度（度），0 为点光源
SPOT_SHARPNESS = 0               ; 0 为从中心柔和衰减，1 为锐利边缘
SPOT_EDGE = 0.12, 0.12, 0.12     ; RGB 边缘颜色偏移
SPOT_EDGE_SHARPNESS = 10         ; 颜色过渡到边缘的速度

; 颜色
COLOR = 1, 1, 1, 10              ; RGBM 颜色（第四个值是乘数）
BASE_COLOR = 1, 1, 1, 1          ; 与 COLOR 相乘
OFF_COLOR = 0.5, 0.5, 0.4, 1    ; "关闭" 状态的颜色
OFF_MULT = 0.1                   ; 如果未设置 OFF_COLOR，计算为 COLOR × OFF_MULT

; 范围和衰减
RANGE = 240                      ; 灯光到达距离（米）
RAW_RANGE = 0                    ; 设为 1 以直接使用 RANGE，不进行内部调整
RANGE_GRADIENT_OFFSET = 0        ; 灯光传播开始衰减的点
FADE_AT = 450                    ; 光源开始消失的距离
FADE_SMOOTH = 50                 ; 消失的平滑度，限制在 [0, FADE_AT]
OFF_RANGE_MULT = 0.5             ; "关闭" 状态的范围乘数
OFF_FADE_MULT = 0.3              ; "关闭" 状态的消失乘数

; 渲染
SPECULAR_MULT = 1                ; 高光强度
DIFFUSE_CONCENTRATION = 0.88     ; 0：背对的面完全被照亮；1：仅直接照射的面
SINGLE_FREQUENCY = 0             ; 0 为常规灯光，1 为类似钠灯的效果
VOLUMETRIC_LIGHT = 1             ; 启用体积光效果（开销较大）
LONG_SPECULAR = 1                ; 启用雨 FX 湿滑路面的长高光

; 绑定
BOUND_TO = mesh1, mesh2          ; 覆盖猜测的发光网格名称以绑定亮度
BOUND_VERSION = 0                ; 绑定计算版本；设为 1 使用新行为
BOUND_EMISSIVE_MAX = 500         ; 最大发光值（BOUND_VERSION=0 默认 500，1 默认 0）
BOUND_EXP = 1                   ; 应用于绑定发光值的指数
RELATIVE_TO = NODE_NAME          ; 将灯光位置附加到特定节点（用于动画部件）
ONESIDED = RIGHT                 ; 禁用镜像；设为 RIGHT 仅翻转到右侧
PREFER_FRONT = -1                ; 0 强制后方网格，1 强制前方网格，-1 自动
EMISSIVE_INDEX = 0               ; 当有多个匹配时使用哪个发光实例

; 可见性
SELF_LIGHTNING = 0               ; 控制此灯光是否照亮自己的车辆（见下文）
INTERIOR_ONLY = 0                ; 仅在相机在车内时激活
EXTERIOR_ONLY = 0                ; 仅在相机在车外时激活
AFFECTS_TRACK = 1                ; 此灯光是否影响赛道表面；也可以是
                                  ; "INTERIOR_ONLY" 以跳过车辆外部渲染
DISTANT_GLARE = 1                ; 从远处看时显示眩光效果
NO_SELF_SPECULAR = 0             ; 跳过车辆本身的高光
AMBIENT_INFLUENCE = 1            ; 日夜环境光对灯光的影响程度

; 假阴影缩减
FADE_FAKE_SHADOW = 0             ; 此灯光激活时减少内饰假阴影（0–1）

; 与其他系统的交互
DISABLE_WITH_BOUNCED_LIGHT = 0   ; 当 Extra FX 屏幕空间反射光激活时禁用
DISABLE_WITH_EMISSIVE_LIGHT = 0  ; 当 Extra FX 发光灯光激活时禁用
SKIP_LIGHT_MAP = 0               ; 跳过对 Extra FX 光照图的贡献
MIRROR_DIRECTION = 0             ; 为对称对镜像灯光方向

; 翼面
AFFECTED_BY_WING = -1            ; 影响此灯光的翼面控制器索引，-1 无
AFFECTED_BY_WING_LUT =           ; 翼面效果的 LUT 文件

; 闪烁模式
BLINKING_PATTERN = (|0=1|0.5=0.8|1=1)  ; 闪烁模式的 LUT，输入为时间
BLINKING_DURATION = 2            ; 模式持续时间（秒）（标准化 LUT）
```

## 关于 SELF_LIGHTNING

此参数（是的，这是 "self lighting" 的拼写错误，为兼容性保留）控制灯光是否照亮自己的车辆：

- `0`：灯光永远不会照亮其所属的车辆；这是前大灯的默认值，因为你不想看到前大灯束照亮车头；
- `1`：灯光从内饰和外部视角都照亮车辆；通常用于内饰仪表板灯、开门灯和其他应该在车辆本身可见的灯光；
- `EXTERIORONLY`：灯光仅在外部视角（例如追踪摄像机、自由摄像机）照亮车辆，不从内饰照亮；这是刹车灯和倒车灯的默认值，这样红色光晕在第三人称视角下可以在保险杠上看到，但在驾驶舱视角中不会穿透仪表板。

## 线性灯光（Line Lights）

任何支持通用参数的章节都可以通过指定两个端点变为线性灯光：

```ini
[LIGHT_HEADLIGHTS]
LINE_FROM = 0.422, 0.1, -0.9
LINE_TO = 0.422, 0.1, 0.9
COLOR_FROM = 1, 0, 0, 5         ; 起始点颜色
COLOR_TO = 0, 1, 0, 5           ; 终点颜色（如果与 COLOR_FROM 不同）
```

当设置了 `LINE_FROM` 和 `LINE_TO` 时，灯光变为线性灯光，`RANGE_GRADIENT_OFFSET` 自动设为 0。

---

## 前大灯（Headlights）

前大灯拥有最丰富的参数。默认值取决于车辆的年份——旧车获得更宽、更柔和的光束和更古老的默认值。

```ini
[LIGHT_HEADLIGHTS]
; 聚光形状
SPOT = 48                        ; 聚光角度（度），默认取决于车辆年份
SPOT_SHARPNESS = 0
SPOT_UP = 0.1, 1, 0             ; 非对称光束模式的归一化向上向量；
                                  ; 非赛车默认根据左舵/右舵略有角度

; 第二聚光（主光束周围更宽的环境光晕）
SECOND_SPOT = 144                ; 更宽环境锥的角度
SECOND_SPOT_SHARPNESS = 0.7
SECOND_SPOT_SKIP = 0.3           ; 主聚光和第二聚光之间的间隙
SECOND_SPOT_RANGE = 20           ; 第二聚光的范围（米）
SECOND_SPOT_INTENSITY = 0.27     ; 第二聚光的亮度乘数

; 弹出式前大灯动画
POPUP_ENABLED = 1                ; 弹出式前大灯动画是否激活
POPUP_START = 0.05               ; 灯光开始出现的动画进度
POPUP_END = 0.7                  ; 灯光完全激活的动画进度
POPUP_SECOND_SPOT_INITIAL_VALUE = 0.4
POPUP_SECOND_SPOT_EXP = 0.6
POPUP_EDGE_OFFSET = 0.5
POPUP_EDGE_EXP = 0.3

; 阴影
SHADOWS_CULL_MODE =              ; 阴影剔除模式覆盖

; 近光灯行为
LOWBEAM_MULT = 0.5               ; 近光灯模式下的亮度乘数
LOWBEAM_RANGE_MAX = 70           ; 近光灯的最大范围（米）
LOWBEAM_RANGE_MULT = 0.8         ; 近光灯的范围乘数
LOWBEAM_RANGE_ONCOMING_MULT = 0.4  ; 近光灯模式下对向来车的范围乘数；
                                     ; 默认取决于车辆的现代化程度
```

前大灯默认值：
- `RANGE` 默认约 240 米（根据车辆年份调整）；
- `FADE_AT` 默认 450 米；
- `SELF_LIGHTNING` 默认为 `0`（前大灯不照亮车辆本身）；
- `VOLUMETRIC_LIGHT` 默认为 `1`；
- `AFFECTS_TRACK` 默认为 `1`。

---

## 刹车灯（Brake Lights）

```ini
[LIGHT_BRAKES]
DIRECTION = 0, 0, -1
SPOT = 175                       ; 默认取决于车辆的现代化程度
SPOT_SHARPNESS = 0.3
SPOT_EDGE = 0.12, 0.12, 0.12
SPOT_EDGE_SHARPNESS = 10
```

刹车灯默认值：
- `RANGE` 默认 5 米；
- `FADE_AT` 默认 120 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## KERS 灯（KERS Lights）

用于赛车上的 KERS 回收指示灯。参数集与刹车灯相同。

```ini
[LIGHT_KERS]
DIRECTION = 0, 0, -1
SPOT = 175
SPOT_SHARPNESS = 0.3
SPOT_EDGE = 0.12, 0.12, 0.12
SPOT_EDGE_SHARPNESS = 10
```

KERS 灯默认值：
- `RANGE` 默认 3 米；
- `FADE_AT` 默认 120 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## 倒车灯（Reverse Lights）

```ini
[LIGHT_REVERSE]
DIRECTION = 0, 0, -1
SPOT = 175
SPOT_SHARPNESS = 0.3
SPOT_EDGE = 1, 1, 1
SPOT_EDGE_SHARPNESS = 0
```

倒车灯默认值：
- `RANGE` 默认 3 米；
- `FADE_AT` 默认 120 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## 转向灯（Turn Signals）

转向灯使用独立的左右章节。方向从网格法线猜测。

```ini
[LIGHT_TURNSIGNALS_LEFT]
DIRECTION = -1, 0, 0            ; 从网格法线猜测
SPOT = 175
SPOT_SHARPNESS = 0.6
SPOT_EDGE = 0.12, 0.12, 0.12
SPOT_EDGE_SHARPNESS = 0
```

转向灯默认值：
- `RANGE` 默认 2.4 米；
- `FADE_AT` 默认 60 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## 弯道灯（Cornering Lamps）

结构与转向灯相同，但范围更广。由转向输入激活。

```ini
[LIGHT_CORNERINGLAMP_LEFT]
DIRECTION = -1, 0, 0
SPOT = 175
SPOT_SHARPNESS = 0.6
```

弯道灯默认值：
- `RANGE` 默认 4.8 米；
- `FADE_AT` 默认 90 米。

---

## 开门灯（Open Door Lights）

车门打开时激活的灯光（照地灯等）。

```ini
[LIGHT_OPENDOORS]
DIRECTION = 0, -1, -0.15        ; 默认朝下
SPOT = 160
SPOT_SHARPNESS = 0.8
```

开门灯默认值：
- `RANGE` 默认 2 米；
- `FADE_AT` 默认 40 米；
- `SELF_LIGHTNING` 默认为 `1`（这些灯照亮车辆本身）；
- 默认启用阴影。

---

## LED 面板灯（LED Panel Lights）

用于带有 LED 数字面板的车辆（lumirank）。

```ini
[LIGHT_LED_PANEL]
POSITION = 0, 0, 0              ; 默认为 lumirank 定义中的位置
DIRECTION = 0, 0, -1            ; 默认为 lumirank 定义中的方向
SPOT = 180
SPOT_SHARPNESS = 0.6
MIRROR = 0
COLOR = 1, 1, 1, 8
```

LED 面板灯默认值：
- `RANGE` 默认 5 米；
- `FADE_AT` 默认 80 米；
- `SELF_LIGHTNING` 默认为 `1`。

---

## 牌照灯（License Plate Lights）

牌照灯从使用 `Plate_D.dds` 和 `Plate_NM.dds` 纹理的网格猜测。它们使用单一的非索引章节。

```ini
[LIGHT_LICENSEPLATE]
ACTIVE = 1
MESHES = plate_mesh              ; 覆盖基于牌照纹理的自动检测
MESH_FILTER_DIRECTION = 0, 0, -1  ; 用于过滤朝向特定方向的顶点
MESH_FILTER_OFFSET = 0
COLOR = 1, 0.9, 0.8, 2
LAYOUT = TWO_ON_TOP              ; 牌照周围的灯光布局

; 布局特定默认值（可覆盖）
SPOT = 170
SPOT_SHARPNESS = 0.9
RANGE = 0.3
RANGE_GRADIENT_OFFSET = 0.5
OFFSET = 0, 0.03, -0.05         ; 从计算位置的偏移
FALLBACK_EMISSIVE = 1, 1, 1, 0.3  ; 牌照网格点亮时的发光值

FADE_AT = 12
FADE_SMOOTH = 8
AFFECTS_TRACK = 0
```

支持的 `LAYOUT` 值：
- `AT_SIDES`：牌照两侧各一个灯；
- `TWO_ON_TOP`：顶部边缘两个灯（默认）；
- `ONE_ON_TOP`：顶部边缘居中一个灯；
- `TWO_ON_BOTTOM`：底部边缘两个灯；
- `ONE_ON_BOTTOM`：底部边缘居中一个灯；
- `NONE`：禁用牌照灯。

---

## 额外灯光（Extra Lights）

额外灯光是自定义光源，适用于底盘灯、霓虹灯、内饰仪表板灯等效果。第一个额外灯光（索引 0，`[LIGHT_EXTRA]`）是自动猜测的仪表板灯。可以使用 `[LIGHT_EXTRA_...]` 添加更多（使用设置迭代器语法，如 `[LIGHT_EXTRA_UNDERGLOW]`、`[LIGHT_EXTRA_1]` 等）。

```ini
[LIGHT_EXTRA_...]
; 使用点光源：
POSITION = 1, 0, 1
COLOR = 10

; 或线性灯光：
LINE_FROM = 0.422, 0.1, -0.9
LINE_TO = 0.422, 0.1, 0.9
COLOR = 10
; 可选的每端点颜色：
COLOR_FROM = 0, 1, 0
COLOR_TO = 1, 0, 0

DIRECTION = 0, -1, 0
SPOT = 210
SPOT_SHARPNESS = 0.75
SPOT_EDGE = 0
SPOT_EDGE_SHARPNESS = 0
MIRROR = 0

; 绑定到车辆状态
BIND_TO_HEADLIGHTS = 1           ; 跟随前大灯；可以是 EXCLUDING_HIGHBEAMS_FLASH 或
                                  ; INCLUDING_HIGHBEAMS_FLASH 作为第二个值用于精细控制
BIND_TO_HIGHBEAM = 0             ; 仅在远光灯时激活
BIND_TO_LOWBEAM = 0              ; 仅在近光灯时激活
BIND_TO_BRAKELIGHTS = 0          ; 跟随刹车灯
BIND_TO_EXTRA_A = 0              ; 绑定到额外开关 A（也有 B、C、D）
NOT_WITH_HEADLIGHTS = 0          ; 前大灯开启时关闭

; 发光绑定
BOUND_TO = mesh_name             ; 绑定亮度到特定网格的发光
BOUND_EMISSIVE_MAX = 0.5

; 开关延迟
LAG = 0                          ; 开和关的延迟（被 LAG_ON/LAG_OFF 覆盖）
LAG_ON = 0                       ; 开启时的延迟
LAG_OFF = 0                      ; 关闭时的延迟

; 其他通用参数也适用（SELF_LIGHTNING、EXTERIOR_ONLY 等）
SELF_LIGHTNING = 1
EXTERIOR_ONLY = 0
INTERIOR_ONLY = 0
SKIP_LIGHT_MAP = 1
VOLUMETRIC_LIGHT = 0
FADE_AT = 7
FADE_SMOOTH = 2
FADE_FAKE_SHADOW = 0.8
RANGE = 0.25
RANGE_GRADIENT_OFFSET = 0.75
DIFFUSE_CONCENTRATION = 0.88
SPECULAR_MULT = 0
```

额外灯光默认值：
- `RANGE` 默认 0.25 米；
- `FADE_AT` 默认 7 米；
- `SELF_LIGHTNING` 默认为 `1`；
- `INTERIOR_ONLY` 默认为 `1`（对于索引 0 自动猜测的仪表板灯）；
- `SKIP_LIGHT_MAP` 默认为 `1`。

---

## 刹车盘发光灯（Brake Disc Glow Lights）

来自刹车盘发光的动态灯光，基于刹车温度数据。

```ini
[LIGHT_BRAKEDISCS_FRONT]
ACTIVE = 1

[LIGHT_BRAKEDISCS_REAR]
ACTIVE = 0

; 共享参数（两个章节都回退到 [LIGHT_BRAKEDISCS]）
[LIGHT_BRAKEDISCS]
COLOR = 1, 0.5, 0, 1.2          ; 发光颜色
GLOW_BOUNDARY_FROM = 1           ; 发光开始的温度边界
GLOW_BOUNDARY_TO = 10            ; 发光达到最大亮度的温度边界
POSITION = 0, 0, 0               ; 位置偏移（左右自动镜像）
DIRECTION = 1, 0, 0              ; 灯光方向（左右自动镜像）
SPOT = 130
SPOT_SHARPNESS = 0.8
```

刹车盘发光灯默认值：
- 前刹车盘默认激活，后刹车盘默认不激活；
- `RANGE` 默认 0.65 米；
- `FADE_AT` 默认 30 米。

---

## 反射光（Bounced Light）

当前大灯或刹车灯影响赛道时，CSP 可以创建一个假反射光，反射回车辆上。此章节控制该行为。

```ini
; 前大灯反射光：
[BOUNCED_HEADLIGHTS]
ACTIVE = 1
MULT = 1, 1, 1, 1               ; 反射光的 RGBM 乘数
OFFSET = 7                       ; 反射光的半径
FALLOFF = 0.7
GRADIENT_OFFSET = 0.8
FADE_AT = 200
FADE_SMOOTH = 50

; 刹车灯反射光（相同参数）：
[BOUNCED_BRAKE_LIGHTS]
ACTIVE = 1
MULT = 1, 1, 1, 1
; ...与上述相同的参数

; 两者的共享后备：
[BOUNCED]
ACTIVE = 1
; ...相同的参数
```

当 Extra FX 的屏幕空间反射光激活时，反射光会自动禁用。

---

## 内饰反射光（Bounced Interior Light）

从前大灯反射到内饰天花板的光。

```ini
[BOUNCED_INTERIOR_LIGHT]
ACTIVE = 1
MULT = 1, 1, 1, 1
OFFSET = 0, -1, 3               ; 从驾驶员眼睛的位置偏移
DIRECTION = 0, 1, -2
SPOT = 20
SPOT_SHARPNESS = 0.9
RANGE = 3.2
RANGE_GRADIENT_OFFSET = 0.9
```

与外部反射光不同，即使屏幕空间反射光照启用，此灯光默认也保持激活，因为它太精确了，屏幕空间无法准确重建。

---

## 后视镜反射光（Bounced Mirror Light）

从车内后视镜反射的光。从车内后视镜自动检测。

```ini
[BOUNCED_MIRROR_LIGHT]
ACTIVE = 1
DISABLE_WITH_BOUNCED_LIGHT = 0
DISABLE_WITH_EMISSIVE_LIGHT = 0
```

---

## 发光兼容性修复

如果 CSP 检测到许多额外灯光有异常高的发光值（表明是在损坏的 CSP 版本上制作的配置），它会自动应用发光兼容性修复。你可以通过以下方式控制：

```ini
[BASIC]
NO_NEED_FOR_LIGHTS_FIX = 1       ; 设为 1 跳过修复（如果灯光看起来正确）
NEEDS_LIGHTS_FIX = 0             ; 设为 1 强制修复
```

## 自动猜测（Guessing）

这些参数中的大多数会从车辆模型、其 `lights.ini`、自定义发光、车辆类别和生产年份自动猜测。未在配置中设置的参数基于以下计算：
- `lights.ini` 和自定义发光定义中的网格位置和发光颜色；
- 车辆的生产年份（旧车获得更宽、更柔和的前大灯光束）；
- 车辆是否为赛车、开放式车轮或公路车；
- 是否为左舵或右舵（影响前大灯光束不对称性）。

通用选项中也有灯光相关参数，请参考[车辆通用选项](./general-options)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Lights) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
