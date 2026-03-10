
const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

async function testImageInfo(titles) {
    const url = `${WIKI_API_URL}?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=imageinfo&iiprop=url|size&iilimit=1&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

testImageInfo(["File:Flag of Oklahoma.svg", "File:USA Oklahoma location map.svg"]);
