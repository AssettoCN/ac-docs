---
title: 实时重载
---


> 汉化标题：Python 应用 – 实时重载  
> 原文页面：Python-Apps-–-Live-reload  
> 原文锚点：19ce7b7  
> 汉化时间：2026-09-12T19:00:00+08:00  

自 CSP 0.1.76 起，可以选择实时重载应用，无需重启 Assetto Corsa 即可编辑并看到改动。你可以在 Python Apps Debug 的 “Live reload” 部分找到它：

![Screenshot](https://files.acstuff.ru/shared/qiuQ/20211021-215221.png)

只需点击 Reload 按钮，或勾选 “Reload automatically” 复选框，这样任何 py 文件发生变化时应用都会自动重载。

重载应用时，CSP 会销毁该应用的所有窗口，然后重载其主模块以及它从应用文件夹中导入的所有模块。这一点可能很重要：如果你的应用从其文件夹之外导入模块，那些模块不会被重载，因此除非它们是无状态的，否则可能出现错误甚至崩溃。

请注意：重载时 CSP 不会调用 `acShutdown` 函数，因为 AC 并没有真正关闭。如果你的应用需要释放某些资源（例如关闭 HTTP 服务器），请定义 `ext_acReload` 函数并在其中释放资源。另外要补充的是，`ext_acReload` 只在应用被重载时才会被调用，因此你可能需要这样写：

```py
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)  

def ext_acReload():
  httpd.shutdown()

def acShutdown():
  ext_acReload()
  # 所有其他与关闭相关的操作，比如记录最佳圈速
```

如果 `ext_acReload` 函数抛出异常，重载将不会继续，以确保程序不会重载进入无效状态。如果你不小心陷入了这种境地，可以从上下文菜单中覆盖这一行为：

![Screenshot](https://files.acstuff.ru/shared/yU8g/20211021-220321.png)

