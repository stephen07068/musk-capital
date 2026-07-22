// Market data
export const marketData = [
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: 6.25, changePercent: 2.58, color: '#EF4444' },
  { symbol: 'BTC', name: 'Bitcoin', price: 98240.15, change: 1850.30, changePercent: 1.92, color: '#F97316' },
  { symbol: 'ETH', name: 'Ethereum', price: 3842.67, change: 78.42, changePercent: 2.08, color: '#6366F1' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.3845, change: 0.0125, changePercent: 3.36, color: '#EAB308' },
  { symbol: 'NASDAQ', name: 'NASDAQ Composite', price: 19842.33, change: 218.55, changePercent: 1.11, color: '#3B82F6' },
  { symbol: 'S&P 500', name: 'S&P 500', price: 6032.38, change: 52.18, changePercent: 0.87, color: '#10B981' },
  { symbol: 'SOL', name: 'Solana', price: 242.56, change: 5.83, changePercent: 2.46, color: '#8B5CF6' },
  { symbol: 'X', name: 'X Corp.', price: 52.80, change: 0.95, changePercent: 1.83, color: '#6B7280' },
];

export const companies = [
  {
    id: 'tesla',
    name: 'Tesla',
    industry: 'Electric Vehicles & Clean Energy',
    status: 'PUBLIC',
    ticker: 'TSLA',
    description: 'Electric vehicles, clean energy, and AI driving the world toward a sustainable future.',
    investment: { expectedReturn: '3x', minInvestment: '$1,000', riskLevel: 'Moderate', horizon: '3-5 yrs', allocation: 10, color: '#EF4444' },
    longDescription: 'Tesla, Inc. is an American multinational automotive and clean energy company. Tesla designs and manufactures electric vehicles, stationary battery energy storage, solar panels, solar roof tiles, and related products and services.',
    ceo: 'Elon Musk',
    founded: 2003,
    headquarters: 'Austin, Texas, USA',
    website: 'https://tesla.com',
    logo: '🔴',
    logoColor: '#EF4444',
    bgColor: 'from-red-900/20 to-obsidian',
    employees: '127,855',
    revenue: '$96.8B',
    milestones: [
      { year: 2003, event: 'Tesla Motors founded in San Carlos, California' },
      { year: 2008, event: 'First Roadster delivered to customers' },
      { year: 2010, event: 'IPO on NASDAQ' },
      { year: 2012, event: 'Model S launched' },
      { year: 2020, event: 'Joined S&P 500 index' },
      { year: 2023, event: 'Cybertruck begins delivery' },
    ],
  },
  {
    id: 'spacex',
    name: 'SpaceX',
    industry: 'Aerospace & Space Transportation',
    status: 'PRIVATE',
    description: 'Space transportation and satellite internet making life multi-planetary.',
    investment: { expectedReturn: '10x', minInvestment: '$1,000', riskLevel: 'High', horizon: '5-7 yrs', allocation: 30, color: '#F97316' },
    longDescription: 'Space Exploration Technologies Corp. (SpaceX) is an American spacecraft manufacturer, launch service provider, and satellite communications company. It was founded in 2002 by Elon Musk with the goal of reducing space transportation costs to enable the colonization of Mars.',
    ceo: 'Elon Musk',
    founded: 2002,
    headquarters: 'Hawthorne, California, USA',
    website: 'https://spacex.com',
    logo: 'SPACEX',
    logoColor: '#FFFFFF',
    bgColor: 'from-slate-900/40 to-obsidian',
    employees: '13,000+',
    revenue: '$9.0B+',
    milestones: [
      { year: 2002, event: 'SpaceX founded by Elon Musk' },
      { year: 2010, event: 'First private company to recover spacecraft from orbit' },
      { year: 2015, event: 'First successful orbital rocket booster landing' },
      { year: 2020, event: 'First crewed mission to ISS (Crew Dragon)' },
      { year: 2022, event: 'Starlink reaches 1 million subscribers' },
      { year: 2023, event: 'Starship first integrated flight test' },
    ],
  },
  {
    id: 'xai',
    name: 'xAI',
    industry: 'Artificial Intelligence',
    status: 'PRIVATE',
    description: 'Building AI systems that accelerate human scientific discovery.',
    investment: { expectedReturn: '50x', minInvestment: '$1,000', riskLevel: 'Extreme', horizon: '5-7 yrs', allocation: 40, color: '#3B82F6' },
    longDescription: 'xAI is an artificial intelligence company founded by Elon Musk. The company focuses on understanding the true nature of the universe through AI, creating large language models including Grok, an AI assistant.',
    ceo: 'Elon Musk',
    founded: 2023,
    headquarters: 'San Francisco, California, USA',
    website: 'https://x.ai',
    logo: 'xAI',
    logoColor: '#FFFFFF',
    bgColor: 'from-purple-900/20 to-obsidian',
    employees: '500+',
    revenue: 'Private',
    milestones: [
      { year: 2023, event: 'xAI founded by Elon Musk' },
      { year: 2023, event: 'Grok AI assistant launched on X platform' },
      { year: 2026, event: 'Grok 2 released with advanced reasoning' },
      { year: 2026, event: 'Grok 3 launched with multimodal capabilities' },
    ],
  },
  {
    id: 'neuralink',
    name: 'Neuralink',
    industry: 'Neurotechnology & Brain-Computer Interface',
    status: 'PRIVATE',
    description: 'Developing brain-computer interfaces to enhance human potential.',
    investment: { expectedReturn: '25x', minInvestment: '$1,000', riskLevel: 'Extreme', horizon: '7-10 yrs', allocation: 15, color: '#8B5CF6' },
    longDescription: 'Neuralink Corporation is an American neurotechnology company that develops implantable brain-computer interfaces (BCIs). The company aims to create devices that can be implanted in the human brain to help people with paralysis.',
    ceo: 'Elon Musk',
    founded: 2016,
    headquarters: 'Fremont, California, USA',
    website: 'https://neuralink.com',
    logo: 'N',
    logoColor: '#FFFFFF',
    bgColor: 'from-blue-900/20 to-obsidian',
    employees: '400+',
    revenue: 'Private',
    milestones: [
      { year: 2016, event: 'Neuralink founded' },
      { year: 2019, event: 'First public presentation of N1 chip' },
      { year: 2023, event: 'FDA grants approval for human trials' },
      { year: 2026, event: 'First human receives Neuralink brain implant' },
    ],
  },
  {
    id: 'boring-company',
    name: 'The Boring Company',
    industry: 'Infrastructure & Tunnel Construction',
    status: 'PRIVATE',
    description: 'Building underground infrastructure to solve urban congestion.',
    investment: { expectedReturn: '15x', minInvestment: '$1,000', riskLevel: 'Very High', horizon: '5-7 yrs', allocation: 5, color: '#EAB308' },
    longDescription: 'The Boring Company is an American infrastructure and tunnel construction services company founded by Elon Musk. It aims to construct a network of tunnels to reduce city traffic via underground transport.',
    ceo: 'Elon Musk',
    founded: 2016,
    headquarters: 'Bastrop, Texas, USA',
    website: 'https://boringcompany.com',
    logo: 'TBC',
    logoColor: '#FFFFFF',
    bgColor: 'from-yellow-900/20 to-obsidian',
    employees: '200+',
    revenue: 'Private',
    milestones: [
      { year: 2016, event: 'The Boring Company founded' },
      { year: 2021, event: 'Las Vegas Convention Center Loop opens' },
      { year: 2022, event: 'Fort Lauderdale Loop contract awarded' },
      { year: 2023, event: 'Expansion to multiple US cities' },
    ],
  },
  {
    id: 'x',
    name: 'X',
    industry: 'Social Media & Communications',
    status: 'PRIVATE',
    description: 'The everything app for global communication and information.',
    investment: { expectedReturn: '8x', minInvestment: '$1,000', riskLevel: 'High', horizon: '3-5 yrs', allocation: 5, color: '#6B7280' },
    longDescription: 'X (formerly Twitter) is a social media platform and micro-blogging website. Acquired by Elon Musk in 2022, X has been repositioned as an everything app, incorporating payments, video, and more.',
    ceo: 'Linda Yaccarino',
    founded: 2006,
    headquarters: 'San Francisco, California, USA',
    website: 'https://x.com',
    logo: 'X',
    logoColor: '#FFFFFF',
    bgColor: 'from-gray-900/40 to-obsidian',
    employees: '1,500+',
    revenue: 'Private',
    milestones: [
      { year: 2006, event: 'Twitter founded by Jack Dorsey' },
      { year: 2013, event: 'Twitter IPO on NYSE' },
      { year: 2022, event: 'Elon Musk acquires Twitter for $44B' },
      { year: 2023, event: 'Twitter rebranded to X' },
      { year: 2026, event: 'X Money payment features launched' },
    ],
  },
];

