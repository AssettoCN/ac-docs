---
title: 驾驶员动画管线
---

# AC EVO – Driver Animation Pipeline

本文档描述 AC EVO 中驾驶员动画的完整制作、导出与导入流程。

## 1 Blender 场景

使用 **Blender 5.1** 或更高版本打开提供的模板场景。场景内包含 3 个 Collection：

| Collection | 说明 |
|---|---|
| `Export_Rig` | 骨骼层级，定义角色位置，仅在导出阶段使用 |
| `Control_Rig` | 基础控制器集合，用于修改驾驶员动画；内含参考网格，可用于自定义驾驶员的蒙皮权重传递与比例调整 |
| `Car_Interior` | 车辆内饰网格，作为驾驶员基础姿态的参考 |

::: danger 注意
- **不要修改** `Export_Rig` 的骨骼名称和层级结构。
- 不建议缺乏经验的用户对 `Control_Rig` 进行修改。
- 游戏使用硬编码骨骼名称（如 `HEAD`）来施加由物理驱动的 G 力动画，**切勿更改任何骨骼名称**。
:::

## 2 驾驶员动画列表

每辆车在 ACEVO 中使用一组特定的驾驶员动画，需匹配不同的驾驶舱空间、方向盘形状和换挡类型。每条动画必须遵循规定的帧数长度和本文档后续描述的逻辑，方可在游戏中正确运行：

![驾驶员动画概览](/evo/driver/image6.png)

| 动画名称 | 帧数 | 说明 |
|---|---|---|
| `Driver_position` | 200 | 基础驾驶姿态 |
| `Driver_steer` | 200 | 方向盘转向 |
| `Driver_accel` | 20 | 油门 |
| `Driver_brake` | 20 | 刹车 |
| `Driver_shift` | 30 | 手动换挡（前半段） |
| `Driver_shift_change` | 20 | 手动换挡（后半段） |
| `Driver_shiftpad_up` | 20 | 换挡拨片 – 升挡 |
| `Driver_shiftpad_down` | 20 | 换挡拨片 – 降挡 |
| `Driver_idle` | 1000+ | 怠速等待动画（可选） |
| `Driver_handbrake` | 30 | 手刹（WIP，尚未完全实现） |
| `Driver_clutch` | 20 | 离合器（暂不支持） |

## 3 动画逻辑详解

### Driver_position

基础驾驶姿态。驾驶员置于正确的驾驶坐姿：双手握方向盘、双脚踩在踏板（油门和刹车）上、头部正视挡风玻璃（或方向盘正上方）。

某些情况可能需要微缩驾驶员脊柱——沿 Y 轴移动驾驶员背部的黄色控制手柄，或缩小（专用绿色手柄）腿部。

![Driver_position 基础姿态](/evo/driver/image13.png)

![Driver_position 侧面视图](/evo/driver/image4.png)

![Driver_position 调整细节](/evo/driver/image14.png)

::: tip
有时需要让驾驶员的臀部或背部嵌入座椅。实际调节范围不如真实座椅那么有弹性，需要适度调整。
:::

### Driver_steer

方向盘转向动画。双手跟随方向盘从 **-360°**（第 0 帧）到 **+360°**（第 200 帧）的线性旋转。

- **第 100 帧** = 编辑器中 0° 转向（居中）
- 第 100 → 第 0 帧 = **左转**
- 第 100 → 第 200 帧 = **右转**

第 0、100、200 帧的姿态应与 `Driver_position` 一致。

当方向盘带有换挡拨片时，手指应放在拨片上方（未按下状态），确保在可触及范围内。

### Driver_accel

右脚踩油门踏板。第 0 帧 = `Driver_position`，第 20 帧 = 全油门。

![Driver_accel 油门动画](/evo/driver/image12.png)

### Driver_brake

左脚踩刹车踏板。逻辑与 `Driver_accel` 相同。

### Driver_shift

手动换挡动画的前半段。第 0 帧手从方向盘处张开离开，第 30 帧手放到换挡杆上，准备换挡。

### Driver_shift_change

手动换挡动画的后半段。从 `Driver_shift` 的末帧开始（作为第 0 帧），手沿换挡杆向前推至第 10 帧，然后回到起始姿态（第 20 帧）。

