'use client';
import { useEffect, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { getPublicClient } from 'wagmi/actions';
import { CONTRACT_ADDRESS } from '../constants/contract';
import { formatEther, type Log } from 'viem';
import { parseAbiItem } from 'viem';

type StakeEvent = Log<bigint, number, false, typeof StakeAbi, undefined>;
const StakeAbi = parseAbiItem('event Staked(address indexed user, uint256 amount)');

export const StakeHistory = () => {
  const { address } = useAccount();
  const config = useConfig();
  const [events, setEvents] = useState<StakeEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const client = getPublicClient(config);
      if (!client) return;
      const logs = await client.getLogs({
        address: CONTRACT_ADDRESS,
        event: StakeAbi,
        fromBlock: 'earliest',
        toBlock: 'latest',
      });
      setEvents(logs);
    };
    if (address) fetchEvents();
  }, [address, config]);

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Lịch sử Staking</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.args?.user} đã stake {event.args?.amount ? formatEther(event.args.amount) : '0'} TKN
          </li>
        ))}
      </ul>
    </div>
  );
};
