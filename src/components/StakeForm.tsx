'use client'
import { useState, useEffect, useCallback } from 'react'
import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { ABI, ERC20_ABI, CHAINLINK_ETH_USD_FEED, CHAINLINK_ABI } from '../constants/contract'
import { parseUnits, formatUnits } from 'viem'
import { StakingTabs } from './StakingStats'
import { useRouter } from 'next/navigation'

interface StakeFormProps {
  tokenAddress?: string
  stakingAddress?: string
}

export const StakeForm = ({ tokenAddress, stakingAddress }: StakeFormProps) => {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [ethPrice, setEthPrice] = useState<number>(0)
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()

  // Fetch ETH price from CHAINLINK_ETH_USD_FEED
  const { data: ethUsdPrice } = useReadContract({
    address: CHAINLINK_ETH_USD_FEED as `0x${string}`,
    abi: CHAINLINK_ABI,
    functionName: 'latestAnswer',
    query: {
      refetchInterval: 60000, // Update every minute
    }
  })

  useEffect(() => {
    if (ethUsdPrice) {
      // Chainlink price feeds usually have 8 decimals for USD pairs
      setEthPrice(Number(ethUsdPrice) / 10**8)
    }
  }, [ethUsdPrice])

  const { data: decimals, refetch: refetchDecimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    }
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address!, stakingAddress as `0x${string}`],
    query: {
      enabled: !!tokenAddress && !!stakingAddress && !!address,
    }
  })

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!tokenAddress && !!address,
    }
  })

  const { data: staked, refetch: refetchStaked } = useReadContract({
    address: stakingAddress as `0x${string}`,
    abi: ABI,
    functionName: 'staked',
    args: [address!],
    query: {
      enabled: !!stakingAddress && !!address,
    }
  })

  const { data: reward, refetch: refetchReward } = useReadContract({
    address: stakingAddress as `0x${string}`,
    abi: ABI,
    functionName: 'calculateReward',
    args: [address!],
    query: {
      enabled: !!stakingAddress && !!address,
    }
  })

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        refetchDecimals(),
        refetchAllowance(),
        refetchBalance(),
        refetchStaked(),
        refetchReward()
      ])
    } catch (err) {
      console.error('Failed to refresh balances:', err)
    }
  }, [refetchDecimals, refetchAllowance, refetchBalance, refetchStaked, refetchReward])

  // Auto refresh balances every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll()
    }, 30000)
    return () => clearInterval(interval)
  }, [refreshAll])

  const handleStake = async () => {
    if (!amount || !tokenAddress || !stakingAddress) return
    try {
      setError('')
      setIsStaking(true)
      
      // Check if we need to approve first
      const tokenDecimals = decimals as number || 2
      const amountToStake = parseUnits(amount, tokenDecimals)
      if (!allowance || (allowance as bigint) < amountToStake) {
        await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [stakingAddress as `0x${string}`, parseUnits('1000000', tokenDecimals)],
        })
        await refetchAllowance()
      }

      // If already staked, claim rewards first to maintain reward calculation
      const currentStaked = staked as bigint
      if (currentStaked && currentStaked > BigInt(0)) {
        await writeContractAsync({
          address: stakingAddress as `0x${string}`,
          abi: ABI,
          functionName: 'claimReward',
          args: [],
          gas: BigInt(300000),
        })
      }

      // Then stake
      await writeContractAsync({
        address: stakingAddress as `0x${string}`,
        abi: ABI,
        functionName: 'stake',
        args: [amountToStake],
        gas: BigInt(300000),
      })
      setAmount('')
      await refreshAll()
    } catch (err) {
      setError('Failed to stake tokens')
      console.error(err)
    } finally {
      setIsStaking(false)
    }
    router.refresh()
  }

  const handleUnstake = async () => {
    if (!stakingAddress) return
    try {
      setError('')
      setIsUnstaking(true)
      if (!staked || staked === BigInt(0)) {
        setError('Bạn chưa stake token nào')
        return
      }
      
      await writeContractAsync({
        address: stakingAddress as `0x${string}`,
        abi: ABI,
        functionName: 'unStake',
        args: [],
        gas: BigInt(300000),
      })
      await refreshAll()
    } catch (err) {
      setError('Không thể unstake token')
      console.error(err)
    } finally {
      setIsUnstaking(false)
    }
    router.refresh()
  }

  const handleClaim = async () => {
    if (!stakingAddress) return
    try {
      setError('')
      setIsClaiming(true)
      if (!reward || reward === BigInt(0)) {
        setError('Không có phần thưởng để claim')
        return
      }
      
      await writeContractAsync({
        address: stakingAddress as `0x${string}`,
        abi: ABI,
        functionName: 'claimReward',
        args: [],
        gas: BigInt(300000),
      })
      await refreshAll()
    } catch (err) {
      setError('Không thể claim phần thưởng')
      console.error(err)
    } finally {
      setIsClaiming(false)
    }
    router.refresh()
  }

  // Calculate APY based on real ETH price and reward rate
  const calculateAPY = () => {
    if (!ethPrice) return '0.00'
    const rewardRate = ethPrice / 1252389 // Reward rate per minute
    const yearly = rewardRate * 525600 // Minutes in a year
    const estimatedApy = (yearly / ethPrice) * 100
    return estimatedApy.toFixed(2)
  }

  // Format balance with correct decimals
  const formatBalance = (value: bigint | undefined) => {
    if (!value) return '0'
    const tokenDecimals = decimals as number || 2
    return formatUnits(value, tokenDecimals)
  }
  
  if (!tokenAddress || !stakingAddress) {
    return (
      <div className="text-center text-gray-500 p-4">
        Vui lòng nhập địa chỉ hợp đồng Token và Staking
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {error && <div className="text-red-400">{error}</div>}
      
      <div className="space-y-4 bg-[#152525] p-4 rounded-lg text-white">
        <div className="bg-[#1a2a2a] p-3 rounded-lg">
          <h2 className="text-xl font-bold text-center">Thông tin Staking</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-400">Số dư ví:</span> {formatBalance(balance as bigint)} MTK
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Đang stake:</span> {formatBalance(staked as bigint)} MTK
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Phần thưởng hiện tại:</span> {formatBalance(reward as bigint)} MTK
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-400">APY (ước tính):</span> {calculateAPY()}%
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Giá ETH/USD:</span> ${ethPrice.toLocaleString()} USD
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Approved Amount:</span> {formatBalance(allowance as bigint)} MTK
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Nhập số lượng token"
            className="flex-2 border border-gray-600 bg-[#1a2a2a] text-white placeholder-gray-400 p-2 rounded"
            step="0.01"
          />
          <button 
            onClick={handleStake} 
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!address || !amount || isStaking}
          >
            {isStaking ? 'Đang thực thi...' : 'Stake'}
          </button>
        </div>
        
        <div className="flex justify-between gap-4">
          <button 
            onClick={handleUnstake} 
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!address || !staked || staked === BigInt(0) || isUnstaking}
          >
            {isUnstaking ? 'Đang thực thi...' : 'Unstake'}
          </button>
          <button 
            onClick={handleClaim} 
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!address || !reward || reward === BigInt(0) || isClaiming}
          >
            {isClaiming ? 'Đang thực thi...' : 'Claim Reward'}
          </button>
        </div>
      </div>

      <StakingTabs />
    </div>
  )
}
