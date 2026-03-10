
const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

async function testGeneratorImages(title) {
    const url = `${WIKI_API_URL}?action=query&titles=${encodeURIComponent(title)}&generator=images&gimlimit=10&prop=imageinfo&iiprop=url|size&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

testGeneratorImages(process.argv[2] || "Blanco, Oklahoma");
