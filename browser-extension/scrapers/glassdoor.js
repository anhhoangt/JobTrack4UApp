/**
 * Glassdoor Job Scraper
 * Extracts job information from Glassdoor job listings
 */

(function() {
    console.log('JobTrack4U: Glassdoor scraper loaded');

    function scrapeGlassdoorJob() {
        try {
            const jobData = {
                company: null,
                position: null,
                jobLocation: null,
                salary: null,
                jobType: null,
                jobUrl: window.location.href,
                description: null
            };

            // Extract company name
            const companySelectors = [
                '[data-test="employerName"]',
                '.e1tk4kwz4',
                '.employerName',
                'div[data-test="employerName"]'
            ];

            for (const selector of companySelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.company = element.textContent.trim();
                    break;
                }
            }

            // Extract job title
            const titleSelectors = [
                '[data-test="jobTitle"]',
                '.e1tk4kwz5',
                'h1.jobTitle',
                '.jobTitle'
            ];

            for (const selector of titleSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.position = element.textContent.trim();
                    break;
                }
            }

            // Extract location
            const locationSelectors = [
                '[data-test="location"]',
                '.location',
                '.e1tk4kwz1'
            ];

            for (const selector of locationSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.jobLocation = element.textContent.trim();
                    break;
                }
            }

            // Extract salary
            const salarySelectors = [
                '[data-test="detailSalary"]',
                '.salary',
                'span[data-test="detailSalary"]'
            ];

            for (const selector of salarySelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.textContent.trim();
                    if (text.includes('$') || text.includes('K')) {
                        jobData.salary = text;
                        break;
                    }
                }
            }

            // Extract job type
            const jobDetailsElements = document.querySelectorAll('[data-test="job-detail"]');
            jobDetailsElements.forEach(el => {
                const text = el.textContent.toLowerCase();
                if (text.includes('full-time') || text.includes('full time')) {
                    jobData.jobType = 'full-time';
                } else if (text.includes('part-time') || text.includes('part time')) {
                    jobData.jobType = 'part-time';
                } else if (text.includes('contract')) {
                    jobData.jobType = 'contract';
                } else if (text.includes('internship')) {
                    jobData.jobType = 'internship';
                }
            });

            // Extract job description
            const descriptionSelectors = [
                '[data-test="description"]',
                '.jobDescriptionContent',
                '.desc'
            ];

            for (const selector of descriptionSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.description = element.textContent.trim().substring(0, 500);
                    break;
                }
            }

            console.log('Scraped Glassdoor job data:', jobData);

            // Store data in chrome storage
            if (jobData.company && jobData.position) {
                chrome.storage.local.set({
                    jobData: jobData,
                    source: 'Glassdoor'
                });
                console.log('Job data saved to storage');
            } else {
                console.log('Could not find required job fields (company/position)');
            }

        } catch (error) {
            console.error('Error scraping Glassdoor job:', error);
        }
    }

    // Wait for page to load, then scrape
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(scrapeGlassdoorJob, 2000);
        });
    } else {
        setTimeout(scrapeGlassdoorJob, 2000);
    }

})();
