import { useState } from "react";

export function LineLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLineLogin = () => {
    setIsLoading(true);

    // 生成随机 state 参数防止 CSRF 攻击
    const state = Math.random().toString(36).substring(7);

    // 构建 LINE Login URL
    const params = new URLSearchParams({
      response_type: "code",
      client_id: import.meta.env.VITE_LIFF_ID, // 使用已有的 LIFF ID
      redirect_uri: window.location.origin, // 重定向到当前域名
      state: state,
      scope: "profile openid",
      nonce: Math.random().toString(36).substring(7),
    });

    // 保存 state 到 sessionStorage 用于验证
    sessionStorage.setItem("line_login_state", state);

    // 重定向到 LINE 登录页面
    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
  };

  return (
    <button
      onClick={handleLineLogin}
      disabled={isLoading}
      className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
    >
      {isLoading ? (
        "登录中..."
      ) : (
        <>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
            alt="LINE"
            width={20}
            height={20}
          />
          使用 LINE 登录
        </>
      )}
    </button>
  );
}
