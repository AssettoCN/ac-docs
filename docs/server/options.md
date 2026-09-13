---
title: 服务器额外选项
---


> 汉化标题：杂项 – 服务器额外选项  
> 原文页面：Misc-–-Server-extra-options  
> 原文锚点：589edd6  
> 汉化时间：2026-09-12T19:00:00+08:00  

v0.1.69 更新带来了为服务器添加额外参数的能力：一个隐藏在欢迎消息里的简单 INI 配置文件。其工作方式是：对于原版 Assetto Corsa 用户，以及 CSP 版本高于 v0.1.69 的用户，这条消息不会显示出来。

# 可用选项

### 比赛规则

如果使用这些选项，最好为 CSP 版本设置严格的下限（基本选项至少要求 0.1.69），以确保所有人都在相同的规则和条件下比赛。

```ini
[EXTRA_RULES]
ALLOW_WRONG_WAY = 1                  ; 允许车辆双向行驶
MAX_METERS_WRONG_WAY = 100           ; 自 0.2.0 起可用，反向行驶允许的最大距离（米），超过即施加处罚

; 自 0.1.76 起可用：
ENFORCE_BACK_TO_PITS_PENALTY = 1     ; 在比赛中使用“回到维修区”AC 命令时施加处罚，
                                     ; 与在暂停菜单中使用“回到维修区”相同
ENFORCE_BACK_TO_PITS_STOP = 1        ; 车辆正在移动时，阻止“回到维修区”AC 命令生效

; 自 0.1.77 起可用：
LIMIT_LOCK_CONTROLS_TIME = 60        ; 每次锁定操作处罚的上限（秒）
LIMIT_LOCK_CONTROLS_TOTAL_TIME = 90  ; 锁定操作处罚总时长的上限（秒）（在某些超长圈中，
                                     ; 若不设置，处罚可能大到重新加入服务器
                                     ; 成为唯一可行的做法）
UNFIT_FOR_DRIVETHROUGH_PENALTY = X, Y, Z, radius  ; 定义一个球体区域，在其中进入维修区
                                     ; 不算作执行通过维修区处罚（例如 Spa 的第二条维修通道，
                                     ; 其参数为 “-202.04, 12.54, -857.77, 50”）

; 自 0.1.78 起可用（之前的版本存在 bug，因此请务必将要求版本设为 0.1.78）：
NO_BACK_TO_PITS = 1                  ; 禁用“回到维修区”AC 命令以及暂停菜单中的“回到维修区”
                                     ; （管理员在有需要时仍可将车辆传送回维修区）
NO_BACK_TO_PITS_OUTSIDE_OF_PITS = 1  ; 同上，但仅在车辆不在其维修位时生效

; 自 0.1.78 起可用：
INVALIDATE_LAP_TIME_IN_PITS = 1      ; 车辆只要经过维修区就使其圈速无效（适用于维修区路面
                                     ; 未被标记为无效的赛道）
REQUIRED_MODULES = lighting_fx, weather_fx  ; 必需模块的可选列表（直接使用其配置的名称），
                                     ; 设置后将禁用实时设置更改
REQUIRE_NEW_LAP_FOR_DRIVETHROUGH_PENALTY = 1 ; 设置后，吃到通过维修区处罚的车手将无法
                                     ; 直接倒车回去就地完成处罚
HIDE_MAP = 1                         ; 隐藏默认的 AC 地图应用（用户仍可使用第三方应用）

; 自 0.1.79 起可用：
SLIPSTREAM_MULT = 1                  ; 用于增大或减小尾流效应的强度

DISABLE_RAIN_PHYSICS = 0             ; 设为 1 可禁用雨天物理

; 自 0.2.1 起可用：
PITS_ORDER = F<TR>                   ; 燃油（F）、轮胎（T）、维修（R）
                                     ; 尖括号括起的内容可同时进行，AC 默认行为为 <FTR>

; 自 0.2.3 起可用：
SURFACES_FX = 0                      ; 启用 SurfacesFX 模块

; 自 0.2.5 起可用：
DISABLE_AUTOBRAKING = 1              ; 启用禁用自动刹车的物理实验功能

AFK_AUTOKICK = 5, OPTION             ; 时间，单位为分钟
                                     ; 可用选项（只能选一个）：
                                     ; SPEED：平均车速低于 0.4km/h 的车辆
                                     ; INPUT：监测车辆输入和鼠标移动
```

