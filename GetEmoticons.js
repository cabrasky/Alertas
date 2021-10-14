const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');


function savePhoto(name, url){
  https.get(url, (response) => {
    response.pipe(fs.createWriteStream(`./emoticons/${name}.png`));
  });
}

async function main() {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();

  await page.goto('https://twitchemotes.com/');
  const imgURLs = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('div.col-md-2 > center > a.emote-name  > img'),
      ({ src }) => src,
    )
  )
  const imgNames = await page.evaluate(() =>
      Array.from(
          document.querySelectorAll('div.col-md-2 > center > a.emote-name  > img'),
          (element) => element.parentElement.parentElement.textContent
      )
  )
  for(var i = 0; i < imgURLs.length; i++){
    savePhoto(i, imgURLs[i])
  }
  console.log(imgNames.length)
  console.log(imgURLs.length)
  return imgNames;
}

module.exports = {
  main
}
