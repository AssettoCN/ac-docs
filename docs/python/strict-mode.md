---
title: 严格模式
---

在处理 Python 应用时，原始 Assetto Corsa 对错误相当宽容，会忽略参数数量不正确或其他类型的失败。虽然这在某些情况下有帮助，但通常来说可能会使应用开发变得更加困难，因为错误无法被正确报告。

因此，CSP 添加了一个可选的严格模式，在该模式下错误会实际抛出给应用处理。建议在开发新应用时使用此模式。

要激活严格模式，只需在应用开头调用以下函数：

```python
ac.ext_setStrictMode()
```

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Python-Apps-–-Strict-mode) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
