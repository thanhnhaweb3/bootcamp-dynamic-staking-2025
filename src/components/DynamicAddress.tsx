'use client'
import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { ERC20_ABI, TOKEN_ADDRESS, CONTRACT_ADDRESS } from '../constants/contract'
import { useRouter } from 'next/navigation'

interface DynamicAddressProps {
  onAddressesUpdate: (tokenAddress: string, stakingAddress: string) => void
}

export const DynamicAddress = ({ onAddressesUpdate }: DynamicAddressProps) => {
  const router = useRouter()
  const [tokenAddress, setTokenAddress] = useState(TOKEN_ADDRESS)
  const [stakingAddress, setStakingAddress] = useState(CONTRACT_ADDRESS)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Kiểm tra tính hợp lệ của địa chỉ token
  const { refetch: refetchDecimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    }
  })

  // Tự động cập nhật địa chỉ mặc định khi component mount
  useEffect(() => {
    if (TOKEN_ADDRESS && CONTRACT_ADDRESS) {
      onAddressesUpdate(TOKEN_ADDRESS, CONTRACT_ADDRESS)
    }
  }, [onAddressesUpdate])

  const handleApply = async () => {
    if (!tokenAddress || !stakingAddress) {
      setError('Vui lòng nhập đầy đủ địa chỉ hợp đồng')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // Kiểm tra tính hợp lệ của địa chỉ token
      const decimals = await refetchDecimals()
      if (!decimals.data) {
        setError('Địa chỉ token không hợp lệ')
        return
      }

      // Cập nhật địa chỉ mới
      onAddressesUpdate(tokenAddress, stakingAddress)

      // Làm mới trang để cập nhật dữ liệu
      router.refresh()
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật địa chỉ')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 bg-[#152525] p-4 rounded-lg text-white">
      <div className="bg-[#1a2a2a] p-3 rounded-lg">
        <h2 className="text-xl font-bold text-center">Cấu hình địa chỉ hợp đồng</h2>
      </div>
      
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium">
            Token:
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 block w-full rounded-md border-gray-600 bg-[#1a2a2a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Dynamic Staking:
          </label>
          <input
            type="text"
            value={stakingAddress}
            onChange={(e) => setStakingAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 block w-full rounded-md border-gray-600 bg-[#1a2a2a] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      <button
        onClick={handleApply}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Đang cập nhật...' : 'Áp dụng'}
      </button>
    </div>
  )
}