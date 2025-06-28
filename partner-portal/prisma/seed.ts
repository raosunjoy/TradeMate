import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

function generateApiKey(): string {
  const prefix = 'tm_';
  const randomString = Array.from({ length: 32 }, () => 
    Math.random().toString(36).charAt(0)
  ).join('');
  return prefix + randomString;
}

async function createSeedData() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.apiUsage.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.partner.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create Partners first
  const partners = await Promise.all([
    // Enterprise Partner
    prisma.partner.create({
      data: {
        id: 'partner_enterprise_001',
        companyName: 'TechCorp Enterprise',
        contactEmail: 'contact@techcorp.com',
        contactPhone: '+1-555-0101',
        website: 'https://techcorp.com',
        description: 'Leading enterprise technology solutions provider',
        tier: 'BLACK',
        status: 'APPROVED',
        industry: 'Technology',
        companySize: 'ENTERPRISE',
        monthlyVolume: 1000000,
        billingEmail: 'billing@techcorp.com',
        webhookUrl: 'https://api.techcorp.com/webhooks/trademate',
        rateLimitTier: 'enterprise',
        approvedAt: new Date(),
        approvedBy: 'admin@trademate.com',
      },
    }),
    
    // Medium Partner
    prisma.partner.create({
      data: {
        id: 'partner_fintech_002',
        companyName: 'FinTech Solutions Ltd',
        contactEmail: 'info@fintech-solutions.com',
        contactPhone: '+1-555-0202',
        website: 'https://fintech-solutions.com',
        description: 'Innovative financial technology solutions',
        tier: 'ELITE',
        status: 'APPROVED',
        industry: 'Financial Services',
        companySize: 'MEDIUM',
        monthlyVolume: 250000,
        billingEmail: 'accounts@fintech-solutions.com',
        webhookUrl: 'https://api.fintech-solutions.com/webhooks',
        rateLimitTier: 'premium',
        approvedAt: new Date(),
        approvedBy: 'admin@trademate.com',
      },
    }),
    
    // Small Partner
    prisma.partner.create({
      data: {
        id: 'partner_startup_003',
        companyName: 'Trading Startup Inc',
        contactEmail: 'hello@trading-startup.com',
        contactPhone: '+1-555-0303',
        website: 'https://trading-startup.com',
        description: 'Emerging trading platform for retail investors',
        tier: 'PRO',
        status: 'APPROVED',
        industry: 'FinTech',
        companySize: 'STARTUP',
        monthlyVolume: 50000,
        billingEmail: 'billing@trading-startup.com',
        rateLimitTier: 'standard',
        approvedAt: new Date(),
        approvedBy: 'admin@trademate.com',
      },
    }),
    
    // Individual Developer
    prisma.partner.create({
      data: {
        id: 'partner_developer_004',
        companyName: 'Indie Developer Solutions',
        contactEmail: 'dev@indie-solutions.com',
        website: 'https://indie-solutions.com',
        description: 'Independent developer building trading tools',
        tier: 'LITE',
        status: 'APPROVED',
        industry: 'Software Development',
        companySize: 'STARTUP',
        monthlyVolume: 10000,
        rateLimitTier: 'basic',
        approvedAt: new Date(),
        approvedBy: 'admin@trademate.com',
      },
    }),
    
    // Pending Partner
    prisma.partner.create({
      data: {
        id: 'partner_pending_005',
        companyName: 'New Trading Co',
        contactEmail: 'contact@newtrading.com',
        description: 'New company applying for partnership',
        tier: 'LITE',
        status: 'PENDING',
        industry: 'Trading',
        companySize: 'SMALL',
        monthlyVolume: 5000,
      },
    }),
  ]);

  console.log('✅ Created partners');

  // Create Users with different roles
  const users = await Promise.all([
    // Super Admin
    prisma.user.create({
      data: {
        id: 'user_superadmin_001',
        name: 'System Administrator',
        email: 'superadmin@trademate.com',
        password: await hashPassword('SuperAdmin123!'),
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        permissions: {
          canManageUsers: true,
          canManagePartners: true,
          canManageSystem: true,
          canViewAnalytics: true,
          canManageBilling: true,
          canAccessAdmin: true,
        },
        lastLoginAt: new Date(),
      },
    }),
    
    // Admin
    prisma.user.create({
      data: {
        id: 'user_admin_002',
        name: 'Admin Manager',
        email: 'admin@trademate.com',
        password: await hashPassword('Admin123!'),
        role: 'ADMIN',
        status: 'ACTIVE',
        permissions: {
          canManageUsers: true,
          canManagePartners: true,
          canViewAnalytics: true,
          canAccessAdmin: true,
        },
        lastLoginAt: new Date(),
      },
    }),
    
    // Enterprise Partner Admin
    prisma.user.create({
      data: {
        id: 'user_enterprise_admin_003',
        name: 'John Enterprise',
        email: 'john.admin@techcorp.com',
        password: await hashPassword('Enterprise123!'),
        role: 'PARTNER_ADMIN',
        status: 'ACTIVE',
        companyName: 'TechCorp Enterprise',
        partnerId: 'partner_enterprise_001',
        permissions: {
          canManageTeam: true,
          canManageApiKeys: true,
          canViewAnalytics: true,
          canManageBilling: true,
        },
        lastLoginAt: faker.date.recent(),
      },
    }),
    
    // Enterprise Developer
    prisma.user.create({
      data: {
        id: 'user_enterprise_dev_004',
        name: 'Sarah Developer',
        email: 'sarah.dev@techcorp.com',
        password: await hashPassword('Developer123!'),
        role: 'DEVELOPER',
        status: 'ACTIVE',
        companyName: 'TechCorp Enterprise',
        partnerId: 'partner_enterprise_001',
        permissions: {
          canUseApi: true,
          canViewDocs: true,
          canManageApiKeys: true,
        },
        lastLoginAt: faker.date.recent(),
      },
    }),
    
    // FinTech Partner Admin
    prisma.user.create({
      data: {
        id: 'user_fintech_admin_005',
        name: 'Mike FinTech',
        email: 'mike@fintech-solutions.com',
        password: await hashPassword('FinTech123!'),
        role: 'PARTNER_ADMIN',
        status: 'ACTIVE',
        companyName: 'FinTech Solutions Ltd',
        partnerId: 'partner_fintech_002',
        permissions: {
          canManageTeam: true,
          canManageApiKeys: true,
          canViewAnalytics: true,
          canManageBilling: true,
        },
        lastLoginAt: faker.date.recent(),
      },
    }),
    
    // Startup Partner
    prisma.user.create({
      data: {
        id: 'user_startup_006',
        name: 'Alex Startup',
        email: 'alex@trading-startup.com',
        password: await hashPassword('Startup123!'),
        role: 'PARTNER',
        status: 'ACTIVE',
        companyName: 'Trading Startup Inc',
        partnerId: 'partner_startup_003',
        permissions: {
          canUseApi: true,
          canViewDocs: true,
          canManageApiKeys: true,
        },
        lastLoginAt: faker.date.recent(),
      },
    }),
    
    // Individual Developer
    prisma.user.create({
      data: {
        id: 'user_indie_dev_007',
        name: 'Emma Developer',
        email: 'emma@indie-solutions.com',
        password: await hashPassword('IndieDev123!'),
        role: 'DEVELOPER',
        status: 'ACTIVE',
        companyName: 'Indie Developer Solutions',
        partnerId: 'partner_developer_004',
        permissions: {
          canUseApi: true,
          canViewDocs: true,
        },
        lastLoginAt: faker.date.recent(),
      },
    }),
    
    // Viewer Role
    prisma.user.create({
      data: {
        id: 'user_viewer_008',
        name: 'Tom Viewer',
        email: 'tom.viewer@techcorp.com',
        password: await hashPassword('Viewer123!'),
        role: 'VIEWER',
        status: 'ACTIVE',
        companyName: 'TechCorp Enterprise',
        partnerId: 'partner_enterprise_001',
        permissions: {
          canViewDocs: true,
          canViewAnalytics: true,
        },
        lastLoginAt: faker.date.recent(),
      },
    }),
    
    // Pending User
    prisma.user.create({
      data: {
        id: 'user_pending_009',
        name: 'Jane Pending',
        email: 'jane@newtrading.com',
        password: await hashPassword('Pending123!'),
        role: 'PARTNER',
        status: 'PENDING_VERIFICATION',
        companyName: 'New Trading Co',
        partnerId: 'partner_pending_005',
        permissions: {},
      },
    }),
    
    // Suspended User
    prisma.user.create({
      data: {
        id: 'user_suspended_010',
        name: 'Bob Suspended',
        email: 'bob.suspended@example.com',
        password: await hashPassword('Suspended123!'),
        role: 'PARTNER',
        status: 'SUSPENDED',
        companyName: 'Suspended Company',
        permissions: {},
      },
    }),
  ]);

  console.log('✅ Created users');

  // Create API Keys for active partners
  const apiKeys = await Promise.all([
    // Enterprise API Keys
    prisma.apiKey.create({
      data: {
        name: 'Production API Key',
        key: generateApiKey(),
        hashedKey: await hashPassword(generateApiKey()),
        partnerId: 'partner_enterprise_001',
        userId: 'user_enterprise_admin_003',
        scopes: ['read:market-data', 'write:orders', 'read:analytics', 'webhook:all'],
        environment: 'PRODUCTION',
        status: 'ACTIVE',
        requestCount: faker.number.int({ min: 10000, max: 100000 }),
        lastUsedAt: faker.date.recent(),
      },
    }),
    
    prisma.apiKey.create({
      data: {
        name: 'Sandbox Testing',
        key: generateApiKey(),
        hashedKey: await hashPassword(generateApiKey()),
        partnerId: 'partner_enterprise_001',
        userId: 'user_enterprise_dev_004',
        scopes: ['read:market-data', 'read:analytics'],
        environment: 'SANDBOX',
        status: 'ACTIVE',
        requestCount: faker.number.int({ min: 1000, max: 10000 }),
        lastUsedAt: faker.date.recent(),
      },
    }),
    
    // FinTech API Key
    prisma.apiKey.create({
      data: {
        name: 'FinTech Production',
        key: generateApiKey(),
        hashedKey: await hashPassword(generateApiKey()),
        partnerId: 'partner_fintech_002',
        userId: 'user_fintech_admin_005',
        scopes: ['read:market-data', 'write:orders'],
        environment: 'PRODUCTION',
        status: 'ACTIVE',
        requestCount: faker.number.int({ min: 5000, max: 50000 }),
        lastUsedAt: faker.date.recent(),
      },
    }),
    
    // Startup API Key
    prisma.apiKey.create({
      data: {
        name: 'Startup Main Key',
        key: generateApiKey(),
        hashedKey: await hashPassword(generateApiKey()),
        partnerId: 'partner_startup_003',
        userId: 'user_startup_006',
        scopes: ['read:market-data'],
        environment: 'PRODUCTION',
        status: 'ACTIVE',
        requestCount: faker.number.int({ min: 1000, max: 5000 }),
        lastUsedAt: faker.date.recent(),
      },
    }),
    
    // Indie Developer API Key
    prisma.apiKey.create({
      data: {
        name: 'Personal Project',
        key: generateApiKey(),
        hashedKey: await hashPassword(generateApiKey()),
        partnerId: 'partner_developer_004',
        userId: 'user_indie_dev_007',
        scopes: ['read:market-data'],
        environment: 'SANDBOX',
        status: 'ACTIVE',
        requestCount: faker.number.int({ min: 100, max: 1000 }),
        lastUsedAt: faker.date.recent(),
      },
    }),
  ]);

  console.log('✅ Created API keys');

  // Create Subscriptions
  const subscriptions = await Promise.all([
    // Enterprise Subscription
    prisma.subscription.create({
      data: {
        partnerId: 'partner_enterprise_001',
        tier: 'BLACK',
        status: 'ACTIVE',
        monthlyPrice: 5000.00,
        yearlyPrice: 50000.00,
        billingCycle: 'YEARLY',
        apiCallsLimit: 10000000,
        usersLimit: 100,
        storageLimit: 1000000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    }),
    
    // FinTech Subscription
    prisma.subscription.create({
      data: {
        partnerId: 'partner_fintech_002',
        tier: 'ELITE',
        status: 'ACTIVE',
        monthlyPrice: 1500.00,
        yearlyPrice: 15000.00,
        billingCycle: 'MONTHLY',
        apiCallsLimit: 1000000,
        usersLimit: 25,
        storageLimit: 500000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    
    // Startup Subscription
    prisma.subscription.create({
      data: {
        partnerId: 'partner_startup_003',
        tier: 'PRO',
        status: 'ACTIVE',
        monthlyPrice: 500.00,
        yearlyPrice: 5000.00,
        billingCycle: 'MONTHLY',
        apiCallsLimit: 100000,
        usersLimit: 10,
        storageLimit: 100000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        trialStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        trialEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    }),
    
    // Indie Developer Subscription
    prisma.subscription.create({
      data: {
        partnerId: 'partner_developer_004',
        tier: 'LITE',
        status: 'TRIALING',
        monthlyPrice: 0.00,
        billingCycle: 'MONTHLY',
        apiCallsLimit: 10000,
        usersLimit: 1,
        storageLimit: 10000,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        trialStart: new Date(),
        trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('✅ Created subscriptions');

  // Create sample API usage data
  const apiUsagePromises = [];
  
  for (const apiKey of apiKeys) {
    // Generate 50-200 usage records per API key
    const usageCount = faker.number.int({ min: 50, max: 200 });
    
    for (let i = 0; i < usageCount; i++) {
      apiUsagePromises.push(
        prisma.apiUsage.create({
          data: {
            apiKeyId: apiKey.id,
            endpoint: faker.helpers.arrayElement([
              '/api/v1/market-data/stocks',
              '/api/v1/market-data/crypto',
              '/api/v1/orders',
              '/api/v1/analytics/portfolio',
              '/api/v1/user/profile',
            ]),
            method: faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
            statusCode: faker.helpers.weightedArrayElement([
              { weight: 80, value: 200 },
              { weight: 10, value: 400 },
              { weight: 5, value: 401 },
              { weight: 3, value: 429 },
              { weight: 2, value: 500 },
            ]),
            responseTime: faker.number.int({ min: 10, max: 2000 }),
            requestSize: faker.number.int({ min: 100, max: 5000 }),
            responseSize: faker.number.int({ min: 200, max: 10000 }),
            userAgent: 'TradeMate-SDK/1.0',
            ipAddress: faker.internet.ip(),
            timestamp: faker.date.recent({ days: 30 }),
          },
        })
      );
    }
  }
  
  await Promise.all(apiUsagePromises);
  console.log('✅ Created API usage data');

  // Create activity logs
  const activities = [];
  
  // User activities
  for (const user of users.filter(u => u.status === 'ACTIVE')) {
    // Login activities
    activities.push(
      prisma.activity.create({
        data: {
          userId: user.id,
          partnerId: user.partnerId,
          type: 'USER_LOGIN',
          action: 'User logged in',
          description: `${user.name} logged into the portal`,
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          timestamp: faker.date.recent({ days: 7 }),
        },
      })
    );
  }
  
  // API key activities
  for (const apiKey of apiKeys) {
    activities.push(
      prisma.activity.create({
        data: {
          userId: apiKey.userId,
          partnerId: apiKey.partnerId,
          type: 'API_KEY_CREATED',
          action: 'API key created',
          description: `API key "${apiKey.name}" was created`,
          metadata: {
            apiKeyId: apiKey.id,
            environment: apiKey.environment,
            scopes: apiKey.scopes,
          },
          timestamp: faker.date.recent({ days: 30 }),
        },
      })
    );
  }
  
  await Promise.all(activities);
  console.log('✅ Created activity logs');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test User Credentials:');
  console.log('\n🔑 Admin Users:');
  console.log('  Super Admin: superadmin@trademate.com / SuperAdmin123!');
  console.log('  Admin: admin@trademate.com / Admin123!');
  console.log('\n🏢 Partner Users:');
  console.log('  Enterprise Admin: john.admin@techcorp.com / Enterprise123!');
  console.log('  Enterprise Developer: sarah.dev@techcorp.com / Developer123!');
  console.log('  FinTech Admin: mike@fintech-solutions.com / FinTech123!');
  console.log('  Startup Partner: alex@trading-startup.com / Startup123!');
  console.log('  Indie Developer: emma@indie-solutions.com / IndieDev123!');
  console.log('  Viewer: tom.viewer@techcorp.com / Viewer123!');
  console.log('\n⚠️  Test Users:');
  console.log('  Pending: jane@newtrading.com / Pending123!');
  console.log('  Suspended: bob.suspended@example.com / Suspended123!');
}

async function main() {
  try {
    await createSeedData();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export default main;