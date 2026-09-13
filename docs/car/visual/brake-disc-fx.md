---
title: 刹车盘 FX
---


> 汉化标题：车辆 – 刹车盘 FX  
> 原文页面：Cars-–-Brake-Disc-FX  
> 原文锚点：8b99d55  
> 汉化时间：2026-09-12T00:00:00+08:00  

全新的刹车盘着色器，具有各向异性光照、动态磨损和全新的加热效果。

<a href="https://gfycat.com/AdorableJampackedFantail"><img src="https://thumbs.gfycat.com/AdorableJampackedFantail-size_restricted.gif" height="400" ></a>
<a href="https://gfycat.com/AdeptIdealisticIlladopsis"><img src="https://thumbs.gfycat.com/AdeptIdealisticIlladopsis-size_restricted.gif" height="400" ></a>

*不必在意孔洞过早发光的问题，现在已经修复。*

补丁会找出所有使用 `ksBrakeDisc` 着色器的网格，将其切换为 `ksBrakeDiscFX`，并添加若干参数使整体生效。如果您将 `ksBrakeDisc` 用于其他用途，可以通过设置禁用整个功能：

### 基本设置（如有需要建议修改）

```ini
[BRAKEDISC_FX]
ACTIVE = 1             ; 若车辆将 ksBrakeDisc 着色器用于其他用途，设为 0 可禁用整个功能
CERAMIC = 0            ; 使用陶瓷外观
CARVED = 0             ; 添加少许刻纹（径向线条，着色器计算开销低）
CARVED_FREQUENCY = 20  ; 增大可增加线条数量
GLOW_OFFSET = 0.8      ; 增大将使受热与磨损的中心区域更偏向盘心，减小则更偏向外部；取 0.5 时位于正中

; 补丁根据 txDiffuse 的 alpha 通道猜测孔洞。孔洞不发光、不反射且呈暗色：
ALPHA_MASK = 0.1, 0.2  ; alpha 低于 0.1 的部分为孔洞，高于 0.2 的部分不是孔洞，介于两者之间为过渡

; 补丁还能根据亮度和法线纹理估算凹陷。凹陷的炽热有延迟（但完全受热后更亮）且带有少许遮挡：
LUMINOCITY_MASK = 0.01, 0.02  ; 亮度低于 0.01 的部分为凹陷
NORMAL_MASK = 0.5, 0.3        ; 朝向偏离超过 50% 的部分为凹陷

; 补丁会尝试从网格猜测刹车盘尺寸及其内部区域，若猜测失败：
DISC_RADIUS = 0.25           ; 刹车盘半径
DISC_INTERNAL_RADIUS = 0.15  ; 刹车盘内部区域的半径

; 另一项特性：补丁会用轮辋遮挡反射，避免从某个角度看时刹车盘反射天空。默认使用“tyres.ini”中的轮辋半径和 60% 的车轮宽度（用于计算刹车盘与轮辋外侧之间的距离），如有需要可更改：
RIM_RADIUS = 0.35  ; 轮辋内侧半径
RIM_HEIGHT = 0.2   ; 刹车盘表面与轮辋垂直面之间的距离
```

若要分别自定义前轮或后轮刹车盘，请使用 `[BRAKEDISC_FX_FRONT]` 或 `[BRAKEDISC_FX_REAR]`。示例中给出的设置在大多数情况下即默认值。

### 调试设置

```ini
[BRAKEDISC_FX]
DEBUG = 0  ; 设为 1 可高亮显示形状：
    ; • 青色为盘面本体；
    ; • 黄色为凹陷；
    ; • 深蓝色为内部区域；
    ; • 粉色为外部区域；
    ; • 红色为边缘；
    ; • 黑色为孔洞。
WEAR_FORCE = 0.5  ; 强制指定磨损程度
GLOW_FORCE = 0.5  ; 强制指定炽热程度
```

### 其他设置（不太建议修改）

```ini
OVERRIDE_NORMAL_MAP = 1   ; 设为 0 使用原始法线贴图
OVERRIDE_DIFFUSE_MAP = 1  ; 设为 0 使用原始漫反射贴图
WEAR_MULT = 1.0           ; 除非您想将其设为 0 之类的值，否则请不要修改此项；通用乘数将来可能会变化
GLOW_MULT = 1.0           ; 调整发光强度
ROUGHNESS = 0.2, 0.9      ; X 与 Y 材质粗糙度，产生径向各向异性高光

; 以下材质设置成对出现：第一个数值用于新盘，第二个用于磨损盘。默认值取决于是否为陶瓷盘：
REFLECTION_F0 = 0.08, 0.44      ; 基础反射强度；陶瓷：0.16, 0.44
REFLECTION_SHARPNESS = 10, 200  ; 即控制反射模糊度的 ksSpecularEXP；陶瓷：10, 10
SPECULAR = 0.5, 1               ; 高光强度

```

请避免修改这些设置，尤其是材质设置，除非您需要还原某种特殊材质。如果只是普通金属或陶瓷盘而默认设置效果不佳，欢迎与我讨论。我真心希望 AC 内容能更加标准化。

### 猜测

默认情况下，补丁会为不早于 1990 年的赛车和开轮式赛车、以及 2004–2010 年之后生产的部分运动型车辆分配陶瓷刹车。[另请参阅](https://github.com/car/guessed-configs)

### 稍后添加的功能

- 调整磨损强度。

