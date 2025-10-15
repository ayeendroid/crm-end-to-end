// Mock data generator for BharatNet ISP CRM
// Generates realistic Indian ISP customer data

export interface BharatNetCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    pincode: string;
    address: string;
  };
  plan: {
    type: 'Fiber' | 'Broadband' | 'Wireless';
    speed: '50Mbps' | '100Mbps' | '200Mbps' | '500Mbps' | '1Gbps';
    price: number;
    billingCycle: 'Monthly' | 'Quarterly' | 'Annual';
    ottApps: string[];
    liveChannels: number;
  };
  usage: {
    dataConsumed: number;
    averageSpeed: number;
    uptime: number;
    mostUsedOTT: string[];
    peakUsageHours: string[];
  };
  customerSince: string;
  lifetimeValue: number;
  churnRisk: 'Low' | 'Medium' | 'High';
  npsScore: number;
  tickets: number;
  lastTicketDate: string;
  satisfaction: 1 | 2 | 3 | 4 | 5;
  source: 'Website' | 'Referral' | 'Cold Call' | 'Social Media' | 'Walk-in';
  referredBy?: string;
  status: 'Active' | 'Suspended' | 'Cancelled';
  nextBillingDate: string;
  outstandingAmount: number;
}

// Indian names
const firstNames = [
  'Rahul', 'Priya', 'Amit', 'Anjali', 'Vikram', 'Neha', 'Rajesh', 'Pooja',
  'Arjun', 'Kavita', 'Sanjay', 'Deepika', 'Rohan', 'Swati', 'Manish', 'Ritu',
  'Aditya', 'Shreya', 'Karan', 'Isha', 'Nikhil', 'Divya', 'Abhishek', 'Meera',
  'Suresh', 'Anita', 'Varun', 'Simran', 'Harsh', 'Nisha', 'Gaurav', 'Preeti',
  'Vishal', 'Sakshi', 'Akash', 'Tanvi', 'Rohit', 'Kriti', 'Ravi', 'Sneha',
];

const lastNames = [
  'Sharma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Nair', 'Gupta', 'Mehta',
  'Verma', 'Iyer', 'Joshi', 'Desai', 'Rao', 'Pillai', 'Agarwal', 'Malhotra',
  'Chopra', 'Kapoor', 'Banerjee', 'Das', 'Bose', 'Mishra', 'Pandey', 'Sinha',
  'Bhatt', 'Shah', 'Kulkarni', 'Menon', 'Krishnan', 'Saxena', 'Arora', 'Sethi',
];

