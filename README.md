# Gitnotek

A note taking app that can store your notes in any git hosting service

[![E2E Tests](https://github.com/drishit96/gitnotek/actions/workflows/e2-tests.yml/badge.svg?branch=main)](https://github.com/drishit96/gitnotek/actions/workflows/e2-tests.yml)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have these installed before trying to run the project
1. Node.js version 12 or above
2. Git

### Installing

1. Run `npm install`
2. Run `npm start`

Open http://localhost:3000 to view the app in the browser.
The page will reload if you make edits. You will also see any lint errors in the console.

## Running the tests

We currently only have end to end tests written using cypress. This helps us to test the app in the same way a user would.
Run `npx cypress open` to open cypress UI and run tests.
If you want to run tests without UI, run `npx cypress run`

## Built With

* [React](https://reactjs.org/)
* [isomorphic-git](https://isomorphic-git.org/)
* [rich-markdown-editor](https://github.com/outline/rich-markdown-editor/)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Drishit Mitra** - *Initial work* - [drishit96](https://github.com/drishit96)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE) file for details
