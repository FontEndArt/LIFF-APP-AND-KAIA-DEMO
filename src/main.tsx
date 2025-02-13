import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import "./vConsole";

// 打印位置信息
console.log("当前页面信息:", {
  href: window.location.href,
  origin: window.location.origin,
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash
});

// 拦截页面跳转
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

window.history.pushState = function(...args) {
  console.log("pushState 跳转:", args);
  return originalPushState.apply(this, args);
};

window.history.replaceState = function(...args) {
  console.log("replaceState 跳转:", args);
  return originalReplaceState.apply(this, args);
};

// 监听 popstate 事件
window.addEventListener('popstate', (event) => {
  console.log("popstate 事件:", {
    state: event.state,
    location: window.location.href
  });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
