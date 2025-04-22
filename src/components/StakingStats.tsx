'use client'
import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI, TOKEN_ADDRESS, ERC20_ABI } from '../constants/contract'
import { formatUnits } from 'viem'

const StakingStats = () => {
  const { data: decimals } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  })

  const { data: stakedAmount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'staked',
    args: ['0x0000000000000000000000000000000000000000'],
  })

  const { data: rewardAmount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'calculateReward',
    args: ['0x0000000000000000000000000000000000000000'],
  })

  const { data: tokenBalance } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: ['0x0000000000000000000000000000000000000000'],
  })

  const formatBalance = (value: bigint | undefined) => {
    if (!value) return '0'
    const tokenDecimals = decimals as number || 2
    return formatUnits(value, tokenDecimals)
  }

  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
      <div className="text-sm text-gray-600">
        Tổng số token đã stake: {formatBalance(stakedAmount as bigint)} MTK
      </div>
      <div className="text-sm text-gray-600">
        Tổng phần thưởng đã nhận: {formatBalance(rewardAmount as bigint)} MTK
      </div>
      <div className="text-sm text-gray-600">
        Tổng số token trong contract: {formatBalance(tokenBalance as bigint)} MTK
      </div>
    </div>
  )
}

const StakeHistory = () => {
  // TODO: Implement stake history fetching and display
  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
      <div className="text-sm text-gray-600">
        Lịch sử stake sẽ được hiển thị ở đây
      </div>
    </div>
  )
}

export const StakingTabs = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats')

  return (
    <div className="mt-4">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'stats'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          Thống kê
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('history')}
        >
          Lịch sử
        </button>
      </div>
      <div className="mt-2">
        {activeTab === 'stats' ? <StakingStats /> : <StakeHistory />}
      </div>
    </div>
  )
}

export { StakingStats }
