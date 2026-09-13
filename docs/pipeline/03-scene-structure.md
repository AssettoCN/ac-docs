---
title: 3. 场景结构
---

# 3. 场景结构

为了让车辆在游戏中正常工作，需要在所有 LOD 中具备特定的 null，以确保所有
车辆部件正常运作。Dropbox 文件夹中提供了一个示例场景，
其中包含可遵循的文件夹结构和层级（Scene templates/scene_nosuspanim_example_max）。
请确保场景中只保留一套 null，并且使用清晰的图层结构
来隐藏/取消隐藏图层，以便导出各个 LOD（参见示例场景）。
必须在所有 LOD 中存在的 null：

| Null | 说明 |
| --- | --- |
| SUSP_LF | 悬架 左前 |
| SUSP_LR | 悬架 左后 |
| SUSP_RF | 悬架 右前 |
| SUSP_RR | 悬架 右后 |
| WHEEL_LF | 车轮 左前 |
| WHEEL_LR | 车轮 左后 |
| WHEEL_RF | 车轮 右前 |
| WHEEL_RR | 车轮 右后 |
| COCKPIT_LR | 座舱 低分辨率节点 |
| STEER_LR | 方向盘 低分辨率节点 |
| DISC_LF | 制动盘 左前 |
| DISC_LR | 制动盘 左后 |
| DISC_RF | 制动盘 右前 |
| DISC_RR | 制动盘 右后 |

还有一些完成车辆所需的次要 null，但它们并非必不可少，也就是说
在某些情况下，这些对象可以从某些 LOD 中排除：

| Null | 说明 |
| --- | --- |
| COCKPIT_HR | 座舱 高分辨率节点（仅 A） |
| STEER_HR | 方向盘 高分辨率节点（仅 A） |
| RIM_LF | 轮辋 左前（A 和 B） |
| RIM_LR | 轮辋 左后（A 和 B） |
| RIM_RF | 轮辋 右前（A 和 B） |
| RIM_RR | 轮辋 右后（A 和 B） |
| RIM_BLUR_LF | 模糊轮辋 左前（A 和 B） |
| RIM_BLUR_LR | 模糊轮辋 左后（A 和 B） |
| RIM_BLUR_RF | 模糊轮辋 右前（A 和 B） |
| RIM_BLUR_RR | 模糊轮辋 右后（A 和 B） |

当需要手动为悬架制作动画，或者车辆采用 Dion axle 悬架时，
你需要在场景中加入一些额外的 null：

| Null | 说明 |
| --- | --- |
| REAR_AXLE | 用于 Dion Trunk 车桥的旋转中心 |
| HUB_LF | 左前悬架的轮毂 |
| HUB_LR | 左后悬架的轮毂 |
| HUB_RF | 右前悬架的轮毂 |
| HUB_RR | 右后悬架的轮毂 |

用于定义破碎玻璃网格的 null/dummy：

| Null | 说明 |
| --- | --- |
| DAMAGE_GLASS_CENTER_1 | （A 和 B） |
| DAMAGE_GLASS_FRONT_1 | （A 和 B） |
| DAMAGE_GLASS_REAR_1 | （A 和 B） |
| DAMAGE_GLASS_LEFT_1 | （A 和 B） |
| DAMAGE_GLASS_RIGHT_1 | （A 和 B） |

当存在其他 null/dummy 时，名称末尾的数字可以递增。
损坏玻璃的实现方式在 DAMAGE GLASS 章节中有完整说明。
关于用于部件动画的 Null/dummy，参见 Additional nulls for animations 章节。
对于车辆部件的 DAMAGE（损伤），以下 null 必须放置在对象受撞击时
绕其旋转的轴心（PIVOT）点上。可损坏部件的
命名约定如下：

| Null | 说明 |
| --- | --- |
| FRONT_BUMPER | （A 和 B） |
| REAR_BUMPER | （A 和 B） |
| MOTORHOOD | （A 和 B） |
| REAR_HOOD | （A 和 B） |
| FRONT_WING | （A 和 B） |
| REAR_WING | （A 和 B） |
| REAR_EXTRACTOR | （A 和 B） |

额外的 dummy 可以有：

| Null | 说明 |
| --- | --- |
| WIPER_# | 用于雨刮动画（A、B 和 C） |
| FRONT_LIGHT | 用于前大灯动画（A、B 和 C） |
| DISPLAY_DATA | 用于数字显示屏（仅 A） |
| DOOR_L 和 DOOR_R | 用于车门外板动画（A 和 B） |
| DOOR_L_1 和 DOOR_R_1 | 用于车门内板动画（仅 A） |

## 通用车辆模型的网格部件

为了管理动画对象、网格以及游戏中存在的其他功能，
车辆的组件必须拆分为多个部件。以下是必需和可选的网格对象列表。
常见外观部件：