![Driver_shift_change 换挡动画](/evo/driver/image22.png)

::: warning
当前不支持不同挡位的不同换挡姿态。所有前进挡和倒挡使用同一组动画。
:::

### Driver_shiftpad_up

换挡拨片升挡动画。按下拨片的手指部分：

- **第 0 帧** = `Driver_position`
- **第 5 帧** = 拨片被按下
- **第 10 帧** = 回到 `Driver_position`
- **第 20 帧** = `Driver_position`（循环结束）

### Driver_shiftpad_down

逻辑与 `Driver_shiftpad_up` 相同。

### Driver_idle

可选的怠速等待动画，在维修区/赛前播放。帧长度无限制，通常不超过 2000 帧。为循环动画，首尾帧需与 `Driver_position` 一致。

### Driver_handbrake（WIP）

手从方向盘处离开，伸向手刹。手刹杆通常不动画化，驾驶员动画仅在最后 10 帧模拟拉动手刹的动作。

::: warning
此动画的实现尚未完全完成，可能无法正常工作。
:::

### Driver_clutch（暂不支持）

可导出并分配，但当前不支持离合器踏板的预期（anticipation）动画。推荐方案是双脚分别放在油门和刹车上，通过踩踏动作完成刹车和加速，不涉及离合器。

## 4 场景导出准备

### 4.1 导入车辆内饰

1. 导入你的车辆内饰模型。

![导入车辆内饰模型](/evo/driver/image17.png)

### 4.2 定位驾驶员

2. 将驾驶员正确就座。

> **切勿移动层级的 ROOT NODE。**

![定位驾驶员坐姿](/evo/driver/image15.png)

### 4.3 方向盘对齐

3. 将 `A_Steer` 控制器的平移和旋转与用于方向盘动画的 Dummy 对齐。
4. 调整 `A_Steer_Rot` 控制器的位置和缩放，使其匹配方向盘轮圈。
   - `A_Steer_Rot` 也是转向动画中使用的控制器。

![A_Steer 控制器对齐](/evo/driver/image11.png)

5. 检查方向盘控制器是否正确对齐后，可在方向盘 Dummy 上添加旋转约束，强制其旋转跟随 `A_Steer_Rot` 骨骼。

![方向盘旋转约束](/evo/driver/image7.png)

![方向盘控制器设置](/evo/driver/image25.png)

::: tip
为了方便导出阶段，建议将不同类型的动画分别存储在不同的 Action 中，之后可在 Blender NLA（Nonlinear Animation）编辑器的不同轨道中保存。
:::

## 5 导出动画

### 5.1 Export Helper 脚本

在模板场景的 **Blender Scripting** 布局中，可找到一个简单的导出辅助脚本（Export_Helper），也可从随附的文本文件中复制粘贴。

![Export Helper 脚本](/evo/driver/image23.png)

1. 运行脚本——在 3D 视口右下角激活 **Export Helper** 面板。

![Export Helper 面板](/evo/driver/image29.png)

2. 在面板中可临时隔离需要导出的骨骼。检查可见性并选择 `Export_Rig` Collection 中的 **COG** 骨骼。

### 5.2 逐步导出流程

对于每个动画，按以下步骤操作：

1. 在 **NLA 编辑器** 中打开要导出的 Action（其他 Action 必须取消勾选）。
2. 在时间线中设置对应的动画长度。
3. 在 Export Helper 面板中勾选对应动画涉及的骨骼分组。
4. 在 **Object Mode** 下选择 COG 骨骼。
5. 以 `.fbx` 格式导出。

::: details 导出示例：Driver_steer
- NLA 编辑器中打开 `Driver_Steer` Action
- 时间线设为 200 帧
- Export Helper 中勾选 **Arms**（包含双臂骨骼）
- 选择 COG 骨骼并导出 FBX
:::

::: warning
脚本会取消勾选需排除骨骼的 **Deform** 选项，这会临时移除对应骨骼的蒙皮权重，导致网格显示异常。导出完成后，使用 Export Helper 面板中的 **Reset** 按钮恢复。
:::

![Export Helper 骨骼隔离](/evo/driver/image16.png)

