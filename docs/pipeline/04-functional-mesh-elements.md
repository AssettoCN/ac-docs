---
title: 4. 功能网格元素
---

# 4. 功能网格元素

## 模拟仪表

![p019_X0](/images/pipeline/p019_X0.png)

要让仪表盘上的指针动起来，ARROW_ 网格需要放置在一个合适的 null 之下。与其他对象一样，ARROW_ null 必须遵循特定的命名规范：
ARROW_SPEED
ARROW_RPM
ARROW_TURBO
ARROW_FUEL
ARROW_WATER_TEMP
ARROW_TIME
*ARROW_LIMITER
每个 ARROW_ null 都必须链接到 COCKPIT_HR null！
每个仪表都由 analog_instruments.ini 脚本中的特定值控制，该脚本位于 “content/cars/car_name/data” 文件夹内。
指针网格必须以中性位置创建，并作为特定 null 的子对象进行链接。
然后必须将指针旋转到 0 位，如上图所示。
Y 轴决定指针在仪表上的位置，必须置于 0（零）或当前仪表的起始刻度处。
注意：Z 轴必须始终指向前方
*ARROW_LIMITER 是一个指示灯，例如在 Lotus 49 和 Lotus 72D 车型上就有，用于显示某段驾驶时间内达到的最高转速。ARROW_LIMITER null 的旋转必须与 ARROW_RPM null 相同，而且它不需要任何脚本，因为它由核心引擎内部控制。
你可以使用 KS 编辑器中的 Data Scripts 标签页来设置模拟仪表脚本（参见 EDITOR 章节）。
为了确保未来的兼容性，如果车上存在引擎目前尚不支持的仪表，请以类似的方式设置它们，命名规范要与现有规则以及仪表的功能保持一致：
ARROW_VOLTAGE
ARROW_OIL_TEMP
ARROW_OIL_PRES
ARROW_FUEL_PRES
ARROW_WATER_PRES
LED 与数字显示屏
驾驶时可以让驾驶舱内的各种 LED 和指示灯点亮。建议让驾驶舱尽可能动态化，具备尽可能多的功能元素。

![p020_X0](/images/pipeline/p020_X0.png)

每个独立的 LED（例如用于 RPM、增压或 KERS 的）或条形 TAG 都必须是单独的对象，并按序列编号：
LED_RPM_# 其中 “#” 是序列中每个具体项目的编号
TAG_RPM_#
KERS_CHARGE_#
KERS_INPUT_#
TURBO_#

![p020_X1](/images/pipeline/p020_X1.png)

有些车拥有多个显示屏，某些项目（例如 RPM）可能显示在不止一块屏幕上。这种情况下，请务必区分两组读数：LED_RPM_1_# 和 LED_RPM_2_# 等。
对于功能性 LED 或警示灯，每个项目都必须是单独的对象，并使用以下命名规范：
LED_LIGHT 大灯指示灯
LED_FUEL 燃油警示灯
LED_KERS KERS 状态灯
LED_IGNITION 点火状态灯
控制仪表盘上特定项目的方法有两种。第一种是网格始终存在，由脚本按对象控制其自发光值。这是 RPM LED 序列、大灯指示灯和点火状态灯所使用的方法。
在第二种方法中，网格默认处于禁用状态，由脚本结合在编辑器中设置好的着色器和对象属性，来控制它以何种方式、在何时出现。需要注意的是，这些网格会出现在编辑器和展厅中。此方法用于动态 RPM 条形图、增压条形图、燃油液位条、换挡指示、燃油警示灯和 KERS 条形图。

![p021_X1](/images/pipeline/p021_X1.png)

注意：在第二种情况下，如果该项目是带自发光值的灯光，它还必须使用单独的材质，并在编辑器中设置所需的自发光值（例如燃油警示灯）。
注意：务必对仪表盘的功能和数字屏幕（如果有）进行充分调研，并为动态显示准备好模型。在为数字显示屏创建纹理时，必须考虑引擎所支持的动态读数，不得将它们包含在静态 diffuse 纹理中。

