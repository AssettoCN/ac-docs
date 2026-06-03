---
title: 色彩分级详解
---

假设我们有某个滤镜产生了这样的画面，而我们对它不满意：

![Boring old picture](https://i.imgur.com/HOLWR3b.jpg)

**第一步：** 截图，就像上面的那样。然后在你的图片编辑器中打开它，并将[中性色彩分级图片](https://i.imgur.com/fTxYwA0.png)粘贴到它的某个角落上：

![Screenshot of some image editor](https://i.imgur.com/OoE0sIC.png)

不要忘记合并图层，这样你就可以同时调整两者的颜色：

![Merged layers](https://i.imgur.com/0DQ9V6d.png)

之后，进行你喜欢的任何色彩变换。曲线、饱和度、对比度、自动色彩、自动对比度、色相、色调——任何基于原始像素颜色的效果都可以：

![Curves transformation](https://i.imgur.com/X3LHD0S.png)

然后，小心地裁剪出你的色彩分级图片并单独保存为 PNG 文件：

![Cutting carefully…](https://i.imgur.com/PvJ3KBk.png)

::: warning 注意
请在此步骤格外小心。色彩分级纹理的分辨率应为 16×256 或 32×1024（即 N×N²），其他分辨率不起作用。
:::

前往 [这里](http://b64.io/)，将新创建的图片拖放到绿色区域，然后将生成的包含完整图片数据的 [base64 链接](https://en.wikipedia.org/wiki/Base64) 复制到剪贴板：

![Copying link](https://i.imgur.com/Pu8zadc.png)

将其粘贴到你的 PP 滤镜中的 `EXT_COLOR_GRADING/FILE` 即可（你可以在 AC 运行时完成所有这些操作）：

```ini
[EXT_COLOR_GRADING]
ENABLED = 1
FILE = data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAAgCAIAAAADnJ3xAAABYUlEQVR42u3cu27CQBQE0PEDEvmxhv//2VQUSZFui/U9RxRUI2sK5BFrT0mSLMmeHMmebElLjqQlLbmS8/O9Ja9kT1qyJV+fz5KsyZzMyZRfpu75a+f8q3P+1jn/3Tl/75x/uv5b57fO+cfg178P/vtzDH79o+c/Ouc/B89f5P+bPw+ePw2e3/f+eQ4AAFDG+ncRAAAAdx4ATQkAAFBnAOxKAACAOgPgUAIAANQZAKcSAACgzgBwBAgAAAoNAEeAAACg0AC4lAAAAHUGgH8AAACg0ADwEDAAABQaAI4AAQBAoQHgLUAAAFBoALyUAAAAdQaAh4ABAKDQAGhKAACAOgPAMwAAAFBoAHgNKAAAFBoAmxIAAKDOAPhWAgAAGAAAAMANB8BTCQAAUGcAPJQAAAB1BsCqBAAAqDMAZiUAAIABAAAAGAAAAMDIA2BSAgAAGAAAAMDtOAAEAAAGAAAAcEc/8uQidWnw6SkAAAAASUVORK5CYII=
```

享受新的外观吧！

![Screenshot with color grading applied](https://i.imgur.com/iiYrx0e.jpg)

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Post-processing-–-More-about-color-grading) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
