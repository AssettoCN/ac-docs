---
title: 灯光
---


> 汉化标题：车辆 – 灯光  
> 原文页面：Cars-–-Lights  
> 原文锚点：01b0f5a  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：cornering lamps 译作「转角照明灯」（随转向输入点亮的辅助灯）；popup headlights 译作「跳灯」；puddle lights 译作「照地灯」  

CSP 会根据 `lights.ini` 中定义的自发光网格以及自定义自发光，为车辆创建动态光源。大多数参数会从模型自动猜测，但所有参数都可以手动覆盖。这些设置全部写入车辆的扩展配置中。

### 小节命名

每种灯光类型都有一个共享小节名（用作回退）和一个按索引的小节名。按索引小节中的参数优先。对于索引 0，共享小节用作回退；对于索引 1 及以上，共享小节被忽略。

| 灯光类型 | 共享（索引 0 回退） | 按索引 |
|---|---|---|
| 大灯 | `LIGHT_HEADLIGHTS` | `LIGHT_HEADLIGHT_0`、`LIGHT_HEADLIGHT_1`、… |
| 刹车灯 | `LIGHT_BRAKES` | `LIGHT_BRAKE_0`、`LIGHT_BRAKE_1`、… |
| 倒车灯 | `LIGHT_REVERSE` | `LIGHT_REVERSE_0`、`LIGHT_REVERSE_1`、… |
| KERS 灯 | `LIGHT_KERS` | `LIGHT_KERS_0`、`LIGHT_KERS_1`、… |
| 开门灯 | `LIGHT_OPENDOORS` | `LIGHT_OPENDOORS_0`、`LIGHT_OPENDOORS_1`、… |
| LED 面板灯 | `LIGHT_LED_PANEL` | `LIGHT_LED_PANEL_0`、`LIGHT_LED_PANEL_1`、… |
| 转向灯（左） | `LIGHT_TURNSIGNALS_LEFT` | `LIGHT_TURNSIGNAL_LEFT_0`、… |
| 转向灯（右） | `LIGHT_TURNSIGNALS_RIGHT` | `LIGHT_TURNSIGNAL_RIGHT_0`、… |
| 转角照明灯（左） | `LIGHT_CORNERINGLAMP_LEFT` | `LIGHT_CORNERINGLAMP_LEFT_0`、… |
| 转角照明灯（右） | `LIGHT_CORNERINGLAMP_RIGHT` | `LIGHT_CORNERINGLAMP_RIGHT_0`、… |

每种类型最多支持 4 盏灯（索引 0–3）。额外灯光和牌照灯使用不同的命名方案（见下文）。

### 通用参数

以下参数适用于上述所有灯光类型：