export const newsArticles = [
  {
    id: 1,
    title: 'SpaceX Starship completes sixth successful test flight',
    summary: 'SpaceX successfully launched and landed its Starship rocket for the sixth time, marking a major milestone in reusable spacecraft technology.',
    category: 'SpaceX',
    date: 'May 25, 2026',
    image: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format',
    readTime: '4 min read',
  },
  {
    id: 2,
    title: 'Tesla unveils next-gen vehicle platform with 50% cost reduction',
    summary: 'Tesla announced a revolutionary new vehicle platform at its investor day, promising to reduce production costs by half and accelerate global adoption.',
    category: 'Tesla',
    date: 'May 24, 2026',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format',
    readTime: '5 min read',
  },
  {
    id: 3,
    title: 'xAI launches Grok 3 with advanced reasoning capabilities',
    summary: 'xAI released Grok 3, featuring breakthrough reasoning capabilities that surpass existing AI models in scientific and mathematical domains.',
    category: 'xAI',
    date: 'May 23, 2026',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format',
    readTime: '3 min read',
  },
  {
    id: 4,
    title: 'Neuralink receives FDA approval for expanded human trials',
    summary: 'Neuralink received expanded FDA approval to conduct brain-computer interface trials in patients with various neurological conditions.',
    category: 'Neuralink',
    date: 'May 22, 2026',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&auto=format',
    readTime: '6 min read',
  },
  {
    id: 5,
    title: 'TSLA stock surges 12% after record quarterly deliveries',
    summary: 'Tesla shares jumped following the announcement of record-breaking vehicle deliveries in Q1 2026, exceeding analyst expectations.',
    category: 'Markets',
    date: 'May 21, 2026',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format',
    readTime: '4 min read',
  },
  {
    id: 6,
    title: 'Bitcoin reaches new all-time high as institutional adoption grows',
    summary: 'Bitcoin crossed $70,000 for the first time as major financial institutions continue to add BTC to their balance sheets.',
    category: 'Crypto',
    date: 'May 20, 2026',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format',
    readTime: '3 min read',
  },
];

