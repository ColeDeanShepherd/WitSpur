declare function require(name: string): any;
const fs = require('fs-extra');

function generateHtmlDocument(title: string, contents: string): string {
  const metaTags = `<meta charset="UTF-8" />`;
  const titleTag = `<title>${title} - WitSpur</title>`;
  const stylesheetLinks = `<link rel="stylesheet" href="./normalize.css"><link rel="stylesheet" href="./global.css">`;
  const googleAnalyticsTag = `<script> (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-72494315-4', 'auto'); ga('send', 'pageview'); </script>`;
  const headTag = `<head>${metaTags}${titleTag}${stylesheetLinks}${googleAnalyticsTag}</head>`;

  const logoTag = `<div class="logo"><a href="/">WitSpur</a></div>`;
  const headerTag = `<div class="header${(title === "Home") ? " front-page" : ""}">${logoTag}</div>`;
  const subHeaderTag = `<div class="sub-header${(title === "Home") ? " front-page" : ""}">Interactive tools and media to inspire your mind.</div>`;
  const footerTag = `<div class="footer"></div>`;

  const scriptTags = `<script src="./bundle.js"></script>`;
  const bodyTag = `<body>${headerTag}${subHeaderTag}${contents}${footerTag}${scriptTags}</body>`;

  const htmlTag = `<html>${headTag}${bodyTag}</html>`;

  return `<!DOCTYPE html>${htmlTag}`;
}

export function clean() {
  fs.emptyDirSync('dist');
}

export function buildCSS() {
  fs.copySync('vendor/normalize.css', 'dist/normalize.css');
  fs.copySync('src/global.css', 'dist/global.css');
}

export function buildHTML() {
  const pages: any[] = fs.readJsonSync("src/pages.json");

  pages.forEach(page => {
    const contents = fs.readFileSync(`src/${page.contentsFileName}.html`);
    const pageHtml = generateHtmlDocument(page.name, contents);
    fs.writeFileSync(`dist/${page.outputFileName}.html`, pageHtml);
  });
}

export function buildImages() {
  fs.copySync('img', 'dist/img');
}