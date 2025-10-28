import { OSMTag } from "@/types/site";
import { getTagValue } from "@/lib/api/osm";

export function formatAddress(tags?: OSMTag[]): string | null {
  if (!tags) {
    return null;
  }

  const street = getTagValue(tags, "addr:street");
  const houseNumber = getTagValue(tags, "addr:housenumber");
  const postcode = getTagValue(tags, "addr:postcode");
  const city = getTagValue(tags, "addr:city");

  // if no street, return null (no address available)
  if (!street) {
    return null;
  }

  // build address string
  let address = street;

  if (houseNumber) {
    address += ` ${houseNumber}`;
  }

  if (postcode) {
    address += `, ${postcode}`;
  }

  if (city) {
    address += ` ${city}`;
  }

  return address;
}
