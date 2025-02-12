import { useEffect, useState } from "react";
import liff from "@line/liff";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ContractDemo } from "./components/ContractDemo";
import { LineLoginButton } from "./components/LineLoginButton";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 处理 LINE Login 回调
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const savedState = sessionStorage.getItem("line_login_state");

    if (code && state && state === savedState) {
      // 清除保存的 state
      sessionStorage.removeItem("line_login_state");

      // 设置成功消息
      setMessage("LINE Login succeeded.");
      console.log("Authorization code:", code);

      // 这里可以处理获取 access token 的逻辑
    }
  }, []);

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
        // TODO: 将所有构建文件上传到网络服务器，例如 Netlify
        // if (!liff.isLoggedIn()) {
        //   liff.login();
        // }
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  return (
    <div className="App">
      <h1>create-liff-app</h1>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <div className="flex flex-col gap-8 items-center justify-center py-12 px-4">
        <LineLoginButton />
        <ConnectButton />
        <ContractDemo />
      </div>
      <a
        href="https://developers.line.biz/ja/docs/liff/"
        target="_blank"
        rel="noreferrer"
      >
        LIFF Documentation
      </a>
    </div>
  );
}

export default App;
