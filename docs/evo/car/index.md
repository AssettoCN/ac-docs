---
title: 车辆模组管线
---

# AC EVO — Car Modding Pipeline

## 更新日志

- 2026 年 6 月 3 日：V1

## 1. EDITOR（编辑器）

### Foreword（前言）

AC EVO 编辑器是 Kunos Simulazioni 自主开发的内部工具，用于创建和配置 AC EVO 的各类资产。与最初的 AC1 编辑器（仅是一个图形化工具）相比，这是一个重大的飞跃。AC EVO 编辑器的设计目标是在大部分内容开发过程中，无需实际进入游戏即可制作和调试大多数游戏内功能。

> 免责声明：请注意，此模组工具是在游戏仍处于抢先体验阶段时公开发布的。

尽管我们完全有意愿保持未来的向后兼容性（考虑到已制作的大量官方内容），但游戏的未来更新很可能需要对已完成的模组资产进行一定程度的维护。

请注意，游戏及其引擎的整体开发和改进始终优先于内容制作，无论是官方内容还是社区内容。我们感谢您的理解，以及您为保持自身内容更新以供社区享受所付出的努力。

### Workspace（工作区）

编辑器位于 Assetto Corsa EVO SDK 中，文件名为 `AssettoCorsaEVOEditor.exe`。

首次启动时，建议为以下类型的文件设置容器。

![Editor containers setup](/evo/car/image113.png)

同时建议指定多个 Content Browser 窗口，以便在编辑器内更方便地导航和传输文件。

编辑器内容从 **`SavedGames/ACE-Modder/mods/`** 文件夹中读取。

创建容器后，请确保勾选复选框，这样打开的任何文件都会在其对应的容器中打开。如果不这样做，新文件仍会在各自独立的窗口中打开！

![Container checkbox](/evo/car/image61.png)

以下是建议的工作区布局：

![Suggested workspace](/evo/car/image82.png)

- 纹理容器
- 材质容器
- 网格容器
- Actor 容器
- 内容浏览器（主窗口）
- 预览选项
- 日期和时间

注意 **Preview** 窗口设置在容器后面展开的方式。

**Asset** 下拉菜单允许在有视口外观的文件（mesh、材质）之间进行选择。

![Asset dropdown](/evo/car/image96.png)

当不使用容器来管理特定类型的文件时，打开新类型的文件时，请确保右键点击其标题栏并保存下次打开时希望使用的位置和大小。否则，文件将始终以折叠状态打开。

![Container position](/evo/car/image66.png)

:::warning
关闭容器时**不会弹出任何提示**，其位置和其他属性需要在创建后通过 Containers 菜单重新设置。
:::

工作区设置保存在 **`user/SavedGames/ACE-Mod/editor_workspace_data`** 文件中。建议在满意工作区布局后**备份**该文件。

如果因任何原因导致编辑器处于无法在启动后恢复的状态或配置，删除该文件即可将编辑器重置为默认状态。

已编辑但未保存的文件会在文件标题栏中以星号（`*`）标识。

![Unsaved file indicator](/evo/car/image23.png)

### Preferences（偏好设置）

通过 Settings -> Preferences 菜单可以对编辑器进行一些设置更改。

![Preferences](/evo/car/image68.png)

各项设置应该一目了然。

以上配置展示的是首席内容美术师的首选设置。

## 2. FBX REQUIREMENTS（FBX 要求）

一辆车由以下 **必须单独导出** 的 `.fbx` 格式 mesh 文件组成：

- Exterior（外壳）
- Interior（内饰）
- Rims（轮毂）（LF 和 RF 为必选 — LR、RR 仅在尺寸不同时需要单独导出）
- Blurred Rims（模糊轮毂）（同上）
- Tyres（轮胎）（同上）

以下 mesh 可选择作为单独文件导出：

- Steering wheel（方向盘）（这种情况下必须从内饰中排除）
- Seatbelt and/or Safety net on（安全带和/或安全网开启状态）
- Seatbelt and/or Safety net off（安全带和/或安全网关闭状态）
- Brake discs（刹车盘）（LF、RF — LR、RR 仅在尺寸不同时需要单独导出）
- Devices or gauges（设备或仪表）
- Numberplates（车牌）（前和后）

每个单独的 mesh 必须从场景的 `0,0,0` 轴心点以默认旋转（Y-up）导出，以消除附加到父骨骼时的任何额外偏移。

例如，当方向盘、车轮 mesh、刹车盘等作为单独文件导出时，如果源场景（例如在 Blender 或 3DS Max 中）保存时各项物品都在其正确位置，则必须先临时移除所有变换和旋转后再导出。

> FBX 文件必须以 **Y-up 方向** 导出，与 AC1 相同。

![FBX export](/evo/car/image101.png)

我们区分骨骼网格（skeletal mesh）和静态网格（static mesh）。骨骼网格包含用于动画或部件附加的骨骼层级结构。

### BONE STRUCTURE（骨骼结构）

#### EXTERIOR Mandatory Bones（外壳必选骨骼）

- `CAR_BODY` — 车辆外壳的根骨骼，所有其他外壳 dummy 必须嵌套在其下
- `HUB_LF` 和 `HUB_RF` — 前轮毂骨骼跟随悬挂运动，并由转向动画旋转。建议将其对齐以匹配前立柱的物理特性，因为与 AC1 不同，即使在游戏中旋转也是由 mesh dummy 驱动的，而非物理悬挂几何体
- `HUB_LR` 和 `HUB_RR`
- `SUSP_LF`、`SUSP_RF`、`SUSP_LR`、`SUSP_RR` — 必须嵌套在 `HUB` 骨骼下，是刹车卡钳的父骨骼，仅跟随轮毂运动，不跟随车轮旋转
- `DISC_LF`、`DISC_RF`、`DISC_LR`、`DISC_RR` — 必须嵌套在 `HUB` 骨骼下，是刹车盘的父骨骼，跟随车轮旋转
- `WHEEL_LF`、`WHEEL_RF`、`WHEEL_LR`、`WHEEL_RR` — 必须嵌套在 `HUB` 骨骼下，是轮毂的父骨骼 — 跟随车轮旋转
- `TYRE_LF`、`TYRE_RF`、`TYRE_LR`、`TYRE_RR` — 必须嵌套在 `HUB` 骨骼下，不跟随车轮旋转，因为轮胎旋转动画是通过变换 UV 通道实现的，mesh 本身是静态的，唯一的运动是接触面处的轮胎变形操作

#### EXTERIOR Optional Function Bones（外壳可选功能骨骼）

- `WIPER_START_1`、`WIPER_END_1` — 这些骨骼必须放置在雨刮片的两个端点（同时嵌套在雨刮片所附着的雨刮 dummy 下），它们是挡风玻璃雨刮器正常工作的必要条件。当有多个雨刮器时，第二个雨刮器应使用后缀 `_2`。第一个雨刮器必须是直接刮刷驾驶员正前方的那个。

:::tip
目前仅支持 2 个挡风玻璃雨刮器，不支持后雨刮器（可以动画化但不会擦除水滴）。
:::

- `MIRROR_1` 和 `MIRROR_2` — 必须放置在左侧（1）和右侧（2）后视镜镜面的中心，Y 朝上，无旋转。它们将作为 Multi/VR 后视镜渲染模式下的投影点。

#### EXTERIOR Arbitrary Bones（外壳任意骨骼）

虽然不是必须的，但建议其他可选的、非功能性的骨骼使用以下命名约定（全大写）：

`DOOR_LF`、`DOOR_RF`、`DOOR_LR`、`DOOR_RR`、`FRONT_BUMPER`、`REAR_BUMPER`、`WING`、`DIFFUSER`、`HOOD`、`TAILGATE`、`PLATE_R`、`PLATE_F` 等。

#### INTERIOR Mandatory Bones（内饰必选骨骼）

- `COCKPIT_HR` — 车辆内饰的根骨骼，所有其他内饰 dummy 必须嵌套在其下
- `STEER_BASE` — 方向盘动画的基础骨骼

#### INTERIOR Optional Function Bones（内饰可选功能骨骼）

- `SEATBELT_ON`、`SEATBELT_OFF`
- `SAFETY_NET_ON`、`SAFETY_NET_OFF`

