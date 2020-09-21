# Show Git repos commits

### Yarn 2 (berry)

```bash
yarn dlx @efrem/showcommits [--date=2020] [--date=2020-03]
```

### Npm

```bash
npx @efrem/showcommits [--date=2020] [--date=2020-03]
```

# VSCode

- Setup (<https://yarnpkg.com/advanced/editor-sdks#vscode>)

  - Open this project directly otherwise you should add to VSCode Workspace `settings.json`:

  ```json
  "typescript.tsdk": "<current directory name>/.yarn/sdks/typescript/lib"
  ```

  - Press ctrl+shift+p in a TypeScript file
  - Choose "Select TypeScript Version"
  - Pick "Use Workspace Version"