export const portfolioData = {
  totalValue: 125430.46,
  investedAmount: 98250.00,
  totalGain: 27180.46,
  totalGainPercent: 27.60,
  todayGain: 4250.75,
  todayGainPercent: 3.51,
  cashBalance: 7180.46,
  holdings: [
    { asset: 'Tesla (TSLA)', shares: 224.5, price: 178.62, value: 40078.32, gain: 2.45, color: '#EF4444', percent: 40.2 },
    { asset: 'Bitcoin (BTC)', shares: 0.368, price: 68742.21, value: 31780.10, gain: 1.35, color: '#F97316', percent: 25.3 },
    { asset: 'Ethereum (ETH)', shares: 1.415, price: 3521.09, value: 19580.35, gain: 1.72, color: '#6366F1', percent: 15.6 },
    { asset: 'Cash (USD)', shares: null, price: 1.00, value: 7180.46, gain: null, color: '#6B7280', percent: 10.4 },
    { asset: 'Others', shares: null, price: null, value: 6811.23, gain: null, color: '#374151', percent: 8.5 },
  ],
};

export const cryptoAssets = [
  { symbol: 'BTC', name: 'Bitcoin', price: 98240.15, change: 1.92, marketCap: '$1.93T', volume: '$42.8B', color: '#F97316' },
  { symbol: 'ETH', name: 'Ethereum', price: 3842.67, change: 2.08, marketCap: '$462B', volume: '$18.2B', color: '#6366F1' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.3845, change: 3.36, marketCap: '$56.3B', volume: '$3.8B', color: '#EAB308' },
  { symbol: 'SOL', name: 'Solana', price: 242.56, change: 2.46, marketCap: '$115.4B', volume: '$5.2B', color: '#8B5CF6' },
  { symbol: 'ADA', name: 'Cardano', price: 1.0842, change: 1.28, marketCap: '$38.5B', volume: '$1.2B', color: '#3B82F6' },
  { symbol: 'AVAX', name: 'Avalanche', price: 52.38, change: 2.14, marketCap: '$21.8B', volume: '$823M', color: '#EF4444' },
];

