# 🌐 DynamicStaking DApp - Nền tảng staking linh hoạt và thông minh

## 🚀 Giới thiệu tính năng

**DynamicStaking DApp** là một nền tảng phi tập trung (DApp) giúp người dùng **stake token một cách an toàn, minh bạch và linh hoạt** trên mạng blockchain. Ứng dụng này được phát triển với sự hỗ trợ của **ChatGPT phiên bản 4o**, **trình soạn thảo thông minh Cursor**, cùng những câu lệnh đơn giản nhưng hiệu quả. Điều này cho thấy rằng bất kỳ ai cũng có thể tạo ra những ứng dụng tuyệt vời của riêng mình với sự trợ giúp từ công cụ AI và công nghệ hiện đại.

DynamicStaking DApp ứng dụng những công nghệ tiên tiến từ **Ethereum Virtual Machine (EVM)**, cùng với các thư viện Web3 mới nhất như **wagmi**, **viem**, **Next.js** và thư viện **Data Feed của Chainlink**  nhằm mang lại trải nghiệm người dùng mượt mà, bảo mật và dễ tiếp cận.

### 🔧 Các tính năng nổi bật:

✅ **Stake & Unstake** token bất kỳ lúc nào với giao diện đơn giản, trực quan.  
✅ Hiển thị **phần thưởng staking theo thời gian thực**, giúp người dùng dễ dàng theo dõi lợi nhuận.  
✅ Kết nối nhanh chóng với các **ví phi tập trung** như MetaMask, Coinbase Wallet...  
✅ **Tự động cập nhật tỷ lệ APY** (Annual Percentage Yield) dựa trên tổng lượng token đang stake, đảm bảo tính công bằng và điều chỉnh linh hoạt theo thị trường.  
✅ Tích hợp **AggregatorV3Interface** từ Chainlink để truy xuất dữ liệu giá token theo thời gian thực, giúp tính toán phần thưởng staking minh bạch, chính xác và đáng tin cậy.

--

### 🎬 Video hướng dẫn thiết lập hợp đồng thông minh cho DynamicStaking DApp

