---
title: 本地立方体贴图
---


> 汉化标题：赛道 – 本地立方体贴图  
> 原文页面：Tracks-–-Local-cubemaps  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

通常，AC 中的一切都使用一张在摄像机位置周围拍摄的全局立方体贴图（类似一张 360° 图片）来做反射。因此，举例来说，如果你有一栋光泽的建筑，当摄像机移动时，反射也会开始移动，而且往往动得过多：

<a href="https://gfycat.com/glassslowbarasingha"><img src="https://thumbs.gfycat.com/GlassSlowBarasingha-size_restricted.gif" width="400" ></a>

*注意：即使视线方向与建筑表面之间的角度没有变化，反射仍会发生变化。*

而这正是使用本地立方体贴图后玻璃的样子：

<a href="https://gfycat.com/CooperativeDelectableGrunion"><img src="https://thumbs.gfycat.com/CooperativeDelectableGrunion-size_restricted.gif" width="400" ></a>

### 语法

```ini
[LOCAL_CUBEMAP_...]
MESHES = base_vetri    ; 拥有独立立方体贴图的赛道网格列表
POSITION = 100, 1, 10  ; （可选）立方体贴图位置，未设置时使用网格中心
OFFSET = 0, 0, 0       ; （可选）根据网格推断位置时的偏移
EXCLUDE = base_vetri   ; 从立方体贴图中排除的网格列表（同时也能加快速度）
CLIP_PLANE_NEAR = 2    ; 近裁剪平面，单位米（或许有助于去除近处物体的反射）
HIGH_RESOLUTION = 0    ; 设为 1 使用高分辨率立方体贴图（适用于大型平面）
LOW_RESOLUTION = 0     ; 设为 1 使用低分辨率立方体贴图（适用于动态立方体贴图）
IS_DYNAMIC = 0         ; 设为 1 切换到动态模式
DYNAMIC_FAST = 0       ; （不推荐！）设为 1 每帧更新一个面
STATIC_FACES = TOP, LEFT, REAR, BOTTOM  ; 不参与动态更新的静态面（参见提示）
INCLUDE_SKY = 1        ; 设为 0 排除天空，略微加快速度（在不需要天空时）
INCLUDE_CARS = 0       ; 设为 1 包含车辆
DYNAMIC_LIGHTING = 0   ; 设为 1 将灯光纳入反射
DEBUG = 0              ; 设为 1 可查看立方体贴图中心以及以红色高亮显示的静态面
DEBUG_CLEAR = 0        ; 禁用天空并设为 1 以测试刷新率
```

配合动态立方体贴图和显示的车辆，你可以让那些镜子更加生动：

[![Example](https://thumbs.gfycat.com/LateOfficialChihuahua-size_restricted.gif)](https://gfycat.com/lateofficialchihuahua)

但请小心，这类东西开销相当大。如果赛道上有好几面镜子，你可以用单个移动的本地立方体贴图覆盖所有镜子：

```ini
[LOCAL_CUBEMAP_...]
POSITION_0 = 10, 1, 100  ; 第一面镜子的位置
POSITION_1 = 10, 1, 200  ; 第二面镜子的位置
POSITION_2 = 10, 1, 300  ; 第三面镜子的位置
...
```

立方体贴图会移动到离观察者最近的位置。

### 重要提示

- 不用担心静态立方体贴图与一天中时间变化的问题：即使是静态贴图，也会不时更新以跟随光照条件的变化。
- 请时刻留意性能。除非必要，避免使用高分辨率、动态、灯光或车辆。
- 一个低分辨率立方体贴图占用 2.6 MB 显存，普通分辨率 12.5 MB，高分辨率 50.3 MB，也请把这一点考虑在内。
- 除非确有必要，不要使用 `DYNAMIC_FAST`。
- 不使用 `DYNAMIC_FAST` 时，本地立方体贴图大约每隔几帧更新一个面。不过通常只有少数几个面需要频繁更新。把其余的面标记到 `STATIC_FACES` 中（用 `DEBUG = 1` 确认各是哪些面），每隔几帧更新一个面就绰绰有余了（如那张 GIF 所示）。
- 我建议手动摆放立方体贴图的位置。请记住：对于处在立方体贴图中心的表面点，立方体贴图的反射是 100% 精确的，点离中心越远，反射就越不准确。如果你有一栋装着玻璃窗的大型建筑，请把立方体贴图放在靠近面向赛道的一侧，也许再放低一点，让主要可见区域以牺牲其他侧面为代价获得更准确的观感。
- 另一种用法是为遍布赛道、不需要精良反射的大量对象使用同一个静态立方体贴图，只要让反射不再漂移、并保持某种特定主题即可。例如 Highlands 中房屋的窗户。用像这样简单的东西：

  ```ini
  [LOCAL_CUBEMAP_...]
  MESHES = material:House_02, material:house?
  POSITION = 842.36, 6.79, 612.28  ; 位置放在小镇中的某处，让房屋能反射其他房屋
  LOW_RESOLUTION = 1
  ```

  这些窗户将获得漂亮而稳定的反射，而且由于它不是动态的且分辨率更低，渲染速度甚至可能比原始方式更快（前提是用户使用的立方体贴图分辨率高于 256×256）。
- 或者，干脆把位置设在高处的某处，让反射的主要内容是天空。

