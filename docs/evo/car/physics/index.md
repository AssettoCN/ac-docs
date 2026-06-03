---
title: 车辆物理管线
---

# AC EVO — 车辆 Modding 管线：Physics

## 更新日志

- **2026 年 6 月 3 日**：V1

## 前言

Car Editor 是一个持续开发中的工具，在相当长的一段时间内都会保持这种状态。每次更新后请务必检查是否有变化。作为一款不断演进的工具，冗余和依赖关系会随着时间推移而变化，并将持续变化。你会发现许多字段乍一看不太直观，或者在另一个地方/文件中是冗余的。总体来说，一辆车可能包含大约 **500 个数据点**，其中任何一个数据点、链接或依赖关系出错都可能导致崩溃。遇到这些情况请留意日志。

物理引擎基于 **Open Dynamics Engine**。关键信息是：各种距离参考的是 **重心 (Center of Gravity)**。

为了使文档简洁，将跳过显而易见的字段。

## 单位

除非另有说明，编辑器使用 **公制 SI 基本单位**：米 (m)、千克 (kg)、秒 (s)、牛顿 (N) 等。

---

## 1. 结构 (STRUCTURE)

### 通用

所有车辆相关文件应放在 `/carname/data/` 文件夹中，特别是 `.car` (Car Data) 文件必须在该目录下。其他文件可以按你的喜好组织在子文件夹中，它们会在 `.cardata` 中以链接方式引用。一旦文件被链接，你可以移动文件到其他位置，链接会自动更新（接收更新链接的文件需要处于关闭状态）。

> ⚠️ 许多地方使用 **0-based 索引**。例如 "TC Setting 1" 在 `.carsetuplimits` 中引用为 "0"。

> ⚠️ 如果你在下拉菜单下创建了一个字段但没有填写，游戏会找到 "NaN" 并崩溃。

### 文件与链接

首先通过增加数量创建内容浏览器：**Workspaces → Content Browsers**

![Content Browsers](/evo/physics/image65.png)

已知的 Windows 快捷键不起作用，请使用鼠标操作。

创建文件：

- **New Asset → Car Physics** → 选择相应部件
- 你还需要 **New Asset → Curve**（大量曲线文件！）

![New Asset](/evo/physics/image56.png)

操作技巧：

- 你可以将整个文件的某个 section 复制粘贴到另一个文件的相同 section 中
- 展开一个 section，右键 → Copy，然后在目标文件中执行相同操作

![复制粘贴 section](/evo/physics/image3.png)

- 你可以将文件拖拽到链接处，例如将 `.wing` 拖到 `.cardata` 中相应字段

![拖拽文件到链接](/evo/physics/image53.png)

---

## 2. 流程 (PROCESS)

### 免责声明

**经常保存。** 首先，避免在编辑器崩溃时丢失数据；其次，保存会确保更改在评估影响时生效。编辑器运行与游戏相同的物理引擎——极高和极低的值会导致问题，这是你 **崩溃的头号原因**。

### Live Preview（实时预览）

要让物理运行，预览窗口需要打开并展开，并且 `.car` 或 `.carsetup` 文件需要处于打开状态。但是，物理只能运行一个实例，所以你 **最先打开的文件** 就是你会看到的。`.carsetup` 中的所有值会覆盖其他文件中的任何值。

> ⚠️ `.carsetup` 是你最终的"现实"。预览中选择的文件是模拟角度上的活跃文件。

![Live Preview](/evo/physics/image59.png)

![Car Data Simulation](/evo/physics/image15.png)

打开这些文件之一还会打开 **"Car Data Simulation"** 窗口。点击 **"Start Simulation"** 让物理激活——可以看到轮胎网格和各种球体变得可见。

打开 `.carsetup` 还会打开 **"Setup"** 窗口，类似于游戏内的设置界面。**"Start AutoSetup"** 会触发"automagic"：车辆被放置在平面上，遵循 car setup 中的所有值，悬挂部件"收敛"以适应当前的设置值（"Wait for working on setup"）。

这是当前 ACC 和 ACE 与 AC1 的主要区别。你设置的 camber、ride height、toe（...）值保持真实，悬挂其余部分需要适应（或"收敛"）。未来的更新将对此进行更改：ride height 将不再是直接选择，而是其他变化产生的被动值，使这个过程不那么繁琐。

![Setup 窗口](/evo/physics/image67.png)

> 确保在每次编辑过程结束时让 setup "收敛"一次，这样车辆将反映所有最新更改。例如，改变重心或油箱位置，或仅仅对车辆重量做 100 克的调整，都需要 car setup 重新计算才能完全正确。但不要惊讶，即使你不做任何更改，由于浮点精度问题，每次重新计算 setup 都会产生略微不同的值。

- 如果你修改了 cardata 而 car setup 处于打开状态并想看到影响：→ **"Reload CarData"**
- 如果你修改了 `.carsetuplimits`（允许的可调范围）并想立即在 setup 中看到反映：→ **"Reload Setup Limits"**
- 理想情况下 **不要** 点击 "Reset Setup to cardata"，这会将 setup 重置为其他文件中存储的所有内容，如果你不维护它们可能会很混乱

### 可视化

![Visualization](/evo/physics/image38.png)

| 元素 | 说明 |
|------|------|
| 蓝色球体 | 重心 (Center of Gravity) |
| 红色球体 | 油箱中心 |
| 白色球体 | Ride height 取点（设置 100mm ride height 意味着此球体中心距地面 100mm） |
| 黄色杆件 | 悬挂叉臂或类似部件 |
| 紫色 | Strut 减震支柱 |
| 黄色平面 | Wing 翼面（包含尺寸和压力中心） |
| 红色 | 地板碰撞体（只有底部平面有效） |
| 绿色圆圈 | 轮胎 |

具有 aero map 的车辆会有额外的绿、黄、蓝和红色球体，代表 aero height 的测量点。

### 文件总览

| 文件 | 说明 |
|------|------|
| `.car` | 主文件，包含所有其他车辆部件的链接 |
| `.coilover` | 前后减震器，包含 bump stop 数据、damper 速度阈值、damper 和 bump stop 模拟、渐进弹簧刚度 |
| `.suspension` | 悬挂几何 |
| `.drivetrain` | 驱动桥和差速器数据 |
| `.gearbox` | 变速箱类型、齿比、行为、换挡相关辅助 |
| `.clutch` | 离合器 |
| `.engine` | 类型、power/coast 曲线、engine maps、throttle shape(s)、涡轮和控制器、Push2Pass、Launch Control (Start ECU)、电池数据 |
| `.turbo` | 更详细的涡轮定义 |
| `.brakesystem` | 制动容量、电子制动力分配控制器、自动制动差速器（"steer brake"）、刹车片 |
| `.brake` | 刹车片和刹车盘属性：摩擦、温度、磨损等 |
| `.tyre` | 尺寸、轮胎初始化、轮胎模型参数（不可调） |
| `.wing` | 空气动力学部件及相关属性 |
| `.surface3d` | 基于 ride height 的 aero map |
| `.carsetuplimits` | 定义所有 `.carsetup` 变量的允许范围 |
| `.carsetup` | 定义所有可调和不可调车辆部件的具体值 |
| `.curve` | 多用途查找表文件，用于各种位置和控制器动态调整所有部件属性 |
| `.dampercurves` | 包含多个 `.curve` 文件的包装器，包含 damper speed → damper force LUT，允许多拐点赛车减震器 |

