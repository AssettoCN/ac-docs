---
title: 条件系统（Conditions）
---

# 条件系统（Conditions）

赛道配置可以定义条件（Conditions），并将其用作动态灯光强度的输入、材质变量不同值之间的混合、自定义音频事件的参数等。

## 语法

```ini
[CONDITION_...]
NAME = CONDITION_NAME    ; 条件名称，用于引用
INPUT = SUN              ; 条件输入键
LUT = (|0=0|90=1|)       ; LUT 设置输入与输出值的关系
LAG = 0.8                ; 平滑过渡的滞后值
LAG_DELAY_ON = 1800      ; 开启所需时间（秒）；如果缺少，将使用 LAG
LAG_DELAY_OFF = 0        ; 关闭所需时间（秒）；设为 0 时使用 LAG
LAG_DELAY_FUNC = SQRT    ; 非零 LAG_DELAY_… 的插值方式，可用值：SQR、POW3、SQRT、LINEAR
SIMULATE_HEATING = 0.7   ; 如果大于零，过渡会模拟加热效果，关闭时变得更红
BOUND_TO_SPECTATORS = 0  ; 设为 1 时，输入会乘以观众数量

; 闪烁参数：
FLASHING_FREQUENCY = 0             ; 闪烁频率
FLASHING_MIN_VALUE = 0             ; 闪烁会应用从此最小值到 1 的乘数
FLASHING_SKIP_OFF_STATE = 0        ; 基本闪烁作为正弦波，一半时间处于禁用状态，
                                    ; 设为 1 跳过那些禁用阶段
FLASHING_SKIP_DOWNHILL_STATE = 0   ; 设为 1 跳过正弦波变小的阶段
FLASHING_SMOOTHNESS = 1            ; 闪烁值的指数（或设为 LINEAR 将正弦波变为线性过渡）
FLASHING_NOISE_AMPLITUDE = 0       ; 增加以添加随机噪声
FLASHING_NOISE_BOUND = 1           ; 随机噪声变化的最大速度
FLASHING_NOISE_SPEED = 10          ; 随机噪声速度变化的速率
FLASHING_LUT = 0                   ; 噪声的可选 LUT
FLASHING_SYNCED = 0                ; 设为 1 时，使用此条件的所有事物噪声同步
```

LUT 可以引用文件而不是内联，使用与原始 AC LUT 相同的格式。此外，这些 LUT 还可以提供 RGB 值，允许彩色过渡。

更多示例请查看 `config/tracks/common/conditions.ini`。

## 复杂表达式

引用条件或设置条件的 INPUT 值时，现在可以以表达式形式引用其他先前定义的条件：

```ini
[CONDITION_...]
NAME = condition_my_1
INPUT = 'SUN * 2 + TIME'

[CONDITION_...]
NAME = condition_my_2
INPUT = 'condition_my_1 * 4 - 100'

[LIGHT_...]
CONDITION = 'saturate( condition_my_2 * 0.01 + condition_my_1 + TIME )'
```

### 可用函数

**无参数（常量）：**
- `e`：欧拉数；
- `pi`：圆周率。

**单参数：**
- `abs(x)`：返回 `x` 的绝对值；
- `acos(x)`：返回弧度角；
- `asin(x)`：返回弧度角；
- `atan(x)`：返回弧度角；
- `ceil(x)`：向上取整；
- `cos(x)`：接受弧度角；
- `cosh(x)`：接受弧度角；
- `exp(x)`：返回 `e^x`；
- `floor(x)`：向下取整；
- `ln(x)`：自然对数；
- `log(x)`：以 10 为底的对数；
- `log10(x)`：以 10 为底的对数；
- `saturate(x)`：如果 `x` 在 0 和 1 之间则返回 `x`，否则返回 0 或 1（取更近者）；
- `sign(x)`：返回 `x` 的符号，除非为 0，否则返回 0；
- `sin(x)`：接受弧度角；
- `sinh(x)`：接受弧度角；
- `smoothstep(x)`：smoothstep 适用于渐变；
- `smootherstep(x)`：类似 smoothstep 但更平滑；
- `sqrt(x)`：返回平方根；
- `tan(x)`：接受弧度角；
- `tanh(x)`：接受弧度角。

**双参数：**
- `atan2(x, y)`：将 `x` 和 `y` 转换为弧度角；
- `max(x, y)`：返回 `x` 和 `y` 中较大的；
- `min(x, y)`：返回 `x` 和 `y` 中较小的；
- `pow(x, y)`：将 `x` 的 `y` 次幂；
- `step(x, y)`：如果 `y` 大于等于 `x` 返回 1，否则返回 0。

**多参数：**
- `clamp(x, min, max)`：如果 `x` 在 `min` 和 `max` 之间则返回 `x`，否则返回更近的 `min` 或 `max`；
- `remap(x, a, b, c, d)`：如果 `x` 等于 `a` 返回 `c`，如果等于 `b` 返回 `d`，否则在 `c` 和 `d` 之间线性插值（不进行钳制）。

