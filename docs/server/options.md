---
title: 服务器额外选项
---

更新 v0.1.69 增加了向服务器添加额外参数的功能：一个隐藏在欢迎消息中的简单 INI 配置文件。其工作原理是，该消息对于使用原始 Assetto Corsa 或 CSP 版本低于 v0.1.69 的用户不可见。

## 可用选项

### 比赛规则

如果你使用这些选项，建议设置 CSP 版本的最低限制（至少设置为 0.1.69 以使用基本选项），以确保所有人都在相同的规则和条件下比赛。

```ini
[EXTRA_RULES]
ALLOW_WRONG_WAY = 1                  ; 允许车辆双向行驶
MAX_METERS_WRONG_WAY = 100           ; 从 0.2.0 开始可用，反向行驶允许的最大距离，超过后将施加处罚

; 从 0.1.76 开始可用：
ENFORCE_BACK_TO_PITS_PENALTY = 1     ; 比赛中使用返回维修区命令时添加处罚，与暂停菜单中的"返回维修区"相同
ENFORCE_BACK_TO_PITS_STOP = 1        ; 如果车辆正在移动，则阻止返回维修区命令

; 从 0.1.77 开始可用：
LIMIT_LOCK_CONTROLS_TIME = 60        ; 每次锁定控制处罚的上限（秒）
LIMIT_LOCK_CONTROLS_TOTAL_TIME = 90  ; 锁定控制处罚总时长的上限（秒）（在一些大型赛道上，
                                      ; 没有此限制，处罚可能会大到重新加入服务器成为唯一选择）
UNFIT_FOR_DRIVETHROUGH_PENALTY = X, Y, Z, radius  ; 定义一个球体区域，在该区域内进入维修区不会
                                      ; 被计为执行驶过处罚（如 Spa 的第二条维修区通道，
                                      ; 参数为 "-202.04, 12.54, -857.77, 50"）

; 从 0.1.78 开始可用（之前的版本有 bug，请确保设置 0.1.78 为最低要求）：
NO_BACK_TO_PITS = 1                  ; 禁止返回维修区命令和暂停菜单中的"返回维修区"
                                      ; （管理员仍可在需要时传送车辆）
NO_BACK_TO_PITS_OUTSIDE_OF_PITS = 1  ; 同上，但仅在车辆不在维修区位置时生效

; 从 0.1.78 开始可用：
INVALIDATE_LAP_TIME_IN_PITS = 1      ; 如果车辆经过维修区则使圈速无效（适用于维修区路面
                                      ; 未标记为无效的赛道）
REQUIRED_MODULES = lighting_fx, weather_fx  ; 必需模块的可选列表（只需使用其配置名称），
                                      ; 设置后将禁用实时设置更改
REQUIRE_NEW_LAP_FOR_DRIVETHROUGH_PENALTY = 1 ; 设置后，获得驶过处罚的车手不能直接倒车执行处罚
HIDE_MAP = 1                         ; 隐藏默认 AC 地图应用（用户仍可使用第三方应用）

; 从 0.1.79 开始可用：
SLIPSTREAM_MULT = 1                  ; 可用于增加或减少尾流效果的强度

DISABLE_RAIN_PHYSICS = 0             ; 设为 1 禁用雨天物理

; 从 0.2.1 开始可用：
PITS_ORDER = F<TR>                   ; F=燃油, T=轮胎, R=维修
                                      ; 尖括号内的操作可同时进行，默认 AC 行为是 <FTR>

; 从 0.2.3 开始可用：
SURFACES_FX = 0                      ; 启用 SurfacesFX 模块

; 从 0.2.5 开始可用：
DISABLE_AUTOBRAKING = 1              ; 启用禁用自动刹车的物理实验

AFK_AUTOKICK = 5, OPTION             ; 时间（分钟）
                                      ; 可用选项，只选一个：
                                      ; SPEED: 平均速度低于 0.4km/h 的车辆
                                      ; INPUT: 监控车辆输入和鼠标移动
```

