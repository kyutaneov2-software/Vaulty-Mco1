import { Vault, WalletTransaction } from '../types';

export const mockVaults: Vault[] = [
    {
        id: 'vault-01',
        name: 'SRV Mini Vault - Central',
        address: 'Near City Center',
        distance: '0.8 km away',
        size: 'Small',
        pricePerHour: 25,
        available: true,
    },
    {
        id: 'vault-02',
        name: 'SRV Mini Vault - North',
        address: 'North District',
        distance: '1.6 km away',
        size: 'Small',
        pricePerHour: 30,
        available: true,
    },
    {
        id: 'vault-03',
        name: 'SRV Mini Vault - Market',
        address: 'Public Market Area',
        distance: '2.4 km away',
        size: 'Medium',
        pricePerHour: 40,
        available: false,
    },
];

export const mockTransactions: WalletTransaction[] = [
    {
        id: 'tx-01',
        type: 'topup',
        title: 'Initial wallet credit',
        amount: 350,
        date: 'Today',
    },
    {
        id: 'tx-02',
        type: 'rental',
        title: 'Vault rental · 2 hrs',
        amount: -50,
        date: 'Yesterday',
    },
    ];
