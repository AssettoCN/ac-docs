---
title: 物理脚本
---

# 物理脚本（Physics Scripts）

从 0.1.77 更新开始，可以使用 Lua 脚本来扩展车辆物理。只需在车辆数据文件夹中创建一个 "script.lua" 文件，如果启用了扩展物理，它就会工作。如果数据已解包，编辑脚本后会实时重新加载。

## 可用功能

- 基础功能：
  - 访问当前车辆状态；
  - 访问频繁更新的详细车辆物理状态；
  - 修改车辆状态：
    - 齿轮研磨标志；
    - 车辆损坏；
    - 引擎损坏；
    - 变速箱损坏；
    - 引擎 RPM；
    - 是否启用熄火；
    - 轮胎充气（设为 0 使其爆胎）；
  - 修改用户控制；
  - 使用最多 8 个可由动态物理控制器和车辆仪表输入访问的值（例如，复杂逻辑可以通过这种方式绑定到差速器）；
  - 为车辆车身添加额外的力。
- 0.1.78 新增：
  - 移动车辆碰撞箱；
  - 设置空气动力学翼面增益。

更多功能将很快添加。

## 几个简短示例

### 使用 Extra A 开关在引擎功率 LUT 之间切换

```lua
local carPh = ac.accessCarPhysics()
local powerBase = ac.DataLUT11.carData(car.index, 'power.lut')
local powerAlt = ac.DataLUT11.carData(car.index, 'power_alt.lut')

function script.update(dt)
  local activeLUT = car.extraA and powerAlt or powerBase
  ac.overrideEngineTorque(activeLUT:get(carPh.rpm))
end
```

### 如果引擎水温超过 95 度则引擎爆炸

```lua
function script.update(dt)
  if car.waterTemperature > 95 then
    ac.accessCarPhysics().engineLifeLeft = 0
  end
end
```

### 重新排列 H 型挡位车辆中的齿轮，使一挡变为倒挡（狗腿式变速箱）

```lua  
function script.update(dt)
  local data = ac.accessCarPhysics()
  if data.requestedGearIndex == 2 then
    -- 如果请求一挡，切换到倒挡
    data.requestedGearIndex = 0
  elseif data.requestedGearIndex > 2 then
    -- 如果请求一挡以上，向下移一位
    data.requestedGearIndex = data.requestedGearIndex - 1
  else
    -- 否则，设为空挡
    data.requestedGearIndex = 1
  end
end
```

### 如果 G 力过于极端超过一秒则熄火一秒

```lua
local counter = 0
local stalledFor = 0

function script.update(dt)
  local data = ac.accessCarPhysics()
  if math.abs(data.gForces.x) > 2 then
    counter = counter + dt
  else
    counter = 0
  end

  if counter > 2 then
    -- 如果 G 力超过阈值超过两秒，激活熄火一秒
    stalledFor = 1
  end

  if stalledFor > 0 then
    -- 如果已熄火，锁定油门踏板为 0
    stalledFor = stalledFor - dt
    data.gas = 0
  end
end
```

### 喷气引擎在车速超过 40 km/h 时使用 Extra A 开关激活

（常规车辆脚本可以添加音频和粒子效果，另外车辆配置中的 `[EXTRA_SWITCHES] SWITCH_A_FLAGS = HOLD_MODE` 可能有用）

```lua
function script.update(dt)
  local data = ac.accessCarPhysics()
  local jetActive = car.extraA and car.speedKmh > 40
  data.controllerInputs[0] = jetActive and 1 or 0
  if jetActive then
    ac.addForce(vec3(0, 0, -2), true, vec3(0, 0, 5000), true)
  end
end
```

### 使用自定义脚本设置项

```ini
[CUSTOM_SCRIPT_ITEM_0]
ID=SOME_ID_0
SHOW_CLICKS=0
TAB=SOME TAB
NAME=Some Setup Item
MIN=70
MAX=95
STEP=1
DEFAULT=88
POS_X=0.5
POS_Y=1
HELP=This does something
```

```lua
ac.setScriptSetupValue("CUSTOM_SCRIPT_ITEM_0", 72)

function script.update(dt)
  ac.debug("Some Setup Item", ac.getScriptSetupValue("CUSTOM_SCRIPT_ITEM_0")()) -- 输出 72
end
```

## Lua 入门

[这里](https://github.com/ac-custom-shaders-patch/acc-lua-sdk) 是 Lua 脚本的入门介绍。更多示例可以在[这里](https://github.com/ac-custom-shaders-patch/acc-lua-examples/tree/main/cars_physics)找到。

相关内容：[启用扩展物理](./enabling)、[牵引力控制](./traction-control)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Physics-scripts) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
