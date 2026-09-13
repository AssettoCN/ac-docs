---
title: 自定义 AI
---


> 汉化标题：其他事项 – 自定义 AI  
> 原文页面：Other-Things-–-Custom-AI  
> 原文锚点：20b1d7d  
> 汉化时间：2026-09-12T19:00:00+08:00  

随着 0.1.78 版本的发布，现在可以使用 AC 来尝试开发自定义 AI 了。外部应用可以连接到 CSP 创建的几个内存映射文件，获取所有车辆的当前状态，并为全部或其中部分车辆填入新的输入状态。还有一些函数允许控制模拟的某些方面，例如禁用车辆间碰撞、放慢模拟速度、传送车辆或重新开始比赛。

整个功能目前仍处于实验阶段，并且仅适用于在 “surfaces.ini” 中明确允许应用自定义 AI 的赛道。这只是一个临时措施，以确保在这个阶段，这些控制模拟的选项不会搞坏任何竞技性内容。

# 入门

要激活自定义 AI：

- 打开 “assettocorsa/extension/config/new_behaviour.ini”，找到 `CUSTOM_AI` 节并将 `ENABLED` 设为 1。其中还有一些其他选项，可在需要时用于加快加载和整体性能。（另外，请确保整个 “New Behavior” 模块也已启用。）

- 打开你想使用自定义 AI 的赛道的 “surfaces.ini”，[激活扩展物理](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Enabling-extended-physics)，然后在同一文件中添加 `[_EXTRA_PERMISSIONS] ALLOW_CUSTOM_AI_MANIPULATION=1`。

# 第一步

一开始，想要控制某辆车的外部工具应创建一个名为 `AcTools.CSP.NewBehaviour.CustomAI.CarControls<N>.v0` 的内存映射文件（其中 `<N>` 是从 0 开始的车辆索引），其结构如下（初始时全部填零或类似值即可）：

```cpp
struct cai_car_controls { 
  /* 所有结构体均按 4 字节对齐 */

  float gas;
  float brake;
  float clutch;
  float steer; /* 转向值，归一化到 -1 至 1 */
  float handbrake;

  bool gear_up; /* 单字节值，1 为真，0 为假 */
  bool gear_dn;
  bool drs;
  bool kers;

  bool brake_balance_up;
  bool brake_balance_dn;
  bool abs_up;
  bool abs_dn;

  bool tc_up;
  bool tc_dn;
  bool turbo_up;
  bool turbo_dn;

  bool engine_brake_up;
  bool engine_brake_dn;
  bool mguk_delivery_up;
  bool mguk_delivery_dn;

  bool mguk_recovery_up;
  bool mguk_recovery_dn;
  byte mguh_mode; /* unsigned char */
  bool headlights;

  byte teleport_to; /* 设为 1 传送回维修区，设为 2 传送到 `teleport_pos` */
  bool autoclutch_on_start;
  bool autoclutch_on_change;
  bool autoblip_active;

  float3 teleport_pos; /* 三个 float，共 12 字节 */
  float3 teleport_dir; /* 注意：在 0.1.79 之前是错误反转的 */

  bool autoshift_active;
}
```

它可以在 Assetto Corsa 启动之后再创建，但 CSP 一旦发现它，就会迅速把该车辆原本的车辆控制器替换为自定义控制器，并使用该文件中的数据作为新的车辆输入。数据以 333 Hz 读取，但可以以更低的频率更新。与此同时，CSP 还会创建一个名称形如 `AcTools.CSP.NewBehaviour.CustomAI.Car<N>.v0` 的内存映射文件。在该文件中，CSP 会以 `cai_car_data` 结构体提供车辆状态的详细描述（其中包含四个 `cai_wheel_data`）：

