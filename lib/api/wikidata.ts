import type { WikidataResponse, WikidataImageData } from "@/types/site";

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";

// fetch image and description from Wikidata
export async function fetchWikidataImage(
  wikidataId: string
): Promise<WikidataImageData> {
  // STAGE 2: Validate the wikidataId parameter
  // Check if it's empty or doesn't match Wikidata ID format (Q followed by numbers)
  if (!wikidataId || !wikidataId.match(/^Q\d+$/)) {
    console.error("Invalid Wikidata ID format:", wikidataId);
    return {
      imageUrl: null,
      description: null,
    };
  }

  try {
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

    const response = await fetch(url);

    // Check if the response was successful
    if (!response.ok) {
      console.error(
        `Wikidata API error: ${response.status} ${response.statusText}`
      );
      return {
        imageUrl: null,
        description: null,
      };
    }

    // handle Json parsing errors
    let data: WikidataResponse;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse Wikidata response:", parseError);
      return {
        imageUrl: null,
        description: null,
      };
    }

    // validate the response structure
    if (!data.results || !data.results.bindings) {
      console.error("Invalid Wikidata response structure");
      return {
        imageUrl: null,
        description: null,
      };
    }

    // extract the first result (if any)
    const binding = data.results.bindings[0];
    const imageUrl = binding?.image?.value || null;
    const description = binding?.description?.value || null;

    return {
      imageUrl,
      description,
    };
  } catch (error) {
    // STAGE 2: Catch any other errors (network failures, etc.)
    console.error("Error fetching Wikidata image:", error);
    return {
      imageUrl: null,
      description: null,
    };
  }
}
