# LINE 登录集成调研文档

## 1. 概述
本文档旨在调研如何在当前项目中集成 LINE 登录功能，并兼容 Kaia 钱包。我们将从启动参数适配、用户信息获取、登录适配、钱包集成、UI 替换等方面进行详细分析。

## 2. LINE 登录集成

### 2.1 测试登录频道地址
- **测试地址**: https://liff.line.me/2006888231-KY98BBj8

### 2.2 启动参数适配
- **需求**: 类似 Telegram 的 `startapp`，需要特定的适配来区分来源和目标页面。
- **用途**: 邀请用户相关功能需要使用这些参数。

### 2.3 获取用户信息接口适配
- **需求**: 登录后通过前端 JavaScript 获取用户的主资料信息。
- **参考文档**: 获取用户信息

### 2.4 登录适配
- **需求**: 需要有后端回调地址，评估如何获取用户头像和姓名，并适配当前用户体系。
- **参考文档**: LINE 登录概述
- **登录版本**: 2.1 支持 OAuth 2.0 授权码流程和 OpenID Connect 协议。

## 3. 应用内链接钱包部分

### 3.1 兼容 Kaia 钱包
- **网络配置**:
  ```javascript
  networks: {
    kaia: {
      url: "https://public-en.node.kaia.io",
      accounts: [process.env.PRIVATE_KEY],
    },
    kairos_testnet: {
      url: "https://public-en-kairos.node.kaia.io",
      accounts: [process.env.PRIVATE_KEY],
    }
  }
  ```
- **Kaia SDK**: https://static.kaiawallet.io/js/dapp-portal-sdk.js
- **测试水(24h)**: https://www.kaia.io/faucet

## 4. UI 和操作替换

### 4.1 Modal UI
- **需求**: 评估是否需要替换 Telegram 的 Modal UI。

### 4.2 链接跳转
- **需求**: 任务部分的链接跳转需要将一些 Telegram 的操作替换为 LINE 的操作。
- **参考文档**: 创建主重定向 URL

### 4.3 TGSDK 相关
- **需求**: 移除或寻找替代方法来替换 `@telegram-apps/sdk-react`。

## 5. 示例代码

以下是一个简单的 LIFF 应用示例代码：

```javascript
import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
        if (!liff.isLoggedIn()) {
          liff.login();
        }
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  }, []);

  return (
    <div className="App">
      <h1>create-liff-app</h1>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
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
```

## 6. 其他资源
- LINE 登录服务
- LIFF 应用开发
- Playground

## 7. 结论
通过以上调研，我们明确了在项目中集成 LINE 登录功能的各项需求和实现方法。接下来，我们将根据这些调研结果进行具体的开发和测试工作。