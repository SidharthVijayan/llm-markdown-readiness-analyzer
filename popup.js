chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "analyze" }, function (res) {

    if (!res) {
      document.getElementById("score").innerText = "Error";
      return;
    }

    const score = res.llm_readiness_score;

    document.getElementById("score").innerText = score;

    // Animate score ring
    const circle = document.getElementById("scoreCircle");
    const deg = (score / 100) * 360;

    circle.style.background =
      `conic-gradient(#22c55e ${deg}deg, #1e293b ${deg}deg)`;

    document.getElementById("markdown").innerText = res.scores.markdown;
    document.getElementById("extract").innerText = res.scores.extractability;
    document.getElementById("token").innerText = res.scores.token_efficiency;
    document.getElementById("conversion").innerText = res.scores.conversion;

    // Issues
    const issuesList = document.getElementById("issues");
    issuesList.innerHTML = "";
    res.top_issues.forEach(i => {
      const li = document.createElement("li");
      li.innerText = i;
      issuesList.appendChild(li);
    });

    // Fixes
    const fixesList = document.getElementById("fixes");
    fixesList.innerHTML = "";
    res.quick_fixes.forEach(f => {
      const li = document.createElement("li");
      li.innerText = f;
      fixesList.appendChild(li);
    });

  });
});
