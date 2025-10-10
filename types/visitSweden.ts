// GeoCoordinates - where a place is located on a map
export type GeoCoordinates = {
  "@type": "schema:GeoCoordinates";
  "schema:latitude": number;
  "schema:longitude": number;
};

export type PostalAddress = {
  "@type": "schema:PostalAddress";
  "schema:streetAddress"?: string;
  "schema:addressLocality"?: string;
  "schema:addressCountry"?: string;
  "schema:postalCode"?: string;
};

// image info
export type ImageObject = {
  type: "schema:ImageObject";
  "@id": string; // image url
  "schema:name"?: string;
  "schema:contentUrl"?: string;
};

// text in different languages - I may add a language option for the whole website in the future
export type MultiLanguageText = {
  "@language": string;
  "@value": string;
};

// region info
export type Region = {
  "@id": string;
};

// a complete heritage site info based on Visit Sweden National Api doc
export type HeritageSite = {
  "@context"?: {
    schema: string;
    dcterms?: string;
    xsd?: string;
    visit?: string;
  };
  "@type": string; // "schema:Place", Museum, Tourist Attraction, etc.
  "@id": string; // unique identifier
  "schema:name": string | MultiLanguageText[]; // name of the site
  "schema:description"?: string | MultiLanguageText[]; // description
  "schema:image"?: ImageObject | ImageObject[] | string; // images
  "schema:geo"?: GeoCoordinates; // location coordinates
  "schema:address"?: PostalAddress; // street address
  "dcterms:spatial"?: Region; // region
  "schema:url"?: { "@id": string } | string; // website URL
  "schema:telephone"?: string; // phone number
  "schema:alternateName"?: string; // alternative name
  "schema:additionalType"?: { "@id": string }; // more specific type
  "schema:openingHoursSpecification"?: unknown; // opening hours
};
