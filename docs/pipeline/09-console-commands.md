---
title: 9. 游戏内控制台命令
---

# 9. 游戏内控制台命令

灯光（前灯、尾灯、刹车灯）、火焰、数字仪表、面板和地面碰撞体（Ground collider）可以通过内置的
控制台命令在游戏内实时调整。
按 HOME 键打开游戏内命令窗口。

![p075_X0](/images/pipeline/p075_X0.png)

输入以下命令之一即可进入编辑模式（区分大小写！）。
- set observeLights [value]
- set observeFlames [value]
- set observeDigital [value]
- set observePanel [value]
- set editBoxes [value]
[Value] 可以为 1（游戏会读取 ini 文件中的新值）或 0（游戏不会读取新值；
这是默认值）。这些命令区分大小写。设为 1 时，对相应文本文件中
脚本的修改会实时反映到游戏中。

![p075_X1](/images/pipeline/p075_X1.png)

贡献者：
Gergő Panker - 首席 3D 美术，车辆制作管理 @pankykapus
Gianluca Miragoli - 首席 3D 美术，技术负责人 @yashugan
Manuel Darin - 专职程序员，Beta 测试管理 @6S.Manu
Marc Orphanos - 外部 3D 美术，驾驶员 Rig @the_meco
