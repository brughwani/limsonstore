import scrape from 'website-scraper';
const options = {
  urls: ['https://www.theindusvalley.in/'],
  directory: './public',
  request: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  }
};

scrape(options).then((result) => {
    console.log("Website successfully downloaded");
}).catch((err) => {
    console.error("Error occurred during scraping:", err);
});