![p021_X0](/images/pipeline/p021_X0.png)

注意：不要对 TAG 对象名称的后缀使用 _01、_02、_03 这类个位数写法，始终使用 _0、_1、_2 等。例如 LED_RPM_0、LED_RPM_1 等。
游戏引擎目前支持以下项目：
时间
档位
车速
RPM
水温
燃油液位（条形图）
燃油液位（升）
KERS 电量（条形图）
KERS 输入（条形图）
涡轮增压值（条形图）
涡轮增压值（压力）
单圈时间
上一圈时间
与上一圈的差值
TC 设置
ABS 设置
大灯指示灯
燃油警示灯
当前圈数
总圈数
环境温度
当前剩余燃油可行驶的公里数
KERS 电量读数
预计燃油量
任何依赖 RPM 的状态指示
轮胎压力
G 力计
用于任何静态文本或数字的占位符脚本
重要：如果有数字显示屏，请创建一个名为 DISPLAY_DATA 的 NULL，其朝向如下图所示。如果有多个显示屏，请使用序号（DISPLAY_DATA_1 等）来指定每一块屏幕。DISPLAY_DATA null 是 digital_instruments.ini 中各项目的参照，它作为一个参考点，确保文字出现在与显示屏相同的表面上。因此，如果显示屏是旋转/倾斜的，null 必须保持相同的朝向。为了避免裁切，放置 null 时要让它的轴心点位于网格前方几毫米处，而不是直接贴在网格上。
注意，以上列表并不完整。请访问以下链接，查看官方支持论坛上由社区和开发人员协助维护的帖子，其中包含数字脚本及其实现方法的完整列表：
http://www.assettocorsa.net/forum/index.php?threads/analog-digital-instruments-lights-q-a-request-official
-support-here-check-first-post.12249/
DISPLAY_DATA null 的朝向以及 KERS 条形图示例：

![p023_X0](/images/pipeline/p023_X0.png)

注意：当显示屏位于方向盘上时，DISPLAY_DATA null 和所有 TAG/RPM 网格对象都必须作为 STEER_HR null 的子对象，以确保它们随方向盘一起旋转。

![p023_X2](/images/pipeline/p023_X2.png)

![p023_X1](/images/pipeline/p023_X1.png)

## 数字面板

数字面板可用于两种功能：Push-to-Pass 状态和场上名次。
此功能需要在车辆的 data 文件夹中有一个 digital_panels.ini，并在 your_car/texture/display_panel 文件夹中放置预先绘制好的数字。示例请查看游戏安装文件夹中的 content/cars/ks_audi_tt_cup/texture 文件夹。
你还需要一个父 NULL（例如 DISPLAY_PANEL），其朝向规则与数字仪表的相同（见上文）。
名次
使用以下脚本激活该功能：
```ini
[FULLPOSITION_SERIES_0]
PREFIX=textName_ 位于 car_folder/texture/display_panel 中的纹理名称的前缀
POSITION=
PARENT=DUMMY 父 dummy 的名称
START=0 后缀起始值
END=9 后缀结束值
DIGIT=1 第二位数字设为 1，第一位数字设为 10
WIDTH=30
HEIGHT=40
COLOR=255,255,255,255
INTENSITY=2
```
Push-to-Pass
使用以下脚本激活该功能：
```ini
[PUSH2PASS_SERIES_0]
PARENT=PANEL_P2P 父 dummy 的名称
POSITION=0.0615,-0.068,0
WIDTH=0.124
HEIGHT=0.137
TRIGGER=0
PREFIX=num_ 纹理名称的前缀
COLOR=255,255,255,255
INTENSITY=40.0
START=0 名称后缀从该值开始
END=9 名称后缀到该值结束
DIGIT=1（第二位数字 =1，第一位数字 =10）
BLINK_HZ=5 激活时的闪烁频率（=0 表示不闪烁）
```
P2P 状态 LED
```ini
[PUSH2PASS_LED_0]
OBJECT_NAME=LED_P2P
EMISSIVE=0,0,800
DIFFUSE=0.35
INVERTED=0 用于反向功能
BLINK_HZ=0 大于 0 时会闪烁
```
已知限制：在回放中，P2P 和所显示的名次状态不会被传递，因此面板会显示不正确的值或占位值。

