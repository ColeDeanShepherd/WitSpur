import { clean, buildHTML, buildCSS, buildImages, buildJS } from "./build-utils";

clean();
buildHTML();
buildCSS();
buildImages();

const uglify = false;
buildJS(uglify);