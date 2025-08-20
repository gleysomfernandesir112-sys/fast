// .github/workflows/scrape.js
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const BEHANCE_URL = 'https://www.behance.net/andrelr';
const OUTPUT_FILE = path.join(__dirname, '..', '..', 'portfolio', 'projects.json');

async function scrapeBehance() {
    try {
        console.log(`Fetching data from ${BEHANCE_URL}...`);
        const { data } = await axios.get(BEHANCE_URL);
        const $ = cheerio.load(data);

        const projects = [];
        $('.ProjectCover-root-1-d').each((index, element) => {
            const coverElement = $(element).find('.Cover-content-2-3 a');
            const title = coverElement.attr('title');
            const url = coverElement.attr('href');
            
            const imageElement = $(element).find('.Cover-image-3-4');
            // Behance loads images via srcset, so we grab the first one in the list.
            const coverSrcSet = imageElement.attr('srcset');
            const cover = coverSrcSet ? coverSrcSet.split(' ')[0] : '';

            if (title && url && cover) {
                projects.push({
                    title,
                    url,
                    cover
                });
            }
        });

        if (projects.length === 0) {
            console.warn('Warning: No projects found. The page structure might have changed.');
        } else {
            console.log(`Found ${projects.length} projects.`);
        }

        await fs.writeFile(OUTPUT_FILE, JSON.stringify(projects, null, 2));
        console.log(`Successfully wrote projects to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('An error occurred during scraping:', error);
        process.exit(1);
    }
}

scrapeBehance();