## 安全带

驾驶舱中包含两个不同的安全带网格对象：一个对应系上安全带的状态，另一个对应解开安全带的状态。这两个网格必须作为 null COCKPIT_HR 的子对象链接，并且必须按如下方式命名：
CINTURE_ON 驾驶时系在车手身上的安全带
CINTURE_OFF 放在座椅上的安全带，没有车手（展厅视图）
注意：这些名称是意大利语（CINTURE = 安全带）……。
要正确制作系在车手身上的安全带网格，请先放置车手，然后为其制作动画，并检查手臂如何移动，以避免与安全带网格发生穿插。

![p026_X1](/images/pipeline/p026_X1.png)

安全带网格在 cockpit LR 中也必须建模，但只建 CINTURE_ON 网格。当你看到的是 cockpit LR 时，就意味着你处于游戏中而不是展厅里，因此车内有一名车手，你只需展示 CINTURE_ON 配置，并且安全带不与驾驶舱网格的其余部分分离。

## 灯光网格与脚本

每辆车都必须有各自独立的对象。灯光网格对象必须从车身上分离并拆分出来，并使用特定的命名

![p027_X1](/images/pipeline/p027_X1.png)

规范。网格名称必须由 lights.ini 脚本控制。同样的脚本中还包含点亮/熄灭条件以及发光颜色的指令。
右侧示例图：灯光网格由不同的部分组成，这些部分按其功能划分。
一些例子：
位置灯、刹车灯、尾灯、标准前大灯、远光灯等。
注意：无需将车灯拆分为“右”和“左”。它们可以是同一个网格，因为它们是一起点亮的。
重要：与仪表盘类似，请对灯光功能进行充分调研，并尽力实现尽可能多的功能。每个光源都必须拆分为单独的对象，避免把所有不同的反光罩和灯泡都放在一个对象中。这样，每个元素都可以被单独控制，从而获得逼真的效果。下图展示了一个很好的例子：

![p027_X0](/images/pipeline/p027_X0.png)

