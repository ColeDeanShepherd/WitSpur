declare function require(name: string): any;
const fs = require('fs-extra');

function generateHtmlDocument(title: string, contents: string): string {
  const metaTags = `<meta charset="UTF-8" />`;
  const titleTag = `<title>${title} - WitSpur</title>`;
  const stylesheetLinks = `<link rel="stylesheet" href="./normalize.css"><link rel="stylesheet" href="./global.css">`;
  const headTag = `<head>${metaTags}${titleTag}${stylesheetLinks}</head>`;

  const logoTag = `<div class="logo"><a href="/">WitSpur</a></div>`;
  const headerTag = `<div class="header${(title === "Home") ? " front-page" : ""}">${logoTag}</div>`;
  
  const scriptTags = `<script src="./bundle.js"></script>`;
  const bodyTag = `<body>${headerTag}${contents}${scriptTags}</body>`;

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