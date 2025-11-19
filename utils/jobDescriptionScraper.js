/**
 * =====================================================
 * JOB DESCRIPTION URL SCRAPER
 * =====================================================
 *
 * Utilities to fetch and extract job descriptions from URLs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Fetch and extract job description from URL
 */
export const fetchJobDescriptionFromURL = async (url) => {
    try {
        // Fetch the webpage
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Remove scripts, styles, and other non-content elements
        $('script, style, nav, header, footer').remove();

        // Try different selectors based on common job board structures
        let jobDescription = '';

        // LinkedIn selectors
        if (url.includes('linkedin.com')) {
            jobDescription = $('.jobs-description__content').text().trim() ||
                           $('.jobs-description-content__text').text().trim() ||
                           $('.description__text').text().trim();
        }
        // Indeed selectors
        else if (url.includes('indeed.com')) {
            jobDescription = $('#jobDescriptionText').text().trim() ||
                           $('.jobsearch-jobDescriptionText').text().trim();
        }
        // Glassdoor selectors
        else if (url.includes('glassdoor.com')) {
            jobDescription = $('.desc').text().trim() ||
                           $('[data-test="description"]').text().trim();
        }
        // Generic fallback - look for largest text block
        else {
            const textBlocks = [];
            $('div, section, article').each((i, elem) => {
                const text = $(elem).text().trim();
                if (text.length > 200 && text.length < 10000) {
                    textBlocks.push(text);
                }
            });
            // Get the longest text block
            jobDescription = textBlocks.sort((a, b) => b.length - a.length)[0] || '';
        }

        if (!jobDescription) {
            // Last resort: get all visible text
            jobDescription = $('body').text().trim();
        }

        // Clean up the text
        jobDescription = jobDescription
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
            .trim();

        if (jobDescription.length < 100) {
            throw new Error('Could not extract meaningful job description from URL');
        }

        return jobDescription;

    } catch (error) {
        console.error('Error fetching job description:', error.message);
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - the website took too long to respond');
        } else if (error.response) {
            throw new Error(`Failed to fetch URL (Status: ${error.response.status})`);
        } else {
            throw new Error('Failed to fetch job description from URL. Please paste the description instead.');
        }
    }
};

export default {
    fetchJobDescriptionFromURL,
};
