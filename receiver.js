
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 4000;
const TOKEN = process.env.REPORT_TOKEN;

const reportFile = path.join(__dirname, "test-report.json");

const server = http.createServer((req, res) => {
    if (req.method !== "POST" || req.url !== "/report") {
        res.writeHead(404);
        return res.end("Not Found");
    }

    if (!TOKEN || req.headers.authorization !== `Bearer ${TOKEN}`) {
        res.writeHead(401, {
            "Content-Type": "application/json"
        });
        return res.end(JSON.stringify({
            message: "Unauthorized"
        }));
    }

    let body = "";

    req.on("data", chunk => {
        body += chunk;

        if (body.length > 1024 * 1024) {
            req.destroy();
        }
    });

    req.on("end", () => {
        try {
            const report = JSON.parse(body);

            fs.writeFileSync(
                reportFile,
                JSON.stringify(report, null, 2)
            );

            console.log("Test report received successfully!");
            console.log("Saved at:", reportFile);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Report saved successfully"
            }));

        } catch (error) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Invalid JSON report"
            }));
        }
    });
});

server.listen(PORT, "127.0.0.1", () => {
    console.log(`Report Receiver running at http://localhost:${PORT}`);
});
