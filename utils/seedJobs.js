import dotenv from 'dotenv';
import { connect } from 'mongoose';
import Job from '../models/Job.js';
import User from '../models/User.js';

dotenv.config();

// Mock data arrays for generating realistic jobs
const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla',
    'Spotify', 'Airbnb', 'Uber', 'Twitter', 'LinkedIn', 'Adobe', 'Salesforce',
    'Oracle', 'IBM', 'Intel', 'Cisco', 'Nvidia', 'PayPal', 'Square', 'Stripe',
    'Shopify', 'Zoom', 'Slack', 'Dropbox', 'GitHub', 'Atlassian', 'Twilio',
    'ServiceNow', 'Workday', 'Datadog', 'Snowflake', 'Cloudflare', 'MongoDB'
];

const positions = {
    'software-engineering': [
        'Software Engineer', 'Senior Software Engineer', 'Frontend Developer',
        'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
        'Site Reliability Engineer', 'Mobile Developer', 'iOS Developer',
        'Android Developer', 'Cloud Engineer', 'Software Architect'
    ],
    'data-science': [
        'Data Scientist', 'Senior Data Scientist', 'Machine Learning Engineer',
        'Data Engineer', 'ML Engineer', 'AI Researcher', 'Data Analyst',
        'Business Intelligence Analyst', 'Research Scientist'
    ],
    'product-management': [
        'Product Manager', 'Senior Product Manager', 'Technical Product Manager',
        'Product Owner', 'Group Product Manager', 'VP of Product'
    ],
    'design': [
        'UX Designer', 'UI Designer', 'Product Designer', 'UX Researcher',
        'Visual Designer', 'Interaction Designer', 'Design Lead'
    ],
    'marketing': [
        'Marketing Manager', 'Digital Marketing Specialist', 'Content Marketing Manager',
        'Growth Marketing Manager', 'Product Marketing Manager', 'SEO Specialist'
    ],
    'sales': [
        'Account Executive', 'Sales Manager', 'Business Development Manager',
        'Sales Engineer', 'Enterprise Sales Representative'
    ]
};

const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX',
    'Boston, MA', 'Los Angeles, CA', 'Chicago, IL', 'Denver, CO',
    'Portland, OR', 'Atlanta, GA', 'Remote', 'Hybrid - San Francisco',
    'Hybrid - New York', 'Remote (US)', 'Remote (Global)'
];

const jobTypes = ['full-time', 'part-time', 'remote', 'internship'];
const statuses = ['pending', 'interview', 'declined'];
const applicationMethods = ['email', 'website', 'linkedin', 'recruiter', 'other'];
const priorities = ['low', 'medium', 'high'];

const tags = [
    ['startup', 'fast-paced'],
    ['enterprise', 'stable'],
    ['remote-first', 'flexible'],
    ['equity', 'stock-options'],
    ['healthcare', 'benefits'],
    ['mentorship', 'growth'],
    ['diverse', 'inclusive'],
    ['innovation', 'cutting-edge'],
    ['work-life-balance'],
    ['competitive-salary']
];

// Helper function to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random date in the past 90 days
const getRandomPastDate = (daysAgo = 90) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date;
};

// Helper function to get random future date within 30 days
const getRandomFutureDate = (daysAhead = 30) => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
    return date;
};

// Generate a single job entry
const generateJob = (userId, category) => {
    const company = getRandom(companies);
    const position = getRandom(positions[category]);
    const location = getRandom(locations);
    const jobType = getRandom(jobTypes);
    const status = getRandom(statuses);
    const applicationMethod = getRandom(applicationMethods);
    const priority = getRandom(priorities);

    // Generate salary range based on position level
    const isSenior = position.includes('Senior') || position.includes('Lead') || position.includes('VP');
    const minSalary = isSenior ?
        Math.floor(Math.random() * 50000) + 120000 :
        Math.floor(Math.random() * 40000) + 70000;
    const maxSalary = minSalary + Math.floor(Math.random() * 40000) + 20000;

    // Generate realistic job descriptions
    const descriptions = [
        `Join ${company} as a ${position}. Work on cutting-edge technology and solve challenging problems at scale.`,
        `We're looking for a talented ${position} to help build the future of our products. Great benefits and team culture.`,
        `${company} is hiring! Be part of an innovative team working on projects that impact millions of users.`,
        `Exciting opportunity to join ${company}'s engineering team. Competitive compensation and growth opportunities.`
    ];

    return {
        company,
        position,
        status,
        jobType,
        jobLocation: location,
        applicationDate: getRandomPastDate(),
        applicationDeadline: Math.random() > 0.5 ? getRandomFutureDate() : undefined,
        salary: {
            min: minSalary,
            max: maxSalary,
            currency: 'USD'
        },
        jobDescription: getRandom(descriptions),
        companyWebsite: `https://www.${company.toLowerCase().replace(/\s+/g, '')}.com`,
        jobPostingUrl: `https://careers.${company.toLowerCase().replace(/\s+/g, '')}.com/jobs/${Math.floor(Math.random() * 10000)}`,
        applicationMethod,
        notes: Math.random() > 0.5 ?
            `Applied through ${applicationMethod}. ${status === 'interview' ? 'Interview scheduled!' : status === 'pending' ? 'Waiting for response.' : 'Did not move forward.'}` :
            undefined,
        category,
        tags: Math.random() > 0.3 ? getRandom(tags) : [],
        priority,
        createdBy: userId
    };
};

// Main seed function
const seedJobs = async (email, numberOfJobs = 50) => {
    try {
        // Connect to MongoDB
        await connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        console.log(`✅ Found user: ${user.name} (${user.email})`);

        // Generate jobs
        const jobs = [];
        const categories = Object.keys(positions);

        for (let i = 0; i < numberOfJobs; i++) {
            const category = getRandom(categories);
            jobs.push(generateJob(user._id, category));
        }

        // Insert jobs into database
        const result = await Job.insertMany(jobs);
        console.log(`✅ Successfully created ${result.length} job entries`);

        // Show breakdown by status
        const statusCounts = await Job.aggregate([
            { $match: { createdBy: user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        console.log('\n📊 Job Status Breakdown:');
        statusCounts.forEach(item => {
            console.log(`   ${item._id}: ${item.count}`);
        });

        // Show breakdown by category
        const categoryCounts = await Job.aggregate([
            { $match: { createdBy: user._id } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        console.log('\n📊 Job Category Breakdown:');
        categoryCounts.forEach(item => {
            console.log(`   ${item._id}: ${item.count}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding jobs:', error);
        process.exit(1);
    }
};

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const numberOfJobs = parseInt(args[1]) || 50;

if (!email) {
    console.error('❌ Please provide a user email address');
    console.log('\nUsage: node utils/seedJobs.js <email> [numberOfJobs]');
    console.log('Example: node utils/seedJobs.js user@example.com 100');
    process.exit(1);
}

// Run the seed function
seedJobs(email, numberOfJobs);