```ini
[LIGHT_HEADLIGHTS]
; 位置与形状
POSITION = 0, 0.7, 1.8           ;车辆坐标系中的灯光位置，未设置时由网格猜测
OFF_POSITION = 0, 0.7, 1.8       ;「关闭」状态使用的位置，未设置时由网格猜测
MIRROR = 0.7                      ;对称的一对灯在 X 轴上的镜像偏移，0 为禁用
OFF_MIRROR = 0.7                  ;「关闭」状态的镜像偏移
OFFSET = 0, 0, 0                 ;同时加到开启与关闭位置
OFF_OFFSET = 0, 0, 0             ;仅加到关闭位置
DIRECTION = 0, -0.2, 1           ;灯光方向
SPOT = 48                        ;聚光角度（度），0 为点光源
SPOT_SHARPNESS = 0               ;0 为从中心柔和衰减，1 为锐利边缘
SPOT_EDGE = 0.12, 0.12, 0.12     ;用于彩色边缘的 RGB 边缘颜色偏移
SPOT_EDGE_SHARPNESS = 10         ;颜色向边缘过渡的速度

; 颜色
COLOR = 1, 1, 1, 10              ;RGBM 颜色（第四个值为乘数）
BASE_COLOR = 1, 1, 1, 1          ;与 COLOR 相乘
OFF_COLOR = 0.5, 0.5, 0.4, 1    ;灯光处于「关闭」状态时的颜色
OFF_MULT = 0.1                   ;若未设置 OFF_COLOR，则按 COLOR × OFF_MULT 计算

; 范围与衰减
RANGE = 240                      ;灯光到达的距离（米）
RAW_RANGE = 0                    ;设为 1 直接使用 RANGE，不做内部调整
RANGE_GRADIENT_OFFSET = 0        ;灯光传播到何处开始衰减
FADE_AT = 450                    ;光源开始消失的距离
FADE_SMOOTH = 50                 ;衰减的平滑度，限制在 [0, FADE_AT]
OFF_RANGE_MULT = 0.5             ;「关闭」状态的范围乘数
OFF_FADE_MULT = 0.3              ;「关闭」状态的衰减乘数

; 渲染
SPECULAR_MULT = 1                ;高光强度
DIFFUSE_CONCENTRATION = 0.88     ;0：背向光源的表面也被完全照亮；1：仅直射表面
SINGLE_FREQUENCY = 0             ;0 为常规灯光，1 用于钠灯之类
VOLUMETRIC_LIGHT = 1             ;启用体积光效果（开销大）
LONG_SPECULAR = 1                ;为 Rain FX 湿滑路面启用长高光

; 绑定
BOUND_TO = mesh1, mesh2          ;覆盖自动猜测的自发光网格名，用于绑定亮度
BOUND_VERSION = 0                ;绑定计算版本；设为 1 使用较新的行为
BOUND_EMISSIVE_MAX = 500         ;最大自发光值（BOUND_VERSION=0 时默认 500，=1 时默认 0）
BOUND_EXP = 1                   ;作用于绑定的自发光值的指数
RELATIVE_TO = NODE_NAME          ;将灯光位置附着到指定节点（适用于动画部件）
ONESIDED = RIGHT                 ;禁用镜像；设为 RIGHT 则仅翻转到右侧
PREFER_FRONT = -1                ;0 强制使用后部网格，1 强制使用前部网格，-1 为自动
EMISSIVE_INDEX = 0               ;存在多个匹配时使用哪个自发光实例

; 可见性
SELF_LIGHTNING = 0               ;控制该灯是否照亮自身车辆（见下文）
INTERIOR_ONLY = 0                ;仅在相机位于车内时生效
EXTERIOR_ONLY = 0                ;仅在相机位于车外时生效
AFFECTS_TRACK = 1                ;该灯是否影响赛道表面；也可设为
                                 ;"INTERIOR_ONLY" 以专门跳过车身外部渲染
DISTANT_GLARE = 1                ;远距离观看时显示眩光效果
NO_SELF_SPECULAR = 0             ;跳过车辆自身的高光
AMBIENT_INFLUENCE = 1            ;昼夜环境光对该灯的影响程度

; 虚假阴影减弱
FADE_FAKE_SHADOW = 0             ;该灯点亮时减弱车内虚假阴影（0–1）

; 与其他系统的交互
DISABLE_WITH_BOUNCED_LIGHT = 0   ;当 Extra FX 的屏幕空间反射光生效时禁用
DISABLE_WITH_EMISSIVE_LIGHT = 0  ;当 Extra FX 的发光生效时禁用
SKIP_LIGHT_MAP = 0               ;不参与 Extra FX 光照贴图
MIRROR_DIRECTION = 0             ;为对称的一对灯镜像灯光方向

; 翼片
AFFECTED_BY_WING = -1            ;影响该灯的翼片控制器索引，-1 表示无
AFFECTED_BY_WING_LUT =           ;翼片效果的 LUT 文件

; 闪烁模式
BLINKING_PATTERN = (|0=1|0.5=0.8|1=1)  ;闪烁模式的 LUT，输入为时间
BLINKING_DURATION = 2            ;模式周期，单位秒（对 LUT 归一化）
```

