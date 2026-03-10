
const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

async function testImages(title) {
    const url = `${WIKI_API_URL}?action=query&titles=${encodeURIComponent(title)}&prop=images&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

testImages(process.argv[2] || "Blanco, Oklahoma");
