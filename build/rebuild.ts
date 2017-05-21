declare let process: any;
import { clean, buildHTML, buildCSS, buildImages, buildJS } from "./build-utils";

const isDevBuild = process.argv.indexOf("--target=prod") < 0;
const outputDir = 'dist';

clean(outputDir);
buildHTML(outputDir);
buildCSS(outputDir);
buildImages(outputDir);

buildJS(outputDir, !isDevBuild);