import type { WikidataResponse, WikidataImageData } from "@/types/site";

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";

// fetch image and description from Wikidata
export async function fetchWikidataImage(
  wikidataId: string
): Promise<WikidataImageData> {
  // build the SPARQL query
  const query = `
    SELECT ?image ?description WHERE {
      wd:${wikidataId} wdt:P18 ?image .
      wd:${wikidataId} schema:description ?description .
      FILTER(LANG(?description) = "en")
    }
  `;

  // full url plus the query
  const url = `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(
    query
  )}&format=json`;

  // Fetch the data
  const response = await fetch(url);
  const data: WikidataResponse = await response.json();

  // extract the first result (if any)
  const binding = data.results.bindings[0];
  const imageUrl = binding?.image?.value || null;
  const description = binding?.description?.value || null;

  return {
    imageUrl,
    description,
  };
}
