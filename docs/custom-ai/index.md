---
title: 自定义 AI
---

从 0.1.78 版本开始，现在可以使用 AC 来尝试开发自定义 AI。外部应用可以连接到 CSP 创建的几个内存映射文件，以获取所有车辆的当前状态，并为所有或部分车辆填写新的输入状态。还有一些功能允许控制某些模拟方面，如禁用车辆之间的碰撞、减慢模拟速度、传送车辆或重启比赛。

目前整个功能仍处于实验阶段，仅在 "surfaces.ini" 中明确允许应用自定义 AI 的赛道上可用。这只是一个临时措施，以确保在此阶段具有所有这些模拟控制选项的情况下不会干扰任何竞技内容。

## 入门指南

要激活自定义 AI：

- 打开 "assettocorsa/extension/config/new_behaviour.ini"，找到 `CUSTOM_AI` 节并将 `ENABLED` 设为 1。还有其他选项可用于在需要时加快加载和整体性能。（同时确保整个 "New Behavior" 模块也已启用。）

- 打开要使用的赛道的 "surfaces.ini"，[激活扩展物理](../track/physics/general-options)，然后在同一文件中添加 `[_EXTRA_PERMISSIONS] ALLOW_CUSTOM_AI_MANIPULATION=1`。

## 第一步

开始时，想要控制特定车辆的外部工具应创建一个新的内存映射文件，名为 `AcTools.CSP.NewBehaviour.CustomAI.CarControls<N>.v0`（其中 `<N>` 是从 0 开始的车辆索引），其结构如下（初始填充零或类似值）：

```cpp
struct cai_car_controls { 
  /* 所有结构按 4 字节对齐 */

  float gas;
  float brake;
  float clutch;
  float steer; /* 将转向值归一化从 -1 到 1 */
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

  byte teleport_to; /* 设为 1 传送到维修区，设为 2 传送到 teleport_pos */
  bool autoclutch_on_start;
  bool autoclutch_on_change;
  bool autoblip_active;

  float3 teleport_pos; /* 三个 float，共 12 字节 */
  float3 teleport_dir; /* 注意：在 0.1.79 之前错误地反转了 */

  bool autoshift_active;
}
```

它可以在 Assetto Corsa 启动后创建，但一旦 CSP 检测到它，就会快速将该车辆的原始控制器替换为使用该文件数据作为新车辆输入的自定义控制器。数据以 333 Hz 读取，但更新频率可以更低。当这发生时，CSP 还会创建一个名为 `AcTools.CSP.NewBehaviour.CustomAI.Car<N>.v0` 的新内存映射文件。在该文件中，CSP 将提供 `cai_car_data` 结构形式的车辆状态详细描述（其中包含四个 `cai_wheel_data`）：

```cpp
struct cai_car_data {
  int packet_id; /* 更新时递增 */
  float gas;
  float brake;
  float clutch;
  float steer; /* 转向角度（度） */
  float handbrake;
  float fuel;
  int gear;
  float rpm;
  float speed_kmh;
  float3 velocity;
  float3 acc_g;  /* G 力（Z 为加速力，X 为左/右力） */
  float3 look;   /* 车辆方向 */
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
  float spline_position;      /* AI 样条线上的位置 (fast_lane.ai) */
  float collision_depth;      /* 当前碰撞深度（米） */
  uint collision_counter;     /* 碰撞时递增 */
  uint wheels_valid_surface;  /* 如果第 N 位置位，第 N 个轮子在有效的
      赛道表面上；如果所有轮子都在有效表面上则为 15 (1|2|4|8)；
      在 0.1.79 中添加。 */
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

总结一下，如果外部应用想要控制模拟中的第二辆车，它应该：

- 创建一个新的内存映射文件 `AcTools.CSP.NewBehaviour.CustomAI.CarControls1.v0`，大小为 `cai_car_controls` 结构，填充零（或者刹车设为 1）；
- 等待 CSP 创建 `AcTools.CSP.NewBehaviour.CustomAI.Car1.v0`；
- 如果找到文件，打开它，映射它，然后开始循环读取车辆状态并输出控制；
- 如果文件未被创建，可能是因为自定义 AI 未启用、赛道不允许自定义 AI 或该车辆无法被控制（例如在线的远程车辆）。

## 其他车辆在哪里

激活自定义 AI 后，CSP 将以 60 Hz（或任何 FPS）在 `AcTools.CSP.NewBehaviour.CustomAI.CarPublic<N>.v0` 文件中发布所有车辆的信息。这些信息更加简化（主要是因为在线远程车辆的数据有限），但希望能满足 AI 的需求：

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

## 控制模拟

要控制模拟状态，创建一个新文件 `AcTools.CSP.NewBehaviour.CustomAI.SimState.v0` 并用以下结构填充：

```cpp
struct cai_sim_control {
  bool pause;               /* 设为 1 暂停模拟 */
  bool restart_session;     /* 设为 1 重启当前会话 */
  bool disable_collisions;  /* 设为 1 禁用碰撞 */
  byte extra_sleep_ms;      /* 如果你的 AI 在开发中需要一些时间来计算答案，
                               此选项可以减慢模拟速度 */
};
```

从 0.2.8 开始，你还可以通过 `AcTools.CSP.NewBehaviour.CustomAI.SimState.v1`（使用 "v1" 而非 "v0" 以保持兼容性）控制模拟时间来加速：

```cpp
struct cai_sim_control {
  bool pause;               /* 设为 1 暂停模拟 */
  bool restart_session;     /* 设为 1 重启当前会话 */
  bool disable_collisions;  /* 设为 1 禁用碰撞 */
  byte extra_sleep_ms;      /* 如果你的 AI 在开发中需要一些时间来计算答案，
                               此选项可以减慢模拟速度 */
  float time_scale;         /* 1 为正常模拟时间比例，增大以使时间流逝更快 */
};
```

## 绘制调试线

出于调试目的，你还可以绘制一些调试线。为此，创建一个新文件 `AcTools.CSP.NewBehaviour.CustomAI.DebugLines.v0`，大小至少为 16 KB，并在其中写入以下 `cai_debug_lines` 结构：

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

## 示例

[这里有一个基本的 C# 程序，展示了如何连接、设置输入、控制模拟状态和绘制调试线](https://gist.github.com/gro-ove/11489f32b3eb3c9e3df1e7819bb3008e)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Other-Things-–-Custom-AI) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
