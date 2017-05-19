import { clean, buildHTML, buildCSS, buildImages, buildJS } from "./build-utils";

clean();
buildHTML();
buildCSS();
buildImages();
buildJS(true);