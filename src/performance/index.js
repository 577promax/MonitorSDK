import fetch from "./fetch";
import observeEntries from "./observeEntries";
import observeLCP from "./observeLCP";
import observeFCP from "./observeFCP";
import observeLoad from "./observeLoad";
import observePaint from "./observePaint";
import xhr from "./xhr";   

export default function performance() {
    fetch();
    observeEntries();
    observeLCP();
    observeFCP();
    observeLoad();
    observePaint();
    xhr();
}