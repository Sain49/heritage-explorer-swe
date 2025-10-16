import { Suspense } from "react";
import SiteDetailsContent from "./site-details-content";

export default function SiteDetails() {
  return (
    <Suspense fallback={<div>Loading site details...</div>}>
      <SiteDetailsContent />
    </Suspense>
  );
}