export const stockAssets = [
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: 2.58, marketCap: '$790B', volume: '$12.5B', pe: '52.8', color: '#EF4444' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 138.42, change: 1.95, marketCap: '$3.42T', volume: '$22.8B', pe: '68.3', color: '#10B981' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 234.82, change: 0.73, marketCap: '$3.62T', volume: '$8.4B', pe: '35.6', color: '#6B7280' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 445.28, change: 1.12, marketCap: '$3.31T', volume: '$7.2B', pe: '38.2', color: '#3B82F6' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 218.45, change: 0.85, marketCap: '$2.28T', volume: '$5.9B', pe: '58.4', color: '#F97316' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 192.38, change: 1.32, marketCap: '$2.42T', volume: '$4.6B', pe: '28.5', color: '#EAB308' },
];

export const generateSparkline = (basePrice, points = 20, volatility = 0.02) => {
  const data = [];
  let price = basePrice * 0.95;
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.45) * volatility);
    data.push({ value: price });
  }
  data[data.length - 1] = { value: basePrice };
  return data;
};

export const watchlistData = [
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.50, change: 6.25, changePercent: 2.58, color: '#EF4444', type: 'stock' },
  { symbol: 'BTC', name: 'Bitcoin', price: 98240.15, change: 1850.30, changePercent: 1.92, color: '#F97316', type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3842.67, change: 78.42, changePercent: 2.08, color: '#6366F1', type: 'crypto' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 138.42, change: 2.65, changePercent: 1.95, color: '#10B981', type: 'stock' },
  { symbol: 'SOL', name: 'Solana', price: 242.56, change: 5.83, changePercent: 2.46, color: '#8B5CF6', type: 'crypto' },
];

export const transactionsData = [
  { id: 'TXN001', type: 'deposit', method: 'Bitcoin', amount: 50000.00, status: 'approved', date: '2026-05-20', description: 'BTC Deposit', hash: '0x1a2b3c4d...' },
  { id: 'TXN002', type: 'deposit', method: 'Ethereum', amount: 25000.00, status: 'approved', date: '2026-05-15', description: 'ETH Deposit', hash: '0x5e6f7g8h...' },
  { id: 'TXN003', type: 'withdrawal', method: 'Bitcoin', amount: 10000.00, status: 'approved', date: '2026-05-10', description: 'BTC Withdrawal', hash: '0x9i0j1k2l...' },
  { id: 'TXN004', type: 'deposit', method: 'Amazon Gift Card', amount: 500.00, status: 'approved', date: '2026-05-08', description: 'Gift Card Deposit' },
  { id: 'TXN005', type: 'deposit', method: 'USDT (ERC20)', amount: 15000.00, status: 'pending', date: '2026-05-25', description: 'USDT Deposit', hash: '0xabcdef...' },
  { id: 'TXN006', type: 'withdrawal', method: 'Ethereum', amount: 5000.00, status: 'pending', date: '2026-05-26', description: 'ETH Withdrawal' },
  { id: 'TXN007', type: 'deposit', method: 'Bitcoin', amount: 30000.00, status: 'approved', date: '2026-04-30', description: 'BTC Deposit', hash: '0xmno...' },
  { id: 'TXN008', type: 'deposit', method: 'Google Play Gift Card', amount: 200.00, status: 'rejected', date: '2026-04-25', description: 'Gift Card Deposit' },
];

export const notificationsData = [
  { id: 1, type: 'deposit', title: 'Deposit Approved', message: 'Your Bitcoin deposit of $50,000 has been approved and added to your account.', date: '2026-05-20T14:32:00Z', read: false },
  { id: 2, type: 'withdrawal', title: 'Withdrawal Pending', message: 'Your withdrawal request of $10,000 is under review. Expected processing: 24-48 hours.', date: '2026-05-26T09:15:00Z', read: false },
  { id: 3, type: 'market', title: 'TSLA Price Alert', message: 'Tesla (TSLA) has surged 5% today, now trading at $178.62.', date: '2026-05-25T16:00:00Z', read: false },
  { id: 4, type: 'system', title: 'Welcome to Musk Capital', message: 'Your account has been successfully set up. Start exploring investment opportunities today.', date: '2026-05-01T08:00:00Z', read: true },
  { id: 5, type: 'deposit', title: 'Deposit Received', message: 'We have received your USDT deposit of $15,000. Awaiting confirmation.', date: '2026-05-25T11:20:00Z', read: true },
  { id: 6, type: 'market', title: 'Bitcoin All-Time High', message: 'Bitcoin has reached a new all-time high of $69,000. Your BTC holdings are up $1,200.', date: '2026-05-24T18:45:00Z', read: true },
  { id: 7, type: 'system', title: 'Security Alert', message: 'A new login was detected from a new device. If this was not you, please secure your account.', date: '2026-05-22T07:30:00Z', read: true },
];

