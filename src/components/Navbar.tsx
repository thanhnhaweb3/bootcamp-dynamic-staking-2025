'use client'
import { ConnectWallet } from './ConnectWallet'

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#152525] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Dynamic Staking DApp</h1>
          </div>
          <div className="flex items-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  )
} 