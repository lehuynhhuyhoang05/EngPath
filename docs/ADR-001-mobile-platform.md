# ADR-001: Mobile platform

Status: Accepted  
Decision: React Native with Expo and TypeScript

## Context

EngPath is built by one student developer, launches on Android first, may support iOS later, and needs microphone/audio integration, local caching, API access, and rapid UI iteration. The developer already has JavaScript and Next.js experience.

## Options considered

### React Native with Expo

- Reuses TypeScript knowledge across mobile, backend, admin, schemas, and tests.
- Fastest path to a working Android beta for the current developer.
- Supports audio and native builds while preserving an escape path to custom native modules.
- Expo SDK and React Native upgrades require version discipline.

### Flutter

- Strong cross-platform UI consistency and tooling.
- Requires learning and maintaining Dart in addition to the TypeScript backend/admin stack.
- Provides no clear product advantage for the current EngPath requirements.

### Native Android with Kotlin

- Best direct access to Android APIs and platform-specific optimization.
- Produces the largest initial learning and implementation cost and does not advance a later iOS client.
- Appropriate only if speech/audio profiling reveals a native limitation that cannot be solved through an Expo module or a small native bridge.

## Decision

Use React Native with Expo. Keep speech integration behind a TypeScript interface and add native code only for a demonstrated limitation.

## Revisit conditions

Reconsider the decision only if:

- a required speech SDK cannot run through Expo development builds or a maintained React Native module;
- measured performance on target low-end Android devices is unacceptable after profiling;
- the project becomes Android-only long term and requires substantial platform-specific behavior.