打开位于 “data” 文件夹中的 lights.ini 脚本
该脚本包含以下值：
```ini
[HEADER]
VERSION=3 脚本版本。保持此值不变。
[BRAKE_0]
NAME=REAR_LIGHT 要点亮的网格的名称
COLOR=500,60,40 踩下刹车踏板时的 RGB 值
OFF_COLOR=50,12,8 刹车松开时位置灯的 RGB 值
[LIGHT_0]
NAME=FRONT_LIGHT 要点亮的网格的名称
COLOR=240,195,180 前大灯点亮时的 RGB 自发光值
OFF_COLOR=50,50,70 日间行车时的 RGB 自发光值（可选）
```
在上面的例子中：NAME= 的值作用于名为 REAR_LIGHT 的网格（如上图所示）。COLOR= 的值为刹车起效时（你正踩着刹车踏板）指定的颜色。下面一行 OFF_COLOR= 是刹车灯的自发光值（在某些车上，开灯时和刹车时点亮的是同一个网格）。
可以为不同的网格指定不同的功能和颜色。
例如，COLOR=3,0,0 这个值为灯光指定了特定的颜色。网格使用 HDR 进行照明，强度没有最大上限。
COLOR= 参数的取值范围为 RGB 0 到 1，因此数值 1 表示 RGB 刻度的最大值（256）。如果需要更高的强度，数值可以超过 1。例如，[LIGHT_0] 小节中给出的值 240 就是为了产生强烈的辉光。
注意：对于点亮的刹车灯，我们建议 R（红色）值在 150 到 850 之间。对于日间行车灯，建议值在 40 到 100 之间；而对于远光灯，建议值在 250 到 800 之间。
注意：仪表盘上的大灯指示灯以及仪表盘照明也同样由 lights.ini 控制。仪表盘对象以及内饰中任何会点亮的对象都必须拆分出来，并按照以下规范命名：
LIGHT_GAUGE_#
LIGHT_INTERIOR_#
如果这些对象位于运动对象上（例如方向盘），别忘了拆分它们并将它们链接到各自的 dummy。
现代方程式赛车可以为车尾的 ERS 状态闪光灯使用以下脚本：
```ini
[HEADER]
VERSION=3
FLASHING_BLINK_TIME=0.35 闪烁时长，以秒为单位
FLASHING_REPEAT=1 激活时的闪烁次数
KERS_BLINKING=1 此行表示启用 KERS 闪烁
NO_LIGHT_SWITCH=1 此行表示它不会作为大灯工作
[LIGHT_0]
NAME=g_Rain_Lights
COLOR=180,0,0
PITLINE=1 1 表示在维修区内闪烁
KERS=1 1 表示在 KERS 回收处于活动状态时闪烁
SPECIAL=1 1 表示禁用灯光开关
```
使用以下脚本为前大灯启用闪光功能并实现闪烁的维修区灯：
```ini
[HEADER]
VERSION=3
FLASHING_BLINK_TIME=0.15
FLASHING_REPEAT=8
[LIGHT_0]
NAME=LIGHT_FRONT
COLOR=530,420,50
FLASH=1 1 表示按下闪光切换开关时会闪烁
[LIGHT_1]
NAME=LIGHT_RAIN
COLOR=95,0,0
PITLINE=1 1 表示在维修区内闪烁
SPECIAL=1 1 表示禁用灯光开关
```

## 蒙皮网格

![p030_X0](/images/pipeline/p030_X0.png)

游戏引擎支持 FBX 蒙皮网格对象。蒙皮网格对象可以拥有任意数量的骨骼，但影响单个顶点的骨骼不得超过 4 根。蒙皮网格的一个好例子是车手（稍后说明），或是底部带有织物裙罩的换挡杆。上面的示例图展示了你可以实现的使用方式。
创建蒙皮网格的规则：
1) 所有顶点都必须至少受到一根骨骼的影响。如果某个顶点没有受到骨骼的影响，它的世界坐标将为 0,0,0，从而产生一条从 3D 世界中心一直延伸到你的空间位置的长多边形。
非蒙皮对象可以与蒙皮网格链接。将非蒙皮对象连接为蒙皮网格的子对象。在上图中，蒙皮有 2 根骨骼，而手柄是非蒙皮黄色 null 的父级。
2) 每个带蒙皮绑定的材质都必须是唯一的。一个材质不能同时用在标准网格和蒙皮网格上。必须创建两个不同的材质，一个用于标准网格，另一个用于蒙皮网格。
3) 蒙皮网格专用的材质必须是 KsSkinnedMesh 或 KsSkinnedMesh_NMDetail。只有当蒙皮材质被指定给蒙皮网格时，动画才能起作用。
4) 蒙皮网格的轴心必须位于世界的 0.0.0 坐标处。它可以是另一个 dummy 的子对象，但这个 dummy 的坐标也必须是 0.0.0。
我们通常把换挡杆或其他部件的蒙皮网格放在驾驶舱内，作为驾驶舱 dummy/null 的子对象。而驾驶舱的 Dummy/null 通常位于 0.0.0 坐标处。或者，你也可以直接让网格保持自由，不链接到任何节点。
注意：不要在没有骨骼的标准网格上使用此材质。避免在悬挂部件上使用蒙皮网格！弹簧和橡胶部件请使用缩放动画。

## 车手位置与网格

![p031_X0](/images/pipeline/p031_X0.png)

