chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" }, function (response) {

    if (!response) {
      document.getElementById("score").innerText = "Error reading page";
      return;
    }

    document.getElementById("score").innerText =
      `Score: ${response.llm_readiness_score}/100`;

    document.getElementById("markdown").innerText = response.scores.markdown;
    document.getElementById("extract").innerText = response.scores.extractability;
    document.getElementById("token").innerText = response.scores.token_efficiency;
    document.getElementById("conversion").innerText = response.scores.conversion;

    const issuesList = document.getElementById("issues");
    response.top_issues.forEach(i => {
      let li = document.createElement("li");
      li.innerText = i;
      issuesList.appendChild(li);
    });

    const fixesList = document.getElementById("fixes");
    response.quick_fixes.forEach(f => {
      let li = document.createElement("li");
      li.innerText = f;
      fixesList.appendChild(li);
    });

  });
});
