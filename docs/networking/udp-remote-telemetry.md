---
title: UDP 远程遥测
---

> **出处**：本文翻译自 Kunos Simulazioni 程序员 Giovanni Romagnoli 撰写的 AC 官方遥测协议文档（2014 年原版）。
> [原文（Google Docs）](https://docs.google.com/document/d/1KfkZiIluXZ6mMhLWfDX1qAGbvhGRC3ZUzjVIt5FQpp4/pub) · [本地原始存档](https://github.com/AssettoCN/ac-docs/blob/main/reference/ac-udp-remote-telemetry/ac-remote-telemetry.md) · [发现渠道：assettocorsamods 论坛帖（2014-07-28）](https://assettocorsamods.net/threads/doc-ac-udp-remote-telemetry.60/)
>
> 译文忠实原文，未添加原文以外的信息；结构体名等协议标识按原文保留。

::: warning 原文未涵盖
如何在游戏内开启远程遥测（相关配置方法）原文未涵盖，本文不作展开。
:::

本文档帮助你搭建应用程序与 Assetto Corsa 之间的 UDP socket 通信。所有代码示例使用 [codepad.org](http://codepad.org/) 编写。

所有代码片段遵循 C++ 语法。运行 Assetto Corsa 的 PC 在下文中称为 **ACServer**。

- int 为 32 位小端（little endian）整数
- float 为 32 位浮点数
- bool 为 8 位布尔值

## 1) 通过 UDP 连接 AC 进行远程遥测：握手

### 1.1) 客户端发起与 AC 远程遥测服务器的通信

通过 UDP 连接 Assetto Corsa 并接收远程遥测数据的握手过程如下：你的应用首先必须创建一个 UDP socket，并连接到运行 Assetto Corsa 的 PC 的地址（ACServer）。连接端口号为

**9996**

你的应用必须按以下格式发送一个结构化数据：

```cpp
struct handshaker
{
    int identifier;
    int version;
    int operationId;
};
```

握手阶段需要 3 个整数：

- **int identifier**：[在当前版本的 AC 远程遥测中未使用] 在未来版本中，它将标识客户端的平台类型，用于为每个平台调整特定行为：
  - eIPhoneDevice=0
  - eIPadDevice=1
  - eAndroidPhone=2
  - eAndroidTablet=3
- **int version**：[在当前版本的 AC 远程遥测中未使用] 在未来版本中，此字段将标识设备期望使用的 AC 远程遥测版本。
- **int operationId**：客户端所请求的操作类型。目前提供以下操作：
  - **HANDSHAKE = 0**：客户端想要开始通信时设置此操作标识。
  - **SUBSCRIBE_UPDATE = 1**：客户端想要从特定 ACServer 接收更新时设置此操作标识。
  - **SUBSCRIBE_SPOT = 2**：客户端只想在 SPOT 事件（例如：一圈结束）发生时从特定 ACServer 接收更新时设置此操作标识。
  - **DISMISS = 3**：客户端想要结束与 ACServer 的通信时设置此操作标识。

总结：第一阶段握手中，你的应用需要向 ACServer 发送以下结构化数据

```cpp
struct handshaker;
handshaker.identifier   = 1;
handshaker.version      = 1;
handshaker.operationId  = 0;
```

### 1.2) AC 远程遥测服务器响应客户端

发送 1.1 节的结构化数据后，你的应用将收到以下结构体作为响应

```cpp
struct handshackerResponse
{
    char carName[50];
    char driverName[50];
    int identifier;
    int version;
    char trackName[50];
    char trackConfig[50];
};
```

- **char carName[50]**：玩家在 AC Server 上驾驶的车辆名称
- **char driverName[50]**：AC Server 上正在驾驶的车手名称
- **int identifier**：目前恒为 4242，此代码将用于标识不同状态，例如连接"不可用（NOT AVAILABLE）"
- **int version**：目前设为 1，将标识 AC Server 上运行的版本
- **char trackName[50]**：AC Server 上的赛道名称
- **char trackConfig[50]**：赛道配置（track configuration）

你的应用需要解析这个结构化数据以获取信息。

这一步用于确认我们连接的是哪位车手。

### 1.3) AC 客户端确认连接

客户端再次发送与 1.1 节相同的结构化数据：

```cpp
struct handshaker
{
    int identifier;
    int version;
    int operationId;
};
```

此时 operationId 必须为以下选项之一：

- **SUBSCRIBE_UPDATE = 1**：客户端想要从特定 ACServer 接收更新时设置此操作标识。
- **SUBSCRIBE_SPOT = 2**：客户端只想在 SPOT 事件（例如：一圈结束）发生时从特定 ACServer 接收更新时设置此操作标识。

此阶段之后，客户端被加入 AC 远程遥测的监听者列表。

## 2) ACServer 向客户端推送数据

每个物理步（physics step），ACServer 都会向所有监听者调用更新函数。

- 如果客户端以 SUBSCRIBE_UPDATE 标识订阅，它将收到以下结构化数据

```cpp
struct RTCarInfo
{
    char identifier;
    int size;
    float speed_Kmh;
    float speed_Mph;
    float speed_Ms;
    bool isAbsEnabled;
    bool isAbsInAction;
    bool isTcInAction;
    bool isTcEnabled;
    bool isInPit;
    bool isEngineLimiterOn;
    float accG_vertical;
    float accG_horizontal;
    float accG_frontal;
    int lapTime;
    int lastLap;
    int bestLap;
    int lapCount;
    float gas;
    float brake;
    float clutch;
    float engineRPM;
    float steer;
    int gear;
    float cgHeight;
    float wheelAngularSpeed[4];
    float slipAngle[4];
    float slipAngle_ContactPatch[4];
    float slipRatio[4];
    float tyreSlip[4];
    float ndSlip[4];
    float load[4];
    float Dy[4];
    float Mz[4];
    float tyreDirtyLevel[4];
    float camberRAD[4];
    float tyreRadius[4];
    float tyreLoadedRadius[4];
    float suspensionHeight[4];
    float carPositionNormalized;
    float carSlope;
    float carCoordinates[3];
};
```

- **char identifier**：设为字符 "a"，用于表明该结构化数据就是客户端应用想要的数据
- **int size**：结构化数据的大小（字节）。

- 如果客户端以 SUBSCRIBE_SPOT 标识订阅，则每当 SPOT 事件触发时（例如一圈结束），它将收到以下结构化数据。与 SUBSCRIBE_UPDATE 不同，此事件将覆盖 AC 会话中的所有车辆：

```cpp
struct RTLap
{
    int carIdentifierNumber;
    int lap;
    char driverName[50];
    char carName[50];
    int time;
};
```

你的应用需要在本地解析 ACServer 发来的结构化数据

## 3) 注销 AC 客户端

客户端要注销自己，必须发送以下数据包（与 1.1 节相同）

```cpp
struct handshaker
{
    int identifier;
    int version;
    int operationId;
};
```

其中 operationId 设为 **DISMISS = 3**。

该客户端将被从监听者列表中移除，ACServer 会忘掉它，不再向其发送更新。若要重新连接，重新执行 1.1 或 1.2 节的步骤即可。
