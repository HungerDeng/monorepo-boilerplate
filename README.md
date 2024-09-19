# Intro

This is a monorepo boilerplate configured with ESLint, Prettier, Husky, Commitlint, Tailwind, and Shadcn-UI configuration.

## Using this example

Run the following command:

```sh
pnpm install
turbo dev
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `extension`: a [plasmo](https://www.plasmo.com/) extension
- `web`: another [Next.js](https://nextjs.org/) app with [Tailwind CSS](https://tailwindcss.com/)
- `ui`: a stub React component library with [Tailwind CSS](https://tailwindcss.com/) shared by both `web` applications

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
