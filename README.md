# Setup Javy

🟨 Install [Javy](https://github.com/bytecodealliance/javy) for GitHub Actions

<table align=center><td>

```yaml
- uses: jcbhmr/setup-javy@v1
- run: javy compile main.js -o main.wasm
```

</table>

✅ Installs the `javy` CLI globally \
📌 Supports version pinning \
⚡ Caches the installation in `$RUNNER_TOOL_CACHE` \
📥 Downloads from [the Javy GitHub releases](https://github.com/bytecodealliance/javy/releases)

## Usage

![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)
![GitHub](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=181717&logo=GitHub&logoColor=FFFFFF&label=)

**🚀 Here's what you're after:**

```yml
on: push
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jcbhmr/setup-wasmtime@v2
      - uses: jcbhmr/setup-javy@v1
      - run: javy compile main.js -o main.wasm
      - run: wasmtime main.wasm
```

### Inputs

- **`javy-version`:** Which version of Javy to install. This can be an exact version specifier such as `1.3.0` or a semver range like `~1.3.0` or `1.x`. Use `latest` to always install the latest release. Defaults to `latest`.

- **`javy-token`:** The GitHub token to use when fetching the version list from [bytecodealliance/javy](https://github.com/bytecodealliance/javy/releases). You shouldn't have to touch this. The default is the `github.token` if you're on github.com or unauthenticated (rate limited) if you're not on github.com.

### Outputs

- **`javy-version`:** The version of Javy that was installed. This will be something like `1.3.0` or similar.

- **`cache-hit`:** Whether or not Javy was restored from the runner's cache or download anew.

## Development

![Bun](https://img.shields.io/static/v1?style=for-the-badge&message=Bun&color=000000&logo=Bun&logoColor=FFFFFF&label=)
![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)

This GitHub Action uses Bun to bundle the main entry point plus all the imported dependencies into a single `.js` file ready to be run by `main: dist/main.js` in the `action.yml`. To test the action just open a PR (even a draft one) and some magic GitHub Actions will test your changes. 🧙‍♂️

ℹ Once [Bun gets Windows support](https://github.com/oven-sh/bun/issues/43) make sure you add back the `runs-on: windows-latest` test to `test-action.yml`.
