/* eslint-disable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */

// ── External Dependencies & Registrations
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

// ── Local Framework
import { checkConfigFiles } from '@/actions/checkConfigFiles';
import { collectConsoleOutput, useTemporaryProject } from '../support/temporaryProject';

// ── Mocks ────────────────────────────────────────────────────────────────────────────────────────────────────────────

// The templates are found next to the built package ('dist/..'), so the action is told it runs from this repository's
// 'dist' folder. The tests then compare against the real templates.
const repositoryDirectory = vi.hoisted(() => new URL('../..', import.meta.url).pathname);
vi.mock('node:url', async (importOriginal) => ({
    ...(await importOriginal<object>()),
    fileURLToPath: () => `${repositoryDirectory}dist/dpuse-development.es.js`
}));

// ── Tests ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const project = useTemporaryProject();

async function copyTemplates(files: Record<string, string>): Promise<void> {
    for (const [projectPath, templatePath] of Object.entries(files)) {
        await fs.mkdir(path.dirname(projectPath), { recursive: true });
        await fs.copyFile(path.join(repositoryDirectory, templatePath), projectPath);
    }
}

async function writeProject(id: string, packageJSON: object = {}): Promise<void> {
    await project.writeFiles({
        'config.json': JSON.stringify({ id }),
        'package.json': JSON.stringify({ prettier: '@dpuse/dpuse-development/prettierrc', ...packageJSON })
    });
}