我们提供了一份 AC 车手的副本作为示例模板，其中包含已完成蒙皮的骨骼、方向盘旋转的基础动画、头盔以及一些纹理。它可以被放入任何自定义车辆中。
要进行正确的摆放，请遵循以下步骤：
如果你想使用自定义车手网格，请转到 CUSTOM DRIVER 章节；否则请遵循以下步骤：
1) 将模板文件 DRIVER_BASE.fbx 导入到你的 3D 软件中。你应该能看到如图所示的车手。模板内提供了一个基础的方向盘旋转动画作为示例。
该动画由 200 帧组成。中性位置在第 100 帧。从中性（100）到 0，方向盘向左转动。从中性（100）到 200，方向盘向右转动。
2) 将车手放到座椅上，双手放在方向盘上。可能需要对我们的动画模板做一些修改。

![p031_X1](/images/pipeline/p031_X1.png)

这里的图片展示了一个摆放示例：
现在可以导出车手网格及其位置了，其中将包含正确的层级，以及骨骼和各种对象的正确名称。

**重要：**

请记住在 EXPORT 时（对于所提供的车手）将单位设置为 Meters。否则，编辑器会产生异常的骨骼位置和错误的结果。在你的 3D 软件中保持相同的 GENERIC UNIT。这是因为我们车手的原始缩放为 1，即使在导出后也必须保持为 1。对于在 3dsMAX 或 MAYA 中以缩放 1 创建的骨骼，应该不会存在此问题。

![p032_X0](/images/pipeline/p032_X0.png)

![p032_X1](/images/pipeline/p032_X1.png)

如何从编辑器导出车手基础位置：
1) 在编辑器中打开已将车手摆放到正确基础位置的 FBX 文件。

![p032_X2](/images/pipeline/p032_X2.png)

2) Save Driver Base Pos
此时会创建一个名为 driver_base_pos.knh 的文件，并存储在源 FBX 所在的同一文件夹中。
此文件必须放置在以下路径：
AssettoCorsa/content/cars/CAR-NAME/，其中 car-name 是车辆的文件夹。
游戏引擎会加载车手，并使用 driver_base_pos.knh 文件中存储的正确位置信息来摆放它。

## 车手动动画

提供的模板文件 DRIVER_BASE.fbx 包含一个 360° 方向盘旋转循环动画的基础示例。
此动画很可能与你车辆设计的方向盘不匹配。必须修改该动画，使其匹配你自定义方向盘的尺寸和位置。
注意：该动画必须是 200 帧，并且第 0 帧、第 100 帧和第 200 帧要相互匹配，以实现循环（LOOP）动画。针对 3DS Max 用户，我们准备了一套动画绑定（rig），可以从 Dropbox 链接的 Driver animation 文件夹中下载。
编辑动画后，仅保存手臂 NULL 的关键帧，并只导出带动画部件的 FBX。踏板动画目前尚不支持。下图展示了层级结构：

![p033_X0](/images/pipeline/p033_X0.png)

手臂的骨骼在图中的蓝色和红色区域高亮显示，而每根骨骼都是 RIG_Clave_L 和 RIG_Clave_R 骨骼的父级。
要为执行换挡动作的那只手制作动画，需要为从 RIG_Clave_L/R 直到手指的手臂骨骼制作动画。
要为拨片换挡制作动画，只需为手指制作动画。
对于每一个动画，你都必须导出一份 driver.fbx 副本，其中只包含所需片段需要的动画部件。例如：导出只带方向盘动画的 driver.fbx，然后再导出另一份只带换挡动画的，等等。
将车手动画以下面指定的名称，与所有 fbx 文件和纹理一起存储到车辆项目文件夹的 animation 文件夹中。
Steer.fbx 用于 360° 方向盘旋转
Shift.fbx 用于换挡动画
Shift_up.fbx 用于拨片升挡
Shift_dw.fbx 用于拨片降挡
有关如何创建片段的说明，请参见 EXPORT ANIMATIONS FROM THE EDITOR 章节。
注意：务必确认车辆的换挡动画与车手的换挡动画具有相同的帧数，这样动画在游戏中才能完全同步。
警告：“neck” 骨骼的名称存在拼写错误，被误拼成了 “nek”。尽管并不正确，但游戏仍使用这个错误的名称正常工作，因此请不要修正这个拼写错误，保留 “nek”。

