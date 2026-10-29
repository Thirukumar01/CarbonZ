import { spawn } from "node:child_process";
import http from "node:http";

const PORT = 3005;
const BASE_URL = `http://localhost:${PORT}`;

const ROUTES_TO_TEST = [
  { path: "/", expectedText: "Verify. Trust. Track." },
  { path: "/projects", expectedText: "Carbon Project Explorer" },
  { path: "/projects/amazon-rainforest-corridor-restoration", expectedText: "Amazon Rainforest Corridor" },
  { path: "/projects/amazon-rainforest-corridor-restoration/passport", expectedText: "Carbon Passport" },
  { path: "/compare", expectedText: "Compare Carbon Projects" },
  { path: "/login", expectedText: "Sign in to your account" },
  { path: "/register", expectedText: "Create your CarbonZ account" },
  { path: "/forgot-password", expectedText: "Reset Account Password" },
  { path: "/dashboard", expectedText: "User Dashboard" },
  { path: "/dashboard/developer", expectedText: "Developer Dossier Management" },
  { path: "/dashboard/reviewer", expectedText: "Verification Reviewer Bureau" },
  { path: "/dashboard/admin", expectedText: "Administrative Console" },
  { path: "/about", expectedText: "About CarbonZ" },
  { path: "/privacy", expectedText: "Privacy Policy" },
  { path: "/terms", expectedText: "Terms of Service" },
  { path: "/contact", expectedText: "Contact CarbonZ Support" },
];

function fetchRoute(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ statusCode: res.statusCode, body }));
    }).on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "inherit",
  });

  // Wait for server to be responsive
  let started = false;
  for (let i = 0; i < 30; i++) {
    await sleep(1000);
    try {
      const res = await fetchRoute("/");
      if (res.statusCode === 200) {
        started = true;
        break;
      }
    } catch {
      // not yet up
    }
  }

  if (!started) {
    server.kill();
    console.error("Server failed to start within 30 seconds.");
    process.exit(1);
  }

  console.log("Server is UP. Testing all 16 major application routes...\n");

  let allPassed = true;

  for (const { path, expectedText } of ROUTES_TO_TEST) {
    try {
      const res = await fetchRoute(path);
      const containsExpected = res.body.includes(expectedText);
      const is200 = res.statusCode === 200;

      if (is200 && containsExpected) {
        console.log(`  ✓ [200 OK] ${path} (Found expected text: "${expectedText}")`);
      } else {
        allPassed = false;
        console.error(`  ✕ [FAIL] ${path} - Status: ${res.statusCode}, Contains text: ${containsExpected}`);
      }
    } catch (err) {
      allPassed = false;
      console.error(`  ✕ [ERROR] ${path} - ${err.message}`);
    }
  }

  // Gracefully terminate server
  console.log("\nTerminating test server...");
  server.kill("SIGTERM");
  await sleep(1500);

  if (allPassed) {
    console.log("\n>>> ALL 16 ROUTES VERIFIED AND RETURNING 200 OK WITH VALID RENDERED CONTENT! <<<");
    process.exit(0);
  } else {
    console.error("\n>>> SOME ROUTE CHECKS FAILED. <<<");
    process.exit(1);
  }
}

run();