---

## 3. CAR DATA（.car 文件）

### 🔽 General（通用）

- **Fuel** 被 `.carsetup` 中的值覆盖
- **Max Fuel** 被 `.carsetuplimits` 中的值覆盖
- **Efficiency** 如果设为 0，则硬编码为 0.30 (30%)
- **Body Box Size**：车辆外尺寸，用于计算惯性
- **Pickup front/rear height**：定义 ride height 测量点与重心的关系

### 🔽 Suspensions（悬挂）

**Cg (Center of gravity) Location**：请查看 "Car Data Simulation" → Suspension Debug 部件中的实时重心位置（"long distr."），包括所有其他属性。

![Cg Location](/evo/physics/image66.png)

**Base Y**：定义车轮中心到重心的垂直距离。这非常重要。所有悬挂几何以车轮中心为参考。调整 Base Y 会上下移动重心。你需要将此与 ride height 取点结合，以找到正确的重心高度（具有 aero map 的车辆参考 aero 取点来测量 ride height，而不是 ride height 取点——你应该使它们彼此对齐）。

例如，如果你有一辆赛车，比如在 ride height（地板到地面）为 50mm、给定轮胎尺寸和胎压的情况下重心高度为 350mm，你需要复现所有这些值，然后调整 Base Y 以达到正确的重心高度。

在 `.car` 文件底部你会找到一个工具，允许轻松精确地调整。在滑块上选择一个值（正或负），然后点击 **"move CG"**。

![CG 调整工具](/evo/physics/image13.png)

> 整个过程是迭代的。

ARB 在 `.car` 中不相关，它们被 `.carsetup` 覆盖。除非你定义了 ARB 控制器，允许根据各种其他输入值动态调整 ARB 刚度。

ARB 控制器的输出是 **车轮处速率，单位 N/mm**（▶️ 详情见控制器部分）

### Damper Controller（减震器控制器）

允许自定义主动减震器控制器，你可以根据驾驶情况定义多种减震曲线。这非常强大。要创建控制器：展开下拉菜单 → 右键 → Create。所有增益应设为 1.0。根据你的喜好调整和定义所有其他属性。一旦创建了可用的主动减震器，你可能可以通过使用 "gain" 值来增减相应逻辑的阻尼，从而在其他车辆上复用。

减震器控制器的输出是 **damper speeds (m/s) 与 force (N) 的曲线配对**。

![Active Dampers](/evo/physics/image7.png)

> 当 `.car` 文件中定义了主动减震器时，"Car Data Simulation" 面板将有一个可选的 "Active Dampers" 下拉菜单，会显示 "Active Damper Debug"。

当定义了主动减震器时：
- `.carsetup` 中的减震器值会被忽略
- `.coilover` 中的任何减震器属性也会被忽略

激活 **"☑ Has Dampers Cockpit Setting"** 可启用车内减震器调整（热键或通过 MFD）。减震器调整的步进和限制在 `.carsetuplimits` 中定义。

### 🔽 Steering System（转向系统）

这专用于 **后轮转向** 车辆。通过定义控制器，你可以使后轮根据任何和多个可用输入变量转动。

4WS 控制器输出表示 **施加到后转向臂连接点上的横向位移，单位为米**。

- 正值 = toe-out
- 负值 = toe-in

有一个函数会考虑 toe arm 位于车轮中心前方还是后方——所以你不需要担心这个问题。

![4WS 控制器](/evo/physics/image20.png)

### 🔽 Electronics（电子系统）

可用级别也需要在 `.carsetuplimits` 中定义。为了能够关闭 TC/ABS/ESC，**Setting 1 需要定义为无干预**。使用 0-based 索引。`.carsetup` 和 `.carsetuplimits` 中的 TC1 = 0 对应 `.car` 文件中的 "Setting 1"。

#### TC（牵引力控制）

允许定义各种 TC 参数，响应纵向（Slip ratio）和横向（slip angle）的抓地力损失。

- **TC2** 仅调节 "Engine Cut Level"（即干预的激进程度，越低 = 越平滑、越早），而 TC1 的所有其他参数不受影响

#### ABS（防抱死制动系统）

类似 TC。建议不要使用高于 **40Hz** 的频率，否则 ABS 会变得过于完美。

#### EDL（电子差速锁）

不要与 ESC 混淆。Electronic Differential Lock 作为后轮上的制动输入，以便在 coast 或 power 情况下获得差速锁定效果，而不需要车辆中安装 LSD。适用于现代扭矩矢量动力系统，尽管 `.drivetrain` 文件中也有其他选项。

> EDL 在 `.car` 文件中激活后，**玩家无法关闭**。

#### ESP（电子稳定程序）

Electronic Stability Control。允许定义更多安全性和稳定性导向的制动干预，具有多种参数。

### 🔽 Controls（控制）

| 参数 | 说明 |
|------|------|
| **FF Mult** | 如果车辆的悬挂（主要是 caster、scrub radius、载荷）导致 FFB 输出较弱，允许调整基准 FFB 输出 |
| **Steer lock** | 中心 → 最大锁止角（因此结果是总范围的两倍） |
| **Steer Ratio** | 按照真实对应车型的设计选择并调整（如果转向臂在车轮中心后方，需要为负值） |
| **Linear Steer Rod Ratio** | 按需匹配方向盘锁止角和轮胎锁止角 |
| **Steer Assist** | 调节转向输入的线性度（1 = 线性） |

### 🔽 Box Colliders（碰撞体）

定义车辆的碰撞地面盒。通常一个就够了。只有当地板坡度急剧变化时才可能需要添加多个。可以对其进行俯仰设置，对于内置 rake 的车辆很有用。

> 碰撞体是计算密集型的。

### 🔽 Aero（空气动力学）

Slipstream 值目前仅影响车辆尾流中提供的 slipstream "锥体"形状，而不影响它接收到多少 slipstream。建议保持默认值。

| 参数 | 默认值 | 说明 |
|------|--------|------|
| **Slip Gain Mult** | 1 | Slipstream 增益倍率 |
| **Speed Factor Mult** | 2 | 速度因子倍率 |

> ⚠️ 正的 lift 是下压力（我们在这里打破了惯例）。正的 drag 是……阻力。

#### Downforces（下压力）

如果你想使用基于 ride height 的 aero map，你需要定义车辆的 4 个角：

