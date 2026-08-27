# Security Policy

## Supported Versions

PiDao is under active development. Security updates and fixes are currently provided for the latest code on the `main` branch.

| Version / Branch | Supported |
| ---------------- | --------- |
| `main`           | ✅ Yes    |
| Legacy builds    | ❌ No     |

---

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues, discussions, pull requests, or social media.

If you discover a vulnerability in this project, including but not limited to:

- Backend API vulnerabilities
- Pi Network payment flow issues
- Authentication or JWT issues
- CORS or domain validation misconfiguration
- Exposure of environment variables or API keys
- Frontend security issues
- Deployment, Docker, Bonto, GitHub Pages, or CI/CD configuration issues

please report it privately.

### Contact

**Email:** alladallod@gmail.com

**Subject format:**

```text
Security Vulnerability Report:
```

1. A clear description of the issue
2. Steps to reproduce
3. Affected component or file, if known
4. Potential impact
5. Screenshots, logs, or proof-of-concept if available
6. Whether the issue is actively exploitable
7. Suggested fix, if you have one

---

## Response Process

We aim to follow this process:

1. **Acknowledgment:** We will acknowledge receipt of the report within 48 hours.
2. **Triage:** We will review and validate the issue.
3. **Investigation:** We will investigate the root cause and impact.
4. **Fix:** We will prepare and test a fix.
5. **Release:** We will release the fix as soon as reasonably possible.
6. **Disclosure:** If appropriate, we will coordinate responsible disclosure with the reporter.

---

## Security Best Practices for Contributors

Contributors must follow these rules:

### Do not commit secrets

Never commit real secrets, including:

- `PI_API_KEY`
- `JWT_SECRET`
- `DATABASE_URL`
- API keys
- private tokens
- `.env` files containing real values

Use `.env.example` files for placeholders.

### Environment files

Real environment files should not be committed:

```text
.env
.env.local
.env.production
backend/.env
frontend/.env
```

Use examples instead:

```text
.env.example
backend/.env.example
frontend/.env.example
```

### Pi Payment Security

Pi payment approval and completion must always be handled by a secure backend.

Do **not** expose Pi API keys in frontend code.

Correct flow:

```text
Frontend: Pi.createPayment()
Backend: approve payment using PI_API_KEY
Frontend: user confirms in Pi Wallet
Backend: complete payment using PI_API_KEY
```

### JWT Security

- Use strong random `JWT_SECRET` values.
- Do not hardcode JWT secrets.
- Rotate secrets if exposure is suspected.
- Store tokens carefully on the frontend.

### CORS Security

Only trusted frontend origins should be allowed.

Examples:

```text
https://piexplorerpi.github.io
https://apppiexplorerrjk7732.pinet.com
```

Avoid allowing all origins in production unless absolutely necessary.

---

## Out of Scope

The following are generally considered out of scope unless they demonstrate a real security impact:

- Generic automated scanner reports without proof of exploitability
- Reports about missing security headers without demonstrated risk
- Social engineering
- Denial-of-service attacks against third-party infrastructure
- Issues requiring physical access to a user's device
- Vulnerabilities in third-party services outside our control

---

## Responsible Disclosure

We ask that reporters:

- Give us reasonable time to fix the issue before public disclosure
- Avoid accessing, modifying, or deleting user data
- Avoid disrupting service availability
- Avoid sharing exploit details publicly before a fix is available

Thank you for helping keep PiDao and its users safe.
```
