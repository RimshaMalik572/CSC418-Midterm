
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const submissionsFile = path.join(__dirname, "submissions.json");

function getSubmissions() {
    if (!fs.existsSync(submissionsFile)) {
        fs.writeFileSync(submissionsFile, "[]");
    }

    return JSON.parse(fs.readFileSync(submissionsFile, "utf8"));
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {
        const html = fs.readFileSync(
            path.join(__dirname, "public", "index.html")
        );

        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        return res.end(html);
    }

    if (req.method === "GET" && req.url === "/api/submissions") {
        return sendJSON(res, 200, getSubmissions());
    }

    if (req.method === "POST" && req.url === "/api/submissions") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                const {
                    studentName,
                    registrationNumber,
                    assignmentTitle,
                    submissionUrl
                } = data;

                if (!studentName || !registrationNumber ||
                    !assignmentTitle || !submissionUrl) {
                    return sendJSON(res, 400, {
                        message: "All fields are required."
                    });
                }

                let parsedURL;

                try {
                    parsedURL = new URL(submissionUrl);
                } catch {
                    return sendJSON(res, 400, {
                        message: "Please enter a valid submission URL."
                    });
                }

                if (!["http:", "https:"].includes(parsedURL.protocol)) {
                    return sendJSON(res, 400, {
                        message: "Please enter a valid HTTP or HTTPS URL."
                    });
                }

                const submissions = getSubmissions();

                submissions.push({
                    studentName,
                    registrationNumber,
                    assignmentTitle,
                    submissionUrl
                });

                fs.writeFileSync(
                    submissionsFile,
                    JSON.stringify(submissions, null, 2)
                );

                return sendJSON(res, 201, {
                    message: "Assignment submitted successfully."
                });

            } catch {
                return sendJSON(res, 400, {
                    message: "Invalid request data."
                });
            }
        });

        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log(`Assignment Portal running at http://localhost:${PORT}`);
});