- **1** = LF（左前）
- **2** = RF（右前）
- **3** = LR（左后）
- **4** = RR（右后）

CL 和 CD 值在前后的 lift 和 drag `surface3d` 文件中定义。

![Downforces 布局](/evo/physics/image51.png)

Downforces 1-4 在车辆上的位置将被 Setup 用作 ride height 参考点。在 `surface3d` map 中，定义你希望车轴产生的实际总 CL/CD 值。代码会自动将其拆分为车辆两角各一半。下力点的纵向定位影响空气平衡（逻辑上）。

查看实时影响：**"Car Data Simulation" → Start Simulation → Wind Tunnel → Wings → 添加一些速度**

**示例配置：**

- **Size rear/front**：定义表格的分辨率
- **min/max rear/front**：定义 map 的范围
- 两者一起定义步进值

输入值或导入 map 后，点击 **"Calculate Interpolation"** 并保存。

![Surface3D Map](/evo/physics/image32.png)

**调试**：点击 **"🔽 Interp Map"** 打开 aero map 可视化。

![Interp Map](/evo/physics/image47.png)

**实时**：**"Car Data Simulation" → Start Simulation → Wind Tunnel → Wings → 添加一些速度**

![Wind Tunnel](/evo/physics/image8.png)

**CL 和 CD Gain**：允许轻松缩放整个 map。

**Yaw Gain**：可用于增加或减少每轴随 yaw 的下压力。5-10 的值开始变得明显。

示例：5° yaw 角，如果 Yaw Gain 为 -1.0，会导致约 9% 的下压力损失。

**Drag per cool transfer**：允许随 brake duct 缩放 drag（尚未实现）。

#### Aero Damage（空气动力学损伤）

Drag 和下压力都可调。

Downforce 1（左前）的以下值定义了该元素对不同碰撞的损伤敏感度：

![Aero Damage](/evo/physics/image25.png)

| 值 | 碰撞类型 |
|----|----------|
| 1 | 前方碰撞 |
| 2 | 后方碰撞 |
| 3 | 左侧碰撞 |
| 4 | 右侧碰撞 |

**Lift/Drag per angle**：随 carsetup 中的翼面调整添加/减少下压力或 drag。

![Lift/Drag per angle](/evo/physics/image18.png)

对于 GT 赛车，我们目前使用一种方法，使用独立的翼面元素，将 lift/drag 添加到基准 aero map 或从中减去。为此，放置两个翼面（一个在前轴上方，一个在后轴上方），**两个**都命名为 **"REAR"**。这将把两个翼面都连接到 `.carsetup` 中的后翼调整，无论它们在车上的位置。这允许通过翼面专用的查找表实现非线性的翼面对空气动力学的影响。

**独立翼面**遵循相同的逻辑：

- **AOA**：根据攻角定义 CL
- **G H C L Mult**：将基于 ride height 的乘数应用于 AOA 导出的 CL/CD 值（类似 AC1）

独立空气动力学元素名称需要如下命名才能通过 car setup 调整：

```
FRONT
REAR
DIFFUSOR
BODY
DRS
```

![独立翼面](/evo/physics/image29.png)

**Wing 控制器**：允许主动空气动力学部件，同时使用 aero map 和独立翼面元素。例如空气制动器。

> Wing 控制器的输出是 **角度，单位为度**。

![Wing 控制器](/evo/physics/image16.png)

#### DRS

允许你将翼面连接到 DRS 功能。以 992 GT3 RS 为例，按下 DRS 按钮时前翼和后翼都会受到影响，瞄准特定角度（在 LUT 中），以实现所需的 CL 和 CD 值，从而达到 DRS 效果。

你也可以使用 **"UseEffect"** 模式来使用 0-1 缩放而不是特定角度。

**"Connected Wing" ID** 来自 `.car` 文件中的 Path ID。

![DRS](/evo/physics/image48.png)

### 🔽 ERS（能量回收系统）

允许混合动力系统。还允许基于例如 F1 规则集定义每圈电池使用的限制。

- **Torque LUT** 需要按照 ICE 发动机的 RPM 定义
- **Power Controllers** 是驾驶舱中可用的 ERS maps（如果 ☑️ Has Cockpit Controls 激活）
- ERS Maps 可以绑定到 "Performance Modes"（见下文），需要在 `.carsetuplimits` 中允许。计数是 0-based，所以 "Power Controller Rear 1" 对于 Performance mode 和 `.carsetuplimit` 以及 "Default Power Controller Index" 都是 0

控制器允许你设置关于 ERS 功率输出（或充电）的各种逻辑。

> ERS 控制器的输出是 **ERS Torque LUT 的乘数**。正值表示输出，负值表示充电。例如 "-0.2" 将以 LUT 中定义的任何 RPM 下扭矩的 20% 进行充电。

![ERS](/evo/physics/image45.png)

### 🔽 Performance Modes（性能模式）

Performance Modes 允许你将多种功能和电子设置组合成预设，如 **Sport Mode** 或 **Comfort**，或者 F1 中的 **Qualifying**。

Mode 依赖的差速器逻辑也属于此范围。

Performance Modes 需要在 `.carsetuplimits` 中提供。

![Performance Modes](/evo/physics/image57.png)

#### Dependency（依赖）

Performance Mode 设置应该是主导的，覆盖其他地方的其他定义，并在会话开始时初始化。但如果遇到问题，请提交 bug，在修复之前，确保在其他文件中定义相同的逻辑或设置。

例如，如果 Performance Mode 依赖于特定的差速器或离合器设置，在 drivetrain 中定义相同的逻辑作为默认值。

#### Electronics（电子系统）

虽然电子系统中的几个设置是冗余的并在各自的部分中有说明，但一些是 Performance Mode 独有的：

| 参数 | 说明 |
|------|------|
| **Ebb** | 引用 `brakesystem` 中定义的模式 |
| **Engine Map** | 引用 `.carengine` 文件中定义的 Maps |
| **ERS Deployment map** | 引用 `.car` 文件 ERS 部分中的 "Power Controllers" |
| **ERS Recharge Lv** | 仅存在于 Perf Mode 设置中。这是一个缩放因子，引用 ERS 部分的 Charge K 值。100 表示 Charge K 值的 100% |
| **ERS Heat Charging** | 同样引用 ERS 部分的 Heat Charge K 值，但这只是一个开/关切换 |
| **Brake settings** | 引用不同的静态扭矩和 bb（我们未在任何地方使用） |

![Electronics 设置](/evo/physics/image63.png)

#### Differential & Clutches（差速器与离合器）

Performance Modes 专门允许在驾驶时更改差速器逻辑，特别是对于可选 AWD 的车辆，将扭矩转移到所需车轴或单个车轮，基于各种物理参数。

##### Differential Adjustments（差速器调整）