### 维修区限速器设置

自 0.1.76 起可用。改变维修区限速器的工作方式。

```ini
[PITS_SPEED_LIMITER]
DISABLE_FORCED = 1                              ; 禁用强制的维修区限速器
KEEP_COLLISIONS = 1                             ; 激活维修区内车辆间的碰撞
SPEED_KMH = 80                                  ; 修改维修区限速值；默认为 80
SPEEDING_PENALTY = DRIVE_THROUGH                ; 违规处罚（目前只能是 DRIVE_THROUGH
                                                ; 或附带锁定操作的 TELEPORT_TO_PITS）
SPEEDING_PENALTY_LAPS = 3
SPEEDING_SUBSEQUENT_PENALTY = TELEPORT_TO_PITS  ; 可选，第二次违规时更严厉的处罚
SPEEDING_SUBSEQUENT_PENALTY_TIME = 30           ; 锁定操作的时长（秒）
```

### 自定义运动

自 0.1.77 起可用。该选项替换了线上远程车辆位置外推的方式。新实现修复了车辆跳跃或翻滚时车轮脱落的问题，提升了性能，并让车辆运动更平滑一些。

```ini
[EXTRA_TWEAKS]
CUSTOM_MOTION = 1, flags        ; flags 可选，以逗号分隔
```

标志位：

- `SMOOTH`：自 0.1.78 起可用，平滑低速移动车辆的运动，避免在大型赛道上出现抖动。
- `RESET`：自 0.2.3 起可用，车辆被传送时重置插值（一经测试验证，可能会对所有车辆默认启用）