### 关于 `SELF_LIGHTNING`

该参数（没错，它是 "self lighting" 的拼写错误，为兼容性而保留）控制灯光是否照亮自身车辆：

- `0`：灯光从不照亮所属车辆本身；这是大灯的默认值，因为你不会希望看到大灯光束从前方照亮车身；
- `1`：灯光在车内与车外视角下都照亮车辆；常用于车内仪表盘灯、开门灯以及其他应能在车辆本身上看到的灯光；
- `EXTERIORONLY`：灯光仅在车外视角（如追逐相机、自由相机）下照亮车辆，车内视角不照亮；这是刹车灯和倒车灯的默认值，这样第三人称下能看到保险杠上的红色辉光，而座舱视角中不会透过仪表盘漏光。

### 线光源

任何支持通用参数的小节，都可以通过指定两个端点变为线光源：

```ini
[LIGHT_HEADLIGHTS]
LINE_FROM = 0.422, 0.1, -0.9
LINE_TO = 0.422, 0.1, 0.9
COLOR_FROM = 1, 0, 0, 5         ;起点颜色
COLOR_TO = 0, 1, 0, 5           ;终点颜色（若与 COLOR_FROM 不同）
```

设置 `LINE_FROM` 和 `LINE_TO` 后，灯光即变为线光源，且 `RANGE_GRADIENT_OFFSET` 自动设为 0。

---

## 大灯

大灯的参数最为丰富。默认值取决于车辆年份——更老的车会得到更宽、更柔和的光束，默认效果也更有年代感。

```ini
[LIGHT_HEADLIGHTS]
; 聚光形状
SPOT = 48                        ;聚光角度（度），默认值取决于车辆年份
SPOT_SHARPNESS = 0
SPOT_UP = 0.1, 1, 0             ;非对称光型的归一化向上向量；
                                 ;非赛车上默认按左舵/右舵略有倾斜

; 第二聚光（主光束周围更宽的环境辉光）
SECOND_SPOT = 144                ;更宽的环境光锥的角度
SECOND_SPOT_SHARPNESS = 0.7
SECOND_SPOT_SKIP = 0.3           ;主聚光与第二聚光之间的间隙
SECOND_SPOT_RANGE = 20           ;第二聚光的范围（米）
SECOND_SPOT_INTENSITY = 0.27     ;第二聚光的亮度乘数

; 跳灯动画
POPUP_ENABLED = 1                ;跳灯动画是否生效
POPUP_START = 0.05               ;灯光开始出现的动画进度
POPUP_END = 0.7                  ;灯光完全点亮的动画进度
POPUP_SECOND_SPOT_INITIAL_VALUE = 0.4
POPUP_SECOND_SPOT_EXP = 0.6
POPUP_EDGE_OFFSET = 0.5
POPUP_EDGE_EXP = 0.3

; 阴影
SHADOWS_CULL_MODE =              ;阴影剔除模式覆盖

; 近光行为
LOWBEAM_MULT = 0.5               ;近光模式下的亮度乘数
LOWBEAM_RANGE_MAX = 70           ;近光的最大范围（米）
LOWBEAM_RANGE_MULT = 0.8         ;近光的范围乘数
LOWBEAM_RANGE_ONCOMING_MULT = 0.4  ;近光模式下对向来车的范围乘数；
                                    ;默认值取决于车辆的现代程度
```

默认值：
- `RANGE` 默认约为 240 米（按车辆年份调整）；
- `FADE_AT` 默认为 450 米；
- `SELF_LIGHTNING` 默认为 `0`（大灯不照亮车辆本身）；
- `VOLUMETRIC_LIGHT` 默认为 `1`；
- `AFFECTS_TRACK` 默认为 `1`。

---

## 刹车灯