安全带和安全网 mesh 的附加骨骼，它们在不同场景下响应可见性要求（展示间显示 OFF 状态，游戏中显示 ON 状态）。

- `MIRROR_0` — 驾驶舱后视镜，必须放置在驾驶舱后视镜镜面的中心，无任何额外旋转

#### INTERIOR Arbitrary Bones（内饰任意骨骼）

`DOOR_LF_INT`、`DOOR_RF_INT`、`PEDAL_ACCEL`、`PEDAL_BRAKE`、`PEDAL_CLUTCH`、`SHIFTER_0`、`SHIFTER_1` 等。

当方向盘是独立的 mesh 且具有换挡拨片的骨骼时，建议使用以下命名约定：

- `STEER_HR` — 方向盘 mesh 内的父骨骼
- `PAD_UP`、`PAD_DW` 等

:::danger 重要提示
默认情况下，FBX 中的每个单独对象都被视为骨骼，因此为确保 FBX 文件经过优化，请确保对**非 dummy 对象**使用以下**命名约定之一**，这样它们在导入后就不会被纳入骨骼骨架：
:::

- `g_example_objectname`
- `GEO_example_objectname`
- `RT_example_objectname`

以下是一个基本悬挂层级结构的示例，展示了正确的骨骼和对象命名（使用上述第一种方式）：

![Suspension hierarchy](/evo/car/image44.png)

骨骼 mesh 文件中可以添加任意数量的骨骼，但建议不要包含超出基本功能、悬挂动画和可选部件附加所需的数量。

关于详细的悬挂绑定及其专用要求，请参阅示例模组的外壳 FBX 文件。

:::warning
使用绑定的悬挂时，带有 look-at 约束的绑定骨骼必须使 X（红色）轴指向对应的 `DIR_` dummy（与 AC1 相同）。

任何对齐错误或设置不当都可能导致悬挂几何体在展示间和最终状态编辑器中就已经看起来不正确，因为约束在那里已经被执行了！
:::

### MATERIAL NAMES（材质名称）

以下材质名称必须遵循命名约定：

- `EXT_SKIN`（`EXT_SKIN`、`EXT_SKIN_2` 等） — 车身主要板件的材质，通常包括车漆、涂装和其他可贴图部件。这是将其暴露给外部涂装编辑和 AI 对手颜色变化（WIP）所必需的
- `EXT_DISC` — 刹车盘材质的必选名称
- `EXT_WINDOWS`（`EXT_WINDOWS`、`EXT_WINDOWS_2` 等） — 外壳车窗的必选名称（可以是多个材质）
- `INT_WINDOWS`（`INT_WINDOWS`、`INT_WINDOWS_2` 等） — 内饰车窗（不含挡风玻璃）的必选名称（可以是多个材质）
- `INT_WINDSHIELD` — 主挡风玻璃的必选名称，具有高分辨率雨滴/雨刮效果，只能是单个材质
- `MIRROR_0`、`MIRROR_1`、`MIRROR_2`、`MIRROR_D`（以及 `MIRROR`） — 后视镜材质

每个后视镜应有自己的材质 ID，但仅在 LOD 0 中。在 LOD 1-3 中，后视镜材质应使用名为 `MIRROR` 的单一材质：

![Mirror materials](/evo/car/image12.png)

当后视镜是 LCD 显示屏时，材质应命名为 `MIRROR_D`。

- `INT_DISPLAY`（`INT_DISPLAY_2`、`INT_DISPLAY_3` 等） — 数字显示屏的命名约定
- `EXT_RIM` — 静态轮毂的材质
- `EXT_RIM_BLUR` — 模糊轮毂 mesh 的 alpha 混合透视材质
- `EXT_RIM_BLUR_STATIC` — 模糊轮毂 mesh 的实体部分
- `EXT_RIM_DECAL`（可选） — 轮毂标志的材质
- `EXT_RIM_DECAL_BLUR`（可选） — 模糊轮毂标志的材质

作为一般指导原则，您可以选择两种材质设置方式：

1. 可以将不同材质合并到使用 splatmap 的单一材质中（利用车辆 shader 中的 4 个独特通道）以及颜色和 PBR 贴图，或者
2. 将每个具有不同属性的独特材质分离为新材质。游戏在运行时合并材质，因此大量的材质 ID 不会产生更大的内存占用 — 但是，依赖更多的纹理即使在材质 ID 数量优化的情况下，也可能产生更大的显存占用。因此，我们推荐**明确的材质分离并减少纹理数量**。

> 注意：与 AC1 不同，只有一个材质 ID 的对象现在可以拥有多/子对象材质分配，而不会回退到 ID1 — 这是由于当时使用的过时 FBX 库导致的问题，现在此问题已修复，从组材质进行材质分配没有（已知的）缺陷。

### UV AND VERTEX COLOURS（UV 与顶点颜色）

某些功能依赖于 UV 映射和顶点颜色的正确使用。

**后视镜 UV 映射：**

后视镜需要在 2 个 UV 通道上进行特定的 UV 映射。

- **通道 1** 应按照 AC1 的方式映射后视镜，反转展开，比例为 4:1。
- **通道 2** 应将两个侧后视镜以 2:1 的比例映射到贴图中心（反向朝向）。中央后视镜应以 4:1 的比例映射到中心。

**灯光 mesh 顶点颜色（用于定义前/后/左/右位置）：**

| 位置 | 颜色 |
|----------|--------|
| 前左 | Red |
| 前右 | Green |
| 后左 | Pink（R+G） |
| 后右 | Teal（B+G） |
| 前中 | Yellow（R+G） |
| 后中 | White（R+G+B） |

**刹车盘顶点颜色（用于定义前盘与后盘的发光）：**

| 位置 | 颜色 |
|----------|--------|
| 前 | Red |
| 后 | Green |

> 顶点颜色应在每个 LOD 阶段分配，LOD 4 除外（没有单独的刹车和灯光 mesh）。

### EXPORTING ANIMATIONS（导出动画）

所有车辆动画必须以 **0-20 帧** 导出，仅选择所涉及的骨骼结构。

可以导出堆叠动画（例如雨刮器附着在可打开的车门上时），在这种情况下，被堆叠的动画必须在上一级动画移除后导出 — 即在上面的雨刮器示例中，雨刮器动画应在包含车门层级但临时移除车门 dummy 上的动画后导出。

从 3DS Max 导出时，使用以下文件**导出设置**：

![3DS Max export settings](/evo/car/image63.png)

> 注意：常规骨骼 mesh 导出时可以禁用动画，但这应该没有区别，单一的导出设置预设应该适用于所有类型的 mesh。

## 3. TEXTURE REQUIREMENTS（纹理要求）

通常我们建议使用 **RGB8** 色彩模式的 **png** 格式。虽然支持带透明度的纹理，但我们建议使用不透明纹理和专用的透明度 alpha 纹理来处理依赖透明度的材质。

纹理的推荐命名约定为 `EXT_Skin_AO`、`INT_Mech_C` 等，即 `EXT`/`INT` 前缀加类型后缀。

**纹理后缀命名约定：**

| 后缀 | 说明 |
|--------|-------------|
| `AO` | 环境光遮蔽（ambient occlusion） |
| `AT` | 透明度 |
| `C` | 颜色/反照率（colour/albedo） |
| `D` | splatmap |
| `E` | 自发光（emissive） |
| `F` | 功能遮罩 |
| `R` | 粗糙度 PBR |
| `M` | 金属度 PBR |
| `CC` | 清漆层 PBR |
| `CR` | 清漆粗糙度 PBR |
| `S` | 磨损程度 |
| `AN` | 各向异性（anisotropy） |

在色阶方面，我们对颜色、AO、自发光使用 **sRGB** 色彩空间，对 PBR 和功能纹理使用 **线性（linear）** 色彩空间。

对于颜色，我们**建议避免极端值**：最深的黑色不应低于 sRGB `20/20/20`，颜色峰值对于非金属材质不应超过 sRGB `210`。对于金属材质，可以推高到 `230` 或略高，但不要再高。

> 建议为每个材质烘焙并包含 AO 纹理（或层级），包括玻璃、小贴花、网格 mesh，否则在阴影场景下会明显看起来不协调。

### FUNCTION TEXTURES（功能纹理）

