export function useNoteFormatter() {
  const format = async (content) => {
    const prompt =
      "Format these notes with bullets, indents, and line spaces where needed. Respond with formatted notes only:\n\n" +
      content;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3.2:latest", prompt }),
    });

    const json = await res.json();
    return json.response || content;
  };

  return format;
}