describe('checkConfigFiles', () => {
    it('finds every file of a public connector the same as its template', async () => {
        await writeProject('dpuse-connector-example');
        await copyTemplates({
            '.editorconfig': '.editorconfig',
            '.gitattributes': '.gitattributes',
            '.gitignore': '.gitignore_default',
            '.markdownlint.json': '.markdownlint.json',
            '.ncurc.json': '.ncurc.json',
            'eslint.config.js': 'eslint.config.default.js',
            LICENSE: 'LICENSE',
            'tsconfig.json': 'tsconfig.json',
            'scripts/tsconfig.json': 'scripts/tsconfig.json',
            'vite.config.ts': 'vite.config.default.ts',
            'vitest.config.ts': 'vitest.config.ts',
            '.github/dependabot.yml': '.github/dependabot.yml',
            '.github/workflows/ci.yml': '.github/workflows/ci.yml',
            '.github/workflows/codeql.yml': '.github/workflows/codeql.yml',
            '.github/workflows/publish.yml': '.github/workflows/publish.yml',
            '.github/workflows/scorecard.yml': '.github/workflows/scorecard.yml'
        });
        const securityPolicy = await fs.readFile(path.join(repositoryDirectory, 'SECURITY.md'), 'utf-8');
        await project.writeFiles({ 'SECURITY.md': securityPolicy.replaceAll('dpuse-development', 'dpuse-connector-example') });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).not.toContain('⚠️');
        expect(output).not.toContain('❌');
        expect(output).toContain("ℹ️  File 'vite.config.ts' is the same as 'vite.config.default.ts'");
        expect(output).toContain("ℹ️  File '.github/workflows/publish.yml' is the same as '.github/workflows/publish.yml'");
        expect(output).toContain("ℹ️  File 'SECURITY.md' is the same as 'SECURITY.md'");
        expect(output).toContain("ℹ️  Prettier configuration is '@dpuse/dpuse-development/prettierrc'");
        expect(output).toContain('✅ Configuration files checked');
    });

    it('reports missing files and a different Prettier configuration', async () => {
        await writeProject('dpuse-tool-example', { prettier: undefined });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("❌  File '.editorconfig' is MISSING");
        expect(output).toContain("❌  File 'vite.config.ts' is MISSING");
        expect(output).toContain("❌  File '.github/workflows/publish.yml' is MISSING");
        expect(output).toContain("❌  File 'SECURITY.md' is MISSING");
        expect(output).toContain("❌  Prettier configuration is NOT '@dpuse/dpuse-development/prettierrc'");
    });

    it('reports a file that differs from its template', async () => {
        await writeProject('dpuse-tool-example');
        await project.writeFiles({ '.editorconfig': 'root = false\n', 'vite.config.ts': 'export default {};\n', '.github/workflows/publish.yml': 'name: Other\n' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("❌  File '.editorconfig' is NOT the same");
        expect(output).toContain("❌  File 'vite.config.ts' is NOT the same");
    });

    it('uses the tool Vite template, and the one publish workflow, for a tool', async () => {
        await writeProject('dpuse-tool-example');
        await copyTemplates({ '.github/workflows/publish.yml': '.github/workflows/publish.yml', 'vite.config.ts': 'vite.config.tool.ts' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File '.github/workflows/publish.yml' is the same as '.github/workflows/publish.yml'");
        expect(output).toContain("ℹ️  File 'vite.config.ts' is the same as 'vite.config.tool.ts'");
    });

    it('checks the Rust version file and the Rust Dependabot template for a project with Rust code', async () => {
        await writeProject('dpuse-connector-example');
        await project.writeFiles({ 'rust/Cargo.toml': '[workspace]\n' });
        await copyTemplates({ 'rust-toolchain.toml': 'rust-toolchain.toml', '.github/dependabot.yml': '.github/dependabot.rust.yml' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File 'rust-toolchain.toml' is the same as 'rust-toolchain.toml'");
        expect(output).toContain("ℹ️  File '.github/dependabot.yml' is the same as '.github/dependabot.rust.yml'");
    });

    it('does not ask for the Rust version file in a project without Rust code', async () => {
        await writeProject('dpuse-connector-example');

        await checkConfigFiles();

        expect(collectConsoleOutput()).not.toContain('rust-toolchain.toml');
    });

    it('uses the presenter Vite template and the shared tsconfig for a presenter', async () => {
        await writeProject('dpuse-presenter-example');
        await copyTemplates({ 'tsconfig.json': 'tsconfig.json', 'vite.config.ts': 'vite.config.presenter.ts' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File 'tsconfig.json' is the same as 'tsconfig.json'");
        expect(output).toContain("ℹ️  File 'vite.config.ts' is the same as 'vite.config.presenter.ts'");
    });

    it('checks only Dependabot, against the private template, for a private package', async () => {
        await writeProject('dpuse-cookbook-example', { private: true });
        await copyTemplates({ '.github/dependabot.yml': '.github/dependabot.private.yml', 'vite.config.ts': 'vite.config.default.ts' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File '.github/dependabot.yml' is the same as '.github/dependabot.private.yml'");
        expect(output).toContain("ℹ️  CodeQL and Scorecard workflows and file 'SECURITY.md' are NOT required by this project");
        expect(output).toContain("ℹ️  File 'vite.config.ts' is the same as 'vite.config.default.ts'");
        expect(output).not.toContain('ci.yml');
    });

    it('checks the CI and publish workflows that a private package has', async () => {
        await writeProject('dpuse-engine', { private: true });
        await copyTemplates({ '.github/workflows/ci.yml': '.github/workflows/ci.yml' });
        await project.writeFiles({ '.github/workflows/publish.yml': 'name: Other\n' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File '.github/workflows/ci.yml' is the same as '.github/workflows/ci.yml'");
        expect(output).toContain("❌  File '.github/workflows/publish.yml' is NOT the same");
        expect(output).not.toContain('codeql.yml');
    });

    it('treats the app, API and development configurations as their own', async () => {
        await writeProject('dpuse-app', { private: true });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("⚠️  File 'eslint.config.js' is UNIQUE to this project");
        expect(output).toContain("⚠️  File 'tsconfig.json' is UNIQUE to this project");
        expect(output).toContain("⚠️  File 'vite.config.ts' is UNIQUE to this project");
        expect(output).toContain("ℹ️  File 'vitest.config.ts' is NOT required by this project");
        expect(output).toContain("⚠️  File '.prettierrc.json' is UNIQUE to this project");
    });

    it('checks the shared Vitest configuration, but no Vite configuration, for the ESLint configuration package', async () => {
        await writeProject('eslint-config-dpuse');
        await copyTemplates({ 'vitest.config.ts': 'vitest.config.ts' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File 'vite.config.ts' is NOT required by this project");
        expect(output).toContain("ℹ️  File 'vitest.config.ts' is the same as 'vitest.config.ts'");
    });

    it("treats the knowledge base's ESLint configuration as its own", async () => {
        await writeProject('dpuse-kb');

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("⚠️  File 'eslint.config.js' is UNIQUE to this project");
        expect(output).toContain("ℹ️  File 'vite.config.ts' is NOT required by this project");
        expect(output).toContain("ℹ️  File 'vitest.config.ts' is NOT required by this project");
    });

    it('checks the shared Vitest configuration, but no Vite configuration, for the sample data', async () => {
        await writeProject('dpuse-resources');
        await copyTemplates({ 'vitest.config.ts': 'vitest.config.ts' });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File 'vite.config.ts' is NOT required by this project");
        expect(output).toContain("ℹ️  File 'vitest.config.ts' is the same as 'vitest.config.ts'");
    });

    it("reports dpuse-development's Prettier configuration as the template", async () => {
        await writeProject('dpuse-development', { prettier: undefined });

        await checkConfigFiles();

        expect(collectConsoleOutput()).toContain("ℹ️  File '.prettierrc.json' is the template");
    });

    it('does not require the TypeScript, ESLint, Vite or Vitest files where a project has no code', async () => {
        await writeProject('github', { private: true });

        await checkConfigFiles();

        const output = collectConsoleOutput();
        expect(output).toContain("ℹ️  File 'eslint.config.js' is NOT required by this project");
        expect(output).toContain("ℹ️  File 'tsconfig.json' is NOT required by this project");
        expect(output).toContain("ℹ️  File 'scripts/tsconfig.json' is NOT required by this project");
        expect(output).toContain("ℹ️  File 'vite.config.ts' is NOT required by this project");
        expect(output).toContain("ℹ️  File 'vitest.config.ts' is NOT required by this project");
    });

    it('exits when a file cannot be read for a reason other than being missing', async () => {
        await writeProject('dpuse-tool-example');
        await fs.mkdir('.editorconfig');

        await expect(checkConfigFiles()).rejects.toThrow('process.exit(1)');
        expect(console.error).toHaveBeenCalledWith('❌  Error checking configuration files', expect.any(Error));
    });
});

/* eslint-enable security/detect-non-literal-fs-filename -- Tests only name files inside their own temporary folder. */
