import type { NominatimResult } from "@/types/site";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

const USER_AGENT = "HeritageExplorerSwe/1.0 (Educational Project)";

// helper func: delay between requests due to nominatim limits requests to 1
// request per second
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// search function
export async function searchByName(query: string): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    format: "json",
    q: query,
    limit: "10",
    addressdetails: "1",
    countrycodes: "se",
  });

  const url = `${NOMINATIM_BASE_URL}/search?${params.toString()}`;
  console.log(`Searching for: "${query}"`);
  console.log(`Searching for: "${url}"`);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT, // required
      },
    });

    if (!response.ok) {
      throw new Error(`Api failed: ${response.status}`);
    }

    const results: NominatimResult[] = await response.json();

    console.log(`found ${results.length} results`);

    await delay(1000); // wait 1 second before next request (nominatim rule)

    return results;
  } catch (error) {
    console.error("search failed: ", error);
    throw error;
  }
}
