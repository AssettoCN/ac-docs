---
title: 实时重载
---

从 CSP 0.1.76 开始，新增了实时重载应用的功能，允许在不重启 Assetto Corsa 的情况下编辑并查看更改。你可以在 Python Apps Debug 的 "Live reload" 部分找到它：

![Screenshot](https://files.acstuff.ru/shared/qiuQ/20211021-215221.png)

点击 Reload 按钮，或勾选 "Reload automatically" 复选框，当任何 py 文件发生更改时，应用将自动重新加载。

为了重载应用，CSP 会销毁该应用的所有实例，然后重新加载其主模块以及从应用文件夹导入的所有模块。这一点很重要：如果你的应用从其文件夹之外导入了模块，那些模块不会被重新加载，因此除非它们是无状态的，否则可能会出现错误甚至崩溃。

::: warning 注意
重载时 CSP 不会调用 `acShutdown` 函数，因为 AC 并没有真正关闭。如果你的应用有一些需要释放的资源（比如关闭 HTTP 服务器），请定义 `ext_acReload` 函数并在其中释放资源。此外，`ext_acReload` 只在应用重载时被调用，因此你可能需要像这样处理：
:::

```python
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)  

def ext_acReload():
  httpd.shutdown()

def acShutdown():
  ext_acReload()
  # 所有其他与关闭相关的操作，比如记录最佳圈速
```

如果 `ext_acReload` 函数抛出异常，重载将不会继续，以确保程序不会进入无效状态。如果你意外陷入这种情况，可以从上下文菜单中覆盖此行为：

![Screenshot](https://files.acstuff.ru/shared/yU8g/20211021-220321.png)

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Python-Apps-–-Live-reload) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
