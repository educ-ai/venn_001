## Onboarding Form: Architecture Decisions

### Framework: React Native CLI

Expo benefits, such as CI / CD and some native libraries, are irrelevant for this project and are an overkill

### Form Management: React Hook Form

- Larger adoption than Formik (~4.9M weekly downloads)
- Backed by many sponsors (long-term stability)
- Fast, small bundle size with no dependencies

### Validation Schema: Zod

- Modern TypeScript-first library with growing adoption, outperforming Yup
- Cleaner syntax than Yup

### UI Components: Custom components with StyleSheet (no library)

Dangerous coupling if support is dropped and need to rewrite the whole app UI level

### Theming: Plain Context + TypeScript (no library)

- Use RN's built-in `useColorScheme` to detect device settings, custom `ThemeContext` and `useTheme()` hook for providing theme to components
- Theme object with TypeScript types for autocomplete and type safety
- No theming library, e.g., Shopify's Restyle:
    - Same risk as UI component libs: if support is dropped, all themed components need rewriting
    - No meaningful benefit without Restyle's components

### HTTP Client: Own networking class around Plain fetch

Networking is on the critical path. Full control over request/response handling. No abstraction should hide behavior or introduce upgrade risk

### Testing: Jest + React Native Testing Library

Standard testing combo for React Native

### Linting: ESLint + Prettier

- Catches bugs before runtime
- Enforces consistent code style across codebase

### Navigation: None

Navigation library is an overkill for this scope

### Localization: i18next + react-i18next + react-native-localize

- i18next is the most widely adopted i18n framework (~4M weekly downloads)
- Flat JSON for simplicity and easy handoff to translators

### State Management: Local state only passed via DI

Global state management is an outdated anti-pattern for mobile development.

---

### Project Structure

```
/
  # wraps with ThemeProvider, renders HomeScreen
  App.tsx
  src/
    # theming context, color definitions, useTheme hook
    theme/
      colors.ts
      ThemeContext.tsx
    # OOP/functional services encapsulating fetch calls and business logic
    business_logic/
    # reusable UI components shared across features
    components/
    # feature-specific code (onboarding form logic, schema, screens)
    features/
      home/
        # main container, app entry point, mounts feature screens
        HomeScreen.tsx
      onboarding/
        components/
        hooks/
        schema/
        screens/
          OnboardingScreen.tsx
```

### Testing Strategy

| Test Type | What | How |
|-----------|------|-----|
| Schema | Zod validation rules | `schema.safeParse(data)` — pass/fail assertions |
| Service | CorporationService, ProfileService | Mock fetch, test methods return correct results |
| Hook | Form logic | `@testing-library/react-hooks` — no component rendering |

-------

## React Native

This a new [**React Native**](https://reactnative.dev) project.

To run in simulator start the Metro dev server:

```sh
npm start
```

### iOS

```sh
npm run ios
```

Every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).
