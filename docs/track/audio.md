---
title: 音频
---


> 汉化标题：赛道 – 音频  
> 原文页面：Tracks-–-Audio  
> 原文锚点：fc6d938  
> 汉化时间：2026-09-12T00:00:00+08:00  

如有需要，你可以为赛道创建一个声音库（soundbank），并将各种音频事件挂接到赛道上的不同位置。[这里有一个示例](https://mega.nz/#!LhZx3YyR!Qe6DoRgMZ5KeQHNiy0WcnM4WfxbA8w5N0fpfiYH9-CE)。

要使其工作，文件需要按如下方式放置：

- `content/tracks/<trackfolder>`
  - `extension/`
    - `sfx/`
      - `GUIDs.txt`
      - `sfx.bank`
    - `ext_config.ini`

然后在 “ext_config.ini” 中写入：

```ini
; 首先，需要定义要使用的声音库：

[SOUNDBANK_0]
BANK = sfx/sfx.bank    ; 如你在此所见，这些文件可以取别的名字
GUIDS = sfx/GUIDs.txt  ; 但起步阶段还是这样命名吧，以防万一

; 接着，定义声音库中的事件

[EVENT_0]
ID = event/path      ; 事件路径，与 GUIDs.txt 中所见一致
REVERB_RESPONSE = 1  ; 事件是否响应混响

; 定位：
POSITION = X, Y, Z   ; 音频源在空间中的位置
                     ; （可以用 Object Inspector 快速查到位置，
                     ; 点击任意处并复制坐标即可）
DIRECTION = 0, 0, 1  ; 音频事件的方向

; 音量：
VOLUME = 1                  ; 基础音量
CAMERA_INTERIOR_MULT = 0.2  ; 车内摄像机的音量乘数
CAMERA_EXTERIOR_MULT = 1    ; 追尾视角等外部摄像机的音量乘数
CAMERA_TRACK_MULT = 1       ; 赛道摄像机的音量乘数

; 参数：
INPUT_KEY_0 = some_parameter
INPUT_VALUE_0 = 0.5
INPUT_KEY_1 = different_parameter
INPUT_VALUE_2 = 1.5

; 当然，你可以在多个位置使用同一事件，并配以不同的参数：

[EVENT_1]
ID = event/path
POSITION = 0, 0, 10
; 依此类推

; 另外，如果需要更复杂的效果，对于音量、音量乘数或输入值
; 这样的每一个数值，都可以用可变值代替常数。

[CONDITION_0]
; 该条件白天返回 0，夜间返回 1：
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

; 依此类推
```

