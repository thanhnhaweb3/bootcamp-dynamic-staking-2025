import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

export const saigon = defineChain({
  id: 2021,
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
  projectId: '9a5be284d66be051ebdf806af6d0a89e',
})
