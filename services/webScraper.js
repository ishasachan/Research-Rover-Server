const axios = require('axios');
const mongoose = require('mongoose');

const ResearchPaper = require('../models/researchPaper');

// Function to scrape the Springer API and save the extracted details
async function scrapeResearchPapers(searchQuery) {
  try {
    const encodedQuery = encodeURIComponent(searchQuery);
    const apiKey = '0e24da79400db9440672437232a4be88';
    const url = `https://api.springernature.com/meta/v2/json?api_key=${apiKey}&q=${encodedQuery}&s=1&p=3`;
    const response = await axios.get(url);
    const { records } = response.data;

    const journals = records.map(record => {
      const htmlUrl = record.url.find(url => url.format === 'html' && url.platform === 'web')?.value;
      const pdfUrl = record.url.find(url => url.format === 'pdf' && url.platform === 'web')?.value;
      const creators = record.creators.map(creator => creator.creator);
      
      return {
        title: record.title,
        htmlUrl,
        pdfUrl,
        creators,
        contentType: record.contentType
      };
    });

    console.log(journals);

    // Save journals to the database
    await ResearchPaper.insertMany(journals);

    return journals;
  } catch (error) {
    console.error('Error scraping journals:', error);
    throw new Error('Failed to scrape journals.');
  }
}

module.exports = {
  scrapeResearchPapers,
};
