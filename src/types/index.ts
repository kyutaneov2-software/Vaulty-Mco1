export type User = {
  id: string;
  name: string;
  email: string;
  points: number;
};

export type Vault = {
  id: string;
  name: string;
  address: string;
  distance: string;
  size: string;
  pricePerHour: number;
  available: boolean;
};

export type WalletTransaction = {
  id: string;
  type: 'topup' | 'rental' | 'refund';
  title: string;
  amount: number;
  date: string;
};
