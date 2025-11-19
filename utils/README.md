# Job Data Seeding & Management Scripts

This directory contains utility scripts for generating and managing job data in your JobTrack4U application.

## 📁 Available Scripts

### 1. `seedJobs.js` - Generate Mock Job Data

Generates realistic mock job data for testing and development purposes.

#### Features:
- Creates jobs with realistic company names (Google, Microsoft, Amazon, etc.)
- Generates appropriate positions based on job categories
- Includes salary ranges, locations, and application details
- Adds tags, priorities, and notes
- Distributes jobs across different statuses (pending, interview, declined)
- Randomizes application dates over the past 90 days

#### Usage:

```bash
# Generate 50 jobs (default)
node utils/seedJobs.js your-email@example.com

# Generate specific number of jobs
node utils/seedJobs.js your-email@example.com 100

# Generate 200 jobs
node utils/seedJobs.js your-email@example.com 200
```

#### Output:
```
✅ Connected to MongoDB
✅ Found user: John Doe (john@example.com)
✅ Successfully created 50 job entries

📊 Job Status Breakdown:
   pending: 18
   interview: 15
   declined: 17

📊 Job Category Breakdown:
   software-engineering: 12
   data-science: 8
   product-management: 7
   design: 9
   marketing: 8
   sales: 6
```

### 2. `deleteAllJobs.js` - Delete All Jobs for a User

Removes all job entries for a specific user. Useful for cleanup before reseeding.

#### Usage:

```bash
node utils/deleteAllJobs.js your-email@example.com
```

#### Output:
```
✅ Connected to MongoDB
✅ Found user: John Doe (john@example.com)
✅ Deleted 50 jobs for user john@example.com
```

## 🚀 Quick Start Guide

### Step 1: Ensure your app is configured
Make sure your `.env` file has the correct MongoDB connection string:
```
MONGO_URL=mongodb://localhost:27017/yourdb
# or
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/yourdb
```

### Step 2: Create a user account
First, register a user account through your app's UI or use an existing account.

### Step 3: Run the seed script
```bash
# From the root directory of your project
node utils/seedJobs.js your-email@example.com 100
```

### Step 4: Verify in your app
Open your app and navigate to the "All Jobs" page to see your generated jobs.

## 📊 Generated Job Data Structure

Each generated job includes:

- **Basic Info**: Company name, position title, job type, location
- **Status**: Randomly assigned (pending, interview, declined)
- **Salary**: Realistic ranges based on position level ($70k-$200k+)
- **Dates**: Application date (past 90 days) and optional deadline (next 30 days)
- **Details**: Job description, company website, job posting URL
- **Application**: Method (email, website, LinkedIn, recruiter)
- **Organization**: Category, tags, priority level
- **Notes**: Optional notes about the application

## 🎯 Use Cases

### Development & Testing
```bash
# Generate a small set for development
node utils/seedJobs.js dev@example.com 20
```

### Demo & Presentations
```bash
# Generate a large dataset for impressive demos
node utils/seedJobs.js demo@example.com 200
```

### Performance Testing
```bash
# Test app performance with lots of data
node utils/seedJobs.js perf-test@example.com 1000
```

### Resetting Data
```bash
# Delete all jobs
node utils/deleteAllJobs.js your-email@example.com

# Then generate fresh data
node utils/seedJobs.js your-email@example.com 50
```

## 🔧 Customization

You can customize the generated data by editing `/Users/anhthehoang/Desktop/learning-code/jobtrack/JobTrack4UApp/utils/seedJobs.js`:

### Add More Companies
```javascript
const companies = [
  'Google', 'Microsoft', 'Amazon',
  'YourCompany', 'AnotherCompany',  // Add here
  // ...
];
```

### Add More Positions
```javascript
const positions = {
  'software-engineering': [
    'Software Engineer',
    'Your Custom Position',  // Add here
    // ...
  ],
};
```

### Add More Locations
```javascript
const locations = [
  'San Francisco, CA',
  'Your City, State',  // Add here
  // ...
];
```

### Customize Date Ranges
```javascript
// Change from 90 days to 180 days in the past
const getRandomPastDate = (daysAgo = 180) => {
  // ...
};
```

## ⚠️ Important Notes

1. **User Must Exist**: The email address must match an existing user in your database
2. **MongoDB Connection**: Ensure your MongoDB is running and accessible
3. **Duplicate Data**: Running the script multiple times will create additional jobs (not replace existing ones)
4. **Production Warning**: Be careful when running these scripts in production environments

## 🐛 Troubleshooting

### "User with email X not found"
- Make sure you've registered the user account first
- Check that the email is spelled correctly
- Verify the user exists in your MongoDB database

### "Cannot connect to MongoDB"
- Check your MongoDB server is running
- Verify `MONGO_URL` in your `.env` file is correct
- Check network connectivity

### Script hangs without output
- Check MongoDB connection
- Ensure no other scripts are holding database locks
- Try reducing the number of jobs to generate

## 📈 Best Practices

1. **Start Small**: Begin with 20-50 jobs to test the script
2. **Clean Before Seeding**: Use `deleteAllJobs.js` before generating new data
3. **Use Different Users**: Create separate test users for different scenarios
4. **Monitor Performance**: Large datasets (1000+) may take a moment to generate
5. **Backup Data**: Always backup your database before running cleanup scripts

## 🔄 Workflow Example

```bash
# Clean slate
node utils/deleteAllJobs.js test@example.com

# Generate new test data
node utils/seedJobs.js test@example.com 75

# Verify in app, then generate more if needed
node utils/seedJobs.js test@example.com 25
```
