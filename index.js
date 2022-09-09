// import packages
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import fetch from 'node-fetch';
import pretty from 'pretty';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
const urlImg = [];

// scrap data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // console.log(data);

    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // console.log($);

    // extract all img-links with an attribute src
    $('img', data).each(function () {
      const img = $(this).attr('src');

      // add all links to an array
      urlImg.push(img);
    });
    // console.log(urlImg);

    // new array with 10 img
    const firstTenImg = urlImg.slice(0, 10);
    // console.log(firstTenImg);

    // const tempurl = firstTenImg[0];

    // download img from strings
    async function download() {
      // loop for downloading 10 img and rename everyone
      for (let i = 0; i < 10; i++) {
        const tempurl = firstTenImg[i];

        const response = await fetch(tempurl);
        // console.log(response);

        const buffer = await response.buffer();

        fs.writeFile(`./memes/0${i + 1}.jpg`, buffer, () =>
          console.log('sucssesfull downloading!'),
        );
      }
    }

    download();
  } catch (err) {
    console.error(err);
  }
}

scrapeData();

// just example

/* async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".plainlist ul li");
    // Stores data for all countries
    const countries = [];
    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const country = { name: "", iso3: "" };
      // Select the text content of a and span elements
      // Store the textcontent in the above object
      country.name = $(el).children("a").text();
      country.iso3 = $(el).children("span").text();
      // Populate countries array with country data
      countries.push(country);
    });
    // Logs countries array to the console
    console.dir(countries);
    // Write countries array in countries.json file
    fs.writeFile("coutries.json", JSON.stringify(countries, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file");
    });
  } catch (err) {
    console.error(err);
  }
} */
