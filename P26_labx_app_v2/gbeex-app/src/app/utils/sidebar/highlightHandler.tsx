// src/app/utils/sidebar/handlers/highlightHandler.ts

/**
 * highlightMatch
 * --------------
 * Returns JSX with matched substring wrapped in <mark> tag.
 */
export function highlightMatch(name: string, query: string): React.ReactNode {
    if (!query.trim()) return name;
    const lower = query.toLowerCase();
    const index = name.toLowerCase().indexOf(lower);
    if (index === -1) return name;

    return (
        <>
        { name.slice(0, index) }
        < mark > { name.slice(index, index + query.length) } </mark>
      { name.slice(index + query.length) }
    </>
  );
}
