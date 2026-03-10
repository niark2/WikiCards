
const WIKI_API_URL = "https://en.wikipedia.org/w/api.php";

async function test(title) {
    const url = `${WIKI_API_URL}?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages|info|pageprops|images&exintro=1&explaintext=1&piprop=original|thumbnail&pithumbsize=1000&pilicense=any&inprop=url&redirects=1&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

test(process.argv[2] || "Blanco, Oklahoma");
