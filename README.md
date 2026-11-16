# CSC418 DevOps Lab Midterm
## Assignment Submission Portal with Automated Testing and CI/CD

### Project Overview
This project is a web-based Assignment Submission Portal developed as part of the CSC418 DevOps for Cloud Computing Lab Midterm.

The application allows students to submit assignments by providing their name, registration number, assignment title, and assignment URL. It validates submissions and stores valid records.

### Features
- Student assignment submission form.
- Input validation for required fields.
- Registration number validation.
- HTTP/HTTPS URL validation.
- Storage of valid submissions in a JSON file.
- Automated testing using Node.js.
- Continuous Integration using GitHub Actions.
- Automatic JSON test report generation.
- Local HTTP receiver for receiving and saving test reports.

### Technologies Used
- Node.js
- HTML
- JavaScript
- Git and GitHub
- GitHub Actions
- JSON
- Cloudflare Tunnel

### Project Structure

```text
CSC418-Midterm/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── public/
│   └── index.html
│
├── scripts/
│   └── create-report.js
│
├── tests/
│   └── submission.test.js
│
├── package.json
├── server.js
├── receiver.js
└── submissions.json
```

### Automated Test Cases

The project includes three automated test cases:

1. Valid submission is accepted and saved successfully.
2. Submission with a missing registration number is rejected.
3. Submission with an invalid URL is rejected.

### Continuous Integration Pipeline

GitHub Actions automatically runs the pipeline whenever code is pushed to the main branch.

The workflow performs the following steps:

1. Checks out the repository.
2. Sets up Node.js.
3. Starts the assignment portal server.
4. Runs automated tests.
5. Generates a JSON test report.
6. Sends the report to the local HTTP receiver.
7. Marks the workflow as failed if the server or tests fail.

### Test Report

The generated JSON report contains:

- Repository name
- Branch name
- Commit SHA
- Workflow run ID
- Timestamp
- Test names and results
- Total, passed, and failed test counts
- Overall test status

### Local Report Receiver

The `receiver.js` application runs a local HTTP server on port `4000`.

It receives test reports through the `/report` endpoint and saves them as `test-report.json`.

For secure communication, the receiver uses a token configured through the `REPORT_TOKEN` environment variable.

### How to Run the Project Locally

**1. Install dependencies**

```bash
npm install
```

**2. Start the assignment portal**

```bash
node server.js
```

Open the application at:

```text
http://localhost:3000
```

**3. Run automated tests**

```bash
npm test
```

**4. Start the local report receiver**

Set the `REPORT_TOKEN` environment variable before starting the receiver, then run:

```bash
node receiver.js
```

The receiver runs at:

```text
http://localhost:4000
```

### CI/CD Demonstration

The project demonstrates three pipeline scenarios:

- Successful pipeline after pushing valid code.
- Failed pipeline after introducing an intentional validation defect.
- Successful pipeline after fixing the defect.

### Repository

GitHub Repository:  
https://github.com/RimshaMalik572/CSC418-Midterm

### Conclusion

This project demonstrates the practical implementation of DevOps concepts, including version control, automated testing, continuous integration, JSON reporting, and local report collection using Node.js and GitHub Actions.

**Course:** CSC418 – DevOps for Cloud Computing  
**Project:** Lab Midterm Assignment
