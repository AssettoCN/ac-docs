---
title: 音频系统
---

# 音频系统

如果需要，你可以为赛道创建音效库（soundbank）并将各种音频事件附加到赛道上的不同位置。

需要将文件放置如下：

- `content/tracks/<trackfolder>`
  - `extension/`
    - `sfx/`
      - `GUIDs.txt`
      - `sfx.bank`
    - `ext_config.ini`

在 "ext_config.ini" 中写入：

```ini
; 首先，定义要使用的音效库：

[SOUNDBANK_0]
BANK = sfx/sfx.bank    ; 如你所见，这些文件可以有不同的名称
GUIDS = sfx/GUIDs.txt  ; 但开始时，像这样命名就好，以防万一

; 然后，定义音效库中的事件

[EVENT_0]
ID = event/path      ; 事件路径，如 GUIDs.txt 中所示
REVERB_RESPONSE = 1  ; 事件是否响应混响

; 定位：
POSITION = X, Y, Z   ; 空间中音频源的位置
                      ; （可以使用 Object Inspector 快速找到位置，
                      ; 只需点击任意位置并复制坐标）
DIRECTION = 0, 0, 1  ; 音频事件的方向

; 音量：
VOLUME = 1                  ; 基础音量
CAMERA_INTERIOR_MULT = 0.2  ; 车内摄像机的音量乘数
CAMERA_EXTERIOR_MULT = 1    ; 外部摄像机（如追踪摄像机）的音量乘数
CAMERA_TRACK_MULT = 1       ; 赛道摄像机的音量乘数

; 参数：
INPUT_KEY_0 = some_parameter
INPUT_VALUE_0 = 0.5
INPUT_KEY_1 = different_parameter
INPUT_VALUE_2 = 1.5

; 当然，你可以在多个点使用同一事件，使用不同的参数：

[EVENT_1]
ID = event/path
POSITION = 0, 0, 10
; 以此类推

; 如果需要更复杂的内容，对于每个数值（如音量、音量乘数或输入值），
; 可以使用变量值代替常量。

[CONDITION_0]
; 此条件白天返回 0，夜间返回 1：
NAME = NIGHT_VOLUME
INPUT = SUN
LUT = (| 0=0 | 88=0 | 88=1 | 180=1 |)
LAG = 0.97

[EVENT_2]
ID = event/path
INPUT_KEY_0 = some_parameter
INPUT_VALUE_0 = NIGHT_VOLUME

[EVENT_...]
; 跟随动画对象的音频事件：
ID = event/path
RELATIVE_TO = node_name  ; 或 mesh_name

; 以此类推
```

## 相关主题

- [条件系统（Conditions）](./conditions.md) — 用于创建动态音频参数
- [动画对象](./animated-objects.md) — 用于将音频绑定到动画对象

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Audio) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