```ini
[LIGHT_BRAKES]
DIRECTION = 0, 0, -1
SPOT = 175                       ;默认值取决于车辆的现代程度
SPOT_SHARPNESS = 0.3
SPOT_EDGE = 0.12, 0.12, 0.12
SPOT_EDGE_SHARPNESS = 10
```

默认值：
- `RANGE` 默认为 5 米；
- `FADE_AT` 默认为 120 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## KERS 灯

用于赛车上 KERS 回收指示灯。参数集与刹车灯相同。

```ini
[LIGHT_KERS]
DIRECTION = 0, 0, -1
SPOT = 175
SPOT_SHARPNESS = 0.3
SPOT_EDGE = 0.12, 0.12, 0.12
SPOT_EDGE_SHARPNESS = 10
```

默认值：
- `RANGE` 默认为 3 米；
- `FADE_AT` 默认为 120 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## 倒车灯

```ini
[LIGHT_REVERSE]
DIRECTION = 0, 0, -1
SPOT = 175
SPOT_SHARPNESS = 0.3
SPOT_EDGE = 1, 1, 1
SPOT_EDGE_SHARPNESS = 0
```

默认值：
- `RANGE` 默认为 3 米；
- `FADE_AT` 默认为 120 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## 转向灯

转向灯左右使用各自独立的小节。方向由网格法线猜测。

```ini
[LIGHT_TURNSIGNALS_LEFT]
DIRECTION = -1, 0, 0            ;由网格法线猜测
SPOT = 175
SPOT_SHARPNESS = 0.6
SPOT_EDGE = 0.12, 0.12, 0.12
SPOT_EDGE_SHARPNESS = 0
```

默认值：
- `RANGE` 默认为 2.4 米；
- `FADE_AT` 默认为 60 米；
- `SELF_LIGHTNING` 默认为 `EXTERIORONLY`；
- `EXTERIOR_ONLY` 默认为 `1`。

---

## 转角照明灯

结构与转向灯相同，但范围更大。由转向输入触发点亮。

```ini
[LIGHT_CORNERINGLAMP_LEFT]
DIRECTION = -1, 0, 0
SPOT = 175
SPOT_SHARPNESS = 0.6
```

默认值：
- `RANGE` 默认为 4.8 米；
- `FADE_AT` 默认为 90 米。

---

## 开门灯

车门打开时点亮的灯（照地灯等）。

```ini
[LIGHT_OPENDOORS]
DIRECTION = 0, -1, -0.15        ;默认朝下
SPOT = 160
SPOT_SHARPNESS = 0.8
```

默认值：
- `RANGE` 默认为 2 米；
- `FADE_AT` 默认为 40 米；
- `SELF_LIGHTNING` 默认为 `1`（这类灯会照亮车辆本身）；
- 默认启用阴影。

---

## LED 面板灯

用于带 LED 号码面板（lumirank）的车辆。

```ini
[LIGHT_LED_PANEL]
POSITION = 0, 0, 0              ;默认取自 lumirank 定义中的位置
DIRECTION = 0, 0, -1            ;默认取自 lumirank 定义中的方向
SPOT = 180
SPOT_SHARPNESS = 0.6
MIRROR = 0
COLOR = 1, 1, 1, 8
```

默认值：
- `RANGE` 默认为 5 米；
- `FADE_AT` 默认为 80 米；
- `SELF_LIGHTNING` 默认为 `1`。

---

## 牌照灯

牌照灯从使用 `Plate_D.dds` 和 `Plate_NM.dds` 纹理的网格自动猜测。它们使用单个不带索引的小节。

