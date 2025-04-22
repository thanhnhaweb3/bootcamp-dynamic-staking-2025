import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, ABI, TOKEN_ADDRESS, ERC20_ABI, CHAINLINK_ETH_USD_FEED, CHAINLINK_ABI} from '../constants/contract'
import { useEffect, useState } from 'react'

export const useStakingData = () => {
  const { address } = useAccount()
  const [apy, setApy] = useState<number>(0)

  const { data: staked = BigInt(0) } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'staked',
    args: [address!],
  })

  const { data: reward = BigInt(0) } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'calculateReward',
    args: [address!],
    query: {
      refetchInterval: 1000,
    },
  })

  // Giả định ETH = $1574 để tính APY tạm
  useEffect(() => {
    const ethPrice = 1574
    const rewardRate = ethPrice / 1252389
    const yearly = rewardRate * 525600
    const estimatedApy = (yearly / ethPrice) * 100
    setApy(estimatedApy)
  }, [])

  const { data: ethUsdPrice = BigInt(0) } = useReadContract({
    address: CHAINLINK_ETH_USD_FEED,
    abi: CHAINLINK_ABI,
    functionName: 'latestAnswer',
    query: {
      refetchInterval: 1000,
    },
  });
  
  const { data: tokenBalance = BigInt(0) } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      refetchInterval: 1000,
    },
  });
  
  return {
    staked,
    reward,
    apy,
    tokenBalance,
    ethUsdPrice,
  }
}