### 维修区限速器设置

从 0.1.76 开始可用。更改维修区限速器的工作方式。

```ini
[PITS_SPEED_LIMITER]
DISABLE_FORCED = 1                              ; 禁用强制维修区限速器
KEEP_COLLISIONS = 1                             ; 激活维修区内车辆之间的碰撞
SPEED_KMH = 80                                  ; 修改维修区限速器值；默认为 80
SPEEDING_PENALTY = DRIVE_THROUGH                ; 违规处罚（目前可选 DRIVE_THROUGH
                                                ; 或 TELEPORT_TO_PITS 并锁定控制）
SPEEDING_PENALTY_LAPS = 3
SPEEDING_SUBSEQUENT_PENALTY = TELEPORT_TO_PITS  ; 可选，第二次违规的更严厉处罚
SPEEDING_SUBSEQUENT_PENALTY_TIME = 30           ; 控制锁定时长（秒）
```

### 自定义运动

从 0.1.77 开始可用。此选项替换了在线远程车辆位置的外推方式。新的实现修复了车辆在跳跃或翻滚时车轮脱离的问题，提高了性能并使车辆运动更加平滑。

```ini
[EXTRA_TWEAKS]
CUSTOM_MOTION = 1, flags        ; flags 是可选的，以逗号分隔
```

标志：

- `SMOOTH`：从 0.1.78 开始可用，平滑慢速移动车辆的运动以防止大型赛道上的抖动。
- `RESET`：从 0.2.3 开始可用，车辆传送时重置插值（经过测试和验证后，可能会默认为所有车辆启用）