```ini
[LIGHT_LICENSEPLATE]
ACTIVE = 1
MESHES = plate_mesh              ;覆盖基于牌照纹理的自动检测
MESH_FILTER_DIRECTION = 0, 0, -1  ;用于筛选朝向特定方向的顶点
MESH_FILTER_OFFSET = 0
COLOR = 1, 0.9, 0.8, 2
LAYOUT = TWO_ON_TOP              ;灯光在牌照周围的布局

; 布局特定的默认值（可覆盖）
SPOT = 170
SPOT_SHARPNESS = 0.9
RANGE = 0.3
RANGE_GRADIENT_OFFSET = 0.5
OFFSET = 0, 0.03, -0.05         ;相对计算位置的偏移
FALLBACK_EMISSIVE = 1, 1, 1, 0.3  ;点亮时牌照网格的自发光值

FADE_AT = 12
FADE_SMOOTH = 8
AFFECTS_TRACK = 0
```

支持的 `LAYOUT` 值：
- `AT_SIDES`：牌照两侧各一盏灯；
- `TWO_ON_TOP`：顶边两盏灯（默认）；
- `ONE_ON_TOP`：顶边居中一盏灯；
- `TWO_ON_BOTTOM`：底边两盏灯；
- `ONE_ON_BOTTOM`：底边居中一盏灯；
- `NONE`：禁用牌照灯。

---

## 额外灯光

额外灯光是自定义光源，适用于底盘灯、霓虹灯、车内仪表盘灯等类似效果。第一个额外灯光（索引 0，`[LIGHT_EXTRA]`）是自动猜测的仪表盘灯。更多灯光可通过 `[LIGHT_EXTRA_...]` 添加（使用设置迭代器语法，例如 `[LIGHT_EXTRA_UNDERGLOW]`、`[LIGHT_EXTRA_1]` 等）。

