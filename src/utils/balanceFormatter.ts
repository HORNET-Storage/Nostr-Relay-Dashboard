export const formatBalance = (balance: number): string => {
  if (balance >= 1e6) {
    return `${(balance / 1e6).toFixed(1)}M Sats`;
  } else if (balance >= 1e3) {
    return `${(balance / 1e3).toFixed(1)}K Sats`;
  } else {
    return `${balance.toFixed(2)} Sats`;
  }
};
