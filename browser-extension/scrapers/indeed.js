/**
 * Indeed Job Scraper
 * Extracts job information from Indeed job listings
 */

(function() {
    console.log('JobTrack4U: Indeed scraper loaded');

    function scrapeIndeedJob() {
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
                '[data-testid="inlineHeader-companyName"]',
                '.jobsearch-InlineCompanyRating-companyHeader',
                '.jobsearch-CompanyInfoWithoutHeaderImage',
                'div[data-company-name="true"]',
                'span.companyName'
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
                '.jobsearch-JobInfoHeader-title',
                'h1.icl-u-xs-mb--xs',
                '[data-testid="jobsearch-JobInfoHeader-title"]',
                'h1.jobsearch-JobInfoHeader-title'
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
                '[data-testid="inlineHeader-companyLocation"]',
                '.jobsearch-JobInfoHeader-subtitle',
                'div[data-testid="job-location"]',
                '.jobsearch-InlineCompanyRating'
            ];

            for (const selector of locationSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.textContent.trim();
                    // Filter out company name and other non-location text
                    if (text && !text.includes('reviews') && !text.includes('★')) {
                        jobData.jobLocation = text.split('•')[0].trim();
                        break;
                    }
                }
            }

            // Extract salary
            const salarySelectors = [
                '#salaryInfoAndJobType',
                '.jobsearch-JobMetadataHeader-item',
                '[data-testid="jobsearch-JobMetadataHeader-salary"]',
                '.metadata.salary-snippet-container'
            ];

            for (const selector of salarySelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.textContent.trim();
                    if (text.includes('$') || text.includes('year') || text.includes('hour')) {
                        jobData.salary = text;
                        break;
                    }
                }
            }

            // Extract job type
            const metadataElements = document.querySelectorAll('.jobsearch-JobMetadataHeader-item');
            metadataElements.forEach(el => {
                const text = el.textContent.toLowerCase();
                if (text.includes('full-time') || text.includes('full time')) {
                    jobData.jobType = 'full-time';
                } else if (text.includes('part-time') || text.includes('part time')) {
                    jobData.jobType = 'part-time';
                } else if (text.includes('contract')) {
                    jobData.jobType = 'contract';
                } else if (text.includes('temporary')) {
                    jobData.jobType = 'contract';
                } else if (text.includes('internship')) {
                    jobData.jobType = 'internship';
                }
            });

            // Extract job description
            const descriptionSelectors = [
                '#jobDescriptionText',
                '.jobsearch-jobDescriptionText',
                '.jobsearch-JobComponent-description'
            ];

            for (const selector of descriptionSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.description = element.textContent.trim().substring(0, 500);
                    break;
                }
            }

            console.log('Scraped Indeed job data:', jobData);

            // Store data in chrome storage
            if (jobData.company && jobData.position) {
                chrome.storage.local.set({
                    jobData: jobData,
                    source: 'Indeed'
                });
                console.log('Job data saved to storage');
            } else {
                console.log('Could not find required job fields (company/position)');
            }

        } catch (error) {
            console.error('Error scraping Indeed job:', error);
        }
    }

    // Wait for page to load, then scrape
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(scrapeIndeedJob, 2000);
        });
    } else {
        setTimeout(scrapeIndeedJob, 2000);
    }

})();