export const depositsHistory = [
  { id: 'DEP001', method: 'Bitcoin', coin: 'BTC', amount: 50000, status: 'approved', date: '2026-05-20', txHash: '0x1a2b3c4d5e6f7g8h9i0j', network: 'Bitcoin' },
  { id: 'DEP002', method: 'Ethereum', coin: 'ETH', amount: 25000, status: 'approved', date: '2026-05-15', txHash: '0x5e6f7g8h9i0j1k2l3m4n', network: 'ERC20' },
  { id: 'DEP003', method: 'USDT (ERC20)', coin: 'USDT', amount: 15000, status: 'pending', date: '2026-05-25', txHash: '0xabcdef123456', network: 'ERC20' },
  { id: 'DEP004', method: 'Amazon Gift Card', coin: null, amount: 500, status: 'approved', date: '2026-05-08', cardBrand: 'Amazon' },
  { id: 'DEP005', method: 'Google Play Gift Card', coin: null, amount: 200, status: 'rejected', date: '2026-04-25', cardBrand: 'Google Play' },
];

export const withdrawalsHistory = [
  { id: 'WIT001', coin: 'BTC', amount: 10000, status: 'approved', date: '2026-05-10', walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf...' },
  { id: 'WIT002', coin: 'ETH', amount: 5000, status: 'pending', date: '2026-05-26', walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
];

export const portfolioHistory = [
  { month: 'Nov', value: 80000 }, { month: 'Dec', value: 88000 },
  { month: 'Jan', value: 85000 }, { month: 'Feb', value: 95000 },
  { month: 'Mar', value: 102000 }, { month: 'Apr', value: 110000 },
  { month: 'May', value: 125430 },
];

export const cryptoWallets = {
  BTC: { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', network: 'Bitcoin', minDeposit: 0.001 },
  ETH: { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', network: 'ERC20', minDeposit: 0.01 },
  'USDT-ERC20': { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', network: 'ERC20 (Ethereum)', minDeposit: 10 },
  'USDT-TRC20': { address: 'TJYeasTPa6gpEEfek4v2CnnDLdpHfkpUVS', network: 'TRC20 (Tron)', minDeposit: 10 },
};

// ─── ADMIN MOCK DATA ───────────────────────────────────────────────

export const adminUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@email.com', username: 'johndoe', role: 'user', status: 'active', balance: 125430, joined: '2026-01-15', lastLogin: '2026-05-31 10:22 AM', avatar: 'J', country: 'USA' },
  { id: 2, name: 'Sarah Williams', email: 'sarah.w@email.com', username: 'sarahw', role: 'user', status: 'active', balance: 87500, joined: '2026-02-03', lastLogin: '2026-05-31 09:14 AM', avatar: 'S', country: 'UK' },
  { id: 3, name: 'Michael Brown', email: 'michael.b@email.com', username: 'mikebrown', role: 'user', status: 'active', balance: 243000, joined: '2026-01-28', lastLogin: '2026-05-30 04:55 PM', avatar: 'M', country: 'Canada' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@email.com', username: 'emilyd', role: 'user', status: 'suspended', balance: 12000, joined: '2026-03-10', lastLogin: '2026-05-15 11:30 AM', avatar: 'E', country: 'Australia' },
  { id: 5, name: 'David Johnson', email: 'david.j@email.com', username: 'davidj', role: 'user', status: 'active', balance: 560000, joined: '2023-12-01', lastLogin: '2026-05-31 08:00 AM', avatar: 'D', country: 'USA' },
  { id: 6, name: 'Lisa Chen', email: 'lisa.c@email.com', username: 'lisachen', role: 'user', status: 'active', balance: 98000, joined: '2026-04-05', lastLogin: '2026-05-29 02:10 PM', avatar: 'L', country: 'Singapore' },
  { id: 7, name: 'James Wilson', email: 'james.w@email.com', username: 'jameswilson', role: 'user', status: 'suspended', balance: 0, joined: '2026-04-22', lastLogin: '2026-05-01 09:00 AM', avatar: 'J', country: 'USA' },
  { id: 8, name: 'Amanda Fox', email: 'amanda.f@email.com', username: 'amandafox', role: 'user', status: 'active', balance: 315000, joined: '2026-02-14', lastLogin: '2026-05-30 01:45 PM', avatar: 'A', country: 'Germany' },
];

export const adminDeposits = [
  { id: 'DEP001', user: 'John Doe', email: 'john.doe@email.com', currency: 'BTC', network: 'Bitcoin', amount: 50000, walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf...', txHash: '0x1a2b3c4d5e6f7g8h', date: '2026-05-20', status: 'approved' },
  { id: 'DEP002', user: 'Sarah Williams', email: 'sarah.w@email.com', currency: 'ETH', network: 'ERC20', amount: 25000, walletAddress: '0x71C7656EC7ab88b098de...', txHash: '0x5e6f7g8h9i0j1k2l', date: '2026-05-22', status: 'approved' },
  { id: 'DEP003', user: 'Emily Davis', email: 'emily.d@email.com', currency: 'USDT', network: 'TRC20', amount: 15000, walletAddress: 'TJYeasTPa6gpEEfek4v2...', txHash: '0xabcdef123456789', date: '2026-05-25', status: 'pending' },
  { id: 'DEP004', user: 'Michael Brown', email: 'michael.b@email.com', currency: 'BTC', network: 'Bitcoin', amount: 80000, walletAddress: 'bc1qxy2kgdygjrsqtzq2n0...', txHash: '0x9i8h7g6f5e4d3c2b', date: '2026-05-26', status: 'pending' },
  { id: 'DEP005', user: 'David Johnson', email: 'david.j@email.com', currency: 'ETH', network: 'ERC20', amount: 120000, walletAddress: '0x71C7656EC7ab88b098de...', txHash: '0xfedcba987654321', date: '2026-05-18', status: 'approved' },
  { id: 'DEP006', user: 'James Wilson', email: 'james.w@email.com', currency: 'USDT', network: 'ERC20', amount: 5000, walletAddress: '0x71C7656EC7ab88b098de...', txHash: '0xaaabbbccc111222', date: '2026-04-30', status: 'rejected' },
  { id: 'DEP007', user: 'Amanda Fox', email: 'amanda.f@email.com', currency: 'BTC', network: 'Bitcoin', amount: 200000, walletAddress: 'bc1qxy2kgdygjrsqtzq2n0...', txHash: '0xdddeeefff444555', date: '2026-05-28', status: 'pending' },
];

export const adminGiftCards = [
  { id: 'GC001', user: 'John Doe', email: 'john.doe@email.com', cardType: 'Amazon', value: 500, country: 'USA', notes: 'Card code: AMZN-XXXX-XXXX', status: 'approved', date: '2026-05-10' },
  { id: 'GC002', user: 'Emily Davis', email: 'emily.d@email.com', cardType: 'Apple', value: 200, country: 'USA', notes: '', status: 'pending', date: '2026-05-26' },
  { id: 'GC003', user: 'Sarah Williams', email: 'sarah.w@email.com', cardType: 'Google Play', value: 100, country: 'UK', notes: 'Two separate $50 cards', status: 'rejected', date: '2026-04-25' },
  { id: 'GC004', user: 'Michael Brown', email: 'michael.b@email.com', cardType: 'Steam', value: 300, country: 'Canada', notes: '', status: 'pending', date: '2026-05-27' },
  { id: 'GC005', user: 'David Johnson', email: 'david.j@email.com', cardType: 'Visa', value: 1000, country: 'USA', notes: 'Pre-paid Visa card', status: 'approved', date: '2026-05-05' },
  { id: 'GC006', user: 'Amanda Fox', email: 'amanda.f@email.com', cardType: 'Amazon', value: 250, country: 'Germany', notes: '', status: 'pending', date: '2026-05-28' },
];

export const adminWithdrawals = [
  { id: 'WIT001', user: 'John Doe', email: 'john.doe@email.com', amount: 10000, currency: 'BTC', walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf...', date: '2026-05-10', status: 'approved' },
  { id: 'WIT002', user: 'Sarah Williams', email: 'sarah.w@email.com', amount: 5000, currency: 'ETH', walletAddress: '0x71C7656EC7ab88b098de...', date: '2026-05-26', status: 'pending' },
  { id: 'WIT003', user: 'David Johnson', email: 'david.j@email.com', amount: 25000, currency: 'USDT', walletAddress: 'TJYeasTPa6gpEEfek4v2...', date: '2026-05-27', status: 'pending' },
  { id: 'WIT004', user: 'Michael Brown', email: 'michael.b@email.com', amount: 50000, currency: 'BTC', walletAddress: 'bc1qxy2kgdygjrsqtzq2n0...', date: '2026-05-20', status: 'approved' },
  { id: 'WIT005', user: 'Amanda Fox', email: 'amanda.f@email.com', amount: 15000, currency: 'ETH', walletAddress: '0x71C7656EC7ab88b098de...', date: '2026-05-28', status: 'rejected' },
  { id: 'WIT006', user: 'Lisa Chen', email: 'lisa.c@email.com', amount: 8000, currency: 'USDT', walletAddress: 'TJYeasTPa6gpEEfek4v2...', date: '2026-05-29', status: 'pending' },
];

export const adminNews = [
  { id: 1, title: 'Tesla Launches Next-Gen Autopilot System', category: 'Tesla', summary: 'Tesla unveils its most advanced autonomous driving system yet, promising full self-driving capability.', date: '2026-05-30', author: 'Admin', status: 'published', featured: true, image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?w=400&h=200&fit=crop' },
  { id: 2, title: 'SpaceX Starship Achieves Orbital Success', category: 'SpaceX', summary: 'SpaceX\'s Starship completes its first successful orbital flight, marking a major milestone in space travel.', date: '2026-05-28', author: 'Admin', status: 'published', featured: false, image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=200&fit=crop' },
  { id: 3, title: 'xAI Releases Grok 3.0 — Most Powerful Model Yet', category: 'xAI', summary: 'xAI pushes the frontier of AI with Grok 3.0, surpassing previous benchmarks in reasoning and code generation.', date: '2026-05-26', author: 'Admin', status: 'draft', featured: false, image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=200&fit=crop' },
  { id: 4, title: 'Bitcoin Breaks $70,000 — Market Euphoria', category: 'Crypto', summary: 'Bitcoin reaches a new all-time high as institutional demand surges and ETF inflows hit record levels.', date: '2026-05-24', author: 'Admin', status: 'published', featured: true, image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop' },
  { id: 5, title: 'Neuralink Brain Chip Shows Promising Results', category: 'Neuralink', summary: 'The first human trial participant demonstrates full control of digital devices using only neural signals.', date: '2026-05-22', author: 'Admin', status: 'published', featured: false, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop' },
];

export const adminTransactions = [
  { id: 'TXN001', user: 'John Doe', type: 'deposit', method: 'BTC', amount: 50000, status: 'approved', date: '2026-05-20' },
  { id: 'TXN002', user: 'Sarah Williams', type: 'deposit', method: 'ETH', amount: 25000, status: 'approved', date: '2026-05-22' },
  { id: 'TXN003', user: 'John Doe', type: 'withdrawal', method: 'BTC', amount: 10000, status: 'approved', date: '2026-05-10' },
  { id: 'TXN004', user: 'Michael Brown', type: 'deposit', method: 'BTC', amount: 80000, status: 'pending', date: '2026-05-26' },
  { id: 'TXN005', user: 'David Johnson', type: 'deposit', method: 'ETH', amount: 120000, status: 'approved', date: '2026-05-18' },
  { id: 'TXN006', user: 'Emily Davis', type: 'deposit', method: 'Gift Card', amount: 200, status: 'pending', date: '2026-05-26' },
  { id: 'TXN007', user: 'Sarah Williams', type: 'withdrawal', method: 'ETH', amount: 5000, status: 'pending', date: '2026-05-26' },
  { id: 'TXN008', user: 'Amanda Fox', type: 'deposit', method: 'BTC', amount: 200000, status: 'pending', date: '2026-05-28' },
  { id: 'TXN009', user: 'Lisa Chen', type: 'withdrawal', method: 'USDT', amount: 8000, status: 'pending', date: '2026-05-29' },
  { id: 'TXN010', user: 'James Wilson', type: 'deposit', method: 'USDT', amount: 5000, status: 'rejected', date: '2026-04-30' },
];

export const auditLogs = [
  { id: 1, admin: 'Super Admin', action: 'Deposit Approved', detail: 'Approved DEP001 — John Doe ($50,000 BTC)', ip: '192.168.1.1', status: 'success', timestamp: '2026-05-20 14:32:00' },
  { id: 2, admin: 'Super Admin', action: 'User Suspended', detail: 'Suspended user: james.w@email.com', ip: '192.168.1.1', status: 'warning', timestamp: '2026-05-18 09:15:00' },
  { id: 3, admin: 'Super Admin', action: 'Withdrawal Approved', detail: 'Approved WIT001 — John Doe ($10,000 BTC)', ip: '192.168.1.1', status: 'success', timestamp: '2026-05-10 11:20:00' },
  { id: 4, admin: 'Super Admin', action: 'News Published', detail: 'Published: "Tesla Launches Next-Gen Autopilot System"', ip: '192.168.1.1', status: 'success', timestamp: '2026-05-30 08:00:00' },
  { id: 5, admin: 'Super Admin', action: 'Gift Card Rejected', detail: 'Rejected GC003 — Sarah Williams (Google Play $100)', ip: '192.168.1.1', status: 'danger', timestamp: '2026-04-26 15:45:00' },
  { id: 6, admin: 'Super Admin', action: 'Admin Login', detail: 'Successful login from IP 192.168.1.1', ip: '192.168.1.1', status: 'success', timestamp: '2026-05-31 08:00:00' },
  { id: 7, admin: 'Super Admin', action: 'Settings Changed', detail: 'Updated platform name and contact information', ip: '192.168.1.1', status: 'info', timestamp: '2026-05-29 13:00:00' },
  { id: 8, admin: 'Super Admin', action: 'Company Updated', detail: 'Updated Tesla company details and description', ip: '192.168.1.1', status: 'info', timestamp: '2026-05-28 10:30:00' },
  { id: 9, admin: 'Super Admin', action: 'Deposit Rejected', detail: 'Rejected DEP006 — James Wilson ($5,000 USDT)', ip: '192.168.1.1', status: 'danger', timestamp: '2026-04-30 16:10:00' },
  { id: 10, admin: 'Super Admin', action: 'User Activated', detail: 'Re-activated user: emily.d@email.com', ip: '192.168.1.1', status: 'success', timestamp: '2026-05-17 09:00:00' },
];

export const adminNotificationHistory = [
  { id: 1, title: 'Platform Maintenance', message: 'Scheduled maintenance on June 1st 2AM-4AM UTC.', target: 'All Users', sent: '2026-05-30 10:00', type: 'system' },
  { id: 2, title: 'New Feature: Watchlist', message: 'You can now track your favourite assets with our new Watchlist feature.', target: 'All Users', sent: '2026-05-20 09:00', type: 'feature' },
  { id: 3, title: 'Deposit Limit Increase', message: 'Daily deposit limits increased for all Premium members.', target: 'Premium Users', sent: '2026-05-15 11:00', type: 'promo' },
];

export const userGrowthData = [
  { month: 'Jan', users: 1200 }, { month: 'Feb', users: 1850 }, { month: 'Mar', users: 2400 },
  { month: 'Apr', users: 3100 }, { month: 'May', users: 3800 }, { month: 'Jun', users: 4200 },
  { month: 'Jul', users: 4752 },
];

export const depositChartData = [
  { month: 'Jan', amount: 320000 }, { month: 'Feb', amount: 480000 }, { month: 'Mar', amount: 560000 },
  { month: 'Apr', amount: 720000 }, { month: 'May', amount: 950000 }, { month: 'Jun', amount: 820000 },
  { month: 'Jul', amount: 1100000 },
];

export const withdrawalChartData = [
  { month: 'Jan', amount: 80000 }, { month: 'Feb', amount: 120000 }, { month: 'Mar', amount: 95000 },
  { month: 'Apr', amount: 180000 }, { month: 'May', amount: 220000 }, { month: 'Jun', amount: 195000 },
  { month: 'Jul', amount: 260000 },
];