另外，从 0.1.78 开始，启用自定义运动后可以禁用远程车辆在跳跃时的碰撞体（由连接问题引起）。附近碰撞体被禁用的车辆会闪烁蓝色。碰撞体会被禁用一段时间，但如果存在持续接触则保持禁用，以防止车辆互相弹开。以下是[该功能的演示视频](https://files.acstuff.ru/shared/8pFk/20220427-225256.mp4)（摄像头聚焦于远程"卡顿"车辆短暂失去连接，维修区碰撞已启用）。

```ini
[EXTRA_TWEAKS]
JUMP_LIMIT = 0.3                ; 跳跃阈值（米），如果远程车辆突然移动超过此距离则应用修复
JUMP_PAUSE_COLLISIONS_FOR = 5   ; 禁用碰撞的持续时间（秒），默认为 5
```

### 紧急重置

从 0.1.78 开始可用。如果车辆穿过地面或卡在墙壁中，将其重置回维修区。

```ini
[EMERGENCY_RESET]
FALL = 5                        ; 距离（米），如果车辆低于地面超过此值则重置
COLLISION = 3                   ; 时间（秒），如果车辆卡在墙壁中超过此时间则重置
PENALTY = 1                     ; 如果此可选参数设为 1，重置将施加与手动传送到维修区相同的处罚
```

### 额外数据

```ini
[EXTRA_DATA]

; 从 0.1.75 开始可用：
TYRES_BLOWN_STATE = 0     ; 交换爆胎状态数据用于视觉效果

; 从 0.1.77 开始可用：
CAMBER_TOE_STATE = 1      ; 交换外倾角和前束角数据，需要启用自定义运动
CUSTOM_UPDATE_FORMAT = …  ; 自定义服务器可以使用具有可变刷新率、精度、批量数据包等
                          ; 的自定义协议：此处给出这些数据包的实际描述
```

### 自定义物理

一些不需要任何自定义物理文件的基本物理调整。

```ini
[CUSTOM_PHYSICS]
REAL_MASS = 1                    ; 设为 1 为远程车辆的刚体设置真实质量，有助于解决碰撞
                                  ; 不如预期的问题（作为实际质量的乘数，可大于 1
                                  ; 使碰撞更有弹性，或小于 1 使碰撞更柔和）
EXTRAPOLATE_STATE = 1            ; 实验性选项，使所有车辆运动更平滑，不推荐使用

; 从 CSP 0.2.5 开始可用
DISABLE_SURFACE_SNAPPING = 0,3,9 ; 以逗号分隔的维修区车位索引列表（从 0 开始）
                                  ; 禁用车辆自动贴合地面。适用于飞机。

; 从 0.1.77 开始可用，服务器现在可以完全重新定义碰撞参数。所有值都是可选的：
[CUSTOM_COLLISIONS]
SOFT_ERP = 0.99                  ; 误差减少参数
SOFT_CFM = 0.0001                ; 约束力混合，值越高碰撞越软
BOUNCE = 0.01                    ; 弹跳参数
FRICTION = 0.25                  ; 接触摩擦
INTENSITY = 1                    ; 碰撞强度（影响损坏、音频和视觉效果）
MAX_DEPTH = 0.2                  ; 如果设置且碰撞深度超过此参数，碰撞变为硬碰撞：可能
                                  ; 有助于提高性能
```

### 文件验证

从 0.1.77 开始可用。使用此功能服务器可以检查某些 AC 文件的存在性和完整性。你可以使用[此类在线工具](https://emn178.github.io/online-tools/sha256_checksum.html)生成校验和。

```ini
[VERIFY_INTEGRITY_...]
FILE = content/cars/…           ; 相对于 AC 根目录的文件路径
CHECKSUM = …                    ; SHA256 校验和

[EXTRA_TWEAKS]
VERIFY_STEAM_API_INTEGRITY = 1  ; 设为 1 以验证 "steam_api64.dll" 的完整性。
```

### 时区

从 0.1.78 开始可用。允许以秒为单位指定精确的时区偏移，以及纬度和经度，以确保所有客户端处于相同的光照条件下。默认情况下，CSP 从其内置数据库或赛道配置中获取这些值，但它们可能已过时。

```ini
[WEATHER_FX]
TIMEZONE = 0                ; 与 UTC 的偏移（秒）；如果需要夏令时，请在此处添加
LATITUDE = 36.25            ; 纬度（度），使用数字（如 36° 15' 变为 36.25）
LONGITUDE = 121.5           ; 经度（度），同样使用数字

; 从 0.1.79 开始可用：
TIMEZONE_ID = Europe/Paris  ; 时区 ID（TZ 数据库名称）。这样设置后，夏令时将根据
                            ; 当前日期自动计算，但使用 "TIMEZONE" 显式设置偏移
                            ; 可能是更好的方法。
```

### 其他在线调整

一些其他的在线调整选项。

```ini
[EXTRA_TWEAKS]
FORCE_HEADLIGHTS = 1            ; 强制保持前照灯开启

; 从 0.1.77 开始可用：
SHOW_DISCONNECTED = 1           ; 显示已断开连接的车辆；设为 WITH_COLLISIONS 而非 1，
                                ; 其他车辆可以与之碰撞

; 从 0.1.78 开始可用：
ACTUAL_TRACK_TIME = 1           ; 如果你的时间比例接近 100% 则设为 1；由火车脚本等
                                ; 用于在客户端之间同步状态；没有此选项时火车时间
                                ; 为：12:00 + 2hr × SessionIndex + SessionTime
SPECTATORS_AMOUNT = 1           ; 调整赛道上的观众数量；从 0 到 1，0 为无观众

MIN_TIME_BETWEEN_COLLISIONS = 5 ; 从 0.2.0 开始可用，用于服务器端插件，不影响玩家物理
                                ; 批量碰撞信息发送到服务器之间的时间（秒）。
                                ; 最小值 0.05，推荐值在 1 到 5 之间
```

```ini
[SPECIAL_CARS]
HIDE_LABELS = …                 ; 要隐藏车手名称标签和在地图上隐藏的车辆的从 0 开始的索引列表
```

### 自由漫游功能

专用于特殊服务器的一些额外功能。所有选项都需要仅 CSP 服务器。

#### 颜色更改
允许在维修区使用简单的颜色选择器更改车辆颜色，适用于使用常规涂装的车辆。
还必须在服务器 entry_list.ini 中按车辆启用。
```ini
[CUSTOM_COLOR]
ALLOW_IN_PITS = 1
ALLOW_EVERYWHERE = 1            ; 二选一
```

#### 传送点
传送点允许定义一组供车辆快速跳转的位置，同时使圈速无效。可用目的地列表和传送按钮可在新的聊天应用中找到。要使整个功能工作，请在 CM 的条目列表编辑器中选择允许传送的车辆（使用每个条目的 CSP 按钮）。
还必须在服务器 entry_list.ini 中按车辆启用。

```ini
[TELEPORT_DESTINATIONS]
POINT_0 = Name          ; 目的地名称
POINT_0_GROUP = Group   ; 可选分组
POINT_0_POS = X, Y, Z   ; 坐标，可通过 Objects Inspector 确定
POINT_0_HEADING = 0     ; 航向角（度）
```

#### 传送门
用于在服务器之间快速跳转的传送门。需要游戏退出并重新启动才能运行，因此请注意加载时间。目前功能相当有限：两个服务器需要具有相同的条目列表，车手保留当前驾驶的车辆。将车辆传送到目标服务器的维修区通道。

```ini
[PORTALS]
PORTAL_0 = 192.168.1.30:8081  ; 目标服务器 IP 和 HTTP 端口
PORTAL_0_POS = X, Y, Z        ; 当前服务器中的传送门位置
PORTAL_0_COLOR = 1, 1, 0, 1   ; 可选 RGB 颜色和透明度
```

### 聊天调整

```ini
[CHAT]
SERVER_MESSAGES_ONLY=1        ; 阻止用户发送聊天消息

; 从 0.1.76 开始可用：
MESSAGES_FILTER='…'           ; 隐藏其他玩家的匹配消息
COMMANDS_NONADMIN_FILTER='…'  ; 隐藏与此过滤器匹配的命令的"你不是管理员"响应
SERVER_MESSAGES_FILTER='…'    ; 隐藏匹配的服务器消息
```

过滤器使用正则表达式进行不区分大小写的部分匹配（要匹配整个字符串，请使用 `'^…$'`）。单引号不是必需的，但最好保留它们以确保像 "[" 这样的符号不会干扰 INI 解析。

### Mumble 语音聊天集成

现在有两种 [Mumble](https://www.mumble.info/downloads/) 集成的实现方式。

从 0.1.75 开始可用，版本 1 `[MUMBLE]` 需要客户端本地安装并运行 Mumble。
```ini
[MUMBLE]
SCALE = 1.0                     ; 为 Mumble 语音聊天缩放世界
CONTEXT = …                     ; Mumble 的可选上下文；默认为服务器 IP 和端口
AUTOCONNECT = 'mumble://…'      ; 加入服务器时可选自动连接到特定 Mumble 频道
```

从 0.2.0 开始可用，版本 2 `[MUMBLE_INTEGRATION]` 使用 CSP 安装中内置的 Mumble 客户端。这是游戏中可用的新应用，具有新功能和自动连接，客户端无需进行其他安装设置。

打开 Content Manager，导航到 `设置 > Custom Shaders Patch > GUI > New Apps > Mumble Integration`，确保其已启用。

```ini
[MUMBLE_INTEGRATION]
HOST = '' 			; Mumble 服务器的 IP 或 URL 地址
PORT = 64738 			; Mumble 服务器的端口，默认 64738
PASSWORD = ''			; Mumble 服务器的密码
CHANNEL = 'Root'		; 加入 Mumble 服务器的默认频道
POSITIONAL_AUDIO = true		; 根据其他车手的位置移动音频，true 或 false
POSITIONAL_MAX_DISTANCE = 50	; 无法听到其他车手的距离
MUTE_DISTANCE = 200             ; 在此距离之外其他玩家被完全静音。默认值为无限
```


### 回放片段

从 0.1.75 开始可用。增加了将比赛最后 N 秒快速保存为单独片段的能力，可能有助于快速保存潜在的冲突情况并在之后进一步解决。所有这些开箱即用，但额外的服务器配置可以定义一个端点，供车手在保存片段后自动上传。

回放将被压缩，并通过在请求体中发送 ZIP 二进制数据的 POST 请求上传。此外，X-Car-Index 头将包含客户端的条目列表索引。

```ini
; 从 0.1.75 开始可用：
[REPLAY_CLIPS]
UPLOAD_URL = 'https://domain.com/endpoint.php?key=X'  ; API 端点
DURATION = 30  ; 片段时长（秒），覆盖用户选择
```

### 临时和实验性功能

所有这些内容将来可能会被移除并替换为更好的方案。

```ini
; 激活雨天，需要 CSP 的预览版本，因为雨天仍在开发中。
[RAIN_PREVIEW]
INTENSITY = 0.5
REQUIRED = 1
WITH_PHYSICS = 1  ; 强制激活雨天物理（确保在核心服务器设置中
                   ; 启用自定义车辆物理）

; RainFX 雨天赛线的设置
[RAIN_RACING_LINE_PREVIEW]
… = …  ; 与 rain_fx.ini 中 "[RACING_LINE_DEV]" 节相同的键和值
```

### 在线脚本

从 0.1.76 开始可用。指定一段要在客户端机器上运行的代码的 URL（有一些限制，例如这些脚本无法访问赛道和车辆文件夹之外的文件，或运行进程等）。这些脚本可用于显示额外的 HUD 元素、访问车辆状态并应用自定义处罚、在特定条件下传送车辆、控制摄像头、实时更改限流器和配重、损坏和修复车辆、施加额外力、加载和显示新模型、实时更新纹理、添加后处理色彩校正等等，功能与赛道脚本几乎相同甚至更多。

```ini
[SCRIPT_...]
SCRIPT = path           ; 路径必须是 Web URL：例如，你可以将脚本存储在
                        ; https://gist.github.com 并使用原始链接
                        ; 出于开发目的，将其设置为包含在
                        ; "assettocorsa/extension/lua/online" 中的文件名以实时编辑脚本。
REQUIRED = 0 		; 加入服务器需要加载，如果脚本无法加载 CSP 会关闭游戏；0 或 1
REFRESH_PERIOD = 0 	; 脚本的定期刷新间隔（秒）；0 或更大
… = …                   ; 此节中设置的任何其他参数都可由脚本访问，
                        ; 从而允许配置同一脚本用于不同的服务器。
```

脚本 URL 还支持参数替换，因此你可以这样设置：

```ini
[SCRIPT_...]
SCRIPT = 'https://myserver.com/script?s={SessionID}&t={SteamID}&c={CarID}&k={CarSkinID}&v={CSPBuildID}'
```

这样，一些基本的服务器可以根据客户端响应不同的脚本，向普通玩家发送一个脚本，向管理员发送另一个（脚本也可以实时验证玩家是否具有管理员权限）。所有参数：

- `SessionID`：玩家使用的条目列表的从 0 开始的索引；
- `SteamID`：玩家的 Steam ID；
- `CarID`：用户车辆文件夹的名称；
- `CarSkinID`：用户涂装文件夹的名称；
- `CSPBuildID`：CSP 构建号；
- `ServerIP`：用于连接服务器的 IP；
- `ServerName`：服务器名称；
- `ServerHTTPPort`：服务器 HTTP 端口；
- `ServerTCPPort`：服务器 TCP 端口；
- `ServerUDPPort`：服务器 UDP 端口。

服务器配置可以指定多个脚本，但过多的脚本可能会引入轻微的性能开销。如果只有十几个左右不必担心，但如果更多，请考虑以某种方式重新组织。

## 配置编码

要在欢迎消息中编码配置，请执行以下步骤（或者直接在 Content Manager 的服务器面板中设置）：

- 获取配置字节（UTF-8 编码）；
- 使用常见的 zlib 算法压缩字节（对于 C#，SharpCompress 可以完成）；
- 将结果编码为 base64 字符串（可以裁剪末尾的 "="）；
- 在结果字符串前面附加 32 个制表符和 `$CSP0:`（这样消息在原始 AC 中会被隐藏）；
- 然后将其附加到欢迎消息中。

以下是 Content Manager 源代码中的示例：

```cs
// 实际编码：
private static readonly string CspConfigSeparator = RepeatString("\t", 32) + "$CSP0:";

private string BuildWelcomeMessage() {
    if (string.IsNullOrWhiteSpace(CspExtraConfig)) return WelcomeMessage;
    return WelcomeMessage + CspConfigSeparator 
        + ToCutBase64(CompressZlib(Encoding.UTF8.GetBytes(CspExtraConfig)));
}

// 辅助函数：
public static string RepeatString(string s, int number) {
    var b = new StringBuilder();
    for (var i = 0; i < number; i++) {
        b.Append(s);
    }
    return b.ToString();
}

public static string ToCutBase64(byte[] decoded) {
    return Convert.ToBase64String(decoded).TrimEnd('=');
}

private static byte[] CompressZlib(byte[] data) {
    using (var m = new MemoryStream()) {
        using (var d = new ZlibStream(m, CompressionMode.Compress, CompressionLevel.Level6)) {
            d.WriteBytes(data);
        }
        return m.ToArray();
    }
}
```

## 仅 CSP 服务器和核心选项

要创建一个只能与已安装 CSP 的客户端一起工作的服务器，其配置需要稍微修改。只需将 `server_cfg.ini` 中的 `TRACK` 属性替换为 `csp/<X>/../<track ID>`，其中 `<X>` 是最低要求的 CSP 版本（构建号）。通过创建 `content/csp` 文件夹并将 "data/surfaces.ini" 等赛道数据移动到那里，它也可以与原始 acServer 一起工作。但是，这样的服务器在理论上仍然可以被不使用 CSP 的人访问，因此另一层可选保护是编辑存储在服务器文件夹中的 "surfaces.ini"（acServer 用于完整性验证的那个）。只需将 "[SURFACE_0]" 替换为 "[CSPFACE_0]"，它会以某种方式改变文件校验和，使只有运行 CSP 的客户端才能通过完整性验证。

更新 0.1.78 还引入了以类似方式存储的额外选项。新格式为 `csp/<X>/../<O>/../<track ID>`，其中 O 是一个特殊编码的字符串，存储了附加选项。在此阶段只有三个选项可用，以下是可能的值：

- `B`：启用自定义车辆物理；
- `C`：启用自定义赛道物理；
- `D`：同时启用自定义车辆和赛道物理；
- `E`：隐藏维修区工作人员；
- `F`：隐藏维修区工作人员并使用自定义车辆物理；
- `G`：隐藏维修区工作人员并使用自定义赛道物理；
- `H`：隐藏维修区工作人员并使用自定义车辆和赛道物理。

这只是一个数字的位，该数字使用此字符串进行某种 base64 编码：`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-`。

## 按车辆标志

![https://files.acstuff.ru/shared/vRhW/20220611-014243.png](https://files.acstuff.ru/shared/vRhW/20220611-014243.png)

这些调整存储在 "entry_list.ini" 的皮肤 ID 中。只需使用斜杠，然后将结构进行 base64 编码：第一个字节为版本，第二个字节为实际值，第三个字节作为校验和。[以下是 Content Manager 的实现方式](https://github.com/gro-ove/actools/blob/master/AcManager.Tools/Objects/ServerDriverCspOptions.cs#L123)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Misc-–-Server-extra-options) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