![Function textures overview](/evo/car/image21.png)

#### Windows（车窗）

车窗湿润功能需要以下纹理和规则：

**`EXT_Windows_Wet`：**

| 通道 | 说明 |
|---------|-------------|
| R | 挡风玻璃区域（`255`）对比侧窗或后窗区域（`0`） |
| G | 雨水条纹类型 — 侧窗玻璃（`100`）、后窗玻璃（`150`）、挡风玻璃（`255`） |
| B | 雨滴遮罩 — 侧窗和后窗（`128`）、挡风玻璃（`0`） |

**`INT_Windows_Wet`：**

| 通道 | 说明 |
|---------|-------------|
| R | 雨滴 — 有（`255`）对比无（`0`） |
| G | 雨水条纹类型 — 后窗玻璃（`255`）对比侧窗玻璃（`0`） |
| B | 占位通道 |

**`INT_Windshield_Wet`：**

与 `INT_Windows_Wet` 相同。

**`INT_Windshield_Dirt`：**

| 通道 | 说明 |
|---------|-------------|
| R | 损伤区域 |
| G | 仪表台反射 |
| B | 静态污垢遮罩 — `0-255` 渐变 — 建议将雨刮区域设为近黑色，其余为白色 |

**`INT_Windshield_Refr`：**

灰度折射遮罩，内侧为黑色，边缘有渐变（参见上方示例）。

#### Lights（灯光）

灯光需要两个功能纹理：

**`EXT_Lights_F_1`：**

| 通道 | 前 | 后 |
|---------|-------|------|
| R | 日间行车灯 | 常规灯光 |
| G | 近光灯 | 刹车灯 |
| B | 远光灯 | 雾灯/雨天灯 |

**`EXT_Lights_F_2`：**

| 通道 | 说明 |
|---------|-------------|
| R | 转向灯（前和后） |
| G | 倒车灯（后） |
| B | 特殊功能（前和后） |

![Lights function texture](/evo/car/image73.png)

:::tip
对于具有交替转向灯/日间行车灯的现代前大灯，将 DRL 功能设置为特殊灯光（蓝色通道），当转向灯激活时可以在脚本中将其自发光值设为 0。
:::

功能可以通过组合通道来叠加，因此在 `F_1` 中红色和绿色（黄色）将同时作为后灯和刹车灯。这通常比通过脚本本身组合功能更简单。

#### LED

LED 功能贴图将每个 RGB 步进值 10 分配给脚本中的新功能 ID：

```text
RGB0   = ID1
RGB10  = ID2
RGB20  = ID3
...
RGB240 = ID25
RGB255 = ID26
```

![LED function map](/evo/car/image70.png)

## 4. EDITOR IMPORT（编辑器导入）

在开始导入流程之前，请确保准备好可以承载所有不同项的文件夹结构。使用 **New Asset -> Folder** 按钮。

以下是文件夹结构示例：

![Folder structure](/evo/car/image30.png)

要开始导入资产，我们将使用 Content Browser 的 **Import External Files** 按钮。

![Import External Files](/evo/car/image31.png)

### MESH IMPORT（网格导入）

在下拉菜单中选择 **Meshes**。

下面是骨骼 mesh 导入示例：

![Skeletal mesh import](/evo/car/image78.png)

1. 进入模组车辆文件夹中的 Meshes 文件夹
2. 选择 FBX 文件的路径
3. 勾选 **Import All Skeleton**
4. 取消勾选 **Ignore Existing Material Assignments**
5. 勾选 **Create Defaults for Missing Materials**
6. 指定模组车辆的 Materials 文件夹

对于**静态 mesh**（轮胎、轮毂、车轮、安全带和其他没有骨骼结构的 mesh），操作与上述相同，只是不需要勾选 **Import All Skeleton**。

![Static mesh import](/evo/car/image7.png)

网格编辑器允许您定义 LOD 规则，例如外壳的设置：

![Mesh editor LOD](/evo/car/image11.png)

我们的标准管线包含总共 **5 个 LOD 阶段**（由外壳驱动）：

| LOD | 说明 | LOD In 距离 |
|-----|-------------|-----------------|
| LOD 0 | 玩家和展示间车辆 | — |
| LOD 1 | 对手车辆 | 10 |
| LOD 2 | 逐步简化 | 20 |
| LOD 3 | 逐步简化 | 50 |
| LOD 4 | 简单 mesh，仅 1-2 个材质，只有 `CAR_BODY`，无功能或额外骨骼 | 100 |

> 确保为每个 LOD 阶段勾选 **Cast Shadows** 并设置 LOD In 距离。

内饰同样有 5 个 LOD 阶段，但分配方式不同：

| LOD | 说明 |
|-----|-------------|
| LOD 0 | 玩家和展示间车辆 |
| LOD 1 | 高 LOD 设置时的第一阶段 |
| LOD 2 | 低 LOD 设置时的第一阶段（对应 AC1 中的 `COCKPIT_LR`） |
| LOD 3 | 逐步简化，对应外壳 LOD 2 |
| LOD 4 | 逐步简化，对应外壳 LOD 3（外壳 LOD 4 时内饰会被剔除！） |

> 虽然不强制要求遵循此约定，但游戏是针对这些 LOD 阶段设计的，因此只有遵循这些规范才能保证 LOD 行为和性能的一致性。

内饰和其他 mesh 的设置略有不同：

![Interior LOD setup](/evo/car/image54.png)

**对于内饰、轮毂、模糊轮毂、轮胎和其他附加 mesh，请确保在 Cull in Merged Lods 中填入阶段 4。** 这意味着当切换到简化的外壳时，这些 mesh 将被移除。

内饰应使用以下 **Lod In** 设置：LOD 1 为 5、LOD 2 为 10、LOD 3 为 20、LOD 4 为 50。

轮胎和轮毂应有 2 个 LOD 阶段（0 和 1），LOD 1 的 LOD In 应设置为 20。

**LOD 4** 预览，所有其他 mesh（外壳除外）已被剔除：

![LOD 4 preview](/evo/car/image85.png)

在网格编辑器中工作时，可以使用 **Use Full Precision UV** 来预览高质量的 UV 空间。

![Full Precision UV](/evo/car/image50.png)

:::warning 注意
确保在所有 mesh 设置完毕并开始通过最终状态编辑器处理车辆时（见后文）**禁用**此设置。最终状态编辑器和游戏默认启用了高精度设置。
:::

### TEXTURE IMPORT（纹理导入）

使用 **Import External Files** 按钮，在下拉菜单中选择 **Textures**。

![Texture import](/evo/car/image107.png)

通常默认设置就足够了，除了 **Pixel Data Type** 字段，必须根据纹理类型进行选择：

| Pixel Data Type | 适用纹理 |
|----------------|---------------------|
| Srgb BC7 | 颜色、AO、splatmap（细节遮罩）、功能遮罩、自发光遮罩、任何应使用 sRGB 色彩空间的纹理 |
| Linear Colour | 任何应使用线性色彩空间的颜色纹理（以 RGB16 模式导出时 — 不推荐） |
| Linear Greyscale | 灰度纹理，如 PBR — 粗糙度、金属度、清漆层、清漆粗糙度、透明度 |

当纹理不会因更激进的压缩而出现明显质量下降时，可以选择使用 **BC1** 模式（非常适合对比度清晰且无渐变的 splatmap 和遮罩）。

> 确保始终勾选 **Compress** 复选框，并确保 **MipMap Generation** 始终启用。

对于某些纹理，可以限制生成的 mip 数量（默认为 16），例如 splatmap，其区域分离即使在远处也很重要。在这种情况下，建议限制不超过 2 或 3 个 mip 级别。

> 注意：纹理导入后，更改任何属性都需要使用 **Import** 按钮重新导入纹理！（与 Unreal 等引擎不同，后者中纹理元数据可以独立于纹理本身进行编辑）。

### SHADER TYPES（着色器类型）

设置车辆需要以下 shader 类型：

| Shader | 用途 |
|--------|-------|
| `UberVehicle` | 所有外壳材质 — 使用外部 probe capture |
| `UberVehicleInterior` | 所有内饰材质 — 使用内部 probe capture |
| `VehicleDisc` | 刹车盘 |
| `VehicleLed` | 自发光 LED 功能 |
| `VehicleLight` | 实体灯光 |
| `VehicleGlass` | 外壳车窗和灯光玻璃 |
| `VehicleWindow` | 内饰侧窗和后窗 |
| `VehicleWindshield` | 带雨刮效果的主挡风玻璃 |

