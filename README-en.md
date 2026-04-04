# Snackbar
A web component about Material Design Snackbar.
Only 5Kb!!!

Language：English | [简体中文](README.md)

## Import

HTML: ```<script src=".../snackbar.js"></script>```

## Parameters

| Parameter | Describe |
| ---- | ---- |
| message (string) | Required. The text of the snackbar message.|
| actionText (string) | Optional. The text of the action button.|
| actionHandler (function) | Optional. The callback function when the action button is clicked.|
| duration (number) | Auto-dismiss delay (milliseconds). Default is 3500. Set to 0 for persistent snackbar (must be dismissed by user interaction).|

## Usage

Basic message: ```snackbar.show({ message: 'Succeed', duration: 3000 })```

With action button: ```snackbar.show({ message: 'Deleted', actionText: 'Undo', actionHandler: () => { callback function } })```

Shortcuts: ```snackbar.info('Plain text message') or snackbar.action('Message', 'Button', callback)```
