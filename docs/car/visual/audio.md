---
title: 音频选项
---


> 汉化标题：车辆 – 音频选项  
> 原文页面：Cars-–-Audio-options  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

通过补丁，您可以更改特定音频事件的音量或音调、更改事件的输入参数，或在您的 soundbank 中使用额外参数。

### 语法

调整音量的方法如下：

```ini
[AUDIO_VOLUME]
ENGINE_EXT = 1.0
ENGINE_INT = 1.0
GEAR_EXT = 1.0
GEAR_INT = 1.0
BODYWORK = 1.0
WIND = 1.0
DIRT = 1.0
DOWN_SHIFT = 1.0
HORN = 1.0
GEAR_GRIND = 1.0
BACKFIRE_EXT = 1.0
BACKFIRE_INT = 1.0
TRACTION_CONTROL_EXT = 1.0
TRACTION_CONTROL_INT = 1.0
TRANSMISSION = 1.0
LIMITER = 1.0
TURBO = 1.0

; 0.1.67 新增选项：
HIT = 1.0
SCRAPE = 1.0
WHEEL = 1.0
SKID_EXT = 1.0
SKID_INT = 1.0
```

同样，音调也可以调整（0.1.67 新增）：

```ini
[AUDIO_PITCH]
ENGINE_EXT = 1.0
ENGINE_INT = 1.0
GEAR_EXT = 1.0
GEAR_INT = 1.0
BODYWORK = 1.0
WIND = 1.0
DIRT = 1.0
DOWN_SHIFT = 1.0
HORN = 1.0
GEAR_GRIND = 1.0
BACKFIRE_EXT = 1.0
BACKFIRE_INT = 1.0
TRACTION_CONTROL_EXT = 1.0
TRACTION_CONTROL_INT = 1.0
TRANSMISSION = 1.0
LIMITER = 1.0
TURBO = 1.0
HIT = 1.0
SCRAPE = 1.0
WHEEL = 1.0
SKID_EXT = 1.0
SKID_INT = 1.0
```

此外，自 0.1.67 起，您还可以对输入参数应用 LUT，如下所示：

```ini
[AUDIO_PARAMETER_TRANSFORM]
; 原本 AC 会向 soundbank 发送 10000，现在将改为发送 5000。或者，
; 将发送 2500 而不是 5000——这些点之间的值按线性插值。
ENGINE_EXT_RPMS = (| 0=0 | 10000=5000 |)
```

支持的参数：

- ENGINE_EXT: ENGINE_EXT_RPMS, ENGINE_EXT_THROTTLE;
- ENGINE_INT: ENGINE_INT_RPMS, ENGINE_INT_THROTTLE;
- GEAR_EXT: GEAR_EXT_STATE;
- GEAR_INT: GEAR_INT_STATE;
- BODYWORK: BODYWORK_SUSP_TRAVEL_SPEED;
- WIND: WIND_SPEED, WIND_AIR_PRESSURE;
- DIRT: DIRT_SPEED, DIRT_DIRTINESS;
- BACKFIRE_EXT: BACKFIRE_EXT_THROTTLE;
- BACKFIRE_INT: BACKFIRE_INT_THROTTLE;
- TRACTION_CONTROL_EXT: TRACTION_CONTROL_EXT_DECAY;
- TRACTION_CONTROL_INT: TRACTION_CONTROL_INT_DECAY;
- TRANSMISSION: TRANSMISSION_DRIVETRAIN_SPEED, TRANSMISSION_THROTTLE;
- LIMITER: LIMITER_DECAY;
- TURBO: TURBO_BOOST, TURBO_BOV, TURBO_BOV_DECAY;
- HIT: HIT_IMPACT_ANGLE, HIT_IMPACT_SPEED;
- SCRAPE: SCRAPE_SPEED, SCRAPE_DECAY;
- WHEEL: WHEEL_BRAKE, WHEEL_SPEED, "WHEEL_INFLATION, WHEEL_SUSPENSION_DAMAGE.

另一项特性是可以在音频 soundbank 中添加新参数：

```ini
[AUDIO_PROPERTIES]
TURBO_THROTTLE = 1    ; 用于涡轮声音的“throttle”输入，与引擎事件中相同
ENGINE_EXT_BOOST = 1  ; 用于车外引擎声音的“boost”输入，与涡轮事件中相同
ENGINE_INT_BOOST = 1  ; 用于车内引擎声音的“boost”输入，与涡轮事件中相同
```

### 新增声音事件

补丁还添加了新的车辆声音事件：

- `/transmission_ext`：类似于 `transmission` 事件，但用于车外；
  - 参数：`drivetrain_speed` 和 `throttle`，与 `transmission` 事件相同。

此外，还有一些事件可在 soundbank 中自定义，但如果缺失，将使用通用版本：

- `/wiper_ext`：车外摄像机视角的雨刷移动声音；
  - 参数：`state` 表示动画状态，用于使雨刷动作与声音同步；
- `/wiper_int`：车内摄像机视角的雨刷移动声音；
  - 参数：`state` 表示动画状态，用于使雨刷动作与声音同步。

### 稍后添加的功能

- 更多可调整的事件；
- 新的车辆声音事件（?）；
- 面向新 soundbank 的更多参数（?）。