```cpp
struct cai_car_data {
  int packet_id; /* 更新时递增 */
  float gas;
  float brake;
  float clutch;
  float steer; /* 转向角（度） */
  float handbrake;
  float fuel;
  int gear;
  float rpm;
  float speed_kmh;
  float3 velocity;
  float3 acc_g;  /* G 力（Z 为加速度力，X 为左右方向的力） */
  float3 look;   /* 车辆朝向 */
  float3 up;
  float3 position;
  float3 local_velocity;
  float3 local_angular_velocity;
  float cg_height;
  float car_damage[5];
  cai_wheel_data wheels[4];
  float turbo_boost;
  float final_ff;
  float final_pure_ff;
  bool pit_limiter;
  bool abs_in_action;
  bool traction_control_in_action;
  uint lap_time_ms;
  uint best_lap_time_ms;
  float drivetrain_torque;
  float spline_position;      /* 在 AI 样条线（fast_lane.ai）上的位置 */
  float collision_depth;      /* 当前碰撞深度（米） */
  uint collision_counter;     /* 碰撞时递增 */
  uint wheels_valid_surface;  /* 若第 N 个比特置位，则第 N 个车轮位于有效的
      赛道表面上；所有车轮都在有效表面上时为 15 (1|2|4|8)；
      于 0.1.79 中加入。 */
}

struct cai_wheel_data {
  float3 position;
  float3 contact_point;
  float3 contact_normal;
  float3 look;      /* 车轮方向 */
  float3 side;      /* 指向车轮侧面的向量 */
  float3 velocity;  /* 世界空间中的车轮速度 */
  float slip_ratio;
  float load;
  float pressure;
  float angular_velocity;
  float wear;
  float dirty_level;
  float core_temperature;
  float camber_rad;
  float disc_temperature;
  float slip;
  float slip_angle_deg;
  float nd_slip;
};
```

总结一下，如果外部应用想控制模拟中的第二辆车，它应该：

- 创建一个新的内存映射文件 `AcTools.CSP.NewBehaviour.CustomAI.CarControls1.v0`，大小为 `cai_car_controls` 结构体的大小，填充为零（或者刹车也许可以用 1）；
- 稍等片刻，让 CSP 创建 `AcTools.CSP.NewBehaviour.CustomAI.Car1.v0`；
- 若找到了该文件，就打开它、映射它，并开始循环：读取车辆状态、输出控制量；
- 若该文件迟迟未被创建，可能是因为自定义 AI 未启用、赛道不允许使用自定义 AI，或该车辆无法被控制（例如线上模式中的远程车辆）。

# 其他车辆在哪里

自定义 AI 激活后，CSP 会以 60 Hz（或任意当前 FPS）将所有车辆的信息发布到 `AcTools.CSP.NewBehaviour.CustomAI.CarPublic<N>.v0` 文件中。这些信息要简化得多（主要是因为线上远程车辆的数据非常有限），但希望对 AI 来说已经够用：

```cpp
struct cai_car_public_data {
  int packet_id; /* 更新时递增 */
  float steer;
  float rpm;
  float spline_position;
  float speed_kmh;
  float3 velocity;
  float3 acc_g;
  float3 look;
  float3 up;
  float3 position;
  float car_damage[5];
  bool is_braking;
}
```

# 控制模拟

要控制模拟的状态，请创建一个新文件 `AcTools.CSP.NewBehaviour.CustomAI.SimState.v0`，并用以下结构体填充：

```cpp
struct cai_sim_control {
  bool pause;               /* 设为 1 暂停模拟 */
  bool restart_session;     /* 设为 1 重新开始当前赛节 */
  bool disable_collisions;  /* 设为 1 时禁用碰撞 */
  byte extra_sleep_ms;      /* 如果你开发中的 AI 需要一些时间才能算出结果，
                               此选项可以放慢模拟 */
};
```

自 0.2.8 起，你还可以通过 `AcTools.CSP.NewBehaviour.CustomAI.SimState.v1` 控制模拟时间来加快速度（用 “v1” 而非 “v0” 是为了保持兼容）：

```cpp
struct cai_sim_control {
  bool pause;               /* 设为 1 暂停模拟 */
  bool restart_session;     /* 设为 1 重新开始当前赛节 */
  bool disable_collisions;  /* 设为 1 时禁用碰撞 */
  byte extra_sleep_ms;      /* 如果你开发中的 AI 需要一些时间才能算出结果，
                               此选项可以放慢模拟 */
  float time_scale;         /* 1 为正常的模拟时间流速，增大可让时间流逝得更快 */
};
```

# 绘制调试线

出于调试目的，你还可以绘制一些调试线。为此，创建一个大小至少为 16 KB 的新文件 `AcTools.CSP.NewBehaviour.CustomAI.DebugLines.v0`，并在其中写入这个 `cai_debug_lines` 结构体：

```cpp
struct cai_debug_lines {
  int count;
  cai_debug_line lines[count];
}

struct cai_debug_line {
  float3 from;
  float3 to;
  uint color;
}
```

# 示例

[这里是一个基础的 C# 程序，演示了如何连接、设置一些输入、控制模拟状态以及绘制调试线](https://gist.github.com/gro-ove/11489f32b3eb3c9e3df1e7819bb3008e)。

