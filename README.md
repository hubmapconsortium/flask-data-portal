# portal-ui
HuBMAP Data Portal:
This is a Flask app, using React on the front end and primarily Elasticsearch on the back end,
wrapped in a Docker container for deployment using Docker Compose.
It is deployed at [portal.hubmapconsortium.org](https://portal.hubmapconsortium.org/)

The Data Portal depends, directly or indirectly, on many other HuBMAP repos:

[![Repo diagram](https://docs.google.com/drawings/d/e/2PACX-1vQ1ISVanilVt3vewU6tekVirOxPpTsKMS3zXa8tL0J5JjdT9zS9adgXivm1ZcXxoyC_lctIlHVYhJuI/pub?w=922&amp;h=408)](https://docs.google.com/drawings/d/1q0IvliNTX0Xo9EzHTAoRZ2x1gatG_n0gOoLN7uVMJ4o/edit)

## Checkout

Because we're using git submodules, a couple additional steps are needed with checkout:
```
git clone https://github.com/hubmapconsortium/portal-ui.git
git submodule init
git submodule update
```

Git does not update submodules on pull by default...
but you can make it the default:
```
git config --global submodule.recurse true # Run this once...
git pull                                   # Now pulls submodules!
```

If you need to work on the code in a submodule, I would encourage you to do that
in a separate top-level checkout. You certainly can push changes from inside
a submodule, but it just gets more confusing.

## Local demo using Docker
To build and run:
```sh
./docker.sh 5001 --follow
```
You will need Globus keys to login to the demo. The base image is based on [this template](https://github.com/tiangolo/uwsgi-nginx-flask-docker#quick-start-for-bigger-projects-structured-as-a-python-package).

A [simple demonstration](compose/) of how the NGINX reverse proxy works in Docker Compose.

## Development
Please install both eslint and prettier plugins for your IDE of choice.

After checking out the project, cd-ing into it, and setting up a Python3.7 virtual environment,
- `npm install`
- `wget https://raw.githubusercontent.com/hubmapconsortium/prov-vis/master/src/schema.json -O node_modules/@hubmap/prov-vis/es/schema.json`
- (Note: Error with @hubmap-prov-vis dependency. Manually add
the schema.json until [this issue is resolved](https://github.com/hubmapconsortium/portal-ui/issues/139).)
- `./quick-start.sh`,
- update `app.conf` with the Globus client ID and client secret, and the Elasticsearch endpoint,
- `./dev-start.sh` to run the webpack dev and flask servers and visit [localhost:5001](http://localhost:5001).

### Development servers
The webpack dev server serves all files within the public directory and provides hot module replacement for the react application.
The webpack dev server proxies all requests outside of those for files in the public directory to the flask server.

### Webpack bundle inspection
To view visualizations of the production webpack bundle run `npm run build:analyze`.
The script will generate two files, report.html and stats.html, inside the public directory each showing a different visual representation of the bundle.

### React File Structure
- Components with tests or styles should be placed in to their own directory.
- Styles should be placed in `style.*` where the extension is js for styled components or css for stylesheets.
- Tests should be placed in `*.spec.js` where the prefix is the name of the component.
- Each component directory should have an `index.js` which exports the component as default.
- Components which share a common domain can be placed in a directory within components named after the domain.

### Changelog files
Every PR should be reviewed, and every PR should include a new `CHANGELOG-something.md`:
These are concatenated by push.sh.

## Testing
[`test.sh`](test.sh) wraps all the tests and is run on Travis.
Low-level unit tests are in python (`pytest -vv`),
while end-to-end tests use [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html) (`npm run cypress:open`).

## Tag, release, and deployment
To tag a new version for github and
[dockerhub](https://hub.docker.com/repository/docker/hubmap/portal-ui),
checkout a release branch, increment `VERSION`, commit, and run:
```sh
./push.sh
```

With a new `latest` Docker image, to redeploy either
`dev` or `test` use `./redeploy.sh`.
(PSC folks will need your ssh public key.)

## Related projects and dependencies

Javascript / React UI components:
- [`vitessce`](https://github.com/hubmapconsortium/vitessce): Visual integration tool for exploration of spatial single-cell experiments. Built on top of [deck.gl](https://deck.gl/).
- [`prov-vis`](https://github.com/hubmapconsortium/prov-vis): Wrapper for [`4dn-dcic/react-workflow-viz`](https://github.com/4dn-dcic/react-workflow-viz) provenance visualization.
- [`portal-search`](https://github.com/hubmapconsortium/portal-search/): A simple, opinionated wrapper for [Searchkit](http://www.searchkit.co/) offering facetted search.

Preprocessing:
- [`portal-containers`](https://github.com/hubmapconsortium/portal-containers): Docker containers for visualization preprocessing.
- [`airflow-dev`](https://github.com/hubmapconsortium/airflow-dev): CWL pipelines wrapping those Docker containers.