| 部件 | 说明 |
| --- | --- |
| MAIN BODY（主车身） | 必需 - 必须存在于 LOD A 和 LOD B |
| DOORS（车门） | 可选 - 若模型上有车门，则仅存在于 LOD A。在 LOD B 中，车门不做动画，而是焊接到主车身上 |
| MOTORHOOD（发动机盖） | 取决于车型 - 如有需要，必须存在于 LOD A 和 LOD B |
| FRONT BUMPER（前保险杠） | 取决于车型 - 如有需要，必须存在于 LOD A 和 LOD B |
| REAR BUMPER（后保险杠） | 取决于车型 - 如有需要，必须存在于 LOD A 和 LOD B |
| WHEEL HUB（轮毂） | 可选 - 包含制动卡钳，必须存在于 LOD A 和 LOD B |
| WHEEL RIM（轮辋） | 必需 - 必须存在于 LOD A 和 LOD B。在 LOD C 中，车轮会被简化。 |
| WHEEL RIM BLUR（模糊轮辋） | 必需 - 使用模糊纹理的轮辋版本，必须存在于 LOD A 和 LOD B |
| WHEEL TYRE（轮胎） | 必需 - 必须存在于 LOD A 和 LOD B。在 LOD C 中，车轮会被简化 |
| BRAKE DISK（制动盘） | 取决于车型 - 如有需要，必须存在于 LOD A 和 LOD B |
| FRONT LIGHT（前大灯） | 取决于车型 - 如有需要，必须存在于 LOD A、LOD B 和 LOD C |
| REAR LIGHT（尾灯） | 取决于车型 - 如有需要，必须存在于 LOD A、LOD B 和 LOD C |
| WIPERS（雨刮） | 取决于车型 - 如有需要，必须存在于 LOD A、LOD B 和 LOD C |
| FRONT WING（前翼） | 取决于车型 - 如有需要，必须存在于 LOD A、LOD B 和 LOD C |
| REAR WING（尾翼） | 取决于车型 - 如有需要，必须存在于 LOD A、LOD B 和 LOD C |

座舱网格部件：

| 部件 | 说明 |
| --- | --- |
| COCKPIT_HR | 必需 - 高分辨率座舱，即你在座舱视图中看到的那一个。低分辨率（LR）版本同样必需，包括 LOD B 和 LOD C |
| STEER | 必需 - 内饰方向盘的 HR 和 LR 版本，LOD B 和 LOD C |
| STEER PADDLE（换挡拨片） | 取决于车型，在低分辨率（LR）和 LOD B 中同样必需 |
| SHIFT（换挡杆） | 取决于车型 - 在低分辨率（LR）和 LOD B 中同样必需 |
| SEATBELTS（安全带） | 取决于车型 - 如有需要，在低分辨率（LR）、LOD B 和 LOD C 中同样必需。在 LOD A 中，ON 和 OFF 两种位置都需要。在 LR、LOD B 和 LOD C 中，只需要 ON 位置的模型！ON 位置仅驾驶员需要，乘客不需要。 |

## 网格命名约定

在场景中为网格对象命名时保持一致。为网格对象使用诸如 MESH_ 或
GEO_ 之类的前缀标签，以便将它们与 null 对象区分开。请确保功能对象（灯光
和其他发光体等）在整个场景的所有 LOD 中保持相同的名称，
以确保脚本对每个 LOD 都能按预期工作。
你可以选择基于位置（在使用多重材质时）为对象命名，例如
GEO_front_bumper 和 GEO_main_body（这种情况下，导出时
编辑器会将其划分为子对象），或者基于材质分组来命名，例如
GEO_paint_body 和 GEO_chromes_body。

## 在 3D 空间中设置车辆模型

你可以在 sdk/dev 文件夹内的 Scene templates 文件夹中找到示例场景！车辆必须
按照图中所示方向摆放：Z 矢量必须指向前方。模型必须
放置到车轮接触地面并位于 0 坐标（Y）处（见下图）。
模型包围盒必须以 YXZ = 0.0.0 为中心。（见下图）
车辆必须有 4 个不同的细节级别（Level of Detail）模型，它们必须共享相同的
位置和朝向！

![p017_X0](/images/pipeline/p017_X0.png)

层级与朝向
提供了一个模板文件作为示例，展示如何为车辆
设置正确的层级。该文件包含一组 NULL 或 DUMMY 对象，
用于定义车辆任意部件的中心（CENTER）位置。这些 NULL 的名称必须

![p017_X1](/images/pipeline/p017_X1.png)

遵循下面展示的特定规则。
EDITOR（编辑器）会识别这些必需的 NULL，
以便定义车轮、悬架以及车辆中
任何可动画对象的旋转轴心。
注意：
任何不是 NULL/DUMMY 子对象的对象，
都会被当作车辆底盘（CAR CHASSIS）的一部分进行管理。
属于车辆的所有几何体部件
都必须放置在层级（HIERARCHY）中，以定义
游戏中每个网格对象的具体属性。
右侧示例图：车轮对象链接到
车轮的 null/dummy 之下。
同样地，你必须把所有其他部件作为对应 NULL 的子对象来放置，
该 NULL 是专为你正在创建的部件而设立的。因此轮辋有一个专属的 NULL，所有其他部件
也是如此。请记住，每个 NULL 同时也是旋转中心。如果你的网格
没有被正确放置在一个旋转中心正确的 NULL 之下，
网格就会朝错误的方式旋转。
参见左侧示例：

![p018_X0](/images/pipeline/p018_X0.png)

WHEEL 的几何体正好
以 NULL 为中心。
这样才能保证旋转正确。
在车辆示例文件中，你将能够
探究我们是如何放置所有 NULL
及其相关网格对象的。
BRAKE DISK 的中心必须位于
与车轮和轮辋完全相同的
位置。
