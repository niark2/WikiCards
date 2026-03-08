# WikiCards Findings

## API Details
- **Random article**: `https://{lang}.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=5&format=json`
- **Article details (extract, pageimage)**: `https://{lang}.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|info&exintro=1&piprop=original|thumbnail&pithumbsize=500&inprop=url&pageids={ids}&format=json`
- **Pageviews for rarity**: `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{project}/{access}/{agent}/{article}/{granularity}/{start}/{end}`
  
## UX/UI Design Guidelines
- Stack: Next.js + Tailwind CSS + Framer Motion (for animations).
- Theme: Dark and premium.

## Notes
- 
