---
title: 音频模组管线
---

# 音频模组管线

AC EVO Audio Modding Pipeline — 使用 FMOD Studio 为车辆创建自定义音频包的完整工作流。

## 更新日志 {#changelog}

- **2026 年 6 月 3 日**：V1 初始版本

## 前置条件 {#prerequisites}

- **FMOD Studio v2.03.13** — [下载页面](https://www.fmod.com/download)
- FMOD 基础知识

## FMOD 脚本安装 {#script-installation}

在 `acevo_content\tools\scripts` 文件夹中找到 `fmodScript.js` 文件，将其复制到你的 FMOD `scripts` 文件夹中（默认路径为 `C:\Program Files\FMOD SoundSystem\FMOD Studio 2.03.13\scripts`）。后续步骤将在 FMOD Studio 中使用此脚本。

![FMOD 脚本安装位置](/evo/audio/image7.png)

## 准备 FMOD 模组项目 {#prepare-project}

打开 FMOD modding 项目，主工作区应自动显示（快捷键 `CTRL + 1`）。你将看到所有可编辑的 Event，稍后将它们分配到编辑器中的车辆上。

**工作流** 如下：

1. 通过脚本 Fork（派生）Event
2. 通过脚本创建新的 Master Bank
3. 删除旧的 Master Bank（及其关联的默认 Event）
4. 进行你自己的音频编辑（本文档不涉及此部分）
5. 构建 Sound Bank

![FMOD 模组项目工作区 — 带 template 后缀的 Event 列表](/evo/audio/image8.png)

### 步骤 1：Fork 模板 Event

如你所见，每个 Event 都带有 `template` 后缀。**默认 Event 不得直接使用**，否则会与其他车辆产生冲突。

1. 选中所有带 `template` 后缀的 Event（如上图所示）。
2. 打开顶部菜单 **Scripts → Mod Tools → Fork Selected \*\_template**。
3. 脚本将生成所选 Event 的完整副本，并附带新的后缀。
   - 你可以通过文本编辑器修改脚本来自定义后缀名称。

![Fork 脚本执行结果 — 新建的 Event 副本](/evo/audio/image6.png)

**最佳实践**：将 Event 后缀设为对应模组车辆文件夹的名称。

脚本会自动将默认 Event 从原始 Master Bank 中取消分配，保持项目整洁。

### 步骤 2：克隆 Master Bank

下一步是克隆 `master_bank`。选择 **Banks** 标签页，选中 `master_bank_template`，然后运行 **Scripts → Clone Selected Banks** 脚本。

![Clone Selected Banks 脚本菜单](/evo/audio/image5.png)

![克隆后的 master_bank 结果](/evo/audio/image1.png)

执行后将得到 `master_bank_template` 的完整副本。

### 步骤 3：标记新的 Master Bank

1. 右键点击新创建的 Bank，选择 **Mark as Master Bank**。
2. 确认旁边出现了 "Master" 标签。
3. 现在可以安全删除原始的 `master_bank_template`。

完成后，项目已准备就绪，你可以开始制作自己的音频包。

## 构建 Sound Bank {#build-banks}

完成音频编辑后，即可构建 Bank。按 `F7` 或使用主菜单中的 **Build…** 命令。

![Build 菜单](/evo/audio/image9.png)

构建完成后会生成以下两个文件：

| 文件名 | 说明 |
|--------|------|
| `master_bank.bank` | 主音频数据包 |
| `master_bank.strings.bank` | 字符串索引数据包 |

将这两个文件放入模组车辆文件夹的 `sfx` 子目录中。

![构建生成的 bank 文件](/evo/audio/image2.png)

:::danger
**绝对不要触碰 FMOD 的 Mixer 页面（CTRL + 2）！修改 Mixer 会导致整个游戏音频崩溃！**

请使用 Event 自身的音量参数进行调节。
:::

## 分配 Sound Event {#assign-events}

1. 打开编辑器，选择 **Tools → CarFinalState**。
2. 在弹出窗口顶部，点击 **Audio events** 标签页。

![CarFinalState 窗口 — Audio events 标签页](/evo/audio/image3.png)

3. 对每个音频 Event 执行以下操作：
   - 在第一个下拉菜单中选择对应的 Event 类型（例如 `EngineInt`）。
   - 点击 `...` 按钮，在 Filter 字段中输入 `master`，然后选择 `master_bank.bank`。
   - 在最后一个下拉菜单中选择对应的音频 Event（例如 `engine_int_ks_modded_car`）。
4. 对所有音频 Event 重复以上步骤。
5. 完成分配后，点击底部的 **Save reference actor** 按钮。

![Save reference actor 按钮](/evo/audio/image4.png)

现在你可以在游戏中测试车辆音频了！

---

## 引用来源

- Kunos Simulazioni, AC EVO Audio Modding Pipeline 官方文档
