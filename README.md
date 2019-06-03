﻿# The iModel.js Library

Copyright © 2019 Bentley Systems, Incorporated. All rights reserved.

The [iModel.js](http://imodeljs.org) library is an open source platform for creating, querying, modifying, and displaying iModels.

If you have questions, or wish to contribute to iModel.js, see our [Contributing guide](./CONTRIBUTING.md).

## About this Repository

[![Build status](https://dev.azure.com/imodeljs/imodeljs/_apis/build/status/iModel.js)](https://dev.azure.com/imodeljs/imodeljs/_build/latest?definitionId=1)

This repository is a [monorepo](https://en.wikipedia.org/wiki/Monorepo) that holds the source code to several iModel.js npm packages. It is built using [Rush](http://rushjs.io/).

See [rush.json](./rush.json) for the list of packages:

| Directory | npm package
| ---- | ---
| `core/backend` | `@bentley/imodeljs-backend`
| `core/bentley` | `@bentley/bentleyjs-core`
| `core/clients` | `@bentley/imodeljs-clients`
| `core/common` | `@bentley/imodeljs-common`
| `core/frontend` | `@bentley/imodeljs-frontend`
| `core/geometry` | `@bentley/geometry-core`
| `core/i18n` | `@bentley/imodeljs-i18n`
| `core/markup` | `@bentley/imodeljs-markup`
| `core/quantity` | `@bentley/imodeljs-quantity`
| `presentation/backend` | `@bentley/presentation-backend`
| `presentation/common` | `@bentley/presentation-common`
| `presentation/components` | `@bentley/presentation-components`
| `presentation/frontend` | `@bentley/presentation-frontend`
| `ui/components` | `@bentley/ui-components`
| `ui/core` | `@bentley/ui-core`
| `ui/framework` | `@bentley/ui-framework`
| `ui/ninezone` | `@bentley/ui-ninezone`

Each package creates its own **node_modules** directory that contains symbolic links to *common* dependencies managed by Rush.

## Prerequisites

* [Git](https://git-scm.com/)
* [Node](https://nodejs.org/en/): an installation of the latest security patch of Node 10. The Node installation also includes the **npm** package manager.
* [Rush](https://github.com/Microsoft/web-build-tools/wiki/Rush): to install `npm install -g @microsoft/rush`
* [TypeScript](https://www.typescriptlang.org/): this is listed as a devDependency, so if you're building it from source, you will get it with `rush install`.
* [Visual Studio Code](https://code.visualstudio.com/): an optional dependency, but the repository structure is optimized for its use

### Linux

The imodeljs-backend requires:

* GLIBC 2.24 (or newer)
* GLIBCXX 3.4.22 (or newer)

The imodeljs-backend is built and primarily tested on Debian 9 (stretch). Most current distributions also deliver these pre-reqs, or newer, such as Fedora 29, Slackware 14.2, OpenSUSE 15, and Ubuntu 18.04.

## Build Instructions

1. Clone repository (first time) with `git clone` or pull updates to the repository (subsequent times) with `git pull`
2. Install dependencies: `rush install`
3. Clean: `rush clean`
4. Rebuild source: `rush rebuild`
5. Run tests:
    * All tests: `rush test`
    * Core tests: `npm test -s`
    * UI tests: `npm run test:ui -s`
    * Presentation tests: `npm run test:presentation -s`

The `-s` option for `npm` is short for `--silent` which results in a less verbose command.
That part of the command is optional depending on the desired verbosity level.

Note that all build instructions are designed to run from the imodeljs-core root directory.
The above commands iterate and perform their action against each package in the monorepo.

For incremental builds, the `rush build` command can be used to only build packages that have changes versus `rush rebuild` which always rebuilds all packages.

Note that it is a good idea to `rush install` after each `git pull` as dependencies may have changed.

## Source Code Edit Workflow

1. Make source code changes on a new Git branch
2. Ensure unit tests pass when run locally: `rush test`
3. Locally commit changes: `git commit` (or use the Visual Studio Code user interface)
4. Repeat steps 1-3 until ready to push changes
5. Add changelog entry (which could potentially cover several commits): `rush change`
6. Follow prompts to enter a change description or press ENTER if the change does not warrant a changelog entry. If multiple packages have changed, multiple sets of prompts will be presented. If the changes are only to non-published packages (like **display-test-app**), then `rush change` will indicate that a changelog entry is not needed.
7. Completing the `rush change` prompts will cause new changelog entry JSON files to be created.
8. Check for API signature changes: `rush extract-api`.  This will update the signature files, located in `common/api`.
9. Review any diffs to the API signature files in the `common/api` directory to ensure they are compatible with the intended release of the package
10. Commit the changelog JSON files and any API signature updates.
11. Publish changes on the branch and open a pull request.

If using the command line, steps 5 through 7 above can be completed in one step by running `rushchange.bat` from the imodeljs-core root directory.
> Note: The CI build will break if changes are pushed without running `rush change` and `rush extract-api` (if the API was changed). The fix will be to complete steps 5 through 10.

Here is a sample [changelog](https://github.com/Microsoft/web-build-tools/blob/master/apps/rush/CHANGELOG.md) to demonstrate the level of detail expected.

## Updating dependencies/devDependencies on packages within the monorepo

The version numbers of internal dependencies should not be manually edited.
These will be automatically updated by the overall *version bump* workflow.
Note that the packages are published by CI builds only.

## Updating dependencies/devDependencies on packages external to monorepo

Use these instructions to update dependencies and devDependencies on external packages (ones that live outside of this monorepo).

1. Edit the appropriate `package.json` file to update the semantic version range
2. Run `rush check` to make sure that you are specifying consistent versions across the repository
3. Run `rush update` to make sure the newer version of the module specified in #1 is installed

## Other NPM Scripts

1. Build TypeDoc documentation for all packages: `rush docs`
2. Build TypeDoc documentation for a single package: `cd core\backend` and then `npm run docs`

The full list of npm scripts can be found in the root `package.json` file.
