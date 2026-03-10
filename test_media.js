
async function testMedia(title) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, '_'))}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

testMedia(process.argv[2] || "Blanco, Oklahoma");