### MATERIAL EDITOR（材质编辑器）

在下拉菜单中选择正确的材质类型。

**混合模式（Blend Mode）：**

| 模式 | 说明 |
|------|-------------|
| Opaque | 完全不透明，忽略透明度纹理 |
| AlphaToCoverage (A2C) | 用于具有二值透明度信息的材质 |
| AlphaBlend | 用于玻璃材质 |

> AlphaTest 和其他混合模式通常不用于车辆材质。

基础（Base）部分包含基本属性和资源复选框。纹理分配只有在基础或专用通道中同时启用时才会生效。

红/绿/蓝是 **splatmap 通道**，它们允许您在单个通道中设置总共 4 种材质属性，RGB 部分各自拥有独立的细节贴图。此外，**Scuff** 部分允许您为材质添加永久磨损效果。

splatmap 通道可以以**两种不同方式**使用：

- **使用 splatmap 纹理定义独立区域** — 您可以分离 4 种不同的材质属性，例如车漆、塑料、金属。`EXT_SKIN` 材质的典型用例。
- **使用堆叠或混合的 splatmap 值** — 您可以为需要更多层次的材质堆叠材质属性，例如皮革，其基础是基础 PBR，一个通道是皮革细节，另一个通道是褶皱细节，还有一个通道是裂纹细节。布料和皮革材质或希望使用更精细磨损效果的实体材质的典型用例。

![Splatmap channels](/evo/car/image47.png)

每个通道可以**乘法（Multiply）** 或**替换（Replace）** 基础的材质属性。**组合（Combine）** 功能可用于叠加法线贴图或在通道的粗糙度纹理应与基础粗糙度值（或纹理）混合时，进行粗糙度行为的特定调制。

**调制（Modulation）** 部分允许对多种材质属性进行另一种类型的调制混合。

**磨损（Scuff）** 效果可以为每个 splatmap 通道使用专用值，并且可以使用特定的磨损强度纹理来定义 UV 贴图中哪些区域应该接收磨损效果。

通常，`UberVehicleMaterial` 的布局由其他功能性车辆 shader 共享：

- `UberVehicleInterior` 与之相同，区别仅在于 probe capture 引用。
- `VehicleDisc` 包含模糊状态的专用插槽。
- `VehicleLED` 包含 26 个 LED 功能 ID 的自发光通道。
- `VehicleLight` 和 `VehicleGlass` 包含特定的功能自发光纹理插槽。
- `VehicleWindow` 和 `VehicleWindshield` 专门用于不同的车窗/挡风玻璃。
- `VehicleRim` shader 包含用于静态和模糊状态之间淡化的面和 gamma 属性，需要使用特定的标志（flags）。轮毂需要使用 3 个独立的 shader。

**有关这些特殊材质的正确设置，请参阅示例模组。** 特别注意 **General** 部分、独特复选框和 **Flags** 部分。

材质可以通过顶部的 **Copy** 和 **Paste** 按钮简单地互相复制：

![Copy paste materials](/evo/car/image36.png)

经常需要为车辆的不同自定义部分复制材质，在这种情况下建议使用**材质覆盖（material override）**：

![Material override](/evo/car/image57.png)

:::warning
确保不要在不同项目之间使用材质覆盖！否则交叉引用会导致一辆车在另一辆车不存在时无法工作。
:::

建立父子关系后，子材质仍可以通过将更改的属性标记为**唯一（unique）** 来进行编辑。

这在例如您有不同的皮革材质仅有颜色变化时很有用，因此您有一个 PBR 参考材质，而颜色部分为不同材质标记为 unique：

![Unique material property](/evo/car/image42.png)

## 5. CAR ACTOR（车辆 Actor）

所有车辆信息（不含物理数据）的主要容器是 **Car Actor**。本指南将按照重要性顺序（必选部分在前）逐一介绍各个部分，某些部分将在其自己的章节中详细讨论 — 例如摄像机，特别是自定义系统。

使用 **New Asset -> Actor** 按钮在项目根文件夹中为您的模组创建它。使用小写字母。

![Car Actor creation](/evo/car/image24.png)

### MESHES（网格）

首先，我们必须分配**必选的基础 mesh**。这些不需要定义 Attachment Bone，因为它们已经被硬编码：

- Exterior（外壳）
- Interior（内饰）
- Tyres（轮胎）
- Rims（轮毂）
- Blurred rims（模糊轮毂）

通常**可选 mesh** 包括：

- Steering wheel（方向盘）
- Seatbelt or Harness（安全带或安全带系统）
- Safety net（安全网）
- Registration plates（车牌）
- Steering cable（转向拉线）
- Racing devices（赛车设备）

> 注意：基础 Meshes 部分下方的 Driver 插槽和 Tyre Texture 插槽已**废弃**。

![Base meshes](/evo/car/image102.png)

### LIGHTS EMITTERS（灯光发射器）

灯光发射器定义用于车辆上基于物理的灯光：

![Lights emitters](/evo/car/image4.png)

每个光源可以分配其功能，并可以覆盖硬编码的默认颜色（白色和红色）。**通常使用 6 个发射器**（参见上方示例数组）。**滥用发射器数量可能会严重影响性能。**

当车辆组装到足以在最终状态编辑器中显示时，可以通过勾选 Enable Debug 选项在场景预览 **Scene/Car debug** 中预览灯光位置。当灯光通过仪表系统实际激活时，调试锥体将会显示。

![Light debug](/evo/car/image87.png)

### FUNCTION SCRIPTS（功能脚本）

功能脚本可以在以下部分中分配：

![Function scripts](/evo/car/image72.png)

只分配相关的脚本。请参阅示例模组获取更多信息。

### PREVIEW TOOLS（预览工具）

此部分允许您设置车辆的展示间姿态（仅在展示间使用，游戏中忽略）。Customization 和 Runtime 部分与此无关，所有这些功能稍后可以通过最终状态编辑器访问。

![Preview tools](/evo/car/image97.png)

在此示例中，模型保持在 FBX 位置，前后轮分别添加了 -2 和 -1.5 度的外倾角用于展示间。游戏中使用实时外倾角数值。

### MIRRORS（后视镜）

后视镜部分允许您为每种模式设置后视镜：

![Mirrors setup](/evo/car/image43.png)

数组应仅包含车辆实际拥有的后视镜，因此如果只有 2 个或更少，只需指定相关的即可：

| 后视镜 | 说明 |
|--------|-------------|
| Mirror 1 | 中央 |
| Mirror 2 | 左侧 |
| Mirror 3 | 右侧 |

后置摄像机设置同时用于显示摄像机和**虚拟后视镜（Virtual Mirror）** 捕获！即使车辆没有物理后视镜，也必须为虚拟后视镜进行设置。

VR 前缀的偏移/偏航/俯仰设置专门用于 Multi/VR 模式。

:::tip
仅在已经设置好默认驾驶摄像机之后再设置 VR 前缀的项目，因为之后更改默认视角也会偏移 VR 后视镜画面。
:::

### LIGHTS AND LEDS（灯光与 LED）

材质名称数组指定哪些材质应受灯光和 LED 功能影响。在此列出所有涉及的材质。

Batch Names 下方的 Leds 部分已**废弃**。

![Lights and LEDs](/evo/car/image115.png)

注意，功能枚举在所有材质中保持一致，这意味着 `ID1` 在 `INT_DECALS` 和 `INT_LED` 中将具有相同的功能。

### SHADER SETTINGS（着色器设置）

这些用于定义某些 shader 效果：

![Shader settings](/evo/car/image25.png)

