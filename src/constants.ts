
export const PLATFORM_COMMISSION = 0.10; // 10%
export const WITHDRAWAL_FEE = 200; // 200 Kz
export const MAX_AFFILIATE_COMMISSION_PERCENTAGE = 30;

export const PROVINCES = ['Luanda'];
export const MUNICIPALITIES: Record<string, string[]> = {
  'Luanda': [
    'Belas',
    'Cacuaco',
    'Cazenga',
    'Icolo e Bengo',
    'Luanda',
    'Quiçama',
    'Kilamba Kiaxi',
    'Talatona',
    'Viana'
  ]
};

export const PAYMENT_METHODS = [
  { id: 'iban', label: 'IBAN (Transferência)', description: 'Transferência manual' },
  { id: 'multicaixa', label: 'Multicaixa Express', description: 'MCX Express' },
  { id: 'unitel', label: 'Unitel Money', description: 'Pagamento via Telemóvel' },
  { id: 'afrimoney', label: 'Afrimoney', description: 'Pagamento via Telemóvel' },
  { id: 'paypay', label: 'PayPay AO', description: 'Carteira Digital' },
  { id: 'cash', label: 'Pagamento na Entrega', description: 'Pague ao receber' }
];

export const ORDER_STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmado',
  preparing: 'Em Preparação',
  collecting: 'Em Recolha',
  in_transit: 'Em Rota',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};