| 选项 | 说明 |
|------|------|
| **Differential Data** | 对于 FWD 和 RWD 动力系统：更改机械差速器属性 |
| **FourWD Differentials** | 对于永久 4WD 动力系统：更改任何类型的机械差速器属性（如奥迪 Quattro） |
| **Front/Rear/Center Lock Controllers** | 控制器允许精确电子控制机械 FWD/RWD/AWD 差速器的锁定扭矩。覆盖静态机械定义。（如 Ferrari 296、M Active Differential、i30N 作为 FWD 示例）。控制器的输出是差速器的锁定扭矩 |
| **AWD Clutches** | 允许通过增加离合器预载将驱动扭矩传递到单个轮胎（如 Audi RS 3 是 FWD + 后轮离合器，或 BMW M8 是 RWD + 前轮离合器） |

对于车辆的每个角，添加一个新的离合器：

| Position | 车角 |
|----------|------|
| 0 | LF（左前） |
| 1 | RF（右前） |
| 2 | LR（左后） |
| 3 | RR（右后） |

- **Preload**：定义最小锁定扭矩
- 名称通过按 ENTER 保存

![AWD Clutches](/evo/physics/image24.png)

- 每个控制器可以包含多个阶段，每个阶段有不同的输入变量
- AWD Clutch 控制器的输出是 **可以通过传动系统各部分之间的 AWD 耦合离合器传递的最大扭矩量**

> 切换 Performance Modes 时，所有应该更改的逻辑都需要定义。如果一个逻辑在 Perf Mode 1 中激活，而 Perf Mode 2 中没有新的定义，Perf 1 的逻辑将保持激活。

> 理论上，你可以通过在运行中将差速器从 LSD 切换到 Torsen 或其他任何类型来达到所需效果。

> ⚠️ `.drivetrain` 文件中有额外功能，允许对 2WD 车辆的左右驱动轮差速锁进行单独控制。

---

## 4. COILOVER（减震弹簧组件）

> ⚠️ Coilover 中的某些值最终会被 `.carsetup` 中的值覆盖！

被覆盖的值：
- Spring Rate（弹簧刚度）
- Bump stop Range（从静止位置到 bump stop 的距离）
- Bump stop Force（bumpstop 的弹簧刚度）
- Collar Position（悬挂的静止位置）
- 所有 Damper fast/slow bump/rebound 值
- Helper spring K & Range（也称为辅助弹簧）

然而，在 coilover 文件中有适当的模拟还是有用的。

![Coilover](/evo/physics/image33.png)

此处的硬定义是：

### Progressive Spring Rate（渐进弹簧刚度）

对于非线性弹簧（需要比弹簧刚度高约 **~10 倍**的值才能明显！）

### Bump Stop（缓冲块）

> Bump stop up = 压缩方向

| 参数 | 说明 | 示例 |
|------|------|------|
| **Length** | Bump stop 的尺寸，单位米 | 2.5cm = 0.025m |
| **Reference** | 从该压缩量开始，橡胶刚度变为渐进的 | - |
| **Gamma** | 指数刚度增加的指数 | - |
| **Damping** | Bump stop 的固有阻尼 | - |

### Damper Transition Speed Threshold（减震器过渡速度阈值）

Damper speed (m/s)，从该速度开始，快速阻尼率适用。

### Damper LUT

- **LUT List**：链接到 `.DamperCurves` 文件，包含预定义的减震曲线（通常是多拐点赛车减震器）

![Damper Curves 文件](/evo/physics/image1.png)

- **Damper LUT Scale**：允许通过缩放在多个车辆上使用相同的 LUT

> ⚠️ 此处定义的 Damper LUT 需要 `.carsetuplimits` 定义允许的点击范围（例如，如果 `.damperCurves` 文件中有 50 条独立曲线，可调减震器范围需要是 1-50！）

![Damper LUT Scale](/evo/physics/image39.png)

**Damper curve 示例：**

![Damper Curve 示例](/evo/physics/image55.png)

```
# 负速度 = rebound（回弹）运动，需要减震器产生正力
# 正速度 = bump（压缩）运动，需要减震器产生负力
```

手动构建这些是不可行的。下面会提供导入数据的途径。

### 🔽 Sim（模拟）

**Plot rate**：显示弹簧和 bump stop 上的力随行程变化。红线标记压缩 bump stop 的起点，绿线标记回弹 stop 的起点。

![Spring Plot](/evo/physics/image46.png)

**Damper plot**：显示力随减震速度的变化，取决于 slow/fast 斜率和定义的拐点速度。

![Damper Plot](/evo/physics/image37.png)

---

## 5. SUSPENSION（悬挂）

你可以在此定义各种悬挂类型几何。

### 🔽 Basic Data（基本数据）

| 参数 | 说明 |
|------|------|
| **Hub Mass** | 轮毂重量，单位 kg（这是车辆总质量的一部分，影响重量分配。严重偏离重量平衡通常表示此处有输入错误） |
| **Toe out** | 如果没有数据，留 0 |
| **Static camber** | 如果没有数据，留 0 |
| **Rim offset** | 应为 0，仅用于微调 scrub radius 而无需重做整个几何 |

> ⚠️ **只填写一种类型** ⚠️

通常悬挂需要毫米级精度，特别是正确的 camber gain 和 bump steer 行为。不建议在编辑器中随意调整悬挂直到找到可行的方案。理想情况下，使用工程软件设计悬挂，然后复制到编辑器中。所有测量源自轮辋/轮胎的中心。

**不带 coilover 角度的类型**（使用 Wheel Rate）：

- DW Data
- Axle
- Multi Link
- Trailing Arm

**带 coilover 角度的类型**（使用 Spring Rate）：

- **Strut**：标准 strut 悬挂，包含角度
- **Strut Ml**：允许更复杂的 strut 悬挂
- **Multi Link New Data**：带 coilover 角度的 Multilink
- **DW Coil Data**：带 coilover 角度的 DW

---

## 6. DRIVETRAIN（传动系统）

### Traction Type（驱动类型）

| 类型 | 说明 |
|------|------|
| **RWD** | 标准后轮驱动 |
| **FWD** | 标准前轮驱动 |
| **FourWD** | 全轮驱动，3 个差速器 + 电子逻辑（如 Peugeot 205 T16、Audi Quattro 等） |
| **AWD** | RWD，可选择通过 position 0 和 1 的 "AWD Clutches" 将扭矩传递到前轮（M8 Competition） |
| **AWDF** | FWD，可选择通过 position 2 和 3 的 "AWD Clutches" 将扭矩传递到后轮（RS 3） |

### Differential Data（差速器数据）

| 参数 | 说明 |
|------|------|
| **Power / Coast** | 以十进制 % 锁定作为输入扭矩的乘数（未来会有更改）。1.0 = 100% |
| **Preload** | Nm |
| **Front share** | 用于 FourWD，十进制 |
| **TBR** | 与 Torsen 差速器一起使用（5.0 = 5:1） |

