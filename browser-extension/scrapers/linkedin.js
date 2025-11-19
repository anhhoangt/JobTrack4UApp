/**
 * LinkedIn Job Scraper
 * Extracts job information from LinkedIn job listings
 */

(function () {
    console.log('JobTrack4U: LinkedIn scraper loaded');

    function scrapeLinkedInJob() {
        try {
            // LinkedIn job listing selectors (these may change as LinkedIn updates their site)
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
                '.job-details-jobs-unified-top-card__company-name',
                '.topcard__org-name-link',
                '.jobs-unified-top-card__company-name',
                'a.topcard__org-name-link',
                '.job-details-jobs-unified-top-card__primary-description-container a'
            ];

            for (const selector of companySelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.company = element.textContent.trim();
                    break;
                }
            }

            // Extract position/job title
            const positionSelectors = [
                '.job-details-jobs-unified-top-card__job-title',
                '.topcard__title',
                '.jobs-unified-top-card__job-title',
                'h1.topcard__title',
                'h2.t-24'
            ];

            for (const selector of positionSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.position = element.textContent.trim();
                    break;
                }
            }

            // Extract location
            const locationSelectors = [
                '.job-details-jobs-unified-top-card__bullet',
                '.topcard__flavor--bullet',
                '.jobs-unified-top-card__bullet',
                'span.topcard__flavor--bullet'
            ];

            for (const selector of locationSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent) {
                    const text = element.textContent.trim();
                    // LinkedIn location is usually the first bullet point
                    if (text && !text.includes('applicants') && !text.includes('ago')) {
                        jobData.jobLocation = text;
                        break;
                    }
                }
            }

            // Extract salary (if available)
            const salarySelectors = [
                '.job-details-jobs-unified-top-card__job-insight',
                '.salary',
                'span[class*="salary"]'
            ];

            for (const selector of salarySelectors) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent.trim();
                    if (text.includes('$') || text.includes('USD') || text.includes('year')) {
                        jobData.salary = text;
                    }
                });
            }

            // Extract job type from job insights
            const insightElements = document.querySelectorAll('.job-details-jobs-unified-top-card__job-insight-view-model-secondary');
            insightElements.forEach(el => {
                const text = el.textContent.toLowerCase();
                if (text.includes('full-time') || text.includes('full time')) {
                    jobData.jobType = 'full-time';
                } else if (text.includes('part-time') || text.includes('part time')) {
                    jobData.jobType = 'part-time';
                } else if (text.includes('contract')) {
                    jobData.jobType = 'contract';
                } else if (text.includes('internship')) {
                    jobData.jobType = 'internship';
                } else if (text.includes('remote')) {
                    jobData.jobType = 'remote';
                }
            });

            // Extract job description (first 500 characters)
            const descriptionSelectors = [
                '.jobs-description__content',
                '.jobs-description-content__text',
                'div[class*="job-description"]',
                '.jobs-box__html-content'
            ];

            for (const selector of descriptionSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    jobData.description = element.textContent.trim().substring(0, 500);
                    break;
                }
            }

            console.log('Scraped LinkedIn job data:', jobData);

            // Store data in chrome storage
            if (jobData.company && jobData.position) {
                chrome.storage.local.set({
                    jobData: jobData,
                    source: 'LinkedIn'
                });
                console.log('Job data saved to storage');
            } else {
                console.log('Could not find required job fields (company/position)');
            }

        } catch (error) {
            console.error('Error scraping LinkedIn job:', error);
        }
    }

    // Wait for page to load, then scrape
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(scrapeLinkedInJob, 2000);
        });
    } else {
        setTimeout(scrapeLinkedInJob, 2000);
    }

    // Re-scrape if user navigates to a new job (LinkedIn uses client-side routing)
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(scrapeLinkedInJob, 2000);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
