const ResearchPaper = require('../models/researchPaper');
const {scrapeResearchPapers} = require('../services/webScraper');

// Controller for fetching research papers based on user interests
exports.getResearchPapers = async (req, res) => {
  try {
    const { interests } = req.query;
    // Query research papers with matching interests
    const researchPapers = await ResearchPaper.find({
      interests: { $in: interests },
    });
    res.json(researchPapers);
  } catch (error) {
    console.error('Error fetching research papers:', error);
    res.status(500).json({ error: 'Failed to fetch research papers.' });
  }
};

// Controller for scraping and saving research papers
exports.postResearchPapers = async (req, res) => {
  const { searchQuery } = req.body;
  try {
    const journals = await scrapeResearchPapers(searchQuery);

    // Save each journal to the database
    for (const journal of journals) {
      const researchPaper = new ResearchPaper(journal);
      await researchPaper.save();
    }

    res.json({ message: 'Journals saved successfully.', journals });
  } catch (error) {
    console.error('Error scraping journals:', error);
    res.status(500).json({ error: 'Failed to scrape journals.' });
  }
};