> *忽略所有 wear 和 temp，当前未激活*

### Other Options（其他选项）

![Drive train wobbling](/evo/physics/image42.png)

| 选项 | 说明 |
|------|------|
| **☑ Max Between Lsd and Elsd** | 允许在驾驶时动态切换逻辑，在机械 LSD 定义和 Front/Rear Lock Controller 逻辑之间。两者同时计算，应用较大的扭矩值 |
| **☑ Has cockpit controls** | 允许根据 `.carsetuplimits` 中的允许范围在车内进行差速器调整（如 GT3 RS） |

控制器的运作方式类似于上面的 Performance Mode 描述。

**Left and right lock Controllers**：允许差速器驱动的扭矩矢量逻辑。然而，许多扭矩矢量或电子差速器使用有针对性的制动施加代替。这可以在 `.brakesystem` 的 "brake steer" 部分构建。

---

## 7. GEARBOX（变速箱）

### General（通用）

![Gearbox](/evo/physics/image62.png)

| 参数 | 说明 |
|------|------|
| **Gear Up/Dn Time** | 换挡时间，单位 ms |
| **Auto Cut Off Time** | 油门切断的长度 |
| **Gas Cut Off Level** | 换挡期间油门量：建议手动变速箱不要设为 0，否则它会作为玩家无法关闭的 flat shift 辅助 |

默认变速箱是 **Sequential**（序列式）。

| 选项 | 说明 |
|------|------|
| **☑ Has Dual Clutch** | 启用 DCT 逻辑，近乎无缝换挡 |
| **☑ Is Shifter Supported** | 启用 H-Shifter 变速箱 |

### H-shifter Damage（H 挡变速箱损伤）

**Damage RPM Window**：基于手动挡车辆齿轮研磨时间定义累积损伤量。与以下配合使用：

**validShiftRPMWindow**（在 `.gearbox` 文件中）：定义发动机和传动系统之间 RPM 差的最大允许值，使换挡被视为成功。

如果 RPM 不匹配超过此阈值，换挡失败并发生齿轮研磨事件。

有效窗口随每秒研磨减少 Damage RPM Window 的值。

**示例：**

```
Valid Window = 1000
Damage Window = 100
```

研磨齿轮 2 秒将 Valid Window 减少到 800。总共 10 秒的研磨将导致变速箱故障。

**Controls Window Gain**：控制油门输入在换挡期间对 RPM 同步的影响程度。

系统在以下之间混合：
- 仅离合器 RPM 影响（controls window gain = 0）
- 离合器 + 油门 RPM 影响

换挡时松开油门时，较高的值会显著减少 RPM 不匹配。即高值奖励换挡时干净地松开油门，减少错挡的可能性。

### Downshift Protection（降挡保护）

![Downshift Protection](/evo/physics/image11.png)

对于 Sequentials 和 DCTs：

| 选项 | 说明 |
|------|------|
| **☑ Is Active** | 帮助防止超转 |
| **Overrev** | 定义降挡期间允许超过 limiter（在 `.engine` 中找到）的 RPM |
| **☑ Lock N** | 强制车辆在能够换入空挡之前必须静止。目前用于规避 DCT 在行驶中换入空挡时熄火的 bug |

### Autoblip（自动补油）

曲线定义油门补油随时间的变化：

```
X = 时间 (ms)
Y = 油门，十进制
```

![Autoblip](/evo/physics/image4.png)

| 选项 | 说明 |
|------|------|
| **☑ Is Electronic** | 无论辅助设置如何，强制 Autoblip 开启。应用于 Sequentials 和 DCT。也适用于手动变速箱使用换挡拨片的情况（如 M2）。即将支持 H-shifter 输入 |

### Auto Shifter（自动换挡）

![Auto Shifter](/evo/physics/image27.png)

| 参数 | 说明 |
|------|------|
| **Up** | 升挡的目标 RPM |
| **Slip Threshold** | 帮助防止轮胎打滑时陷入升/降挡循环 |
| **Gas Cutoff Time** | 同上 |

> *忽略任何 Gear fatigue，当前未激活*

---

## 8. CLUTCH（离合器）

### Autoclutch（自动离合器）

手动变速箱在玩家没有离合器并使用 autoclutch 辅助时需要。

![Autoclutch 曲线](/evo/physics/image28.png)

```
X = 时间 (s)
Y = 离合器接合度
```

| 参数 | 说明 |
|------|------|
| **☑ Forced On** | 用于 DCT，即使离合器辅助关闭也在起步时有离合器 |
| **Min Rpm** | 离合器开始接合的 RPM |
| **Max Rpm** | 离合器完全接合的 RPM |
| **☑ Use on Changes** | 即使没有离合器辅助也在换挡时强制使用离合器 |

标准离合器曲线是 **0-100 的 S 形**。你可以添加任何形状，例如带死区的。

```
用户输入 0 = 踏板踩下，离合器分离 (0)
用户输入 100 = 踏板松开，离合器接合 (100)
```

![离合器输入曲线](/evo/physics/image41.png)

---

## 9. ENGINE（发动机）

> 功率和扭矩值 **@车轮**。

按 `.engine` 文件底部的 **"Simulation"** 打开扭矩图表。

### General（通用）

**Type**：

| 类型 | 说明 |
|------|------|
| **Combustion** | ICE（内燃机） |
| **Motor** | EV（电动车） |

对于混合动力，选择 Combustion 并在 `.cardata` 中添加 ERS。

![Engine Type](/evo/physics/image22.png)

### Power Curve（功率曲线）

```
X = RPM
Y = Torque Nm（涡轮增压器作为乘数叠加）
```

![Power Curve](/evo/physics/image40.png)

### Coast Curve（滑行曲线）

与 Power curve 相同，但扭矩值应为负。

例如：0 扭矩是你的怠速 RPM，20 本质上是启动机扭矩和发动机抗熄火的阻力。

![Coast Curve](/evo/physics/image64.png)

### Engine Maps（发动机映射）

可用于在车内更改与功率相关的行为。

| 类型 | 说明 |
|------|------|
| **Type Cervone** | 在此模型中，扭矩调制由取决于油门输入和转速 (RPM) 平方的规律控制。行为可以通过 Throttling Factor 轻松调整 |
| **Throttling factor** | 控制最小和最大扭矩的标准线性插值 (lerp) 与基于 RPM 损失模型之间的混合。较高的值增加 RPM 依赖损失的影响，较低的值倾向于标准扭矩插值 |
| **Type Gamma** | 由三个参数定义：Throttle、Throttle Gain (k) 和 Throttle RPM Move |

其他参数：

| 参数 | 说明 |
|------|------|
| **Throttle Lag up/dn** | 延迟踏板输入的效果 |
| **Minimum** | 熄火 RPM |
| **Limiter** | 最大 RPM |
| **Limiter Cycles** | limiter 的频率，但与发动机惯性、coast 和 power 扭矩一起工作 |
| **Throttle Rev Choking** | 目前开发中。尝试更好地管理 RPM limiter |

