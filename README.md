# ConsultasSII API

A Node.js/Express API for reading DTE (Documento Tributario Electrónico) data for the Chilean SII system.


## Database Backup & Restore

A GitHub Actions workflow runs every Sunday at 02:00 UTC and saves an encrypted backup to `database/backups/latest.pgdump.gpg`. The dump is encrypted with GPG — you need the private key on your local machine to decrypt it.

### Check your local GPG key
```bash
gpg --list-secret-keys
# Should list: tiago <tiagowhuber@gmail.com>
```

### Decrypt the backup
```bash
gpg --decrypt database/backups/latest.pgdump.gpg > /tmp/restore.pgdump
```
You will be prompted for your key passphrase (if set).

### Inspect contents (optional)
```bash
pg_restore --list /tmp/restore.pgdump
```

### Restore into the database
```bash
# Merge into existing database (safe for partial restore)
pg_restore --no-owner --no-privileges -d "$DATABASE_URL" /tmp/restore.pgdump

# Full restore — drops and recreates all objects first
pg_restore --clean --if-exists --no-owner --no-privileges -d "$DATABASE_URL" /tmp/restore.pgdump
```

---

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize with sequelize-typescript
- **Development**: nodemon, ts-node
