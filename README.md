# Snackbar
A web component about Material Design Snackbar. 一个网页Snackbar小组件。

Only 5Kb!!!

Language：简体中文 | [English](README-en.md)

## 使用说明

在 HTML 中通过 <script src=".../snackbar.js"></script> 引入。

## 参数说明：

| 参数 | 说明 |
| ---- | ---- |
| message (string) | 必填，提示文本 |
| actionText (string) | 可选，按钮文字 |
| actionHandler (function) | 可选，按钮点击的回调函数 |
| duration (number) | 自动收回延迟（毫秒），默认 3500，设为 0 则不自动关闭（常驻通知，必须通过交互等方式关闭） |

## 调用方式：

| 参数 | 说明 |
| ---- | ---- |
| 基础消息 | snackbar.show({ message: '操作成功', duration: 3000 }) |
| 带操作按钮 |snackbar.show({ message: '已删除', actionText: '撤销', actionHandler: () => { ```这里写回调函数``` } })|
| 快捷调用 |snackbar.info('纯文本消息') 或 snackbar.action('消息', '按钮', callback) |