| 设置 | 说明 |
|---------|-------------|
| Tyre global AO | 轮胎上的额外 AO 遮罩。值越大 = 阴影越多，值越小 = 阴影越少。开轮式赛车使用 `0`，封闭轮舱（如 GT 赛车）使用 `0.8` |
| Tyre Colour and PBR override | 允许为车辆设置独特的基础轮胎 shader 值。所有值保持 `0` 将保留官方内容的设置 |
| Tyre Maximum Sheen | 新轮胎（展示间和刚生成时）上的光泽铬金属光泽量，短距离驾驶后会消退。推荐值：现代 F1 为 `0.5`，公路轮胎为 `0` |
| Rim Velocity values | 从提供的基础值开始，设置静态和模糊轮毂 mesh/材质之间的过渡 |
| Mechanics Glow Batches | 具有自发光纹理的材质，应受排气温度引起的发光影响 |
| Mechanics Glow Intensity | 最高参考温度下的最大自发光值倍数 |
| Driving side | `LHS`、`RHS` 或 `Centre` — 定义开场序列中打开哪扇门 |

### CAR ANIMATIONS（车辆动画）

可以为预定义功能定义动画，也可以添加无限数量的可选动画，用于外观目的或某些物理属性，例如主动空气动力学。以下示例展示了常用的播放类型（循环、顺序简单、脉冲和反向）及其典型分配位置。

![Car animations](/evo/car/image39.png)

有关**驾驶员动画**的信息，请参阅相应文档。

**顺序 LUT（查找表）动画：**

这是一个具有多阶段的可选动画（Sequential LUT）示例。通过这些，您可以使用查找表定义动画要经过的帧步骤：

![Sequential LUT animation](/evo/car/image74.png)

在上面的示例中，动画与纵向 G 力关联，在急加速和急减速时都会打开。除此之外，您还可以分配其他控制器，通过勾选 **Use Greatest Value**，动画将根据最高的瞬时输入值播放。

另一个 **DRS 驱动动画**示例：

![DRS animation](/evo/car/image2.png)

另一个**设置驱动动画**示例（当设置中的尾翼角度在车辆上可视化时）：

![Setup-driven animation](/evo/car/image84.png)

要**导入车辆动画**，必须选择 **New Asset -> Animation**。在模组车辆文件夹的专用 Animations 文件夹中执行此操作。

![Import animation](/evo/car/image51.png)

在导入设置中选择路径，然后按 Import。Take 将自动填充包含的骨骼：

![Animation take](/evo/car/image83.png)

### BODY SHADOW DECAL（车身阴影贴花）

这些属性允许您定义模拟车身阴影的大小和强度。

![Body shadow decal](/evo/car/image71.png)

从上述值开始并根据需要调整，确保贴花移到地面高度（**Position Z**）。

纹理应该类似于这样：

![Body shadow texture](/evo/car/image22.png)

建议至少将轮毂（不含轮胎）烘焙到阴影中以获得最佳效果。

> **轮胎有自己的阴影贴花，在 Tyreesh 文件中定义**，不通过 Actor 定义。前后轮胎阴影部分**可以在此忽略**。

贴花本身可以通过在最终状态编辑器激活时的 **Preview Options -> Scene -> Helper** 部分使用 **Decal visualization debug** 来预览。

![Shadow decal debug](/evo/car/image14.png)

### PARTICLE EMITTERS（粒子发射器）

这些包括车辆和轮胎的水花、灰尘和烟雾效果，以及排气回火：

![Particle emitters](/evo/car/image112.png)

**必选的是 `CAR`、`LF`、`RF`、`LR` 和 `RR`**。

发射器包对模组是硬编码的，与官方内容保持一致。

**排气管发射器（可选）：**

| 类型 | 说明 |
|------|-------------|
| Type 1 | 仅蓝色火焰（公路车） |
| Type 2 | 主要蓝色火焰，偶尔小火焰（赛车和超级跑车） |
| Type 3 | 混合火焰，偶尔大火焰（超级跑车或具有特征性火焰的改装车） |

对于 CAR 和 WHEEL 发射器，使用上方示例中显示的推荐变换。

### NUMBER DECALS（号码贴花）

此功能允许您分配具有特定背景纹理和字体的动态车牌。

![Number decals](/evo/car/image26.png)

**Number Decal Types** 部分定义布局 — 贴花的视觉外观，而 **Number Decal Positions** 部分定义贴花在车辆上的位置。您可以添加无限数量的贴花并分配不同的 ID 集，然后可以按视觉预设进行分配（参见后面的**自定义系统**部分）。

### CAMERAS（摄像机）

摄像机包括以下内容：

- **驾驶摄像机（Drivable cameras）**（通过 F1 键切换）
- **车载摄像机（Onboard cameras）**（通过 F6 键切换）
- **展示间摄像机（Showroom cameras）**（菜单中的可平移和内部展示间摄像机）

#### Drivable Cameras（驾驶摄像机）

![Drivable cameras](/evo/car/image55.png)

驾驶摄像机共包括 6 个摄像机：

| 摄像机 | 模式类型 |
|--------|-----------|
| Cockpit | Camera Cockpit |
| Dash | Camera Dash（强制隐藏驾驶员模型和方向盘） |
| Bonnet | Camera Fixed |
| Bumper | Camera Fixed |
| Near Chase | Camera External |
| Far Chase | Camera External |

> 正确的设置对于摄像机激活时使用**正确的声音混合**是必要的。

#### Onboard Cameras（车载摄像机）

![Onboard cameras](/evo/car/image79.png)

这些摄像机可以在 Cameras 部分中添加。**Camera Reference Name** 可以选择性地为摄像机指定一个友好名称以便将来参考。这些摄像机的默认 FOV 是硬编码的，不从 actor 中读取。

基础属性下的 **Fixed** 设置可移除摄像机的额外 G 力效果。这可以为每个摄像机实例设置，以及设置独特的 FOV 值。

![Camera settings](/evo/car/image53.png)

这些摄像机应设置 **Camera None** 模式类型。

#### Showroom Camera（展示间摄像机）

这些设置涉及平移摄像机和内部摄像机的行为。

从这些设置开始，根据模组车辆的尺寸和座椅位置进行调整：

![Showroom camera](/evo/car/image9.png)

### DASH DISPLAY（仪表盘显示）

仪表盘显示定义必须包含图像渲染所用的材质名称和所用纹理的分辨率：

![Dash display](/evo/car/image35.png)

在此示例中，车辆有 2 个独立的显示屏，一个为 2:1 宽高比，另一个为 1:1。

