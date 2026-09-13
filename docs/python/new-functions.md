---
title: 新增函数
---


> 汉化标题：Python 应用 – 新增函数  
> 原文页面：Python-Apps-–-New-functions  
> 原文锚点：37527be  
> 汉化时间：2026-09-12T19:00:00+08:00  

CSP 为 Python 应用添加了一些新函数，下面是带参数名与返回类型的完整列表。每当函数需要向量参数（如 vec2、vec3 或 vec4）时，可以直接传入相应数量的数字，也可以把它们打包成元组传入。

另见官方与非官方 Python 文档：https://assettocorsamods.net/threads/doc-python-doc.59/
共享内存参考：https://assettocorsamods.net/threads/doc-shared-memory-reference.58/
入门指南：https://assettocorsamods.net/threads/getting-started-with-ac-app-developing.716/#post-2892

```py
# 赛道控制：

def ac.ext_applyTrackConfig(config: str, flags: int):
  # flags：1<<0 表示恢复条件，1<<1 表示部分更新
def ac.ext_setTrackConditionInput(conditionName: str, value: float):

# 后视镜（需要启用 Real Mirror）：

def ac.ext_mirrorLeft():
def ac.ext_mirrorRight():
def ac.ext_mirrorUp():
def ac.ext_mirrorDown():
def ac.ext_mirrorFovUp():
def ac.ext_mirrorFovDown():
def ac.ext_mirrorAspectRatioUp():
def ac.ext_mirrorAspectRatioDown():
def ac.ext_mirrorToggleMon():
def ac.ext_mirrorPrev():
def ac.ext_mirrorNext():
def ac.ext_mirrorCurrent() -> int:
def ac.ext_mirrorParams() -> (isMonitor: bool, fov: float, aspectMult: float, role: int, index: int):

# 翻转后视镜（自 0.1.76 起可用，1 表示水平翻转，2 表示垂直翻转，3 表示两者）：

def ac.ext_mirrorGetFlip() -> int:
def ac.ext_mirrorSetFlip(flip: int) -> int:

# G27 LED：

def ac.ext_isG27Available() -> bool:
def ac.ext_setG27Thresholds(minRpm: float, maxRpm: float):

# 通用函数：

def ac.ext_patchVersion() -> str:
def ac.ext_patchVersionCode() -> int:

def ac.ext_weatherDebugText() -> str:
  
def ac.ext_setStrictMode():    # 激活严格模式，可获得更好的错误报告，推荐使用
def ac.ext_pauseWhenHidden():  # 允许应用在非活动状态时暂停
def ac.ext_isAnyAppVisible() -> bool:
def ac.ext_isAppVisible(appName: str) -> bool:
  
def ac.ext_perfBegin(key: str?):
  # 开始测量耗时
def ac.ext_perfEnd(key: str?) -> float:  
  # 停止测量耗时，返回毫秒时间，并显示在 Python Debug 应用中

def ac.ext_loadIniFileAsJson(filename: str, includeDir0: str?, includeDir1: str?, includeDir2: str?) -> str:
  # 问号表示该参数可选
def ac.ext_parseIniAsJson(iniData: str) -> str:

def ac.ext_getBaseAltitude() -> float:
def ac.ext_getAltitude(car: int) -> float:
  
def ac.ext_setDriverVisible(visible: bool, carIndex: int):
def ac.ext_setDoorsOpen(doorOpen: bool, carIndex: int):

def ac.ext_isExtendedPhysics(car: int) -> bool:
def ac.ext_getTyreGrain(car: int, tyre: int) -> float: 
def ac.ext_getHeadlights(car: int) -> bool:
def ac.ext_getHandbrake(car: int) -> float:
def ac.ext_getTyreIsHot(car: int, tyre: int) -> bool:
def ac.ext_getTyreTempMult(car: int, tyre: int) -> float:
def ac.ext_getTyreBlister(car: int, tyre: int) -> float:
def ac.ext_getTyreFlatSpot(car: int, tyre: int) -> float:
def ac.ext_getTyreVirtualKM(car: int, tyre: int) -> float:
def ac.ext_getTyreCarcassTemp(car: int, tyre: int) -> float:

def ac.ext_getSuspensionTravel(corner: int) -> float:  # ! 在 csp 0.1.77-prev80 及之前版本中损坏
def ac.ext_getDamperTravel(corner: int) -> float:      # ! 在 csp 0.1.77-prev80 及之前版本中损坏

def ac.ext_getTcSetting1(car: int) -> int:
def ac.ext_getTcSetting2() -> int:
def ac.ext_getAeroSpeed() -> float:
def ac.ext_getDrag() -> float:
def ac.ext_getDownforce(selection: int) -> float:
def ac.ext_getStaticDeflection() -> float:
def ac.ext_getCurrentTorque() -> float:
def ac.ext_getBrakeCoreTemp(corner: int) -> float:
def ac.ext_getSteerTorque() -> float:
def ac.ext_getBrakeTorque(corner: int) -> float:
def ac.ext_getTireLoadedRadius(corner: int) -> float:

def ac.ext_isTripleScreenCamera() -> bool:
def ac.ext_isInVR() -> bool:
def ac.ext_getCameraDirection() -> vec3:  # vec3 是包含 3 个元素的元组
def ac.ext_getCameraPosition() -> vec3:
def ac.ext_setCameraPosition(pos: vec3):
def ac.ext_getCameraPositionAxis(axis: int) -> float:
def ac.ext_setCameraPositionAxis(axis: int, value: float):
def ac.ext_setCameraDirection(forward: vec3, up: vec3?):
def ac.ext_getCameraMatrix() -> mat4x4:  # mat4x4 是包含 16 个元素的元组
def ac.ext_getCameraRollRad() -> float:  # rad 表示结果为弧度
def ac.ext_getCameraPitchRad() -> float:
def ac.ext_getCameraYawRad() -> float:
def ac.ext_getCameraFov() -> float:
def ac.ext_setCameraFov(value: float):
def ac.ext_getCameraDofFactor() -> float:
def ac.ext_setCameraDofFactor(value: float):
def ac.ext_getCameraDofFocus() -> float:
def ac.ext_setCameraDofFocus(value: float):
def ac.ext_getCameraClipNear() -> float:
def ac.ext_setCameraClipNear(value: float):
def ac.ext_getCameraClipFar() -> float:
def ac.ext_setCameraClipFar(value: float):
def ac.ext_currentPpFilter() -> str:

def ac.ext_getReplayFrameMS() -> float:  # 帧时间，单位毫秒
def ac.ext_getReplayFrames() -> int:     # 已录制的帧数
def ac.ext_getReplayPosition() -> int:   # 帧索引
def ac.ext_setReplayPosition(frameIndex: int):

def ac.ext_getCurrentCamera() -> int:
def ac.ext_setCurrentCamera(mode: int):
def ac.ext_getCurrentDrivableCamera() -> int:
def ac.ext_setCurrentDrivableCamera(mode: int):
def ac.ext_getTrackCamerasNumber() -> int:
def ac.ext_getCurrentTrackCamera() -> int:
def ac.ext_setCurrentTrackCamera(setIndex: int):
def ac.ext_getAudioVolume() -> float:
def ac.ext_setAudioVolume(volume: float):

def ac.ext_getPreviousSectorTime() -> str:
def ac.ext_getCurrentSector() -> int:

def ac.ext_isButtonPressed(keyIndex: int) -> bool:
def ac.ext_isCtrlPressed() -> bool:
def ac.ext_isAltPressed() -> bool:
def ac.ext_isShiftPressed() -> bool:
def ac.ext_isJoystickButtonPressed(controllerIndex: int, buttonIndex: int) -> bool:
def ac.ext_getJoystickAxisValue(controllerIndex: int, axisIndex: int) -> float:
def ac.ext_getJoystickDpadValue(controllerIndex: int, dpadIndex: int) -> int:

def ac.ext_setClipboardData(text: str):
def ac.ext_isVirtualMirrorForced() -> bool:
def ac.ext_markLapAsSpoiled():
def ac.ext_getCameraPositionRelativeToCar() -> vec3:
def ac.ext_getCompassAngle(direction: vec3) -> float: 
  # 将方向转换为航向角（度）
def ac.ext_dirname() -> str:
  # Python 应用文件夹的路径
def ac.ext_getSplineLength(splineIndex: int) -> float:
  # 0 表示主样条（即整条赛道的长度），1 表示维修区样条
def ac.ext_worldToSpline(splineIndex: int, worldPos: vec3) -> float:
def ac.ext_splineToWorld(splineIndex: int, splinePos: float) -> vec3:

def ac.ext_storeLua(key: str, value: float or string):
def ac.ext_loadLua(key: str) -> float or string:

def ac.ext_getStateAbs(carIndex: int) -> int:
def ac.ext_getStateAbsActive(carIndex: int) -> bool:
def ac.ext_getStateTc(carIndex: int) -> int:
def ac.ext_getStateTcActive(carIndex: int) -> bool:

def ac.ext_pauseFsWatching():
def ac.ext_resumeFsWatching():

def ac.ext_resetCar():       # 将车辆重置回路面并使圈速无效
def ac.ext_takeAStepBack():  # 将车辆后退一步并使圈速无效
def ac.ext_weatherFxActive() -> bool:
def ac.ext_weatherTimeOffset(offset: float) -> bool:
def ac.ext_getWeatherTimeMult() -> float:
def ac.ext_setWeatherTimeMult(value: float):
def ac.ext_isVaoPatchLoaded() -> bool:
def ac.ext_vaoOnly():
def ac.ext_vaoNormalDebug():
def ac.ext_vaoDisable():
def ac.ext_vaoNormal():
def ac.ext_setVaoActive(active: bool):

def ac.ext_getWiperSpeedsNumber() -> int:
def ac.ext_getWiperSpeed() -> int:
def ac.ext_setWiperSpeed(wiperSpeed: int):

def ac.ext_getCameraProj() -> mat4x4:
def ac.ext_getCameraView() -> mat4x4:
def ac.ext_getLightsNum() -> int:
def ac.ext_getCarLightsNum() -> int:
def ac.ext_getTrackLightsNum() -> int:
def ac.ext_getLightsVisible() -> int:
def ac.ext_getCarLightsVisible() -> int:
def ac.ext_getTrackLightsVisible() -> int:
def ac.ext_getLightsMirrorVisible() -> int:
def ac.ext_getCarLightsMirrorVisible() -> int:
def ac.ext_getTrackLightsMirrorVisible() -> int:
def ac.ext_getAmbientMult() -> float:
def ac.ext_getAngleSpeed() -> float:
def ac.ext_debugLights(nameFilter: str, count: int, distance: float, mode: int):

# 扩展渲染函数：

def ac.ext_glSetCullMode(mode: int): 
  # mode：0 表示正面剔除，1 表示背面剔除，2 表示不剔除，4 表示线框，7 表示抗锯齿线框
def ac.ext_glSetBlendMode(mode: int):
  # mode：0 表示不透明，1 表示 alpha 混合，2 表示 alpha 测试，4 表示叠加，5 表示乘法
def ac.ext_mirrorTexture() -> int:
  # 返回纹理索引，用法与 ac.createTexture() 相同
def ac.ext_releaseMirrorTexture():
  # 每次调用 ac.ext_mirrorTexture() 后，在不再需要该纹理时调用它，
  # 以重新激活真实后视镜
def ac.ext_createRenderTarget(width: int, height: int, mips: bool) -> int:
  # 返回纹理索引，该编号同时也可用于在其上绘制内容
def ac.ext_clearRenderTarget(rtIndex: int):
def ac.ext_generateMips(rtIndex: int):
def ac.ext_disposeRenderTarget(rtIndex: int):
def ac.ext_bindRenderTarget(rtIndex: int):
  # 开始绘制到渲染目标
def ac.ext_restoreRenderTarget():
  # 恢复原始渲染目标，以继续在其中绘制应用
def ac.ext_glSetTexture(textureIndex: int, slotIndex: int):
  # 绑定纹理
def ac.ext_glLoadPixelShader(filename: str) -> int:
  # 加载像素着色器（本文末尾有示例）
def ac.ext_glSetPixelShader(shaderIndex: int):
  # 后续绘制调用将使用该自定义着色器
def ac.ext_glResetPixelShader():
  # 恢复为原始像素着色器
def ac.ext_glVertexTex(posUV: vec4):
  # 添加一个带纹理坐标的新顶点，与 ac.glBegin() 和 ac.glEnd() 配合使用
  # vec4 是包含四个值的元组
def ac.ext_glTexCoord2f(uv: vec2):
  # 为先前添加的顶点添加纹理坐标
  # vec2 是包含两个值的元组
def ac.ext_glFontCreate(font: str, size: float, italic: int, weight: int) -> int:
def ac.ext_glFontColor(fontIndex: int, color: vec4):
def ac.ext_glFontUse(fontIndex: int, text: str, pos: vec2, scale: float, alignment: int):
  # 使用已创建的字体绘制文本
  # alignment：0 表示左对齐，1 表示右对齐，2 表示居中

```

# 自定义绘制示例着色器

```c
// 默认绑定的 AC 纹理采样器：

SamplerState samPoint : register(s2) {
  Filter = POINT;
  AddressU = WRAP;
  AddressV = WRAP;
};

SamplerState samLinear : register(s5) {
  Filter = LINEAR;
  AddressU = WRAP;
  AddressV = WRAP;
};

struct VS_IN {
  float4 PosH : SV_POSITION;
  float4 Color : COLOR;
  float2 Tex : TEXCOORD;
  float3 Tangent : TANGENT;
};

// 要绘制的常规纹理：

Texture2D txDiffuse : register(t0);

// 实际代码：

float4 main(VS_IN pin) : SV_TARGET {
  return 1 - txDiffuse.Sample(samLinear, pin.Tex); // 一个简单的反色示例
}
```