![p034_X0](/images/pipeline/p034_X0.png)

示例：当车手换挡时，他的手臂开始动画时手会稍微离开方向盘。
（见下图）
第 0 帧时，手稍微离开方向盘。第 10 帧时，手位于换挡杆上。第 20 帧时，手移动换挡杆。请确保换挡杆动画与手部同步。
例如，如果手需要 10 帧才能到达换挡杆，那么换挡杆必须先在静止位置停留 10 帧，然后才开始移动。
注意：请在以下论坛帖子中查看可用于 3DS Max 的车手绑定（rig）和说明（非常感谢 the_meco）：
http://www.assettocorsa.net/forum/index.php?threads/custom-steering-animation-rig-1-7.18201/

## 车手脚本

车手由 “AssettoCorsa/content/cars/CAR-NAME/data” 中的 driver3d.ini 脚本管理。
文件结构如下：
```ini
[MODEL]
NAME=driver
POSITION=0,0,0
```
- 此小节决定要使用的车手模型（有多种不同的模型可供选择）
```ini
[STEER_ANIMATION]
NAME=steer.ksanim
LOCK=360
```
- 此小节决定用于方向盘动画的片段及其旋转锁止角（本例中为 360 度）
```ini
[SHIFT_ANIMATION]
BLEND_TIME=200 ; (MS) 用于将车手的手从方向盘位置移动到动画第一帧所需的时间。
POSITIVE_TIME=400 ; (MS) 将车手的手从动画第一帧移动到换挡杆所需的时间（前进动画）。
STATIC_TIME=10 ; (MS) 车手的手停留在换挡杆上的时间间隔（前进动画与反向动画之间的等待时间）
NEGATIVE_TIME=400 ; (MS) 将车手的手从换挡杆移回动画第一帧所需的时间（反向动画）。
PRELOAD_RPM=6000 ; (MS) 当引擎达到此 RPM 值时，会自动播放前进动画
INVERT_SHIFTING_HANDS=0 ; 如果车手用左手换挡，则设为 1。
[HIDE_OBJECT_0]
NAME=DRIVER:HELMET; 在驾驶舱摄像机视图中隐藏特定网格（从编辑器中复制正确的名称）。本例中隐藏的是头盔。
[HIDE_OBJECT_1]
NAME=DRIVER:GEO_Driver_FACE ; 这里隐藏的是车手的头部网格。
```
注意：如果你使用自定义车手网格，车手面部网格可能会有不同的名称。

## 碰撞体

车辆之间的碰撞是任何游戏中对资源消耗最大的活动之一，

![p036_X1](/images/pipeline/p036_X1.png)

尤其是在弯道中 20 辆车同时相撞时。为了优化此类场景，需要使用一个简单的碰撞体形状来计算车身与赛道物体之间的碰撞。
碰撞体形状必须是一个尽可能简单的实体对象，多边形数量尽可能少，不带任何 UV 或纹理。
碰撞体的轴心必须位于 0,0,0 坐标处，并且与车轮 dummy 的朝向相同。
碰撞体对象的规则：
1) 碰撞体的三角形数量不应超过 40/60 个。
2) 必须在编辑器中为碰撞体指定一个名为 “GL” 的材质。这是一种专门为不进行渲染的网格制作的特殊材质。带有此材质的网格仅用于碰撞。

![p036_X0](/images/pipeline/p036_X0.png)

3) 碰撞体不得

![p036_X2](/images/pipeline/p036_X2.png)

延伸到车辆底板以下。
4) 碰撞体不得有孔洞。网格必须是完全封闭的。碰撞网格完成后，只需在编辑器中导出 kn5，并命名为 “collider.kn5”。
务必在不带任何纹理的情况下保存！该文件必须与车辆 LOD 位于同一文件夹中，并命名为 collider.kn5。
