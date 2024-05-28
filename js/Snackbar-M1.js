function showSnackbar() {

  var snackbar = document.getElementById("snackbar");

  // 将 snacktext 的值填充到元素中
  snackbar.innerHTML = snacktext;

  // 添加点击其他地方隐藏 snackbar 的功能
  document.addEventListener("click", function(event) {
    if (event.target !== snackbar) {
      snackbar.className = "hide";
    }
  });

   // 清除之前的延时函数
  clearTimeout(snackbar.timeoutId);

  // 使用 requestAnimationFrame 延迟 setTimeout 函数的执行
  requestAnimationFrame(function() {

  // 隐藏现有的 snackbar
    if (snackbar.className === "show") {
      snackbar.className = "hide";
    }

    // 显示 snackbar
    snackbar.className = "show";

   // 设置一个新的延时函数
    snackbar.timeoutId = setTimeout(function(){ snackbar.className = "hide"; }, 3000);
  });
}