此外，自 0.1.78 起可用：启用自定义运动后，可以禁用远程车辆在跳跃（由连接问题引起）期间的碰撞体。附近碰撞体被禁用的车辆会闪烁蓝色。碰撞体会被禁用一段时间，但若存在持续接触则会保持禁用，以免车辆彼此弹开。这里是[该功能的实际演示](https://files.acstuff.ru/shared/8pFk/20220427-225256.mp4)（镜头对准一辆短暂失去连接的远程“卡顿”车辆，维修区内的碰撞已启用）。

```ini
[EXTRA_TWEAKS]
JUMP_LIMIT = 0.3                ; 跳跃阈值（米），若远程车辆突然移动超过该距离则应用修复
JUMP_PAUSE_COLLISIONS_FOR = 5   ; 禁用碰撞的时长（秒）（默认为 5）
```

### 紧急重置

自 0.1.78 起可用。当车辆掉入地面之下或卡在某面墙里时，将其重置回维修区。

```ini
[EMERGENCY_RESET]
FALL = 5                        ; 距离（米），车辆低于地面超过该值即被重置
COLLISION = 3                   ; 时间（秒），车辆卡在墙中超过该时长即被重置
PENALTY = 1                     ; 若此可选参数设为 1，重置将施加与手动传送回维修区
                                ; 相同的处罚
```

### 额外数据

```ini
[EXTRA_DATA]

; 自 0.1.75 起可用：
TYRES_BLOWN_STATE = 0     ; 交换爆胎状态数据，用于视觉特效

; 自 0.1.77 起可用：
CAMBER_TOE_STATE = 1      ; 交换束角与外倾角，需要启用自定义运动
CUSTOM_UPDATE_FORMAT = …  ; 自定义服务器可使用自定义协议，支持可变刷新率、精度、
                          ; 批量数据包、更频繁地发送附近车辆的信息等：
                          ; 这些数据包的实际说明见此处
```

### 自定义物理

一些不需要任何自定义物理内容的基础物理调整。

```ini
[CUSTOM_PHYSICS]
REAL_MASS = 1                    ; 设为 1 为远程车辆的刚体设置真实质量，有助于解决碰撞
                                 ; 不符合预期的问题（作为实际质量的乘数生效，可大于 1
                                 ; 使碰撞更弹，或小于 1 使碰撞更软）
EXTRAPOLATE_STATE = 1            ; 实验性选项，让所有车辆运动更平滑，不推荐使用

; 自 CSP 0.2.5 起可用
DISABLE_SURFACE_SNAPPING = 0,3,9 ; 以逗号分隔的维修位索引列表（从 0 开始）
                                 ; 禁用车辆向地面的自动吸附。适用于飞机。

; 自 0.1.77 起可用，服务器现在可以完全重新定义碰撞参数。所有数值均为可选：
[CUSTOM_COLLISIONS]
SOFT_ERP = 0.99                  ; 误差缩减参数
SOFT_CFM = 0.0001                ; 约束力混合，值越高碰撞越软
BOUNCE = 0.01                    ; 弹性参数
FRICTION = 0.25                  ; 接触摩擦
INTENSITY = 1                    ; 碰撞强度（影响损坏、音频和视觉效果）
MAX_DEPTH = 0.2                  ; 若设置且碰撞深度超过该参数，碰撞将变为硬碰撞：可能
                                 ; 有助于性能
```

### 文件校验

自 0.1.77 起可用。有了它，服务器可以检查某些 AC 文件是否存在及其完整性。你可以使用[这样的](https://emn178.github.io/online-tools/sha256_checksum.html)在线工具生成校验和。

```ini
[VERIFY_INTEGRITY_...]
FILE = content/cars/…           ; 相对 AC 根目录的文件路径
CHECKSUM = …                    ; SHA256 校验和

[EXTRA_TWEAKS]
VERIFY_STEAM_API_INTEGRITY = 1  ; 设为 1 以校验 “steam_api64.dll” 的完整性。
```

### 时区

自 0.1.78 起可用。允许以秒为单位指定精确的时区偏移，以及经纬度，以确保所有客户端处于相同的光照条件。默认情况下，CSP 会从其内置数据库或赛道配置中获取这些值，但它们可能已过时。

```ini
[WEATHER_FX]
TIMEZONE = 0                ; 相对 UTC 的偏移（秒）；若需要夏令时，请将其加在此处
LATITUDE = 36.25            ; 纬度（度），请使用数字（因此 36° 15' 应写作 36.25）
LONGITUDE = 121.5           ; 经度（度），同样请使用数字

; 自 0.1.79 起可用：
TIMEZONE_ID = Europe/Paris  ; 时区 ID（TZ 数据库名称）。如此设置后，夏令时会根据
                            ; 当前日期自动计算，但用 “TIMEZONE” 显式设置偏移
                            ; 可能是更好的做法。
```

### 其他线上调整

一些零散的线上调整。

```ini
[EXTRA_TWEAKS]
FORCE_HEADLIGHTS = 1            ; 强制保持大灯开启

; 自 0.1.77 起可用：
SHOW_DISCONNECTED = 1           ; 显示已断开连接的车辆；将其设为 WITH_COLLISIONS 而非 1，
                                ; 其他车辆即可与其发生碰撞

; 自 0.1.78 起可用：
ACTUAL_TRACK_TIME = 1           ; 若你的时间流速接近 100% 则设为 1；供火车脚本之类用于
                                ; 在各客户端间同步其状态；若不启用此选项，火车时间
                                ; 将为：12:00 + 2小时 × SessionIndex + SessionTime
SPECTATORS_AMOUNT = 1           ; 调整赛道上的观众数量；从 0 到 1，0 表示没有观众

MIN_TIME_BETWEEN_COLLISIONS = 5 ; 自 0.2.0 起可用，供服务器端插件使用，不影响玩家物理
                                ; 批量碰撞信息发送到服务器的时间间隔（秒）。
                                ; 最小值 0.05，推荐值介于 1 到 5 之间
```
```ini
[SPECIAL_CARS]
HIDE_LABELS = …                 ; 以 0 为起点列出车辆的索引，隐藏其车手名牌并将其在地图上隐藏
```

### 自由漫游功能

仅供特殊服务器使用的一些额外功能。所有选项都要求仅限 CSP 的服务器。

#### 更改颜色

允许在维修区通过一个简单的取色器更改车色，适用于使用常规涂装的车辆：
还必须在服务器的 entry_list.ini 中按车辆逐个启用
```ini
[CUSTOM_COLOR]
ALLOW_IN_PITS = 1
ALLOW_EVERYWHERE = 1            ; 二者择一；
```

#### 传送

传送功能允许定义一组供车辆快速跳转的点，并使其圈速无效。可用目的地列表和传送按钮位于新的聊天应用中。要让整套功能生效，请在 CM 的参赛名单编辑器中选定允许传送的车辆（使用每个条目旁的那个 CSP 按钮）。
还必须在服务器的 entry_list.ini 中按车辆逐个启用

```ini
[TELEPORT_DESTINATIONS]
POINT_0 = Name          ; 目的地名称
POINT_0_GROUP = Group   ; 可选的分组
POINT_0_POS = X, Y, Z   ; 坐标，可用 Objects Inspector 确定
POINT_0_HEADING = 0     ; 朝向角（度）
```

#### 门户

用于从服务器到服务器快速跳转的门户。需要退出并重新启动游戏才能生效，因此请留意加载时间。目前限制颇多：两个服务器必须拥有相同的参赛名单，且车手保留当前驾驶的车辆。会将车辆传送到目标服务器的维修通道。

```ini
[PORTALS]
PORTAL_0 = 192.168.1.30:8081  ; 目标服务器的 IP 和 HTTP 端口
PORTAL_0_POS = X, Y, Z        ; 门户在当前服务器中的位置
PORTAL_0_COLOR = 1, 1, 0, 1   ; 可选的 RGB 颜色和透明度
```

### 聊天调整

```ini
[CHAT]
SERVER_MESSAGES_ONLY=1        ; 阻止用户发送聊天消息

; 自 0.1.76 起可用：
MESSAGES_FILTER='…'           ; 隐藏其他玩家发送的匹配消息
COMMANDS_NONADMIN_FILTER='…'  ; 对匹配此过滤器的命令，隐藏“你不是管理员”的回应
SERVER_MESSAGES_FILTER='…'    ; 隐藏匹配的服务器消息
```

过滤器使用正则表达式，进行不区分大小写的部分匹配（若要匹配整个字符串，请使用 `'^…$'`）。单引号并非必需，但最好保留，以确保像 “[” 这样的字符不会破坏 INI 解析。

### Mumble 语音聊天集成

目前有两种 [Mumble](https://www.mumble.info/downloads/) 集成实现。

自 0.1.75 起可用的版本 1 `[MUMBLE]` 要求客户端在本地安装并运行 Mumble。
```ini
[MUMBLE]
SCALE = 1.0                     ; 为 Mumble 语音聊天缩放世界
CONTEXT = …                     ; Mumble 的可选上下文；默认为服务器 IP 和端口
AUTOCONNECT = 'mumble://…'      ; 可选，加入服务器时自动连接到某个 Mumble 频道
```

自 0.2.0 起可用的版本 2 `[MUMBLE_INTEGRATION]` 使用 CSP 安装包中内置的 Mumble 客户端。这是一个游戏内的新应用，带有新功能并支持自动连接，客户端无需任何额外的安装配置。

打开 Content Manager，前往 `settings > Custom Shaders Patch > GUI > New Apps > Mumble Integration`，确保其已启用。

```ini
[MUMBLE_INTEGRATION]
HOST = '' 			; Mumble 服务器的 IP 或 URL 地址
PORT = 64738 			; Mumble 服务器的端口，默认 64738
PASSWORD = ''			; Mumble 服务器的密码
CHANNEL = 'Root'		; 加入 Mumble 服务器时的默认频道
POSITIONAL_AUDIO = true		; 让声音跟随其他车手的位置移动，true 或 false
POSITIONAL_MAX_DISTANCE = 50	; 超过该距离便听不到其他车手
MUTE_DISTANCE = 200             ; 其他玩家超出该距离将被完全静音。默认值为无限
```


### 回放片段

自 0.1.75 起可用。它增加了将比赛最后 N 秒快速保存为独立片段的能力，有助于快速保存潜在的冲突情形，以便日后解决。所有这些都开箱即用，但额外的服务器配置可以为车手定义一个端点，让他们在保存后自动上传这些片段。

回放会被打包为 ZIP，并通过发送 POST 请求（请求体为 ZIP 二进制数据）上传。此外，X-Car-Index 请求头会包含该客户端在参赛名单中的索引。

```ini
; 自 0.1.75 起可用：
[REPLAY_CLIPS]
UPLOAD_URL = 'https://domain.com/endpoint.php?key=X'  ; API 端点
DURATION = 30  ; 片段时长（秒），覆盖用户的选择
```

### 临时与实验性内容

所有这些内容将来都可能被移除，并被更好的东西取代。

```ini
; 激活雨天，需要 CSP 的预览版构建，因为雨天仍在开发中。
[RAIN_PREVIEW]
INTENSITY = 0.5
REQUIRED = 1
WITH_PHYSICS = 1  ; 强制激活雨天物理（请确保在核心服务器设置中
                  ; 启用自定义车辆物理）

; RainFX 雨天赛车线的设置。
[RAIN_RACING_LINE_PREVIEW]
… = …  ; 键与值与 rain_fx.ini 的 “[RACING_LINE_DEV]” 节相同
```

### 线上脚本

自 0.1.76 起可用。指定一段代码的 URL，使其在客户端机器上运行（附带一些限制，例如这些脚本无法访问赛道和车辆文件夹以外的文件、无法运行进程等）。这些脚本可用于显示额外的 HUD 元素、访问车辆状态并施加自定义处罚、在特定条件下传送车辆、控制摄像机、实时更改限流器和配重、破坏和修复车辆、施加额外的力、加载并显示新模型、实时更新纹理、添加后期处理色彩校正等等，几乎涵盖了赛道脚本所能做的事情，甚至更多。

```ini
[SCRIPT_...]
SCRIPT = path           ; 路径必须是一个 web URL：例如，你可以把脚本
                        ; 存放在 https://gist.github.com 上并使用其 raw 链接
                        ; 出于开发目的，也可以将其设为 “assettocorsa/extension/lua/online”
                        ; 中所含文件的名称，以便实时编辑脚本。
REQUIRED = 0 		; 加入服务器所必需加载；若无法加载脚本，CSP 会关闭游戏；0 或 1
REFRESH_PERIOD = 0 	; 脚本周期性刷新的间隔（秒）；0 或更大
… = …                   ; 此节中设置的任何其他参数都可被脚本访问，
                        ; 从而允许同一个脚本适配不同的服务器。
```

脚本 URL 还支持参数替换，因此可以这样设置：

```ini
[SCRIPT_...]
SCRIPT = 'https://myserver.com/script?s={SessionID}&t={SteamID}&c={CarID}&k={CarSkinID}&v={CSPBuildID}'
```

如此一来，哪怕是一个基础服务器，也可以根据客户端返回不同的脚本——给普通玩家发送一个脚本，给管理员发送另一个（脚本同样可以实时校验玩家是否拥有管理员权限）。全部参数：

- `SessionID`：玩家所使用的参赛名单条目的索引（从 0 开始）；
- `SteamID`：玩家的 Steam ID；
- `CarID`：用户车辆文件夹的名称；
- `CarSkinID`：用户涂装文件夹的名称；
- `CSPBuildID`：CSP 构建号；
- `ServerIP`：连接服务器所用的 IP；
- `ServerName`：服务器名称；
- `ServerHTTPPort`：服务器 HTTP 端口；
- `ServerTCPPort`：服务器 TCP 端口；
- `ServerUDPPort`：服务器 UDP 端口；

服务器配置可以指定多个脚本，不过脚本太多可能带来少许性能开销。如果只是十来个倒不必担心，但若超过这个数量，请考虑以某种方式重新整合。

# 配置编码

要将配置编码进欢迎消息，请按以下步骤操作（或者直接在 Content Manager 的服务器面板中设置）：

- 获取配置的字节（UTF-8 编码）；
- 使用常见的 zlib 算法压缩这些字节（C# 可用 SharpCompress）；
- 将结果编码为 base64 字符串（可随意去掉末尾的 “=”）；
- 在结果字符串前面加上 32 个制表符和 `$CSP0:`（这样该消息在原版 AC 中就会被隐藏）；
- 然后将其附加到欢迎消息上。

以下是 Content Manager 源代码中的一个示例：

```cs
// 实际的编码：
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

# 仅限 CSP 的服务器与核心选项

要创建一个只有安装了 CSP 才能加入的服务器，其配置需要稍作修改。只需将 `server_cfg.ini` 中的 `TRACK` 属性替换为 `csp/<X>/../<track ID>`，其中 `<X>` 是最低要求的 CSP 版本（构建号）。通过创建 `content/csp` 文件夹并将赛道数据（如 “data/surfaces.ini”）移到那里，它同样可以与原版 acServer 配合工作。不过，这样的服务器理论上仍可能被不使用 CSP 的人访问，因此另一层可选的保护是编辑服务器文件夹中存储的 “surfaces.ini”（即 acServer 用于完整性校验的那个）。只需将 “[SURFACE_0]” 替换为 “[CSPFACE_0]”，它就会以某种方式改变文件校验和，使只有运行 CSP 的客户端能通过完整性校验。

0.1.78 更新还引入了以类似方式存储的额外选项。新格式为 `csp/<X>/../<O>/../<track ID>`，其中 O 是一个经过特殊编码、存储额外选项的字符串。考虑到此阶段只有三个可用选项，这里不再过多深入编码细节，可能的取值如下：

- `B`：启用自定义车辆物理；
- `C`：启用自定义赛道物理；
- `D`：同时启用自定义车辆和赛道物理；
- `E`：隐藏维修区工作人员；
- `F`：隐藏维修区工作人员并使用自定义车辆物理；
- `G`：隐藏维修区工作人员并使用自定义赛道物理；
- `H`：隐藏维修区工作人员并使用自定义车辆和赛道物理。

这些其实只是某个数字的各个位，而该数字使用这串字符进行某种换用了字符集的 base64 编码：`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-`。

# 每车标志位

![https://files.acstuff.ru/shared/vRhW/20220611-014243.png](https://files.acstuff.ru/shared/vRhW/20220611-014243.png)

这些调整存储在 “entry_list.ini” 的涂装 ID 中。只需加上一个斜杠，然后 base64 编码一个结构：第一个字节是版本号，第二个字节是实际数值，第三个字节用作校验和。[这里是 Content Manager 的实现方式](https://github.com/gro-ove/actools/blob/master/AcManager.Tools/Objects/ServerDriverCspOptions.cs#L123)。

