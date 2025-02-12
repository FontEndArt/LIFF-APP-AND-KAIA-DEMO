import {
  BaseError,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useBalance,
} from "wagmi";
import { useState } from "react";
import { isAddress, getAddress } from "viem";

// 示例 ABI，这里只包含了 balanceOf 和 transfer 函数
const abi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function ContractDemo() {
  const { address } = useAccount();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  // 读取合约状态
  const { data: balance, isLoading: isReading } = useBalance({
    address,
  });

  // 写入合约状态
  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // 处理转账
  const handleTransfer = async () => {
    try {
      // 尝试格式化地址
      let formattedAddress;
      try {
        formattedAddress = getAddress(recipientAddress);
      } catch (e) {
        console.error('地址格式化失败:', e);
        return;
      }

      console.log('开始转账:', {
        to: formattedAddress,
        amount,
        isValidAddress: isAddress(formattedAddress)
      });

      if (!formattedAddress || !amount) {
        console.error('验证失败:', {
          hasRecipient: !!formattedAddress,
          hasAmount: !!amount
        });
        return;
      }

      const result = await writeContract({
        address: "0x0000000000000000000000000000000000000000",
        abi,
        functionName: "transfer",
        args: [formattedAddress, BigInt(amount)],
      });

      console.log('转账结果:', result);
    } catch (error) {
      console.error('转账错误:', error);
    }
  };

  // 添加调试信息显示
  console.log('当前状态:', {
    address,
    balance: balance?.formatted,
    isReading,
    isWritePending,
    isConfirming,
    isConfirmed,
    hash,
    writeError
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">余额查询</h2>
        {isReading && <p>读取中...</p>}
        {balance && <p>余额: {balance.formatted} {balance.symbol}</p>}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">转账</h2>
        <input
          type="text"
          placeholder="接收地址"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="number"
          placeholder="金额"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleTransfer}
          disabled={isWritePending || !recipientAddress || !amount}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isWritePending ? "处理中..." : "转账"}
        </button>

        {hash && <p className="mt-2">交易哈希: {hash}</p>}
        {isConfirming && <p className="mt-2">等待确认...</p>}
        {isConfirmed && <p className="mt-2 text-green-500">交易已确认！</p>}
        {writeError && (
          <p className="mt-2 text-red-500">
            错误:{" "}
            {(writeError as unknown as BaseError).shortMessage ||
              writeError.message}
          </p>
        )}
      </div>

      {/* 添加调试信息显示 */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold">调试信息</h3>
        <pre className="text-sm">
          {JSON.stringify({
            connected: !!address,
            walletAddress: address,
            balance: balance?.formatted,
            status: {
              isReading,
              isWritePending,
              isConfirming,
              isConfirmed
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
