
const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

async function testImageThumb(titles) {
    const url = `${WIKI_API_URL}?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=imageinfo&iiprop=url|size&iiurlwidth=800&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

testImageThumb(["File:USA Oklahoma location map.svg"]);