[![Xem video hướng dẫn DynamicStaking DApp](https://img.youtube.com/vi/Ll5_MDHwewg/maxresdefault.jpg)](https://www.youtube.com/watch?v=Ll5_MDHwewg)

👉 Nhấn vào hình ảnh để xem video trên YouTube.

---

## 2. 📈 Giới thiệu cách tính phần thưởng

Cốt lõi của DynamicStaking là **thuật toán tính phần thưởng động**, cho phép phần thưởng staking được phân phối dựa trên thời gian stake và tổng lượng token đang được stake.

### Nguyên lý tính phần thưởng:
- Mỗi người dùng stake token sẽ được ghi nhận **thời điểm bắt đầu stake** và **số lượng token stake**.
- Phần thưởng được tính theo công thức:
  
  ```
  reward = stakedAmount * timeElapsed * dynamicAPY / secondsInYear
  ```

  Trong đó:
  - `stakedAmount`: số lượng token stake.
  - `timeElapsed`: số giây người dùng đã stake.
  - `dynamicAPY`: tỷ lệ lãi suất hàng năm (APY), được cập nhật liên tục theo logic nội bộ.
  - `secondsInYear`: số giây trong một năm (thường là 31,536,000 giây).

- Người dùng có thể **claim phần thưởng bất kỳ lúc nào**, hoặc phần thưởng sẽ được **tự động nhận khi tiếp tục stake thêm token**.

Điểm đặc biệt: APY trong DynamicStaking không cố định, mà **tăng/giảm tuỳ theo hành vi thị trường**, giúp tối ưu lợi ích cho người stake sớm hoặc stake dài hạn.

---

## 3. 🚀 Phạm vi ứng dụng của DApp này

DynamicStaking DApp có thể được áp dụng rộng rãi trong nhiều lĩnh vực của nền kinh tế Web3:

### a. 💰 Quản lý thanh khoản cho dự án DeFi
- Tăng khả năng giữ chân người dùng bằng việc **thưởng cho những ai nắm giữ token dài hạn**.
- Dễ dàng tích hợp với các nền tảng DeFi hiện tại để quản lý nguồn cung.

### b. 🎮 Có thể mở rộng cho GameFi và NFT
- Áp dụng staking token hoặc NFT để mở khoá phần thưởng, vật phẩm hiếm hoặc cấp quyền truy cập sự kiện đặc biệt.
- Tích hợp staking trong **battle pass**, **guild** hoặc **DAO của game**.

### c. 🧠 Hệ sinh thái giáo dục & cộng đồng
- Thưởng cho người học/stake token của nền tảng giáo dục.
- Dùng làm công cụ **tích luỹ điểm tín nhiệm cộng đồng** trong các DAO mở.

### d. 🧩 Tích hợp trong các hệ thống token có tiện ích
- Hệ thống loyalty/staking token cho **token membership**, **quyền biểu quyết DAO**, hoặc **tích điểm thưởng** trong các ứng dụng Web3.

---

##  4.🗂️ Cấu trúc thư mục dự án

```
dynamic-staking-dapp/
├── app/
│   └── page.tsx
├── components/
│   ├── ConnectWallet.tsx
│   ├── StakeForm.tsx
│   └── StakingStats.tsx
├── constants/
│   └── contract.ts
├── hooks/
│   └── useStakingData.ts
├── styles/
│   └── globals.css
├── wagmi/
│   ├── config.ts
├── public/
├── package.json
├── tsconfig.json
└── next.config.js
```

### 1. ✅ Cài đặt thư viện cần thiết

```bash
npx create-next-app@latest bootcamp-dynamic-staking-2025 --typescript --app
cd bootcamp-dynamic-staking-2025

npm install viem wagmi ethers @rainbow-me/rainbowkit
```

### 2. ⚙️ Cấu hình wagmi & RainbowKit

#### `wagmi/config.ts`
```ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

export const saigon = defineChain({
  id: 2024123456,
  name: 'Ronin Saigon',
  nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://saigon-testnet.roninchain.com/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Saigon Explorer', url: 'https://saigon-explorer.roninchain.com' },
  },
})

export const config = getDefaultConfig({
  appName: 'Dynamic Staking DApp',
  chains: [saigon],
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
})
```

### 3. 🌐 Cấu hình App root

#### `app/page.tsx`
```tsx
'use client'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { config } from '../wagmi/config'
import { ConnectWallet } from '../components/ConnectWallet'
import { StakeForm } from '../components/StakeForm'
import { StakingStats } from '../components/StakingStats'

export default function Home() {
  return (
    <WagmiConfig config={config}>
      <main className="p-6 font-sans max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dynamic Staking DApp</h1>
        <ConnectWallet />
        <StakingStats />
        <StakeForm />
      </main>
    </WagmiConfig>
  )
}
```


### 4. 🔑 Contract Info

#### `constants/contract.ts`
```ts
export const CONTRACT_ADDRESS = '0xYourContractAddress'
export const ABI = [/* ABI rút gọn: stake, unstake, claimReward, calculateReward, staked, lastClaim, etc. */]
```

> (Bạn có thể dán ABI JSON rút gọn từ `DynamicStake.sol` vào đây.)


### 5. 🧠 Hook lấy dữ liệu staking

#### `hooks/useStakingData.ts`
```ts
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '../constants/contract'
import { useEffect, useState } from 'react'

export const useStakingData = () => {
  const { address } = useAccount()
  const [apy, setApy] = useState<number>(0)

  const { data: staked = 0n } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'staked',
    args: [address!],
  })

  const { data: reward = 0n } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'calculateReward',
    args: [address!],
    watch: true,
  })

  // Giả định ETH = $1574 để tính APY tạm
  useEffect(() => {
    const ethPrice = 1574
    const rewardRate = ethPrice / 1252389
    const yearly = rewardRate * 525600
    const estimatedApy = (yearly / ethPrice) * 100
    setApy(estimatedApy)
  }, [])

  return {
    staked,
    reward,
    apy,
  }
}
```


### 6. 📟 Component: Thống kê staking

#### `components/StakingStats.tsx`
```tsx
'use client'
import { useStakingData } from '../hooks/useStakingData'
import { formatEther } from 'viem'

export const StakingStats = () => {
  const { staked, reward, apy } = useStakingData()

  return (
    <div className="p-4 border rounded-lg shadow">
      <p><strong>Đang stake:</strong> {formatEther(staked)} TKN</p>
      <p><strong>Phần thưởng hiện tại:</strong> {formatEther(reward)} TKN</p>
      <p><strong>APY (ước tính):</strong> {apy.toFixed(2)}%</p>
    </div>
  )
}
```


### 7. 🧾 Component: Form stake/unstake

#### `components/StakeForm.tsx`
```tsx
'use client'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '../constants/contract'
import { parseEther } from 'viem'

export const StakeForm = () => {
  const [amount, setAmount] = useState('')
  const { writeContractAsync } = useWriteContract()

  const handleStake = async () => {
    if (!amount) return
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'stake',
      args: [parseEther(amount)],
    })
    setAmount('')
  }

  const handleUnstake = async () => {
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'unStake',
    })
  }

  return (
    <div className="space-y-4">
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Nhập số lượng token"
        className="border p-2 w-full rounded"
      />
      <button onClick={handleStake} className="bg-blue-600 text-white px-4 py-2 rounded">Stake</button>
      <button onClick={handleUnstake} className="bg-red-600 text-white px-4 py-2 rounded">Unstake</button>
    </div>
  )
}
```


### 8. 👛 Component: Kết nối ví

#### `components/ConnectWallet.tsx`
```tsx
'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const ConnectWallet = () => {
  return <ConnectButton showBalance />
}
```


### 9. 💅 `styles/globals.css` (tuỳ chọn)

```css
body {
  font-family: 'Inter', sans-serif;
  background: #f0f0f0;
}
```

---

## 5. 🎯 Kết luận


DynamicStaking DApp là một **ví dụ tham khảo** nhằm minh họa cách xây dựng cơ chế staking động trong môi trường Web3 hiện đại. DApp này không chỉ giúp bạn hiểu rõ quy trình kỹ thuật của staking và phân phối phần thưởng, mà còn cung cấp nền tảng để mở rộng hoặc tùy biến theo nhu cầu riêng.

> ⚠️ **Lưu ý:** Mã nguồn trong dự án này **không được thiết kế cho mục đích thương mại**. Bạn **không nên sử dụng trực tiếp** vào sản phẩm thật mà chưa đánh giá bảo mật, tối ưu hiệu năng, hoặc kiểm thử chuyên sâu. Hãy coi đây là một nền móng để học tập, thử nghiệm và xây dựng các hệ thống staking của riêng bạn theo tiêu chuẩn an toàn và chuyên nghiệp.

Nếu bạn đang trong quá trình phát triển một hệ sinh thái Web3 cần cơ chế **giữ chân người dùng**, **tưởng thưởng minh bạch** và **xây dựng niềm tin lâu dài**, DynamicStaking DApp có thể là một **điểm khởi đầu tuyệt vời** để bạn tham khảo và phát triển giải pháp riêng phù hợp với cộng đồng của mình.

---

