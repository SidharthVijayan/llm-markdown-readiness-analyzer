function getText() {
  return document.body.innerText || "";
}

function getParagraphStats() {
  const paragraphs = [...document.querySelectorAll("p")];
  const totalWords = paragraphs.reduce((acc, p) => {
    return acc + p.innerText.split(/\s+/).length;
  }, 0);

  return {
    count: paragraphs.length,
    avgWords: paragraphs.length ? Math.round(totalWords / paragraphs.length) : 0
  };
}

function redundancyScore(text) {
  const words = text.toLowerCase().split(/\s+/);
  const unique = new Set(words);
  return Math.round((1 - unique.size / words.length) * 100);
}