仪表盘显示的脚本以 HTML 格式存储，并引用模组车辆 `\display\` 文件夹中的图像。

**Dash-In-Hud** 设置定义数字显示屏是否应在启用的 HUD 显示组件中显示：

![Dash-In-Hud](/evo/car/image59.png)

| 值 | 说明 |
|-------|-------------|
| `-1` | 不显示任何显示屏（因为没有或者显示屏是数字时钟等） |
| `0` | 显示主显示屏 |
| `1` | 显示第二块显示屏 |
| `2` | 显示第三块显示屏 |

### DAMAGE AND MOVING PARTS（损坏和运动部件）

![Damage and moving parts](/evo/car/image105.png)

**损坏部件（Damage parts）** 是响应碰撞并在预定义方向和程度上移动或旋转的骨骼。

上面的示例是前保险杠，属于 **FRONT** 区域（损坏区域），在受损时响应基于速度的振荡，碰撞时沿 Z 轴旋转和移动，并在受损时响应 G 力。

**运动部件（Moving parts）** 是响应 G 力或速度而产生移动或振荡的骨骼，通常是安全网，但也可以应用于车辆本身的某些元素（如尾翼、天线等）。

尾翼示例：

![Rear wing moving part](/evo/car/image94.png)

安全网示例：

![Safety net moving part](/evo/car/image67.png)

## 6. CUSTOMIZATION（自定义系统）

与 AC1 不同，车辆不仅仅是其 mesh 的简单集合。自定义定义用于建立车辆的默认"最终状态"。这意味着应用在 mesh 上的材质和颜色不一定是最终可见的，因为通过自定义系统，预设颜色将被应用到包含在自定义中的材质上。

车辆正常工作所需的最少自定义配置包括：

![Customization overview](/evo/car/image46.png)

![Customization hierarchy](/evo/car/image29.png)

- **1 个 compatiblerim** — 与车辆配对的轮毂组，最少需要 1 个 — 引用 rimmesh 文件和对应的 tyremesh 文件
- **1 个 mechanical preset** — 机械定义，最少需要 1 个 — 引用默认 compatiblerim 文件和视觉预设
- **1 个 visual preset** — 可自定义材质的外观定义状态，最少需要 1 个，引用 cardesign 文件、默认 rimdesign 文件和号码贴花集（可选）
- **1 个 cardesign 文件** — 引用 design 文件和该设计允许使用的 compatiblerim 文件
- **1 个 design 文件** — 自定义规则（包含在自定义中的材质列表及其规则）
- **1 个 rimmesh 文件** — 包含一对轮毂 mesh 和所有轮毂设计文件的文件
- **1 个 rimdesign 文件** — 包含轮毂自定义规则的文件

> 注意，只需要这些文件存在即可，如果不需要对车辆进行自定义，设计文件可以留空。但是，在设计文件中定义了多个颜色选项的每个材质，必须在视觉预设中有默认颜色定义 — 车身和轮毂都是如此！

### VISUAL PRESET（视觉预设）

![Visual preset](/evo/car/image64.png)

在此示例中，车辆有 3 个可自定义材质，2 个通过 design 文件（Skin 和 Caliper），1 个通过 rimdesign 文件（Rim）。在视觉预设中，每个材质都从可用颜色数组中定义了默认颜色，这定义了车辆的默认最终状态（例如哑光灰色车身）。

注意 cardesign 路径引用和 rimdesign 定义。

注意 **isCustomizable** 标志 — 取消勾选时，车辆将被锁定为其默认状态 — 但上述文件对于定义该默认状态仍然是必需的！

### MECHANICAL PRESET（机械预设）

![Mechanical preset](/evo/car/image114.png)

机械预设必须包含兼容的视觉预设列表和默认兼容轮毂（不是数组）。

它还包含在 UI 中显示的数字 **Car Specs** — 这些可以按机械变体定义。

机械预设的意义在于能够通过部件定义创建车辆的不同变体：

- **Compatible Part Paths** — 已安装（但可移除）的部件列表
- **Not Compatible Parts Paths** — 此预设上不可安装的部件列表
- **Forced Compatible Part Paths** — 强制（不可移除）的部件列表
- **Not Compatible Rim Paths** — 选择此预设时不允许的轮毂列表

驾驶员模型类型可以在此定义，决定是使用街道驾驶员模型还是赛车驾驶员模型。

### COMPATIBLERIM（兼容轮毂）

CompatibleRim 文件定义了一组分配给车辆的前后两对轮毂和轮胎。

此外，当整体车轮尺寸与默认不同时，它可以定义一个**增量展示间姿态修正器**，以便在安装时需要修改展示间位置。

这里也是可以为车轮添加**安装偏移**的地方，同时影响展示间和游戏内。

![CompatibleRim](/evo/car/image19.png)

**CompatibleTyre** 文件引用包含这组车轮允许的轮胎配方：

![CompatibleTyre](/evo/car/image62.png)

这里将 3 种视觉配方与物理轮胎文件匹配。注意任何物理轮胎都可以与任何视觉配方匹配 — 但通常建议确保视觉效果代表已安装的轮胎类型。

### CARDESIGN（车辆设计）

CarDesign 文件是一个容器，用于将特定设计文件与允许配对的可用轮毂进行匹配。

它可以包含 1 个设计文件和任意数量的 compatiblerim 文件：

![CarDesign](/evo/car/image3.png)

在此示例中，仅定义了一套车轮。

### DESIGN（设计文件）

设计文件是可能性几乎无限的地方。

在这里，您可以定义车辆的哪些材质将参与自定义，可以通过可选颜色、从其他材质继承自定义颜色，或作为可选选项。

在此示例中，您可以看到 `EXT_SKIN` 材质的主通道（R）如何同时允许 OEM 颜色自定义和包含 PBR 值的自由选择器：

![Design EXT_SKIN](/evo/car/image33.png)

这里可以看到驾驶舱车漆材质如何设置为**继承** SKIN 材质的所有设置，包括颜色、所有 PBR 属性和金属片强度（法线强度）：

![Design inheritance](/evo/car/image91.png)

当仅选择 OEM 时，自由选择器在游戏中不可用。您还可以限制哪些材质属性参与选择器自定义和继承，例如当继承材质应始终保持哑光而仅继承颜色时，可以取消勾选会继承光泽度的属性，仅勾选颜色。

除了颜色更改外，材质定义还可以包含（也可以组合）**可选项（Optional items）**。在这种情况下，材质变为可切换的。注意它仍然可以额外拥有颜色自定义。

**Key** 下拉菜单允许您将多个可选项分组为一起切换。单个设计最多可以使用 10 个组（A 到 G）：

![Design optional items](/evo/car/image15.png)

**isHidden** 选项将材质从 UI 显示中隐藏，因此一个组在游戏中可以作为单一选项出现。

**Group** 条目是可选且任意的，它允许您定义不同的自定义选项供 UI 子分类，以减少混乱。

UI 将按照以下顺序显示车身和轮毂材质的条目：

```text
Exterior/Interior -> (Group) -> Item
Rim -> Item
```

轮毂的设计文件基于相同的设计逻辑（颜色对比继承和选项）：

![Rim design](/evo/car/image111.png)

### RIMMESH（轮毂网格）

RimMesh 文件用于将轮毂 mesh 与其元数据和轮胎兼容性进行匹配。它们包含一对轮毂 mesh（静态和模糊）用于一对轮毂，这里也可以列出可用的设计文件。

![RimMesh](/evo/car/image18.png)

:::warning
如果车辆前后轮尺寸不同，将需要**两个独立的 rimmesh 文件**！在这种情况下，CompatibleRim 文件必须引用正确的前后配对。
:::

**CompatibleTyre** 字段允许您为该轮毂匹配所有兼容的轮胎尺寸。它可以包含多个条目。

**但在 CompatibleRim 文件中，每个轮毂只能定义一个轮胎尺寸。**

如果要将同一轮毂与多种轮胎尺寸配对到同一辆车，必须为每种组合创建一个 CompatibleRim 文件！这种情况很少见，我们（至今）从未实际遇到过这种场景。

### TYREMESH（轮胎网格）

TyreMesh 文件将轮胎 mesh 与其元数据配对，以便在 RimMesh 和 CompatibleRim 文件中引用。

![TyreMesh](/evo/car/image100.png)

它定义了标称尺寸以及轮胎阴影贴花的缩放和位置。

轮胎阴影贴花的正确位置：

| 属性 | 说明 |
|----------|-------------|
| Scale X | 取决于 mesh 的宽度（经验法则：接触面宽度 × 1.5 / 1000） |
| Scale Z | 阴影长度 = 轮胎的总直径 |
| Position Y | 贴花应从轮毂水平放置多远 = 轮胎半径 |

使用 [Tyre Size Calculator](https://tiresize.com/tyre-size-calculator/) 等网站来计算正确的值。

## 7. PARTS（部件系统）

部件自定义允许您添加或替换车辆上的部件，可以带有外观或物理影响。

部件管线涉及以下文件引用序列：

```text
Mesh file -> CarPart -> CompatiblePart
Data file -> TuningPart -> CarPart -> CompatiblePart
```

> 注意：单个 CarPart 可以包含多个 TuningPart 文件，但只能包含一个 mesh。

### TUNINGPART（调校部件）

TuningPart 文件是一个容器，为数据文件分配类型，使其可以在 CarPart 文件中被分配。

![TuningPart](/evo/car/image38.png)

仅当部件具有物理属性时才需要 TuningPart 文件。外观 mesh 不需要此文件。

有关物理数据文件的更多信息，请参阅相关文档。

### COMPATIBLEPART（兼容部件）

这是一个将部件与其车辆特定安装数据配对的容器。注意一个部件可以安装在多辆车上，但每次安装都需要自己的 CompatiblePart 文件！

此文件还可以定义**增量姿态数据**，当部件改变展示间外观时使用（例如降低悬挂、增加外倾角等）。

CompatiblePart 文件包含**附加规则**，部件应该是**添加式（Additive）** 还是**替换式（Replacement）**，以及它应该附加到或替换的骨骼。当设置为 Replacement 时，部件将替换指定骨骼下的整个层级结构。

![CompatiblePart](/evo/car/image48.png)

**Showroom Data** 部分允许对车辆的展示间姿态应用增量变换（例如当悬挂部件改变外倾角或离地间隙时）。这些值是在车辆 Actor 中定义的 Showroom Data 的叠加。

**Animation overrides** 允许在部件安装时定义额外或替换的动画，例如当方向盘与默认方向盘具有不同直径或位置，需要自己的一组驾驶员动画时。

**Driver Animation Override** 允许您按照与车辆 Actor 相同的方式设置覆盖动画。

### CARPART（车辆部件）

CarPart 文件是部件自定义的关键组件，它们可以包含图形、物理和组合元素及其元数据，以及对车辆现有脚本的添加或修改（显示、LED、排气发射器等）。

包含 mesh、音频文件和物理文件的发动机部件示例：

![CarPart engine](/evo/car/image58.png)

包含修改后排气发射器位置的排气部件示例：

![CarPart exhaust](/evo/car/image108.png)

### KITS（套件）

套件可用于将多个文件分组为单一实体。当部件在套件中定义时，它们会一起切换，且在游戏内部件选择中仅显示为单一项（而不是逐个列出）。

套件在 CarPart 级别操作，这意味着它需要将 CarParts 列在内部的数组中。

:::warning 注意
套件不能替代为每个 CarPart 创建 CompatiblePart 文件的需要！
:::

![Kit example](/evo/car/image5.png)

当您不希望用大量本应一起选择的部件使部件列表杂乱时，套件非常有用。

**车辆 Actor 中自定义和部件文件的分配。** **OEM** 和 **Aftermarket** 部分可用于 UI 中的区分：

![Parts assignment](/evo/car/image98.png)

### PARTS COMPATIBILITY（部件兼容性）

机械预设可以**规定某个部件**：

- **默认安装**
- **默认强制安装**（不可移除）
- **与该预设不兼容**，无法安装

![Parts compatibility](/evo/car/image32.png)

在此 ZL1 的 1LE 变体示例中，油箱盖已安装但可通过自定义移除，1LE 专用部件为强制安装且不可移除。

![1LE variant](/evo/car/image81.png)

在此基础 ZL1 示例中，1LE 部件不可安装，车辆保持默认配置（默认不安装额外部件）。

部件之间以及部件与轮毂之间的不兼容性可以通过 Parts 文件设置：

![Part incompatibility](/evo/car/image86.png)

在上面的示例中，GT Apex Sport Mudguard 与另一个 Mudguard 部件和特定轮毂有不兼容规格。

## 8. INSTRUMENTATION（仪表系统）

由于可能的组合和设置方案极其繁多，本指南不会过多涉及脚本的细节。建议学习和尝试示例模组中包含的脚本。

### LIGHTS（灯光脚本）

灯光脚本的 **Main Lights** 部分定义了 3 个主要阶段（点火阶段、近光灯阶段和远光灯阶段）。阶段数量是硬编码的，无法更改。

![Lights script](/evo/car/image69.png)

仅在此处包含随不同阶段变化的功能。尽量减少重复以避免混淆和不匹配的值。

使用 **Shared Main Lights** 部分定义在不同阶段间共享的功能：

![Shared Main Lights](/evo/car/image49.png)

**Pit Limiter** 部分应该一目了然。

**Blinker** 脚本可以设置为在不同的闪烁功能中引用（如转向灯、闪光灯或维修区限速灯）。

**Intensity Filter** 部分允许您设置灯光启动速度的延迟。老式灯光应使用较低的值，而 `0` 为瞬时响应。

![Intensity filter](/evo/car/image16.png)

缩放主灯光阶段时，确保远光灯发射器值为 `1.0` 并向下缩放。

:::danger 注意
滥用发射器强度可能会导致**严重的性能问题**！
:::

**推荐的发射器强度：**

| 灯光阶段 | 发射器强度 |
|-------------|------------------|
| 日间行车灯 | `0.03` |
| 近光灯 | `0.3` |
| 远光灯 | `1.0` |

**推荐的自发光值（透明玻璃或无玻璃）：**

| 灯光阶段 | 自发光值 |
|-------------|---------------|
| 日间行车灯 | `1.0` |
| 近光灯 | `8.0` |
| 远光灯 | `20.0` |

> 经验法则要求使用折射玻璃时将这些值**乘以四**。确保不要过度设置玻璃自发光，以免看不到后面的光源。根据需要混合两种效果。

您可以使用**亮度调试视图（luminance debug view）** 来帮助可视化此效果。

### LEDS（LED 脚本）

LED 脚本允许 LED 随灯光阶段和特定功能切换。LED 枚举对应于功能遮罩渐变值（在上面的纹理部分中已解释）。

![LEDs script](/evo/car/image90.png)

您可以使用自发光纹理来设置颜色，这种情况下脚本应乘以白色，或使用灰度自发光并通过脚本更改颜色。例如，赛车 LED 建议使用后者，而仪表盘上的警告符号建议使用前者。

与灯光类似，LED 也可以进行过滤以实现更渐进的亮起效果。

![LED filtering](/evo/car/image75.png)

**推荐的 LED 值：**

| 类型 | 值 |
|------|-------|
| 赛车 LED | `1.0` |
| 警告符号 | `0.3` |
| 现代 LED 背光 | `0.1` |
| 经典仪表盘背光 | `0.05` |

### ANALOGUE（模拟仪表）

模拟仪表脚本将功能分配给查找表，定义附加骨骼和指针旋转的轴原点（如果 FBX 设置正确，通常为 Z 轴）。

![Analogue instruments](/evo/car/image95.png)

可以根据需要添加过滤（用于更有质感的运动）和振荡：

![Analogue filtering](/evo/car/image109.png)

`10.0` 是获得有质感手感的良好起始值。

### EXHAUST BACKFIRE（排气回火）

排气回火脚本包括音频回火逻辑以及视觉粒子。

视觉概率是音频概率之上的额外乘数。使用相对较低的值，因为触发器可能经常快速连续重复。

总共可以设置 5 种回火场景，每种都有自己的概率和粒子发射器（参见粒子发射器部分）。

![Exhaust backfire](/evo/car/image13.png)

### WIPER（雨刮器脚本）

雨刮器脚本是一个简单的脚本，允许您设置不同的雨刮阶段和时序，以及动态效果，如振动和 G 力引起的变换。

官方内容使用共享脚本，如下所示：

![Wiper script](/evo/car/image27.png)

> 注意，指定较少的阶段可能会导致自动雨刮辅助功能行为不正确。

此脚本还包括雨刮器的**振荡（oscillation）** 和 **G 力（g-force）** 逻辑。

两个条目的 **Max Amplitude** 秒数指的是动画循环。使用非常低的值（如果有的话）。

**Min** 和 **Max G Force** 值设置 G 力影响开始生效的窗口范围。

## 9. FINALSTATE EDITOR（最终状态编辑器）

最终状态编辑器的主要目的是允许您预览车辆的最终装配，包括所有功能及其自定义逻辑，无需在编辑器和游戏之间来回切换。

与 AC1 中编辑器纯粹用于材质编辑不同，这里几乎所有功能都可以通过最终状态编辑器查看和调试。

此外，车辆的某些元素只能通过最终状态编辑器生成。我们将首先从这些开始介绍，然后再转向专注于预览/调试而非创建的部分。

要使车辆出现在最终状态编辑器中，必须导入所有 mesh、分配材质并选择正确的 shader 类型用于功能 shader、设置最小的自定义层级结构（参见上方自定义系统部分），并在模组车辆数据文件中填写名称、actor 和文件夹路径。

要访问编辑器，转到 **Tools -> Gameplay -> Car Finalstate Editor**。

### BAKING（烘焙）

转到 **Baking** 标签页并按 Bake Current Car。这将生成世界空间法线贴图，这是**挡风玻璃雨刮效果**在世界空间中正确工作所必需的：

![Baking](/evo/car/image106.png)

生成的纹理将如下所示，并在生成后自动保存。

![Baked textures](/evo/car/image99.png)

### GENERATE（生成）

另一个用于实际创建资产的标签页是 **Generate** 部分。

![Generate](/evo/car/image41.png)

这允许创建每种机械和视觉预设组合的 UI 缩略图以及 UI 选择的最终状态定义。

按钮之间的区别应该一目了然。

保持 **Compress Texture** 启用！

### BODYWORK（车身）

**Bodywork** 标签页显示外壳和内饰的自定义选项。您可以在机械预设之间选择，对应的视觉预设，然后是每个可自定义材质。

当材质具有可自定义的颜色选择时，颜色也会列在那里：

![Bodywork tab](/evo/car/image10.png)

这是测试和调试自定义脚本以及面向用户的预设及其配置的主要位置。

### RIMS（轮毂）

**Rims** 部分显示轮毂专用的自定义，因为轮毂在车辆自定义系统中构成独立实体，与车身自定义并行。

第一个列表包含可用轮毂，然后是每个轮毂的可用设计变体，然后是该设计中可自定义的材质：

![Rims tab](/evo/car/image52.png)

上方示例显示了 4 种不同的轮毂和所选轮毂的 2 种设计选项及颜色选择。

### COMPOUNDS（轮胎配方）

**Compounds** 标签页显示可用的轮胎配方图形。

![Compounds tab](/evo/car/image104.png)

### PARTS（部件）

**Parts** 标签页显示所选机械预设的可用部件及其状态和规则。

![Parts tab](/evo/car/image6.png)

粉色框表示套件（其中的项目一起切换），灰色框表示当前选择下对应部件不可用 — 在此示例中，安装了 Dual 前大灯时 Quad 前大灯不可用。移除 Dual 前大灯将使 Quad 前大灯变为可选。

### SCENE（场景）

**Scene** 标签页允许在场景中旋转车辆模型，以及加载背景 mesh。

### RUNTIME（运行时）

**Runtime** 标签页是调试车辆功能的主要位置。它是预览车窗和挡风玻璃功能、损坏和污垢功能、车轮功能、驾驶员和车辆动画以及雨天效果的工具。

数字显示、灯光和 LED 是 shader 级别的调试工具 — 当设置好仪表脚本后，其功能应通过仪表标签页检查（见后文）。

由于数字显示使用外部库，其通过 HTML 脚本的功能只能在游戏内检查。

注意，当设置了适当的脚本后，某些动画在 Runtime 调试中也将无法正常工作，例如雨刮器动画。

**细节级别（Level of Detail）** 部分允许您结合车辆功能调试每个 LOD 阶段，以便您可以看到动画和脚本在较低 LOD 上也能正常工作。

![Runtime LOD](/evo/car/image110.png)

**粒子发射器（Particle Emitters）** 部分允许您无需启动游戏即可查看粒子效果。

### INSTRUMENTATION（仪表调试）

**Instrumentation** 标签页是在功能上下文中预览车辆功能的主要位置。

![Instrumentation tab](/evo/car/image89.png)

在这里可以应用车辆点火和启动阶段、不同的灯光阶段以及各种物理属性和电子级别来预览灯光、LED 和模拟仪表。

![Instrumentation controls](/evo/car/image103.png)

![Instrumentation preview](/evo/car/image93.png)

**Time of Day** 部分允许您预览模拟时钟的功能：

![Time of Day](/evo/car/image34.png)

### DRIVABLE/ONBOARD CAMERAS（驾驶/车载摄像机）

**驾驶摄像机（Drivable Cameras）** 部分允许您通过最终状态编辑器预览和编辑驾驶（F1）摄像机并保存 actor：

![Drivable cameras in FSE](/evo/car/image17.png)

**车载摄像机（Onboard Cameras）** 部分对 F6 摄像机执行相同操作：

![Onboard cameras in FSE](/evo/car/image88.png)

## 10. DEBUG TOOLS（调试工具）

本节将展示编辑器中可访问的一些（主要是视觉方面的）调试工具，这些工具应该有助于模组车辆的图形工作。

### RENDERER DEBUG（渲染器调试）

渲染器调试可通过 **Renderer -> Debug** 访问。

其最相关的部分是 Material 标签页，其中 PBR 可视化帮助我们调试材质设置，确保我们的车辆在颜色级别、一致（且正确）的环境光遮蔽和 PBR 方面保持协调。

环境光遮蔽（Ambient Occlusion）：

![AO debug](/evo/car/image56.png)

颜色/反照率（Colour/Albedo）：

![Albedo debug](/evo/car/image8.png)

### VISUALIZATION（可视化）

正确灯光设置的必要步骤之一是在 **Actor** 中正确定义驾驶舱 probe capture 的位置和大小。

为此，我们需要使用 Debug -> Visualization 窗口，输入 `probe_cockpit_color` 并查看图像。

此外，在 Preview Options -> Scene -> Helper 部分启用 **Show Reflection Probes**。

![Visualization](/evo/car/image65.png)

probe 位置和尺寸应在 Actor 的 **Cockpit Probe Transform** 部分中设置：

![Cockpit Probe Transform](/evo/car/image80.png)

移动位置直到 **Vis** 窗口显示原点大致在仪表台上方，窗口上部清晰（车顶部分不能被遮挡）。

Scale X 应足够大以使打开状态下的车门也被包含（从 `2.0` 开始），Scale Z 应足够大以包含整个驾驶舱 mesh。

如果驾驶舱 probe 太小，将在内饰 mesh 上产生明显的反射边界线条。如果太大，将在内饰材质上添加过多来自周围环境的反射信息。

如果 probe 位置不当（例如放置在仪表台内部），即使 PBR 材质设置正确，反射也会变得暗淡无光。

### DATE & TIME（日期和时间）

日期和时间菜单允许您在选定时区和世界坐标中设置特定日期。

![Date and Time](/evo/car/image92.png)

它为您提供所选日期的适当太阳角度和方向。

### PREVIEW OPTIONS（预览选项）

虽然之前针对某些调试功能已经简要提及过，让我们过一遍 **Preview Options** 菜单最重要的部分。

![Preview Options](/evo/car/image28.png)

**Scene** 菜单包含渲染、可视化辅助工具和车灯调试锥体的调试选项。各选项应该一目了然。

某些设置与环境工作和常规灯光调试相关，可以忽略。

![Scene options](/evo/car/image76.png)

- **Sky** 允许您在程序化天空（响应时间设置）或由选定 HDRI 照亮的静态天空之间选择。
- **Post processing** 允许您从游戏后处理预设中选择。
- **Camera** 部分允许您更改自由编辑器摄像机的 FOV。

### EXPORT AND ENCRYPTION（导出和加密）

功能完整的模组可以通过两种方式导出供游戏读取：

1. **将 `mod_folder` 原样复制** 到 `Saved Games/ACE/mods/content/cars`

   这在您仍在积极开发项目时推荐使用，方便在编辑器和游戏之间来回切换查看模组。

2. **准备好打包模组时**，使用编辑器的加密功能将 `mod_folder` 加密为 **`.kspkg`** 文件。

![Encryption](/evo/car/image37.png)

![Encrypted package](/evo/car/image20.png)

将 `.kspkg` 文件复制到 `Saved Games/ACE/mods/`。

示例模组同时包含用于参考项目的开放包和加密的模组文件。

### KNOWN ISSUES, WIP & WORKAROUNDS（已知问题）

在一般开发过程中，编辑器在意外崩溃方面相对稳定，但请确保定期保存资产。

最终状态编辑器在以下情况下会**崩溃**，以指示资产中存在严重错误：

- mesh 装配包含冲突的骨骼名称（多个骨骼同名）
- mesh 装配缺少必选骨骼（如 `TYRE_`、`WHEEL_`、`DISC_` 等）
- 文件中存在空路径 — 确保不要添加未填写的新数组项 — 查找错误可能非常令人沮丧，因为日志不会告诉您空引用在哪里
- 设计文件和视觉预设之间缺失或错误的引用 — 例如视觉预设为材质定义了默认 OEMColour 文件，但该材质在其数组中没有该（或任何）颜色文件
- 部件管线中缺失或错误的引用
- 在最终状态编辑器中工作后，关闭它并在 mesh 编辑器或材质编辑器中工作，然后再次打开最终状态编辑器时，编辑器偶尔会崩溃

我们的建议是**从简单开始**，然后逐步扩展 — 作为初始 mesh 和材质设置后的第一步，确保您有一个可用的最终状态预设，包含单个机械预设、单个视觉预设和单套车轮。

添加部件时，确保在大量添加之前对整个管线有全面了解。

## 引用来源

- Kunos Simulazioni, AC EVO Car Modding Pipeline 官方文档
