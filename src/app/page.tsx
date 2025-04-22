'use client'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi'
import { config } from '../wagmi/config'
import { Navbar } from '@/components/Navbar'
import { StakeForm } from '@/components/StakeForm'
import { DynamicAddress } from '@/components/DynamicAddress'
import { useState } from 'react'

export default function Home() {
  const [tokenAddress, setTokenAddress] = useState('')
  const [stakingAddress, setStakingAddress] = useState('')

  const handleAddressesUpdate = (newTokenAddress: string, newStakingAddress: string) => {
    setTokenAddress(newTokenAddress)
    setStakingAddress(newStakingAddress)
  }

  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen bg-[#0a1a1a]">
        <Navbar />
        <main className="pt-20 pb-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <DynamicAddress onAddressesUpdate={handleAddressesUpdate} />
            <StakeForm 
              tokenAddress={tokenAddress}
              stakingAddress={stakingAddress}
            />
          </div>
        </main>
      </div>
    </WagmiConfig>
  )
}
