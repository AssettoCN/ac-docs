---
title: 物理脚本
---


> 汉化标题：车辆 – 物理脚本  
> 原文页面：Cars-–-Physics-scripts  
> 原文锚点：3aa4bff  
> 汉化时间：2026-09-11T23:30:00+08:00  

自 0.1.77 更新起，可以使用 Lua 脚本来扩展车辆物理。只需在车辆数据文件夹中创建一个 `script.lua`，在启用扩展物理时它就会生效。若数据已解包，编辑脚本后还会实时重新加载。

### 可用功能

- 基础功能：
  - 访问当前车辆状态；
  - 访问高频更新的详细车辆物理状态；
  - 修改车辆状态：
    - 打齿标志；
    - 车辆损坏；
    - 发动机损坏；
    - 变速箱损坏；
    - 发动机转速；
    - 是否启用熄火；
    - 轮胎气压（设为 0 可使其爆胎）；
  - 修改用户控制；
  - 使用最多 8 个可被动态物理控制器和车辆仪表输入访问的值（例如，可以通过这种方式将复杂逻辑绑定到差速器上）；
  - 向车身施加额外的力。
- 0.1.78 新增：
  - 移动车辆盒形碰撞体；
  - 设置空气动力学翼片增益。

更多功能将陆续加入。

### 一些简短示例

- 使用 Extra A 开关在发动机功率 LUT 之间切换：

  ```lua
  local carPh = ac.accessCarPhysics()
  local powerBase = ac.DataLUT11.carData(car.index, 'power.lut')
  local powerAlt = ac.DataLUT11.carData(car.index, 'power_alt.lut')

  function script.update(dt)
    local activeLUT = car.extraA and powerAlt or powerBase
    ac.overrideEngineTorque(activeLUT:get(carPh.rpm))
  end
  ```

- 若发动机水温超过 95 度则令发动机爆炸：

  ```lua
  function script.update(dt)
    if car.waterTemperature > 95 then
      ac.accessCarPhysics().engineLifeLeft = 0
    end
  end
  ```

- 在带 H 挡杆的车辆上重新编排挡位，使一挡变为倒挡，用于[狗腿式变速箱](https://www.youtube.com/watch?v=rQf2MYU5QC0)：

  ```lua  
  function script.update(dt)
    local data = ac.accessCarPhysics()
    if data.requestedGearIndex == 2 then
      -- 若请求一挡，切换为倒挡
      data.requestedGearIndex = 0
    elseif data.requestedGearIndex > 2 then
      -- 若请求一挡以上，则降一挡
      data.requestedGearIndex = data.requestedGearIndex - 1
    else
      -- 否则，设为空挡
      data.requestedGearIndex = 1
    end
  end
  ```

- 若 G 力过于极端持续超过一秒，则将发动机熄火一秒：

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
      -- 若 G 力超过阈值持续两秒以上，则熄火一秒
      stalledFor = 1
    end

    if stalledFor > 0 then
      -- 若已熄火，将油门踏板锁定为 0
      stalledFor = stalledFor - dt
      data.gas = 0
    end
  end
  ```

- 当车速超过 40 km/h 时，通过 Extra A 开关激活喷气发动机（常规车辆脚本可以添加音频和粒子效果，另外车辆配置中的 `[EXTRA_SWITCHES] SWITCH_A_FLAGS = HOLD_MODE` 或许也有帮助）：

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

- 使用自定义脚本设置项

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
  ac.setScriptSetupValue(("CUSTOM_SCRIPT_ITEM_0", 72)

  function script.update(dt)
    ac.debug("Some Setup Item",ac.getScriptSetupValue("CUSTOM_SCRIPT_ITEM_0")()) -- 输出 72
  end
  ```

- 涡轮运转时强制向发动机压入更多空气（`carPh.turboBoost` 需 0.3.0-preview445 或更新版本才能工作，旧版本如有必要可改用 `car` 中的值）：


  ```lua
  local carPh = ac.accessCarPhysics()

  function script.update()
    ac.overrideGasInput(carPh.turboBoost > 0 and math.lerp(carPh.gas, 1, math.min(1, carPh.turboBoost)) or math.huge)
  end
  ```

### Lua 简介

[这里](https://github.com/ac-custom-shaders-patch/acc-lua-sdk)是 Lua 脚本编写的入门介绍。更多示例可在[这里](https://github.com/ac-custom-shaders-patch/acc-lua-examples/tree/main/cars_physics)找到。

