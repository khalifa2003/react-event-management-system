export interface EventPricing {
  ticketPrice: number;
  currency: 'EGP' | 'USD' | 'EUR';
  earlyBird?: {
    price: number;
    deadline: Date | string;
  };
}