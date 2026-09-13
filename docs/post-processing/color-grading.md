---
title: 色彩分级详解
---


> 汉化标题：后期处理 – 色彩分级详解  
> 原文页面：Post-processing-–-More-about-color-grading  
> 原文锚点：474ceed  
> 汉化时间：2026-09-12T19:00:00+08:00  

假设我们有一个滤镜，渲染出来的画面是这样的，而我们不喜欢它：

![无聊的旧画面](https://i.imgur.com/HOLWR3b.jpg)

第一步：给它截一张图，就像这里的这张。然后，用你喜欢的图像编辑器打开它，并把[中性色彩分级图片](https://i.imgur.com/fTxYwA0.png)粘贴到它的某个角落上：

![某图像编辑器的截图](https://i.imgur.com/OoE0sIC.png)

别忘了合并图层，这样你就能同时调整两者的颜色：

![合并图层](https://i.imgur.com/0DQ9V6d.png)

之后，随意进行任何你喜欢的色彩变换。曲线、饱和度、对比度、自动颜色、自动对比度、色相、色调，以及任何只依赖原始像素颜色、不依赖其他信息的效果：

![曲线变换](https://i.imgur.com/X3LHD0S.png)

然后，小心地把你的色彩分级图片抠出来，单独保存为 PNG 文件：

![小心地抠图…](https://i.imgur.com/PvJ3KBk.png)

*这一步请格外小心。色彩分级纹理的分辨率应当形如 16×256 或 32×1024（换句话说，N×N²），其他任何分辨率都无法工作。*

打开[这个网站](http://b64.io/)，把刚生成的图片拖放到那块绿色区域上，然后把包含整张图片的 [base64 链接](https://en.wikipedia.org/wiki/Base64)复制到剪贴板：

![复制链接](https://i.imgur.com/Pu8zadc.png)

最后，直接把它作为 `EXT_COLOR_GRADING/FILE` 粘贴到你的 PP 滤镜里即可（这一切都可以在 AC 运行时进行）：

```ini
[EXT_COLOR_GRADING]
ENABLED = 1
FILE = data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAAgCAIAAAADnJ3xAAABYUlEQVR42u3cu27CQBQE0PEDEvmxhv//2VQUSZFui/U9RxRUI2sK5BFrT0mSLMmeHMmebElLjqQlLbmS8/O9Ja9kT1qyJV+fz5KsyZzMyZRfpu75a+f8q3P+1jn/3Tl/75x/uv5b57fO+cfg178P/vtzDH79o+c/Ouc/B89f5P+bPw+ePw2e3/f+eQ4AAFDG+ncRAAAAdx4ATQkAAFBnAOxKAACAOgPgUAIAANQZAKcSAACgzgBwBAgAAAoNAEeAAACg0AC4lAAAAHUGgH8AAACg0ADwEDAAABQaAI4AAQBAoQHgLUAAAFBoALyUAAAAdQaAh4ABAKDQAGhKAACAOgPAMwAAAFBoAHgNKAAAFBoAmxIAAKDOAPhWAgAAGAAAAMANB8BTCQAAUGcAPJQAAAB1BsCqBAAAqDMAZiUAAIABAAAAGAAAAMDIA2BSAgAAGAAAAMDtOAAEAAAGAAAAcEc/8uQidWnw6SkAAAAASUVORK5CYII=
```

享受新画面吧！

![应用色彩分级后的截图](https://i.imgur.com/iiYrx0e.jpg)

