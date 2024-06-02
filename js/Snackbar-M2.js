if (snackbar.className === "hide") {
      setTimeout(function() {
    snackbar.style.display = "none";
  }, 500); // 5.2秒后执行此操作
    }

function showSnackbar() {

  var snackbar = document.getElementById("snackbar");

  // 添加点击其他地方隐藏 snackbar 的功能
requestAnimationFrame(function() {
document.addEventListener("click", function(event) {
    if (event.target !== snackbar) {
      snackbar.className = "hide";
      clearSnackbar();
    }
  });
 })
  // 清除之前的延时函数
  clearTimeout(snackbar.timeoutId);

  // 等待 snackbar 动画完成
  setTimeout(function() {
    // 隐藏现有的 snackbar
    if (snackbar.className === "show") {
      snackbar.className = "hide";
    }

  // 将 snacktext 的值填充到元素中
  snackbar.innerHTML = snacktext;

    // 显示新的 snackbar
    snackbar.className = "show";
    snackbar.style.display = "block";

    // 设置一个新的延时函数
    snackbar.timeoutId = setTimeout(function() {
  snackbar.className = "hide";
  setTimeout(function() {
    snackbar.style.display = "none";
  }, 500); // 5.2秒后执行此操作
}, 5000);
  }, 240); // 调整此值以匹配 snackbar 动画的持续时间
}