import dotenv from 'dotenv';
import { connect } from 'mongoose';
import Job from '../models/Job.js';
import User from '../models/User.js';

dotenv.config();

const deleteAllJobs = async (email) => {
    try {
        await connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        console.log(`✅ Found user: ${user.name} (${user.email})`);

        const result = await Job.deleteMany({ createdBy: user._id });
        console.log(`✅ Deleted ${result.deletedCount} jobs for user ${user.email}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error deleting jobs:', error);
        process.exit(1);
    }
};

const args = process.argv.slice(2);
const email = args[0];

if (!email) {
    console.error('❌ Please provide a user email address');
    console.log('\nUsage: node utils/deleteAllJobs.js <email>');
    console.log('Example: node utils/deleteAllJobs.js user@example.com');
    process.exit(1);
}

deleteAllJobs(email);