// Indian cities with states
const cities = [
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { city: 'Delhi', state: 'Delhi', pincode: '110001' },
  { city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
  { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
  { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
  { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
  { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
  { city: 'Surat', state: 'Gujarat', pincode: '395001' },
  { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
  { city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' },
  { city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001' },
  { city: 'Nagpur', state: 'Maharashtra', pincode: '440001' },
  { city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
  { city: 'Thane', state: 'Maharashtra', pincode: '400601' },
  { city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462001' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530001' },
  { city: 'Patna', state: 'Bihar', pincode: '800001' },
  { city: 'Vadodara', state: 'Gujarat', pincode: '390001' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', pincode: '201001' },
];

// OTT apps available with BharatNet
const ottApps = [
  'Netflix', 'Amazon Prime Video', 'Disney+ Hotstar', 'Sony LIV',
  'Zee5', 'Voot', 'ALTBalaji', 'MX Player', 'JioCinema', 'Eros Now',
  'Hoichoi', 'Sun NXT', 'Shemaroo', 'Lionsgate Play', 'Apple TV+',
  'Discovery+', 'YouTube Premium', 'Spotify', 'Gaana', 'JioSaavn',
];

// Plan configurations
const plans = [
  { type: 'Fiber' as const, speed: '50Mbps' as const, price: 599, ottCount: 5, channels: 200 },
  { type: 'Fiber' as const, speed: '100Mbps' as const, price: 899, ottCount: 10, channels: 250 },
  { type: 'Fiber' as const, speed: '200Mbps' as const, price: 1299, ottCount: 15, channels: 300 },
  { type: 'Fiber' as const, speed: '500Mbps' as const, price: 1999, ottCount: 25, channels: 350 },
  { type: 'Fiber' as const, speed: '1Gbps' as const, price: 2999, ottCount: 40, channels: 350 },
  { type: 'Broadband' as const, speed: '50Mbps' as const, price: 499, ottCount: 3, channels: 150 },
  { type: 'Broadband' as const, speed: '100Mbps' as const, price: 799, ottCount: 8, channels: 200 },
  { type: 'Wireless' as const, speed: '50Mbps' as const, price: 699, ottCount: 5, channels: 180 },
];

const billingCycles: Array<'Monthly' | 'Quarterly' | 'Annual'> = ['Monthly', 'Quarterly', 'Annual'];
const sources: Array<'Website' | 'Referral' | 'Cold Call' | 'Social Media' | 'Walk-in'> = 
  ['Website', 'Referral', 'Cold Call', 'Social Media', 'Walk-in'];

// Helper functions
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export function generateBharatNetCustomers(count: number = 100): BharatNetCustomer[] {
  const customers: BharatNetCustomer[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const location = randomItem(cities);
    const plan = randomItem(plans);
    const billingCycle = randomItem(billingCycles);
    const source = randomItem(sources);
    const status = Math.random() > 0.85 ? randomItem(['Suspended', 'Cancelled'] as const) : 'Active';
    
    // Calculate billing multiplier
    const cycleMultiplier = billingCycle === 'Annual' ? 12 : billingCycle === 'Quarterly' ? 3 : 1;
    const monthlyPrice = plan.price;
    const totalPrice = monthlyPrice * cycleMultiplier;
    
    // Customer since date (between 6 months to 5 years ago)
    const customerSince = randomDate(
      new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    );
    
    // Calculate lifetime value
    const monthsSinceJoining = Math.floor((Date.now() - customerSince.getTime()) / (30 * 24 * 60 * 60 * 1000));
    const lifetimeValue = monthlyPrice * monthsSinceJoining;
    
    // Select OTT apps
    const selectedOTT = [...ottApps]
      .sort(() => Math.random() - 0.5)
      .slice(0, plan.ottCount);
    
    // Most used OTT (top 3)
    const mostUsedOTT = selectedOTT.slice(0, 3);
    
    // Peak usage hours
    const peakHours = ['9-11 PM', '2-4 PM', '6-8 PM'];
    const selectedPeakHours = peakHours.slice(0, randomInt(1, 2));
    
    // Churn risk based on multiple factors
    const ticketCount = randomInt(0, 15);
    const npsScore = randomInt(0, 10);
    const usagePercent = randomInt(40, 100);
    
    let churnRisk: 'Low' | 'Medium' | 'High' = 'Low';
    if (ticketCount > 10 || npsScore < 4 || usagePercent < 50 || status === 'Suspended') {
      churnRisk = 'High';
    } else if (ticketCount > 5 || npsScore < 7 || usagePercent < 70) {
      churnRisk = 'Medium';
    }
    
    // Satisfaction based on NPS
    let satisfaction: 1 | 2 | 3 | 4 | 5;
    if (npsScore >= 9) satisfaction = 5;
    else if (npsScore >= 7) satisfaction = 4;
    else if (npsScore >= 5) satisfaction = 3;
    else if (npsScore >= 3) satisfaction = 2;
    else satisfaction = 1;
    
    // Last ticket date
    const lastTicketDate = ticketCount > 0 
      ? randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date())
      : randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
    
    // Next billing date
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + randomInt(1, 30));
    
    // Outstanding amount
    const outstandingAmount = status === 'Suspended' 
      ? totalPrice * randomInt(1, 3)
      : Math.random() > 0.8 ? totalPrice : 0;
    
    customers.push({
      id: `CUST${String(i + 1).padStart(6, '0')}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`,
      location: {
        ...location,
        address: `${randomInt(1, 999)}, ${randomItem(['MG Road', 'Park Street', 'Main Road', 'Anna Salai', 'Brigade Road', 'Linking Road'])}`,
      },
      plan: {
        type: plan.type,
        speed: plan.speed,
        price: monthlyPrice,
        billingCycle,
        ottApps: selectedOTT,
        liveChannels: plan.channels,
      },
      usage: {
        dataConsumed: randomInt(100, 2000), // GB per month
        averageSpeed: parseFloat((parseFloat(plan.speed) * randomInt(85, 99) / 100).toFixed(1)),
        uptime: parseFloat((randomInt(95, 100) + Math.random()).toFixed(2)),
        mostUsedOTT,
        peakUsageHours: selectedPeakHours,
      },
      customerSince: customerSince.toISOString().split('T')[0],
      lifetimeValue,
      churnRisk,
      npsScore,
      tickets: ticketCount,
      lastTicketDate: lastTicketDate.toISOString().split('T')[0],
      satisfaction,
      source,
      referredBy: source === 'Referral' ? `${randomItem(firstNames)} ${randomItem(lastNames)}` : undefined,
      status,
      nextBillingDate: nextBillingDate.toISOString().split('T')[0],
      outstandingAmount,
    });
  }

  return customers;
}

// Generate and export customers
export const mockBharatNetCustomers = generateBharatNetCustomers(500);

// Debug log
console.log('✅ mockBharatNetData.ts loaded!');
console.log('📊 Generated', mockBharatNetCustomers.length, 'BharatNet customers');
console.log('👤 First customer:', mockBharatNetCustomers[0]?.name);
console.log('📍 First customer city:', mockBharatNetCustomers[0]?.location.city);
console.log('💰 First customer plan:', mockBharatNetCustomers[0]?.plan.type, mockBharatNetCustomers[0]?.plan.speed);

// Analytics calculations
export const getCustomerAnalytics = (customers: BharatNetCustomer[]) => {
  const active = customers.filter(c => c.status === 'Active').length;
  const suspended = customers.filter(c => c.status === 'Suspended').length;
  const cancelled = customers.filter(c => c.status === 'Cancelled').length;
  
  const totalRevenue = customers
    .filter(c => c.status === 'Active')
    .reduce((sum, c) => sum + c.plan.price, 0);
  
  const avgLifetimeValue = customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / customers.length;
  
  const highChurnRisk = customers.filter(c => c.churnRisk === 'High').length;
  const mediumChurnRisk = customers.filter(c => c.churnRisk === 'Medium').length;
  const lowChurnRisk = customers.filter(c => c.churnRisk === 'Low').length;
  
  const avgNPS = customers.reduce((sum, c) => sum + c.npsScore, 0) / customers.length;
  
  const avgUptime = customers.reduce((sum, c) => sum + c.usage.uptime, 0) / customers.length;
  
  const planDistribution = customers.reduce((acc, c) => {
    const key = `${c.plan.speed}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: customers.length,
    active,
    suspended,
    cancelled,
    totalRevenue,
    avgLifetimeValue,
    churnRisk: { high: highChurnRisk, medium: mediumChurnRisk, low: lowChurnRisk },
    avgNPS: avgNPS.toFixed(1),
    avgUptime: avgUptime.toFixed(2),
    planDistribution,
  };
};
