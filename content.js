chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "analyze") {

    const h2 = document.querySelectorAll("h2").length;
    const lists = document.querySelectorAll("ul, ol").length;
    const tables = document.querySelectorAll("table").length;

    const { avgWords } = getParagraphStats();
    const text = getText();
    const redundancy = redundancyScore(text);

    const hasFAQ = [...document.querySelectorAll("h2, h3")]
      .some(el => el.innerText.toLowerCase().includes("faq"));

    // MARKDOWN
    let markdown = 100;
    if (h2 === 0) markdown -= 20;
    if (avgWords > 120) markdown -= 15;
    if (lists === 0) markdown -= 15;
    if (tables === 0) markdown -= 10;

    // EXTRACTABILITY
    let extract = 100;
    if (!hasFAQ) extract -= 20;
    if (avgWords > 120) extract -= 20;
    if (lists === 0) extract -= 15;

    // TOKEN
    let token = 100;
    if (avgWords > 25) token -= 15;
    if (redundancy > 30) token -= 25;

    // CONVERSION
    let conversion = 100;
    const hasCTA =
      text.toLowerCase().includes("buy") ||
      text.toLowerCase().includes("contact") ||
      text.toLowerCase().includes("sign up");

    if (!hasCTA) conversion -= 25;

    // FINAL
    const finalScore = Math.round(
      markdown * 0.3 +
      extract * 0.3 +
      token * 0.25 +
      conversion * 0.15
    );

    const issues = [];
    if (avgWords > 120) issues.push("Long paragraphs");
    if (lists === 0) issues.push("Missing structured lists");
    if (!hasFAQ) issues.push("No FAQ blocks");

    const fixes = [
      "Add 3 bullet sections",
      "Break paragraphs <80 words",
      "Insert FAQ section"
    ];

    sendResponse({
      llm_readiness_score: finalScore,
      scores: {
        markdown,
        extractability: extract,
        token_efficiency: token,
        conversion
      },
      top_issues: issues,
      quick_fixes: fixes
    });
  }
});