### Start ECU Assist / Launch Control（起步辅助/起步控制）

两种逻辑可用。新逻辑通过 **☑ use clutch** 复选框触发。

新逻辑有 2 个阶段。第一阶段中，limiter 控制 RPM，同时离合器尝试匹配所需的轮胎滑移。

#### 新方法（☑ use clutch）

| 参数 | 说明 |
|------|------|
| **Speed Range KHM** | 起步控制结束前的速度范围 |
| **Rpm Limiter** | 起步前保持的 RPM |
| **Limiter Cycles** | Limiter 以 Rpm Limiter 接合的频率 |
| **Slip Ratio Target** | 定义目标滑移率 |

#### 旧方法

> 新方法更好，所以不需要使用这个。

| 参数 | 说明 |
|------|------|
| **Rpm Range** | 定义离合器的平滑度 |
| **Clutch and Gas Gain** | 调节干预 |

### Turbos（涡轮增压器）

有各种方法来控制涡轮增压器（Supercharger 也是涡轮增压器，但没有迟滞）。

**Turbos to load**：在此添加涡轮。你可以添加任意多个，它们各自的增压将被组合。你可以使用具有独特特性的多个涡轮，也可以使用单个涡轮并定义涡轮控制器来创建任何你想要的增压特性。如果你有两个涡轮，创建两个控制器。否则一个可能未经调节就产生 `.turbo` 文件中定义的全部增压。

| 参数 | 说明 |
|------|------|
| **Max boost** | 涡轮的峰值增压输出 |
| **Lag Up** | 定义建立增压的延迟 |
| **Lag Dn** | 定义压力损失的延迟（如 anti-lag） |
| **☑ is Adjustable** | 启用车内通过 MFD/热键调整——还需要 `.carsetuplimit` 定义 |

**Lag 逻辑**：

```
value = old_value + (new_value - old_value) * saturate(1 - filter)
```

| 值 | 延迟 (ms) |
|----|-----------|
| 0.999 | 3000ms |
| 0.990 | 300ms |
| 0.90 | 30ms |

![Turbo Lag](/evo/physics/image10.png)

### Turbo Controllers（涡轮控制器）

允许你基于各种指标控制涡轮压力——在 `.turbo` 文件中定义的限制范围内。

例如，第一阶段基于 RPM 并将涡轮压力与之绑定。

![Turbo Controller](/evo/physics/image21.png)

![Turbo Controller 示例](/evo/physics/image52.png)

> Max Turbo Boost 和 Bov Threshold 没有物理影响，但用作游戏性和音频的参考，有更多自由度。

![Max Turbo Boost](/evo/physics/image19.png)

### Battery Data（电池数据）

此部分用于纯电动车。Coast 扭矩曲线影响充电速度。

![Battery Data](/evo/physics/image14.png)

---

## 10. BRAKESYSTEM（制动系统）

| 参数 | 说明 |
|------|------|
| **Total Torque** | 总制动系统容量。扭矩将根据当前制动力分配在前轴和后轴之间分配 |
| **Front Bias** | 被 carsetup 和/或车载调整覆盖（☑ has cockpit bias 启用后者） |
| **Bias Step** | 被 `.carsetuplimits` 覆盖，但当前也被 MFD 自己的步进逻辑覆盖（bug） |
| **Compounds** | 刹车片（`.brakes` 文件）。如果没有定义化合物，则使用硬编码标准刹车片。由于这与轮胎温度严重交互，这是当前 WIP 领域 |

### .Brakes File（刹车文件）

当前建议不要在这里投入太多时间，因为轮胎温度校准也尚未完成。

**Performance Curve**：以温度 (°C) 和扭矩乘数定义（1.0 = 100%）。

![Brake Performance Curve](/evo/physics/image61.png)

![Performance Curve](/evo/physics/image54.png)

### Brake Controllers（制动控制器）

存在多种控制制动接合的选项，特别适用于现代跑车。

#### Electronic Brake Bias（电子制动力分配）

允许创建基于各种物理参数前后移动制动力的逻辑。

**EBB Mode**：

| 模式 | 说明 |
|------|------|
| **Absolute** | 将制动力分配设置为相应值（0.67 = 67%） |
| **Relative** | 从原始 BB 偏移制动力分配（如 0.67 + 0.05 → 72% BB） |

#### Steer Brake Controller（转向制动控制器）

允许创建 **自动制动差速器**，其中制动作用于内侧驱动轮以替代或辅助差速器，或作为扭矩矢量。

> 控制器的输出是 **扭矩 (Nm)**

> ⚠️ **重要**：要知道制动扭矩应该施加在哪一侧，需要一个 **Multiplier** 阶段，其中正值接合一侧，负值接合另一侧。

```
例如：X (input) = Lat G, Y = multiplier
```

![Steer Brake Controller](/evo/physics/image23.png)

我们的 ABD 通常有 **5-6 个阶段**，以覆盖所有驾驶场景，结合 G-forces、Speed、Slip、Throttle、over- 和 understeer。粗略的施加扭矩范围在 **300-500 Nm**。

#### Torque Controller EBB（扭矩控制器 EBB）

允许动态制动强度调整。

---

## 11. CONTROLLERS（控制器）

控制器是我们的多功能工具。正确使用时，它们非常强大，允许你为车辆部件的行为制定复杂的定义。现代汽车特别是有复杂的电子系统，将大量传感器数据集成到决策中。控制器允许我们在合理程度上模拟这些系统。

以 **Alpine 的自动制动差速器** 的简单版本为例：

控制器是 `.brakesystem` 中 **"🔽 Steer Brake Controller"** 部分的一部分。

它仅使用 **2 个阶段**，查看 slip ratio 和横向 G 力来对内侧车轮施加制动力。

![Controller 示例](/evo/physics/image50.png)

### 每个阶段的选项

| 选项 | 说明 |
|------|------|
| **Input Var** | 定义控制器用于决策的变量 |
| **Combinator Mode** | 允许在相加或相乘输出值之间切换（对于 steer brake 控制器，输出值是到一个或另一个车轮的扭矩） |
| **LUT** | 将输入变量的值与控制器的输出值配对的查找表 |
| **Filter Gain** | 定义系统延迟 |
| **Up limit / Down limit** | 定义一个夹限，无论逻辑如何，在此阶段不超过这些值 |
| **Current / Constant value** | 很少使用。Current 是直通，Constant 是无范围的夹限（需要 inputVar → const） |

**Combinator 示例**：

```
(example 4 stages: add, mult, add, mult) → (val1 * val2 + val3) * val4
```

### Filter Gain 值

| 值 | 延迟 (ms) |
|----|-----------|
| 0.999 | 3000ms |
| 0.990 | 300ms |
| 0.90 | 30ms |