有关额外灯光语法的快速参考，请参阅[额外灯光](https://github.com/car/visual/extra-lights)。

```ini
[LIGHT_EXTRA_...]
; 可以使用点光源：
POSITION = 1, 0, 1
COLOR = 10

; 或使用线光源：
LINE_FROM = 0.422, 0.1, -0.9
LINE_TO = 0.422, 0.1, 0.9
COLOR = 10
; 可选的各端点颜色：
COLOR_FROM = 0, 1, 0
COLOR_TO = 1, 0, 0

DIRECTION = 0, -1, 0
SPOT = 210
SPOT_SHARPNESS = 0.75
SPOT_EDGE = 0
SPOT_EDGE_SHARPNESS = 0
MIRROR = 0

; 绑定到车辆状态
BIND_TO_HEADLIGHTS = 1           ;跟随大灯；第二个值可设为 EXCLUDING_HIGHBEAMS_FLASH
                                 ;或 INCLUDING_HIGHBEAMS_FLASH 以精细控制
BIND_TO_HIGHBEAM = 0             ;仅在远光时点亮
BIND_TO_LOWBEAM = 0              ;仅在近光时点亮
BIND_TO_BRAKELIGHTS = 0          ;跟随刹车灯
BIND_TO_EXTRA_A = 0              ;绑定到额外开关 A（也支持 B、C、D）
NOT_WITH_HEADLIGHTS = 0          ;大灯开启时熄灭

; 自发光绑定
BOUND_TO = mesh_name             ;将亮度绑定到指定网格的自发光
BOUND_EMISSIVE_MAX = 0.5

; 开关延迟
LAG = 0                          ;点亮与熄灭的延迟（会被 LAG_ON/LAG_OFF 覆盖）
LAG_ON = 0                       ;点亮时的延迟
LAG_OFF = 0                      ;熄灭时的延迟

; 其他通用参数同样适用（SELF_LIGHTNING、EXTERIOR_ONLY 等）
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

额外灯光的默认值：
- `RANGE` 默认为 0.25 米；
- `FADE_AT` 默认为 7 米；
- `SELF_LIGHTNING` 默认为 `1`；
- `INTERIOR_ONLY` 默认为 `1`（针对索引 0 处自动猜测的仪表盘灯）；
- `SKIP_LIGHT_MAP` 默认为 `1`。

---

## 刹车盘辉光灯

基于刹车温度数据、由炽热刹车盘发出的动态灯光。

```ini
[LIGHT_BRAKEDISCS_FRONT]
ACTIVE = 1

[LIGHT_BRAKEDISCS_REAR]
ACTIVE = 0

; 共享参数（两个小节都回退到 [LIGHT_BRAKEDISCS]）
[LIGHT_BRAKEDISCS]
COLOR = 1, 0.5, 0, 1.2          ;辉光颜色
GLOW_BOUNDARY_FROM = 1           ;辉光开始的温度边界
GLOW_BOUNDARY_TO = 10            ;辉光达到最大亮度的温度边界
POSITION = 0, 0, 0               ;位置偏移（左右自动镜像）
DIRECTION = 1, 0, 0              ;灯光方向（左右自动镜像）
SPOT = 130
SPOT_SHARPNESS = 0.8
```

默认值：
- 前刹车盘默认启用，后刹车盘默认关闭；
- `RANGE` 默认为 0.65 米；
- `FADE_AT` 默认为 30 米。

---

## 反射光

当大灯或刹车灯照亮赛道时，CSP 可以创建一个反射回车辆本身的虚假反射光。本小节控制该行为。

```ini
; 用于大灯：
[BOUNCED_HEADLIGHTS]
ACTIVE = 1
MULT = 1, 1, 1, 1               ;反射光的 RGBM 乘数
OFFSET = 7                       ;反射光的半径
FALLOFF = 0.7
GRADIENT_OFFSET = 0.8
FADE_AT = 200
FADE_SMOOTH = 50

; 用于刹车灯（参数相同）：
[BOUNCED_BRAKE_LIGHTS]
ACTIVE = 1
MULT = 1, 1, 1, 1
; ...与上面的参数相同

; 两者的共享回退：
[BOUNCED]
ACTIVE = 1
; ...参数相同
```

当 Extra FX 的屏幕空间反射光生效时，反射光会自动禁用。

---

## 车内反射光

大灯灯光反射到车内顶棚上的光。

```ini
[BOUNCED_INTERIOR_LIGHT]
ACTIVE = 1
MULT = 1, 1, 1, 1
OFFSET = 0, -1, 3               ;相对驾驶者眼睛的偏移
DIRECTION = 0, 1, -2
SPOT = 20
SPOT_SHARPNESS = 0.9
RANGE = 3.2
RANGE_GRADIENT_OFFSET = 0.9
```

与外部反射光不同，即使启用了屏幕空间反射光，该灯光默认也保持启用，因为其效果过于精细，屏幕空间无法精确重现。

---

## 后视镜反射光

从车内后视镜反射出的光。自动从车辆内饰中的后视镜检测。

```ini
[BOUNCED_MIRROR_LIGHT]
ACTIVE = 1
DISABLE_WITH_BOUNCED_LIGHT = 0
DISABLE_WITH_EMISSIVE_LIGHT = 0
```

---

### 自发光兼容性修复

如果 CSP 检测到大量额外灯光的自发光值异常偏高（说明配置是在有缺陷的 CSP 版本上制作的），会自动应用自发光兼容性修复。你可以用以下参数控制它：

```ini
[BASIC]
NO_NEED_FOR_LIGHTS_FIX = 1       ;如果灯光看起来正常，设为 1 跳过修复
NEEDS_LIGHTS_FIX = 0             ;设为 1 强制应用修复
```

### 猜测

这些参数大多会从车辆模型、其 `lights.ini`、自定义自发光、车辆类别和生产年份自动猜测。配置中未设置的参数基于以下内容计算：
- `lights.ini` 与自定义自发光定义中的网格位置和自发光颜色；
- 车辆的生产年份（更老的车会得到更宽、更柔和的大灯光束）；
- 车辆是赛车、开轮式赛车还是公路车；
- 左舵还是右舵（影响大灯光束的非对称性）。

