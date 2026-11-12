
const fs = require("fs");

const tapFile = "test-results.tap";
const outputFile = "test-report.json";

const tap = fs.existsSync(tapFile)
    ? fs.readFileSync(tapFile, "utf8")
    : "";

const lines = tap.split(/\r?\n/);
const tests = [];

for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(ok|not ok)\s+\d+\s+-\s+(.+)$/);

    if (match) {
        const passed = match[1] === "ok";

        let failureMessage = "";

        if (!passed) {
            const details = [];

            for (let j = i + 1; j < lines.length; j++) {
                if (/^(ok|not ok)\s+\d+\s+-\s+/.test(lines[j])) {
                    break;
                }

                if (lines[j].trim()) {
                    details.push(lines[j].trim());
                }
            }

            failureMessage = details.join(" ").slice(0, 1000);
        }

        tests.push({
            name: match[2],
            result: passed ? "PASS" : "FAIL",
            failureMessage: failureMessage || null
        });
    }
}

const passed = tests.filter(t => t.result === "PASS").length;
const failed = tests.filter(t => t.result === "FAIL").length;

const report = {
    repository: process.env.GITHUB_REPOSITORY || "CSC418-Midterm",
    branch: process.env.GITHUB_REF_NAME || "local",
    commitSHA: process.env.GITHUB_SHA || "local-test",
    pipelineRunID: process.env.GITHUB_RUN_ID || "local-test",
    executionTimestamp: new Date().toISOString(),
    tests,
    total: tests.length,
    passed,
    failed,
    status: failed === 0 && tests.length > 0 ? "PASS" : "FAIL"
};

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));

console.log("Test report generated:");
console.log(JSON.stringify(report, null, 2));
