---
title: 网格分割
---


> 汉化标题：车辆 – 网格分割  
> 原文页面：Cars-–-Meshes-splitting  
> 原文锚点：f301e21  
> 汉化时间：2026-09-12T00:00:00+08:00  

这里其实没什么可看的。整个功能是为了让几辆车能用上[局部立方体贴图](https://github.com/car/visual/local-cubemaps)而添加的。适用于极为罕见的情况：为已有的车辆准备配置时，出于某种原因需要将一个网格一分为二。

需要重启游戏才能使更改生效。必须置于其他作用于被切分网格的节之上。

切分不会递归执行，无法对已切分的网格再次切分。
### 语法

```ini
[MESH_SPLIT_...]
ACTIVE = 1 			; 快速启用或禁用该节
MESHES = mesh 	    		; 要切分的网格列表
SPLIT_NAME = name 		; 指定新切分网格的确切网格名
SPLIT_POSTFIX = 	   	; 新切分网格的后缀，显式设置名称时不使用
SPLIT_MATERIAL = name 		; 指定新切分网格的确切材质名
SPLIT_MATERIAL_POSTFIX = 	; 新切分网格材质的后缀，显式设置名称时不使用
INSERT_TO = node 		; 为新网格指定新的父节点
INSERT_IN_FRONT = 0
MODE = 				; 可用选项：
				; PLANE = 基于 SPLIT_AXIS 沿平面切分
				; LOOK_AT = 切分朝向给定方向的网格三角形
				; COPY_FLIPPED = 复制网格并反转方向。适用于修复缺失的车内侧窗

; 若 MODE = LOOK_AT
LOOK_AT = 0, 0, 0 		; 切分朝向该点（相对于网格父节点）的网格三角形
LOOK_AT_THRESHOLD = 0 		; 指定面必须以何种精度朝向上述点才会被选中。0 表示全部。

; 若 MODE = PLANE
SPLIT_AXIS = 1, 0, 0   		; 切分所沿的轴（切分面与其垂直；X 为横向，Y 为纵向，Z 为垂直
SPLIT_THRESHOLD = 0.0  		; 切分沿轴线的偏移，单位米

MODEL_SPACE = 0 		; 将坐标转换为基于车辆根节点而非网格父节点
```

需要说明的是，这并不是真正的*切割*，不会有三角形被一分为二，只是将现有三角形重新分组为两个不同的网格。

### 稍后添加的功能

- 更多分离方式？也许有一天它能帮助在不添加额外 KN5 的情况下加入转向灯之类的东西。

