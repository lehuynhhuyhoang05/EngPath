# ADR-002: Repository boundary

Status: Accepted and executed  
Date: 2026-09-15

## Context

The workspace root contains product documentation, AI assets, project skills and the mobile application, but only `apps/mobile` currently has a `.git` directory. This leaves most project artifacts outside version control and prevents a root GitHub Actions workflow from operating as the project quality gate.

The nested mobile repository has one historical commit and currently contains uncommitted prototype changes. It has no configured remote.

## Decision

Use `C:\Study\HHoang-Prj` as the single Git repository boundary. Keep mobile, future API, documentation, AI prompts and project skills in one monorepo during the solo-development and private-beta phases.

Do not use a mobile submodule. It would add release and onboarding overhead without independent ownership or a separate deployment need.

## Safe migration conditions

The repository owner confirmed the migration and provided the empty GitHub remote on 2026-09-15.

Executed safeguards:

1. Created `.git-history-backups/mobile-history-2026-09-15.bundle` containing complete commit `48b5d30` history.
2. Verified that Git reports the bundle as complete and valid.
3. Moved the nested metadata to `.git-history-backups/mobile-dotgit-2026-09-15`; nothing was deleted.
4. Initialized `C:\Study\HHoang-Prj` on branch `main`.
5. Added `https://github.com/lehuynhhuyhoang05/EngPath.git` as `origin` after confirming the remote was empty.
6. Ignored `.git-history-backups/` and local `.claude/` settings.

Retain both backups until the root repository, remote and CI have been verified.

## Consequences

- One CI workflow can validate mobile and future API changes.
- Product decisions and content contracts are versioned with the code they govern.
- The old mobile commit is preserved as a recoverable bundle/backup, but is not automatically rewritten into the new root history.
- A later split remains possible if mobile and API gain independent teams or release ownership.
