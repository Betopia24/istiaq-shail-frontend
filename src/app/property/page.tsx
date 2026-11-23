import { notFound } from "next/navigation";

// A buyer page always needs its share link: /property/<shareToken>.
export default function PropertyRootPage() {
  notFound();
}
