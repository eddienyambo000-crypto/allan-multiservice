/**
 * Inline JSON-LD structured data. Escapes `<`, `>`, `&` so admin-entered text
 * (titles, descriptions) can never break out of the script tag — closes the
 * XSS vector (e.g. a description containing `</script>`).
 */
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(
    /[<>&]/g,
    (c) => ({ "<": "\\u003c", ">": "\\u003e", "&": "\\u0026" })[c] ?? c,
  );
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
