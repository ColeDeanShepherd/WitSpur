declare function require(name: string): any;
const fs = require("fs-extra");
const execSync = require("child_process").execSync;

function generateHtmlDocument(page: any, contents: string): string {
  const metaTags = `<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1">`;
  const titleTag = `<title>${page.name} - WitSpur</title>`;
  const faviconTags = `<link rel="shortcut icon" href="/favicon.ico"> <link rel="icon" sizes="16x16 32x32 64x64" href="/favicon.ico"> <link rel="icon" type="image/png" sizes="196x196" href="/favicon-192.png"> <link rel="icon" type="image/png" sizes="160x160" href="/favicon-160.png"> <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png"> <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png"> <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"> <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png"> <link rel="apple-touch-icon" href="/favicon-57.png"> <link rel="apple-touch-icon" sizes="114x114" href="/favicon-114.png"> <link rel="apple-touch-icon" sizes="72x72" href="/favicon-72.png"> <link rel="apple-touch-icon" sizes="144x144" href="/favicon-144.png"> <link rel="apple-touch-icon" sizes="60x60" href="/favicon-60.png"> <link rel="apple-touch-icon" sizes="120x120" href="/favicon-120.png"> <link rel="apple-touch-icon" sizes="76x76" href="/favicon-76.png"> <link rel="apple-touch-icon" sizes="152x152" href="/favicon-152.png"> <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png"> <meta name="msapplication-TileColor" content="#FFFFFF"> <meta name="msapplication-TileImage" content="/favicon-144.png"> <meta name="msapplication-config" content="/browserconfig.xml">`;
  const stylesheetLinks = `<link rel="stylesheet" href="./normalize.css"><link rel="stylesheet" href="./global.css">`;
  const googleAnalyticsTag = `<script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-72494315-4', 'auto'); ga('send', 'pageview'); </script>`;
  const headTag = `<head>${metaTags}${titleTag}${faviconTags}${stylesheetLinks}${googleAnalyticsTag}</head>`;

  const logoTag = `<div class="logo"><a href="/">WitSpur</a></div>`;

  const absolutePageUrl = `http://witspur.com${(page.outputFileName !== "index") ? `/${page.outputFileName}.html` : ""}`;
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(absolutePageUrl)}`;
  const facebookShareLi = `<li><a href="${facebookShareUrl}" target="_blank"><img src="img/facebook.svg" alt="Share on Facebook" /></a></li>`;
  
  const twitterShareUrl = `https://twitter.com/intent/tweet?source=${encodeURI(absolutePageUrl)}&text=${encodeURI(absolutePageUrl)}&via=WitSpur`;
  const twitterShareLi = `<li><a href="${twitterShareUrl}" target="_blank"><img src="img/twitter.svg" alt="Tweet" /></a></li>`;
  
  const socialSharingLinks = `<ul class="social-sharing-icons">${facebookShareLi}${twitterShareLi}</ul>`;

  const subHeaderTag = `<div class="sub-header${(page.name === "Home") ? " front-page" : ""}">Interactive tools and media to inspire your mind.</div>`;
  const headerTag = `<div class="header${(page.name === "Home") ? " front-page" : ""}">${logoTag}${subHeaderTag}${socialSharingLinks}</div>`;
  const footerTag = `<div class="footer"></div>`;

  const scriptTags = `<script src="./bundle.js"></script>`;
  const bodyTag = `<body>${headerTag}${contents}${footerTag}${scriptTags}</body>`;

  const htmlTag = `<html>${headTag}${bodyTag}</html>`;

  return `<!DOCTYPE html>${htmlTag}`;
}

export function clean(outputDir: string) {
  fs.emptyDirSync(outputDir);
}

export function buildHTML(outputDir: string) {
  const pages: any[] = fs.readJsonSync("src/pages.json");

  pages.forEach(page => {
    const contents = fs.readFileSync(`src/${page.contentsFilePath}`);
    const pageHtml = generateHtmlDocument(page, contents);
    fs.writeFileSync(`${outputDir}/${page.outputFileName}.html`, pageHtml);
  });
}

export function buildCSS(outputDir: string) {
  fs.copySync("vendor/normalize.css", `${outputDir}/normalize.css`);
  fs.copySync("src/global.css", `${outputDir}/global.css`);
}

export function buildImages(outputDir: string) {
  fs.copySync("img", `${outputDir}/img`);
  fs.copySync("favicon", outputDir);
}

export function buildJS(outputDir: string, uglify: boolean) {
  execSync("webpack");

  if(uglify) {
    fs.removeSync(`${outputDir}/bundle.js.map`);
    execSync(`uglifyjs ${outputDir}/bundle.js --output ${outputDir}/bundle.js`);
  }
}