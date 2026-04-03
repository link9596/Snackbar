/**
 * Material Design Snackbar 组件
 * @author Link
 * @link https://atlinker.cn
 */

(function(global) {
    //组件样式
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .md-snackbar {
            position: fixed;
            bottom: 24px;
            left: 16px;
            right: 16px;
            margin: 0 auto;
            max-width: 640px;
            width: auto;
            background-color: #1f1f1f;
            color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12);
            font-family: 'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif;
            font-size: 0.875rem;
            font-weight: 400;
            letter-spacing: 0.2px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 2px 16px;
            min-height: 48px;
            z-index: 10000;
            transform: translateY(150px);
            transition: transform 0.48s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            will-change: transform;
        }
        .md-snackbar--active {
            transform: translateY(0);
            pointer-events: auto;
        }
        .md-snackbar--hide {
            transform: translateY(150px);
            pointer-events: none;
        }
        .md-snackbar__message {
            flex: 1;
            line-height: 1.4;
            word-break: break-word;
            padding: 6px 0;
            font-weight: 400;
        }
        .md-snackbar__action {
            background: none;
            border: none;
            color: #d0bcff;
            font-family: inherit;
            font-weight: 500;
            font-size: 0.875rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            padding: 6px 12px;
            margin: -6px -8px -6px 0;
            border-radius: 20px;
            cursor: pointer;
            transition: background 0.2s ease;
            background-color: transparent;
            white-space: nowrap;
            -webkit-tap-highlight-color: transparent;
        }
        .md-snackbar__action:hover {
            background-color: rgba(208, 188, 255, 0.12);
        }
        .md-snackbar__action:active {
            background-color: rgba(208, 188, 255, 0.2);
        }
        @media (max-width: 480px) {
            .md-snackbar {
                left: 12px;
                right: 12px;
                bottom: 16px;
                padding: 2px 15px;
            }
            .md-snackbar__action {
                white-space: nowrap;
                padding: 4px 8px;
                font-size: 0.8rem;
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // 初始化
    let currentSnackbarElement = null;   // 当前显示的DOM元素
    let currentTimer = null;              // 自动关闭定时器
    let isClosing = false;                // 是否正在执行关闭动画
    let pendingShow = null;               // 待处理的请求（只保留最新）
    let isProcessing = false;             // 是否正在处理显示/关闭流程

    // 清除定时器
    function clearTimer() {
        if (currentTimer) {
            clearTimeout(currentTimer);
            currentTimer = null;
        }
    }

    // 立即移除DOM
    function removeImmediately() {
        if (currentSnackbarElement && currentSnackbarElement.parentNode) {
            currentSnackbarElement.removeEventListener('transitionend', () => {});
            currentSnackbarElement.remove();
        }
        currentSnackbarElement = null;
        isClosing = false;
    }

    // 关闭动画，返回 Promise 等待动画完成
    function animateClose() {
        if (!currentSnackbarElement) return Promise.resolve();
        if (isClosing) {
            // 如果已经关闭，等待元素移除
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (!currentSnackbarElement) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 20);
                setTimeout(() => {
                    clearInterval(checkInterval);
                    resolve();
                }, 500);
            });
        }
        isClosing = true;
        return new Promise((resolve) => {
            const elem = currentSnackbarElement;
            if (!elem) {
                isClosing = false;
                resolve();
                return;
            }
            elem.classList.remove('md-snackbar--active');
            elem.classList.add('md-snackbar--hide');
            const onFinish = () => {
                if (elem) elem.removeEventListener('transitionend', onFinish);
                if (currentSnackbarElement === elem) removeImmediately();
                else if (elem.parentNode) elem.remove();
                isClosing = false;
                resolve();
            };
            elem.addEventListener('transitionend', onFinish, { once: true });
            // 如果动画未触发，强制移除
            setTimeout(() => {
                if (elem && elem.parentNode) {
                    if (currentSnackbarElement === elem) removeImmediately();
                    else if (elem.parentNode) elem.remove();
                    isClosing = false;
                    resolve();
                }
            }, 450);
        });
    }

    // 销毁当前
    async function destroyCurrentWithAnimation() {
        clearTimer();
        if (!currentSnackbarElement) return;
        await animateClose();
    }

    // 创建 Snackbar DOM
    function createSnackbarDOM(message, actionText, actionHandler) {
        const container = document.createElement('div');
        container.className = 'md-snackbar';
        const msgSpan = document.createElement('span');
        msgSpan.className = 'md-snackbar__message';
        msgSpan.textContent = message;
        container.appendChild(msgSpan);
        if (actionText && typeof actionText === 'string' && actionText.trim() !== '') {
            const actionBtn = document.createElement('button');
            actionBtn.className = 'md-snackbar__action';
            actionBtn.textContent = actionText;
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (actionHandler && typeof actionHandler === 'function') actionHandler();
                if (currentSnackbarElement === container) destroyCurrentWithAnimation();
            });
            container.appendChild(actionBtn);
        }
        return container;
    }

    // 实际显示
    async function performShow(options) {
        const { message, actionText, actionHandler, duration } = options;
        const snackbarElem = createSnackbarDOM(message, actionText, actionHandler);
        currentSnackbarElement = snackbarElem;
        document.body.appendChild(snackbarElem);

        void snackbarElem.offsetHeight;
        snackbarElem.classList.add('md-snackbar--active');
        // 自动延时关闭
        let autoCloseDelay = duration;
        if (autoCloseDelay !== undefined && (typeof autoCloseDelay !== 'number' || autoCloseDelay <= 0)) autoCloseDelay = null;
        if (duration === 0 || duration === Infinity || (typeof duration === 'number' && duration < 0)) autoCloseDelay = null;
        if (autoCloseDelay && autoCloseDelay > 0) {
            clearTimer();
            currentTimer = setTimeout(() => {
                if (currentSnackbarElement === snackbarElem) destroyCurrentWithAnimation();
                currentTimer = null;
            }, autoCloseDelay);
        }
    }

    // 确保旧消息弹出后再显示新消息
    async function processQueue() {
        if (isProcessing) return;
        if (!pendingShow) return;
        isProcessing = true;
        const options = pendingShow;
        pendingShow = null;
        // 如果当前有 Snackbar，等待
        if (currentSnackbarElement) {
            await destroyCurrentWithAnimation();
        }
        await performShow(options);
        isProcessing = false;
        // 如果在显示期间又有新的请求，继续
        if (pendingShow) processQueue();
    }

    // 公开的 show 方法
    function show(options) {
        const { message = '', actionText = null, actionHandler = null, duration = 3500 } = options || {};
        if (!message && message !== 0) {
            console.warn('[Snackbar] message is required');
            return;
        }
        // 只保留最新的待显示请求，放弃旧的未处理请求
        pendingShow = { message, actionText, actionHandler, duration };
        processQueue();
    }

    // 手动关闭Snackbar
    async function close() {
        if (currentSnackbarElement) {
            await destroyCurrentWithAnimation();
        }
        //不清空 pendingShow
    }

    // 简易调用
    function info(message, duration = 3500) {
        show({ message, duration });
    }

    function action(message, actionText, actionHandler, duration = 3500) {
        show({ message, actionText, actionHandler, duration });
    }

    // 导出全局对象
    const snackbar = {
        show,
        close,
        info,
        action
    };

    global.snackbar = snackbar;
})(window);