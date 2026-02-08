const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:5000";
const authCookie = process.env.SMOKE_AUTH_COOKIE;

async function assertOk(response: Response, label: string) {
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`${label} failed: ${response.status} ${response.statusText} ${body}`);
  }
}

async function run() {
  const healthResponse = await fetch(`${baseUrl}/api/health`);
  await assertOk(healthResponse, "Health check");
  const healthJson = await healthResponse.json();
  if (healthJson.status !== "ok") {
    throw new Error(`Health check returned unexpected status: ${healthJson.status}`);
  }

  if (!authCookie) {
    console.log("Skipping authenticated smoke checks (SMOKE_AUTH_COOKIE not set).");
    return;
  }

  const projectResponse = await fetch(`${baseUrl}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify({
      name: `Smoke Test Project ${new Date().toISOString()}`,
      industry: "technology",
    }),
  });
  await assertOk(projectResponse, "Create project");
  const project = await projectResponse.json();

  const brandKitResponse = await fetch(`${baseUrl}/api/projects/${project.id}/brand-kit`, {
    headers: {
      Cookie: authCookie,
    },
  });
  await assertOk(brandKitResponse, "Fetch brand kit");
}

run()
  .then(() => {
    console.log("Smoke checks passed.");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
