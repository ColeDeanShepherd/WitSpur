declare let process: any;
import { clean, buildHTML, buildCSS, buildImages, buildSounds, buildJS } from "./build-utils";

const isDevBuild = process.argv.indexOf("--target=prod") < 0;
const outputDir = 'dist';

clean(outputDir);
buildHTML(outputDir);
buildCSS(outputDir);
buildImages(outputDir);
buildSounds(outputDir);

buildJS(outputDir, !isDevBuild);