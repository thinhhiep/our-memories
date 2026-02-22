# 🔐 Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email **security@ourmemories.dev** instead of using the issue tracker.

**Please do not** disclose security vulnerabilities publicly until they have been addressed.

### Security Report Should Include:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Your contact information

We will:
- Confirm receipt of your report
- Provide an estimated timeline for a fix
- Keep you updated on progress
- Credit you in the fix (if desired)

---

## Security Features

### Database Security

- **SQL Injection Prevention**: All queries use parameterized queries via `@vercel/postgres`
- **Connection Pooling**: Using Neon's connection pooler for secure connections
- **SSL/TLS**: All connections use `sslmode=require`
- **Encryption**: Credentials stored in environment variables only

### API Security

- **Edge Runtime**: API routes run on Vercel Edge Network (encrypted transport)
- **Ownership Verification**: All operations verify user ownership
- **Input Validation**: Query parameters validated before use
- **Error Handling**: Generic error messages (no sensitive info leaked)

### Frontend Security

- **XSS Prevention**: React escapes content by default
- **CSRF Protection**: Implement as needed for state-changing operations
- **Content Security Policy**: Configure in production
- **Secure Headers**: Set in `next.config.mjs`

### Credential Security

- **Environment Variables**: Sensitive data stored in `.env.local` (git ignored)
- **No Hardcoding**: No passwords, API keys, or tokens in code
- **Rotation**: Credentials should be rotated periodically
- **Template**: `.env.example` shows required variables without values

---

## Security Best Practices

### For Developers

1. **Never commit secrets**
   ```bash
   # ❌ WRONG
   const apiKey = "sk_live_123456789";
   
   # ✅ RIGHT
   const apiKey = process.env.API_KEY;
   ```

2. **Use parameterized queries**
   ```typescript
   // ❌ WRONG
   const result = await sql(`SELECT * FROM users WHERE id = '${id}'`);
   
   // ✅ RIGHT
   const result = await sql`SELECT * FROM users WHERE id = ${id}`;
   ```

3. **Validate user input**
   ```typescript
   if (!userId || typeof userId !== 'string') {
     return NextResponse.json(
       { error: 'Invalid userId' },
       { status: 400 }
     );
   }
   ```

4. **Verify ownership**
   ```typescript
   // Only allow user to access their own albums
   if (album.user_id !== userId) {
     return NextResponse.json(
       { error: 'Unauthorized' },
       { status: 401 }
     );
   }
   ```

5. **Use HTTPS in production**
   - All traffic should be encrypted
   - Verify SSL/TLS certificate validity
   - Use security headers (HSTS, CSP, etc.)

### For Database

1. **Backup regularly**
   - Neon provides automatic daily backups
   - Test restore procedures
   - Keep backup retention policy

2. **Monitor activity**
   - Check database logs regularly
   - Set up alerts for suspicious activity
   - Review audit logs

3. **Limit access**
   - Use role-based access control
   - Principle of least privilege
   - Disable unused features

4. **Keep updated**
   - Update PostgreSQL version
   - Apply security patches
   - Monitor Neon security announcements

### For Users

1. **Use strong passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse across sites

2. **Enable 2FA** (when implemented)
   - Adds extra security layer
   - Use authenticator app (not SMS if possible)
   - Save backup codes

3. **Verify HTTPS**
   - Check for padlock icon
   - Verify domain name
   - Never enter credentials on unsecured sites

4. **Be cautious with shares**
   - Don't share tokens publicly
   - Use password protection for sensitive albums
   - Set expiration dates on shares
   - Review share list regularly

---

## Dependency Security

### Vulnerability Scanning

```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities (with caution)
npm audit fix

# See detailed report
npm audit --json
```

### Best Practices

1. **Keep dependencies updated**
   ```bash
   npm outdated      # See available updates
   npm update        # Update to compatible versions
   ```

2. **Review before updating**
   - Check CHANGELOG for breaking changes
   - Test after updating
   - Use `npm audit` before and after

3. **Remove unused dependencies**
   - Reduces attack surface
   - Improves performance
   - Use `npm prune` to clean up

4. **Lock file in git**
   - `package-lock.json` ensures reproducible installs
   - Never commit `node_modules/`
   - Use `npm ci` in CI/CD

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Environment variables configured on hosting platform
- [ ] No hardcoded secrets in code
- [ ] All tests passing
- [ ] ESLint check passing
- [ ] Build command successful
- [ ] Database migrations run
- [ ] Backups configured
- [ ] SSL/TLS enabled
- [ ] Security headers configured
- [ ] Logging configured

### Vercel Deployment

1. **Set environment variables in project settings**
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL` and `POSTGRES_URL`
   - These won't be visible in logs

2. **Configure security headers**
   ```javascript
   // next.config.mjs
   export default {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             { key: 'X-Content-Type-Options', value: 'nosniff' },
             { key: 'X-Frame-Options', value: 'DENY' },
             { key: 'X-XSS-Protection', value: '1; mode=block' },
           ],
         },
       ];
     },
   };
   ```

3. **Enable DDoS protection**
   - Vercel provides automatic DDoS protection
   - Monitor on dashboard

### Ongoing Security

1. **Monitor for vulnerabilities**
   - Subscribe to security advisories
   - Check GitHub security alerts
   - Use `npm audit` regularly

2. **Review access logs**
   - Check Vercel logs for suspicious activity
   - Monitor database query logs
   - Set up alerts for failures

3. **Security updates**
   - Apply patches promptly
   - Test in staging first
   - Communicate to users if needed

---

## Security Testing

### Manual Testing

1. **Test SQL injection**
   - Try entering SQL commands in search fields
   - Verify they're escaped properly

2. **Test XSS**
   - Try entering scripts in text fields
   - Verify they're escaped/sanitized

3. **Test authorization**
   - Try accessing other users' data
   - Verify ownership checks work
   - Test role-based access

4. **Test authentication**
   - Session timeout
   - Token expiration
   - Invalid token handling

### Automated Testing

```bash
# ESLint security rules
npm run lint

# TypeScript type checking
npm run build

# Dependency audit
npm audit
```

---

## Incident Response

### If a vulnerability is discovered:

1. **Stop the bleeding**
   - Take affected service offline if critical
   - Notify users if their data is at risk

2. **Investigate**
   - Determine scope and impact
   - Review logs to see who was affected
   - Preserve evidence

3. **Fix the issue**
   - Patch the vulnerability
   - Test the fix thoroughly
   - Deploy to production

4. **Communicate**
   - Notify affected users
   - Explain what happened
   - Outline steps taken
   - Recommend user actions if needed

5. **Follow up**
   - Post-mortem analysis
   - Update security measures
   - Document lessons learned

---

## Security Resources

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)

### Tools

- [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit)
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [GitHub Security Alerts](https://github.com/features/security/code)
- [SonarQube](https://www.sonarqube.org/) - Code quality

### Learning

- [Auth0 Security Blog](https://auth0.com/blog/)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

---

## Questions?

- Create a private security report
- Contact: security@ourmemories.dev
- Discuss in private security advisory

---

**Last Updated**: February 22, 2024
**Version**: 1.0
