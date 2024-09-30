var snackbar = document.getElementById("snackbar");
var CloseButton = document.getElementById("CloseButton");
//var ButtonID3 = document.getElementById("3");


function snackbarX() {
setTimeout(function() {
  //关闭时的回调函数

}
, 500);
}

function clickSnackbar(){
//按钮点击事件
 }

function clearSnackbar() {
setTimeout(function() {
  if (snackbar.className === "hide") {
    snackbar.style.display ="none";
  }
}
, 400);
// 5.4秒后执行此操作
}

function showSnackbar() {
  let snackbarCallback = true;
  // 添加点击其他地方隐藏 snackbar 的功能
  requestAnimationFrame(function() {
    document.addEventListener("click", function(event) {
      if (event.target !== snackbar && snackbar.style.display !== "none") {
    closeSnackbar();
      }
    },
    );
  }
)
// 清除之前的延时函数
clearTimeout(snackbar.timeoutId);

function closeSnackbar(){
  snackbar.className ="hide";
  //判断函数没被调用过防止多次调用
  if (snackbarCallback === true) {
    clearSnackbar();
    snackbarX();
  }
  //设置false标志函数已经被调用
  snackbarCallback = false;
  clearTimeout(snackbar.timeoutId);
}

// 延时让snackbar消失动画完成后再隐藏
setTimeout(function() {
  // 隐藏现有的 snackbar
  if (snackbar.className === "show") {
    snackbar.className ="hide";
  }

  // 将 snacktext 的值填充到元素中

  if (closeText === "") {
  // 没有指定按钮
  snackbar.style.padding ="16px";
  snackbar.innerHTML = snacktext;


} else {
  // 指定了按钮
  snackbar.style.padding ="16px 64px 16px 16px";
    snackbar.innerHTML = snacktext + " <span onclick=\"clickSnackbar()\" id=\"CloseButton\">" + closeText + "</span>";
}

  // 显示新的 snackbar
  snackbar.className ="show";
  snackbar.style.display ="block";

  // 设置一个新的延时函数
  snackbar.timeoutId = setTimeout(function() {
    snackbar.className ="hide";

    setTimeout(function() {
      snackbar.style.display ="none";
if (snackbarCallback === true) {
      snackbarX();
      }
    }
    , 500);//5.5秒后清除div
  }
  , 5000);//5秒后消失
}
, 250);// 调整此值以匹配 snackbar 消失动画的持续时间
}