---
title: 自定义展厅油漆店默认名称
---


> 汉化标题：无关 – 自定义展厅油漆店默认名称  
> 原文页面：Unrelated-–-Default-names-for-Paint-Shop-in-Custom-Showroom  
> 原文锚点：afab896  
> 汉化时间：2026-09-12T19:00:00+08:00  

要让油漆店（Paint Shop）正常工作，它需要知道每张纹理的用途，以及它可以被如何编辑。这些都可以用 JSON 文件来设置，但 JSON 文件相当难测试。油漆店也会尝试根据纹理的名称来猜测其用途，而选对名称可比去编辑那堆乱麻容易多了。以下是它会查找的名称：

- `car_paint.dds` — 车漆，带或不带闪粉的小纹理（通常在 `txDetail` 槽位）；
- `car_paint_rims.dds` — 轮圈颜色，另一张小的纯色纹理（若想用一张 `txDetail` 纹理给轮圈上色、同时把 alpha 用作模糊版本，可使用 `ksPerPixelMultiMap_AT` 着色器，把 alpha 通道放在 `txNormal` 槽位，而 `txDiffuse` 槽位的 alpha 仍将充当 `txDetail` 的遮罩）；
- `car_paint_roll_cage.dds` — 防滚架颜色（纯色）；
- `metal_detail_roof.dds` — 车顶颜色（纯色）；
- `carpet.dds` — 地毯（在现有纹理上着色）；
- `cuciture.dds` — 座椅等处的内饰缝线（着色）；
- `seat_logo_D.dds` — 座椅上的标志（着色）；
- `PlasticDetail_color.dds` — 塑料颜色（纯色）；
- `cloth_detail.dds` — 织物颜色（纯色）；
- `TEssuto_color.dds` — 织物部件（纯色）；
- `cloth_seats.dds` — 座椅颜色（着色）；
- `kevlar_tile.dds` — 凯夫拉（着色）；
- `alcnt.dds` — 内饰（着色）；
- `leather.dds` — 皮革（着色）；
- `ext_glass.dds` — 玻璃（可选透明度）；
- `caliper_detail.dds` — 刹车卡钳（纯色）；
- `noise_D.dds` — 气缸盖罩（纯色）。

名称之所以这么奇怪，是因为我让这套猜测机制兼容原版 Kunos 车辆和一些模组。此外，如有需要，还有一些带索引的额外颜色：

- `<X>` 取 2 至 8：
  - `metal_detail_<X>.dds`：车漆 #X（填充）；
  - `metal_detail_skin_<X>.dds`：车辆涂装 #X（填充）；
  - `rim_detail_<X>.dds`：轮圈 #X（填充）。
- `<X>` 取 0 至 6：
  - `interior_plastics_detail<X>.dds`：内饰塑料 #X（着色）；
  - `carpet<X>.dds`：地毯 #X（着色）；
  - `INT_Trim<X>.dds`：内饰饰板 #X（着色）；
  - `INT_fabric<X>.dds`：织物 #X（着色）；
  - `leather_seat<X>.dds`：座椅 #X（着色）；
  - `alcnt_cust<X>.dds`：内饰 #X（着色）；
  - `leather_<X>.dds`：皮革 #X（着色）。

牌照纹理请命名为 `Plate_D.dds` 和 `Plate_NM.dds`。如果希望 `txMaps` 可配置，请使用车漆着色器 `ksPerPixelMultiMap_damage_dirt`。