### 示例分析

在我们的示例中：

**第一阶段**查看两个后轮之间的最大 slip ratio 值。直到 slip ratio 为 0.1 时不施加制动力。从 0.1 到 0.18，制动接合增加，响应时间为 30ms。

**第二阶段**查看横向 G 并乘以之前定义的制动扭矩。

直到两个方向 0.1g 都不施加制动扭矩（本质上即直线行驶）。然后，直到 0.4g，如果满足 slip ratio 条件，最大扭矩被接合。

"+" 和 "-" 定义制动应该施加在车辆的哪一侧。由于最大乘数是 1，第一阶段的最大扭矩是 300，所以最大制动扭矩也是 **300 Nm**。

![Controller 阶段分析](/evo/physics/image31.png)

![Controller 可视化](/evo/physics/image26.png)

### 输入变量

| 输入变量 | 单位 | 说明 |
|----------|------|------|
| `UndefinedInput` | - | - |
| `Brake` | 0 - 1.0 | 制动 |
| `Gas` | 0 - 1.0 | 油门 |
| `LatG` | G | 左 = -G，右 = G |
| `LongG` | G | 减速 = -G，加速 = G |
| `Steer` | 0 - 1.0 | 1.0 等于车辆最大转向输入 |
| `Speed` | kph | 速度 |
| `Gear` | # | 挡位 |
| `SlipRatioFrontAVG` | 通常 0 - ~0.2 | 前轮之间各自当前 slip ratio 的平均值（纵向） |
| `SlipRatioRearAVG` | " | 后轮同上 |
| `SlipRatioFrontMAX` | " | 取两个前轮胎中较高的 SR 值 |
| `SlipRatioRearMAX` | " | 后轮同上 |
| `SlipAngleFrontAVG` | 通常 0-10° | 前轮之间各自当前 slip angle 的平均值（横向） |
| `SlipAngleRearAVG` | " | 后轮同上 |
| `SlipAngleFrontMAX` | " | 取两个前轮胎中较高的 SA 值 |
| `SlipAngleRearMAX` | " | 后轮同上 |
| `OversteerFactor` | ° | `SlipAngleRearAVG - SlipAngleFrontAVG`。例如 4 表示后轮平均 slip angle 比前轮平均 slip angle 高 4°（过度转向）。负值表示不足转向 |
| `RearSpeedRatio` | Ratio | 后轮平均角速度与前轮平均角速度的比率 |
| `SteerDEG` | ° | 方向盘角度 |
| `Const` | output value | 与 "Const Value" 字段配合使用。当 Input Var 不是 Const 时，此字段被忽略 |
| `RPMS` | 0-20000 | RPM |
| `WheelSteerDeg` | ° | 轮胎转向角度 |
| `LoadSpreadLF` | Ratio | 左前轮胎载荷与前轴总载荷的比率 |
| `LoadSpreadRF` | Ratio | 右前轮胎载荷与前轴总载荷的比率 |
| `AvgTravelRear` | mm | 后悬挂平均行程 |
| `SusTravelLR` | mm | 左后悬挂行程 |
| `SusTravelRR` | mm | 右后悬挂行程 |
| `SteerYawDeltaLeft` | - | `steer + 4 * CarAngularVelocity`。比较转向输入与车辆角速度。用于左轮胎扭矩矢量 |
| `SteerYawDeltaRight` | - | `-(steer + 4 * CarAngularVelocity)`。比较转向输入与车辆角速度（负值）。用于右轮胎扭矩矢量 |
| `ErsChargeLevel` | 0-100 (或 0-1) | 检查电池充电状态，例如管理现代 F1 赛车的 ERS 输出 |
| `ErsCoastTorque` | Nm | 检查混合动力汽车中电动机的 coast 扭矩，例如管理制动力分配偏移 (EBB) |

### Look Up Tables（查找表）

了解每个用例中需要的输入变量和输出很重要。许多地方没有特别提及输入和输出的单位——在其他地方可以选择。

| 系统 | 输入变量 | 输出变量 | 单位 |
|------|----------|----------|------|
| EBB (electronic brake bias) | Controller: 可选择 | Brake Bias | 十进制前制动力分配。如 0.70 = 70% |
| AWD Clutches | Controller: 可选择 | Locking Torque per tire | Nm |
| Turbos | Controller: 可选择 | Boost | Bar |
| KERS | Controller: 可选择 | Torque | Nm |
| Throttle | 踏板输入 % | throttle % | % |
| Engine | Rpm | Torque | Nm |
| Active Aero | Controller: 可选择 | Wing Angle | ° |
| Aero downforce | ride height | CL/CD | 十进制 |

---

## 12. TYRES（轮胎）

> ⚠️ **请阅读** ⚠️

轮胎编辑器允许你调整模型中可用的任何值。但是，你无法控制连接所有参数的代码和数学。我们正在持续工作于此，如果你偏离当前校准，它将以未知的方式影响你创建的轮胎。我们 **强烈建议保持轮胎原样**，以保持更新间的兼容性。理想情况下，你只选择 **"Tyre Compound"** 并初始化其尺寸。

**模型中的已知问题**：
- 轮胎需要过多的滑移才能产生抓地力（因此响应也很慢）
- Slip Ratio 曲线过于动态，特别是在组合抓地力场景中，导致紧张的油门响应
- 胎压和 camber 对抓地力的影响过于简单

> 这些需要代码更改，无法仅通过调整值来解决，否则会将问题转移到其他地方。

### 创建轮胎

要创建轮胎，创建一个轮胎文件：

![创建轮胎文件](/evo/physics/image5.png)

![选择 Compound](/evo/physics/image12.png)

1. 打开文件
2. 选择所需的 compound（所有 GT 轮胎是 **Slick Medium** (!)）
3. 滚动到底部的 **"🔽 Init Data"** 部分
4. 输入尺寸（不需要 speed index）
5. 按 **"Init Tyre"** → 保存文件

所有模型参数将根据 compound 和尺寸设置。

> 如果你使用奇怪的 Init data，预期会有奇怪的结果。

![Tyre Init Data](/evo/physics/image68.png)

![典型 GT3 Slick](/evo/physics/image36.png)

---

## 13. CAR SETUP LIMITS（车辆设置限制）

Car Setup Limits 定义了可用的设置选项、范围和每次调整的步进。如果 `.carsetup` 中的值超出范围，游戏将强制执行 `.carsetuplimit` 值。这可能导致车辆功能异常，直到 `.carsetup` 和 `.carsetuplimits` 都正确。这意味着即使设置选项对玩家不可用，你仍然需要确保 `.carsetuplimits` 允许你为 `.carsetup` 选择的值。

![Car Setup Limits](/evo/physics/image49.png)

