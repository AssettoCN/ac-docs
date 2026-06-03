---
title: 启用扩展物理
---

# 启用扩展物理（Enabling Extended Physics）

与所有其他专注于与原始 AC 兼容的功能不同，所有物理扩展需要专门修改的车辆数据：这样，现有的车辆不会有任何不同的行为，而使用新功能的车辆在没有补丁的 AC 中将无法工作。

新功能的支持可以在 AC Custom Shaders Discord 服务器的 cphys-support-only 或 mod-talk 频道中找到。

请参阅每个页面（空气动力学、悬挂等）以获取功能和实现信息。注意：所有功能列表和示例代码将尽最大努力保持最新——将不提供对已弃用功能的支持。

---

## 启用扩展物理

为确保所有人都在相同的条件下比赛，要使用扩展车辆物理的任何功能，你需要先启用扩展物理。为此，打开 `car.ini`，找到 `[HEADER]` 部分，并将 `VERSION` 值添加 `extended-` 前缀，如下所示：

```ini
[HEADER]
VERSION=extended-2
```

## 版本锁定（1.74+ 仅限）

```ini
[HEADER]
VERSION=extendedV2-1 ;末尾仍然可以是 1 或 2

[_EXTENSION]
REQUIRED_VERSION=2142 ;这里使用 1.79 版本代码作为示例。可以在 CM->Settings->CSP->About 中找到，标题为 "Shaders Patch version ID"
```

## 工作原理

核心思想是：原始 AC 如果遇到该 `VERSION` 值会崩溃（因为它无法将该值解析为整数）。而 Custom Shaders Patch 则会捕获该值，阻止 AC 崩溃，并将加载的车辆标记为可以使用扩展物理的车辆。

接下来请参考：
- [动力传动系统](./powertrain)
- [悬挂系统](./suspension)
- [转向系统](./steering)
- [轮胎物理](./tyre-physics)
- [牵引力控制](./traction-control)
- [物理脚本](./physics-scripts)

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Enabling-extended-physics) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