## 可用输入

- `TIME`：从 00:00 到 23:59 的一天中的时间（秒），取整。

- `TIME_SMOOTH`：从 00:00 到 23:59 的一天中的时间（秒），不取整。

- `SUN`：太阳角度（度），0 为天顶，90 为地平线。

- `YEAR_PROGRESS`：年度进度，从 0 到 1。

- `YEAR_DAY`：一年中的第几天，从 1 到 365（2 月 29 日被跳过，因此可以绑定其后的特定日期而无需担心闰年）。

  如果需要绑定特定日期，使用 LUT：

  ```ini
  [CONDITION_...]
  INPUT = YEAR_DAY     ; 第 184 天是 7 月 4 日
  LUT = (| 1=0 | 184=0 | 185=1 | 186=0 | 356=0 |)
  ```

  ```ini
  [CONDITION_...]
  INPUT = YEAR_DAY     ; 按日期的硬性冬季切换
  LUT = (|1=1|40=1|41=0|332=0|333=1|365=1|)
  ```

  ```ini
  [CONDITION_...]
  INPUT = YEAR_PROGRESS    ; 渐变冬季效果
  LUT = (| 0=0.5 | 0.1=1 | 0.2=0 | 0.8=0 | 0.9=0.35 | 1=0.5 |)
  ```

- `WEEK_DAY`：星期几，从 1 到 7。

- `AMBIENT`：环境光亮度乘数，夜间为 1.0，晴朗正午时非常低（≈0.01）（Python 函数：`ac.ext_getAmbientMult()`）。

- `FOG`：雾强度。

- `FLAG_TYPE`：比赛旗帜类型。

  此输入还有参数 `INPUT_CHANGE_DELAY`（延迟更改的秒数）和 `INPUT_STAY_FOR`（保持更改的秒数）。

  可能的值：

  - 0：无旗帜，非比赛；
  - 1：比赛开始，一切正常；
  - 2：注意，黄旗；
  - 3：湿滑赛道表面¹²；
  - 4：维修区通道关闭¹²；
  - 5：黑旗；
  - 6：赛道上有慢速车辆²；
  - 7：赛道上有救护车/最后一圈¹²；
  - 8：返回维修区（通过处罚）；
  - 9：因机械问题返回维修区¹²³；
  - 10：不当行为¹²；
  - 11：无视黑旗¹²；
  - 12：快速车辆接近（蓝旗）；
  - 13：赛段结束；
  - 14：最后一圈；
  - 15：赛段暂停²；
  - 16：代码 60¹²。

  ¹ 需要某种图案；

  ² AC 默认不会触发，但自定义赛道或在线脚本可以设置该旗帜；

  ³ 需要板上的车辆号码。

- `CAR_ACTIVE_X`：如果维修区 #X（从 0 开始的索引）的车辆存在则返回 1，否则返回 0。

- `CAR_DAMAGE_X`：返回维修区 #X（从 0 开始的索引）的车辆最大损伤级别；损伤值是最大碰撞速度。

- `CAR_DAMAGE`：返回任何车辆的最大损伤级别；损伤值是最大碰撞速度。

- `SPECTATORS`：赛道上的观众百分比，从 0 到 1。

- `RAIN`：雨强度，从 0 到 1。

- `RAIN_WETNESS`：返回赛道湿度（下雨开始时快速上升到 1）。

- `RAIN_WATER`：返回赛道上的水量（缓慢上升到赛道强度并保持，定义水坑）。

- `ONLINE_RACE`：如果是在线比赛则返回 1。

- `ONE`：始终返回 1。

- `ZERO`：始终返回 0。

- `HOLIDAY`：当前假日类型，用于烟花和其他节日效果。

  可分为三种主要类型：

  - **全局**：由系统时间触发，到处生效；
  - **区域**：根据 Windows 设置中的区域由系统时间触发，某些区域可能不会触发；
  - **赛道基于**：如果赛道设置在某个区域，由游戏内时间触发。

  当前支持的假日：

  - 0：无；
  - 1：新年（全局）；
  - 2：圣诞节¹；
  - 3：胜利日¹；
  - 4：独立日²；
  - 5：万圣节²；
  - 6：日本烟花节²；
  - 7：中国新年²；
  - 8：宰牲节²；
  - 9：盖伊·福克斯之夜²；
  - 10：圣伊什特万节²；
  - 11：加拿大日²；
  - 12：维多利亚日²。

  ¹：区域性（根据 Windows 设置中的系统区域触发）；

  ²：区域性或赛道基于（根据系统区域或赛道位于合适的区域国家时触发）。

  日本烟花节在 8 月举行，默认从 8 月 1 日到 3 日。要根据赛道的地区更改日期，使用 `[PARTICLES_FX] JAPAN_AUGUST_FESTIVALS_INTERVAL = 1, 3`（默认值）。

  如果有其他假日想要添加，请联系开发者。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Conditions) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
