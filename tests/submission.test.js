
const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");

const BASE_URL = "http://localhost:3000";

function submitAssignment(data) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(data);

        const request = http.request(
            BASE_URL + "/api/submissions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body)
                }
            },
            response => {
                let responseData = "";

                response.on("data", chunk => {
                    responseData += chunk;
                });

                response.on("end", () => {
                    resolve({
                        status: response.statusCode,
                        body: JSON.parse(responseData)
                    });
                });
            }
        );

        request.on("error", reject);
        request.write(body);
        request.end();
    });
}

test("Valid submission should be accepted and saved", async () => {
    const result = await submitAssignment({
        studentName: "Test Student",
        registrationNumber: "TEST-001",
        assignmentTitle: "DevOps Test",
        submissionUrl: "https://github.com/"
    });

    assert.strictEqual(result.status, 201);
    assert.strictEqual(
        result.body.message,
        "Assignment submitted successfully."
    );

    const response = await fetch(BASE_URL + "/api/submissions");
    const submissions = await response.json();

    assert.ok(
        submissions.some(item => item.registrationNumber === "TEST-001")
    );
});

test("Missing registration number should be rejected", async () => {
    const result = await submitAssignment({
        studentName: "Test Student",
        registrationNumber: "",
        assignmentTitle: "DevOps Test",
        submissionUrl: "https://github.com/"
    });

    assert.strictEqual(result.status, 500);
    assert.strictEqual(
        result.body.message,
        "All fields are required."
    );
});

test("Invalid submission URL should be rejected", async () => {
    const result = await submitAssignment({
        studentName: "Test Student",
        registrationNumber: "TEST-003",
        assignmentTitle: "DevOps Test",
        submissionUrl: "not-a-valid-url"
    });

    assert.strictEqual(result.status, 400);
    assert.strictEqual(
        result.body.message,
        "Please enter a valid submission URL."
    );
});
