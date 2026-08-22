const fs = require('fs');
let code = fs.readFileSync('src/screens/LogicEngineScreen.tsx', 'utf-8');

code = code.replace('let scenarios: any = {', 'let scenarios = {'); // Revert previous change if applied
code = code.replace('const scenarios = {', 'let scenarios: any = {');

const injection = `
  if (selectedCaseId && caseFiles && caseFiles[selectedCaseId]) {
    const hwFile = caseFiles[selectedCaseId].find(f => f.type === 'handwritten' || f.type === 'image');
    if (hwFile && hwFile.content) {
      if (hwFile.content.includes('45')) {
         scenarios.land.comparisons['evt-2'].strategy = "[Đã trích xuất từ Bản án D1] Đề xuất: Căn cứ tài liệu quét (có thông tin thửa đất số 45), áp dụng khoản 2 Điều 138 Luật Đất đai 2024 để xin cấp GCNQSDĐ.";
         scenarios.land.events[1].text = "Hành vi lấn chiếm / Di chúc thửa đất số 45.";
      } else {
         scenarios.land.comparisons['evt-2'].strategy = "[Dữ liệu từ Bản án D1] " + scenarios.land.comparisons['evt-2'].strategy;
      }
    }
  }

  const currentEventData = currentScenario.comparisons[selectedEventId] || Object.values(currentScenario.comparisons)[0];
`;

code = code.replace('const currentEventData = currentScenario.comparisons[selectedEventId] || Object.values(currentScenario.comparisons)[0];', injection);

fs.writeFileSync('src/screens/LogicEngineScreen.tsx', code);