| 选项 | 说明 |
|------|------|
| **☑ Is Modifiable** | 在设置界面启用设置选项——如果已从 UI 端实现 |
| **☑ Hide Value** | 将值转换为仅可用的数量步进，隐藏实际值 |
| **☑ Is Negative** | 允许反转 UI 滑块，目前用于 Caster（caster 是悬挂顶部安装点的负纵向偏移，单位米，具有负值，因此"更多 caster"会在滑块左侧） |
| **LUT** | 如果定义了 LUT，你可以有非线性步进，这是 ARB 的典型情况。步进需要按照 LUT（通常 1 click），min 和 max 是第 1 个和最后一个可能的 click |

**LUT 示例**：

![LUT 示例](/evo/physics/image34.png)

在这种情况下，Step 必须为 "1"，min 为 "1"，max 为 "7"。如果你只想使用 LUT 的一部分，也可以定义从 min "3" 到 max "5"，结果只有 3 个 click。Step 为 "2" 将只有设置 1、3、5 和 7 可选。

| 参数 | 说明 |
|------|------|
| **Unit** | 单位覆盖目前不起作用 |
| **Fractional Digits** | 不起作用 |
| **Treat as Boolean** | 不需要，也未在任何地方使用 |

---

## 14. CAR SETUP（车辆设置）

`.carsetup` 文件是车辆的默认设置。可以有不同的文件用于不同的机械预设和湿滑条件（赛车使用湿地轮胎）。

> `.carsetup` 中的所有值覆盖在其他地方输入的值，如 cardata。

但是，**默认 Performance Mode (1) 中的值覆盖 `.carsetup` 值**（例如 GT3 RS 减震器）——我们认为这是一个 bug 并寻求解决。

Car setup 需要在 cardata 中链接。

一旦你打开 carsetup，**"Setup"** 部件会打开：

按 **"Start Auto Setup"** 开始模拟并让 setup 收敛——车辆将被提升到设定的 ride height，悬挂元素将到位。在这里你可以像在游戏中一样调整 setup，同时 carsetuplimit 范围被遵守，只有可调整的设置被显示。收敛完成后（"Wait while working on setup" 消失），确保保存 setup。你会看到 setup 文件中 "collar position" 的值发生变化——这些是计算得出的，**不要手动调整它们**。

![Car Setup](/evo/physics/image35.png)

> **注意**：将来我们将从直接选择 ride height 转变。Ride height 将成为所有其他设置的结果。

---

## 15. 校准悬挂 (CALIBRATING SUSPENSION)

基于悬挂几何、车辆重量和尺寸、Base Y、ride height 设置等，默认悬挂位置会被计算。

但是，如果当前 `.carsetuplimits` 不允许正确的范围来让悬挂位置稳定下来，auto-setup 将失败，因为悬挂不允许进一步移动。

为此你需要：
- `.carsetup`
- `.carsetuplimits`
- 启动模拟
- 打开 Suspension debug

**Suspension debug 显示：**

![Suspension Debug](/evo/physics/image58.png)

| 元素 | 说明 |
|------|------|
| 蓝色线 | 所有 4 个角的悬挂 collar position |
| 红色线 | 压缩 bump stop 起点 |
| 蓝色线 | 回弹 bump stop 起点 |
| 白色线 | 行程的 **有限** 终点（在 AC1 和 ACC 中不是这种情况，悬挂和 bump stop 变得更硬但永远不是刚性的） |

截图显示了 auto-setup 尝试将前悬挂降低到请求位置，但是允许范围太小，悬挂到达了行程终点。

**校准步骤**：

打开 `.carsetup`，转到 **🔽 Suspension 1**（然后复制到 2），**🔽 Bump stop up** 并调整 Range。在这种情况下，缺失的范围相当大，所以做一个数厘米的大调整，然后再次启动 auto setup。

![Bump Stop 调整前](/evo/physics/image43.png)

![Bump Stop 调整后](/evo/physics/image17.png)

前左现在到达最终位置（当然回弹范围 - Bump stop down - 也需要调整），而前右仍然失败，因为你还没有调整它。

![前右仍然失败](/evo/physics/image9.png)

> 每次更改 Base Y、悬挂几何或 ride height 都可能需要你重新对齐悬挂，这意味着这应该是你整个过程中的 **最后一步**，否则你将不断循环。

---

## 16. DATA IMPORT（数据导入）

由于游戏中的大量数据基于 `.curve` 文件（查找表），你可能想要加速这个过程。有多种选项。

### Aero Map 导入

1. 打开 `.surface3d` 文件
2. 滚动到底部
3. 点击 "..." 选择导入路径，导航到 csv 文件（示例文件待定）
4. Calculate interpolation
5. 保存

### 通用 JSON 导入

在内容浏览器中有一个 **"Import Json"** 按钮。当剪贴板中有正确结构的 json 内容时它会工作（即 Ctrl+A, Ctrl+C → "Import Json"）。

![Import Json](/evo/physics/image2.png)

结构：

```json
// Header 需要文件名和路径，文件将被创建
// t = X
// value = Y
// anchors 不使用但必须存在

// FILENAME=content\target_folder\desired_name.curve
{
  "points": [
    {
      "t": -1.1,
      "value": 2499.999756,
      "anchor_left": {
        "x": 0,
        "y": 0
      },
      "anchor_right": {
        "x": 0,
        "y": 0
      }
    },
    {
      "t": -1,
      "value": 2500,
      "anchor_left": {
        "x": 0,
        "y": 0
      },
      "anchor_right": {
        "x": 0,
        "y": 0
      }
    }
  ]
}
```

### 替代 JSON 导入

打开任何现有 `.curve` 文件时可使用不同的 json 结构。

![替代 JSON 导入](/evo/physics/image6.png)

1. 点击 "..." 导航到 `.json` 文件
2. 点击 **"Import JSON curve"**

此处的结构有所不同，省略了 anchors：

```json
{
  "values": [
    {
      "x": 0,
      "y": 1
    },
    {
      "x": 91,
      "y": 1
    },
    {
      "x": 392,
      "y": 1
    }
  ]
}
```

---

## 17. UI CAR SPECS（UI 车辆规格）

你可以为车辆添加数字规格和详细描述，以及详细的设置指南。

### Numeric Specs（数字规格）

你可以在主菜单车辆选择中添加车辆规格。

![UI Car Specs](/evo/physics/image30.png)

技术规格位于 **mechanical presets** 底部。

![Technical Specs](/evo/physics/image60.png)

### Description Texts（描述文本）

UI、Setup 和自定义文本可以在 mod 的 `uiresources` 文件夹中以 `.loc` 文件添加：

| 文件 | 说明 |
|------|------|
| `en.loc` | UI 描述文本 |
| `en.cars.loc` | 包含匹配的自定义键明文 |
| `setup_en.loc` | 设置说明 |

---

## 引用来源

- Kunos Simulazioni, AC EVO Car Modding Pipeline - Physics 官方文档
