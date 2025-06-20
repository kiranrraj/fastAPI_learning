import { JSX } from "react";

export function highlightMatch(text: string, term: string): JSX.Element {
  if (!term) return <>{text}</>;

  const regex = new RegExp(`(${term})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}