![导出过程](/evo/driver/image21.png)

![Export Helper 菜单](/evo/driver/image9.png)

使用以下设置正确导出 `.fbx` 格式动画：

![FBX 导出设置 1](/evo/driver/image2.png)

![FBX 导出设置 2](/evo/driver/image27.png)

![FBX 导出设置 3](/evo/driver/image24.png)

![FBX 导出设置 4](/evo/driver/image5.png)

## 6 编辑器导入

1. 打开 ACEVO 编辑器，创建一个命名规范的文件夹用于存放驾驶员动画。

![创建动画文件夹](/evo/driver/image18.png)

![文件夹结构](/evo/driver/image28.png)

2. 创建 **Animation** 类型资产，导入驾驶员动画。使用文件浏览器导航到之前创建的动画文件夹。

![创建 Animation 资产](/evo/driver/image1.png)

3. 双击动画资产打开动画标签页，初始窗口为空。
4. 在 **Preview** 标签页中填入提供的 `Driver_Dummy_full_TEST` 网格，即可看到待动画化的 Dummy。

![导入方向盘动画](/evo/driver/image26.png)

5. 在路径栏填入从 Blender 导出的动画文件路径，点击 **Import** 按钮。

![导入动画并预览](/evo/driver/image32.png)

6. 使用 **Play** 按钮或下方时间轴滑块播放动画。

::: tip
建议首先导入并打开 `Driver_Position` 动画的预览，这样后续导入的动画将显示正确姿态的驾驶员（而非 A-Pose）。
:::

## 7 分配动画

![动画分配界面](/evo/driver/image10.png)

1. 在车辆 Actor 中找到 **Driver Animation** 标签页。
2. 从动画文件夹拖拽动画到对应插槽：

| 插槽 | 对应动画 |
|---|---|
| Base Pose | `Driver_Position` |
| Steering Animation | `Driver_Steer` |
| Steering Paddles Gear Animation | `Driver_ShiftPad_Up` / `Driver_ShiftPad_Down`（仅用于双换挡配置的车辆） |
| Gear Shift Up / Down | `Driver_Shift_Change` |
| Manual Shift Approach | `Driver_Shift` |

> 如果车辆只有一种转向配置，使用 **Steering Animation** 插槽即可。

![拖拽动画到插槽](/evo/driver/image30.png)

### 7.1 动画混合参数

在 Driver Animation 标签页下方可找到 **Animation Blendings** 参数。这些值决定动画的播放速度和混合过渡：

- **换挡混合速度**：方向盘动画到换挡动画的过渡速度（第一个值 = 手过渡到换挡杆，第二个值 = 反向过渡）
- **换挡变更与预判播放时间**：也分为前进和回退两个值

![动画混合参数](/evo/driver/image8.png)

### 7.2 G 力参数

以下为 G 力（G-Force）滑块参数，控制驾驶时颈部和头部的运动：

- **Max G**：允许的最大 G 力值（通常设为 `1`）
- **Filter**：用于排除头部 G 力的微小变化
- **Pitch / Yaw**：需根据头盔/头部与座椅（尤其是头部侧翼）的穿插情况调整

![G 力参数](/evo/driver/image31.png)

> Look Left / Look Right 值当前未激活。

## 8 测试动画

1. 在顶部菜单打开 **carfinalstate**，ACE 编辑器中将出现一个场景。

![carfinalstate 场景](/evo/driver/image20.png)

2. 选择你的车辆 Actor，打开 **Driver** 标签页，勾选驾驶员和头盔可见性。

![驾驶员可见性设置](/evo/driver/image19.png)

3. 进入 **Runtime** → **Runtime Parameters** → **Driver Animations**。
4. 可在此测试驾驶员动画在游戏中的实际效果。

![Runtime Driver Animations 测试](/evo/driver/image3.png)

::: tip
建议一次只测试一个动画，将其他动画留在第 0 帧，避免动画重叠。
在同一菜单中也可检查混合参数值（部分值暂不支持实时修改）。显示的值是保存在车辆 Actor 中的当前值。
:::

---

## 引用来源

- Kunos Simulazioni, AC EVO Driver Animation Pipeline 官方文档
