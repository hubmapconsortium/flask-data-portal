# portal-ui
HuBMAP Data Portal:
This is a Flask app, using React on the front end and primarily Elasticsearch on the back end,
wrapped in a Docker container for deployment using Docker Compose. The front end depends on AWS S3 and CloudFront for the hosting and delivery of images.
It is deployed at [portal.hubmapconsortium.org](https://portal.hubmapconsortium.org/)

The Data Portal depends on many [APIs](https://portal.hubmapconsortium.org/services),
and directly or indirectly, on many other HuBMAP repos.

```mermaid
graph LR
    gateway
    click gateway href "https://github.com/hubmapconsortium/gateway"

    top[portal-ui] --> commons
    click top href "https://github.com/hubmapconsortium/portal-ui"
    click commons href "https://github.com/hubmapconsortium/commons"
    top --> ccf-ui
    click ccf-ui href "https://github.com/hubmapconsortium/ccf-ui"
    top --> vitessce --> viv
    click vitessce href "https://github.com/vitessce/vitessce"
    click viv href "https://github.com/hms-dbmi/viv"
    top --> portal-visualization --> vitessce-python
    click portal-visualization href "https://github.com/hubmapconsortium/portal-visualization"
    click vitessce-python href "https://github.com/vitessce/vitessce-python"
    top --> valid[ingest-validation-tools]
    click valid href "https://github.com/hubmapconsortium/ingest-validation-tools"
    top --> cells-sdk --> cells-api --> pipe
    click cells-sdk href "https://github.com/hubmapconsortium/cells-api-py-client"
    click cells-api href "https://github.com/hubmapconsortium/cross_modality_query"
    top --> gateway
    gateway --> entity-api --> pipe[ingest-pipeline]
    click entity-api href "https://github.com/hubmapconsortium/entity-api"
    click pipe href "https://github.com/hubmapconsortium/ingest-pipeline"
    gateway --> assets-api --> pipe
    %% assets-api is just a file server: There is no repo.
    gateway --> search-api --> pipe
    click search-api href "https://github.com/hubmapconsortium/search-api"
    gateway --> workspaces-api
    click workspaces-api href "https://github.com/hubmapconsortium/user_workspaces_server"

    pipe --> valid
    pipe --> portal-containers
    click portal-containers href "https://github.com/hubmapconsortium/portal-containers/"

    subgraph APIs
        entity-api
        search-api
        cells-api
        assets-api
        workspaces-api
    end

    subgraph Git Submodules
        valid
    end

    subgraph Python Packages
        commons
        portal-visualization
        vitessce-python
        cells-sdk
    end

    subgraph NPM Packages
        vitessce
        viv
    end

    subgraph cdn.jsdelivr.net
        ccf-ui
    end

    subgraph legend
        owner
        contributor
        not-harvard
    end

    classDef contrib fill:#ddffdd,stroke:#88AA88,color:#000;
    class owner,contributor,top,vitessce,viv,portal-visualization,vitessce-python,cells-sdk,portal-containers,valid,search-api contrib

    classDef owner stroke-width:3px,font-style:italic,color:#000;
    class owner,top,vitessce,viv,portal-visualization,vitessce-python,portal-containers owner

    style legend fill:#f8f8f8,stroke:#888888;
```

## Feedback

Issues with the Portal can be reported [via email](mailto:help@hubmapconsortium.org).
More information on how issues are tracked across HuBMAP is available
[here](https://software.docs.hubmapconsortium.org/feedback).

## Design

We try to have a design ready before we start coding.
Often, issues are filed in pairs, tagged [`design`](https://github.com/hubmapconsortium/portal-ui/issues?q=is%3Aissue+is%3Aopen+label%3Adesign)
and [`enhancement`](https://github.com/hubmapconsortium/portal-ui/labels/enhancement).
All designs are in [Figma](https://www.figma.com/files/team/834568130405102661/HuBMAP).
(Note that if that link redirects to `/files/recent`, you'll need to be added to the project, preferably with a `.edu` email, if you want write access.)

## Development

### Prerequisites
- `git`: Suggest [installing Apple XCode](https://developer.apple.com/xcode/).
- `python 3.9`
    - MiniConda:
        -  [installing miniconda](https://docs.conda.io/en/latest/miniconda.html#macosx-installers) and [creating a new conda environment](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-with-commands): `conda create -n portal python=$(cat .python-version)`
    - pyenv:
        - ```brew install pyenv```
        - ```brew install pyenv-virtualenv```
        - ```pyenv install `cat .python-version` ```
        - ```pyenv virtualenv `cat .python-version` portal```
        - ```pyenv activate portal```
    
- `nodejs/npm`: Suggest [installing nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and then using it to install the appropriate node version: `nvm install`.
  - ```nvm install `cat .nvmrc` ```
  - ```nvm use `cat .nvmrc` ```

Optional:
- `VSCode`, with `eslint` and `prettier` plugins
- `docker`

### Development

After checking out the project, cd-ing into it, and setting up a Python 3.9 virtual environment,
- Get `app.conf` from [Confluence](https://hms-dbmi.atlassian.net/wiki/spaces/GL/pages/3045457929/app.conf) or from another developer and place it at `context/instance/app.conf`.
- Run `etc/dev/dev-start.sh` to start the webpack dev and flask servers and then visit [localhost:5001](http://localhost:5001).

You will see an warning about `Cannot find source file '../src/index.ts'`, but just ignore it; [Issue filed](https://github.com/hubmapconsortium/portal-ui/issues/1489).

The webpack dev server serves all files within the public directory and provides hot module replacement for the react application;
The webpack dev server proxies all requests outside of those for files in the public directory to the flask server.

Note: Searchkit, our interface to Elasticsearch, has changed significantly in the lastest release. Documentation for version 2.0 can be found [here](https://github.com/searchkit/searchkit/tree/6f3786657c8afa6990a41acb9f2371c28b2e0986/packages/searchkit-docs).

### Changelog files
Every PR should be reviewed, and every PR should include a new `CHANGELOG-something.md` at the root of the repository. These are concatenated by `etc/build/push.sh`.

### File and directory structure conventions

<details><summary>:atom_symbol: React</summary>

> **Note**  
> **Any mentions of `.js`/`.jsx` in the following guidelines are interchangeable with `.ts`/`.tsx`. New features should ideally be developed in TypeScript.**

- Components with tests or styles should be placed in to their own directory.
- Styles should follow the `style.*` pattern where the extension is `js` for styled components or `css` for stylesheets.
  - New styled components should use `styled` from `@mui/styles`.
- Tests should follow the `*.spec.js` pattern...
- and stories should follow the `*.stories.js` pattern. For both, the prefix is the name of the component.
- Each component directory should have an `index.js` which exports the component as default.
- Components which share a common domain can be placed in a directory within components named after the domain.

</details>

<details><summary>For images</summary>

Images should displayed using the `source srcset` attribute. You should prepare four versions of the image starting at its original size and at 75%, 50% and 25% the original image's size preserving its aspect ratio. If available, you should also provide a 2x resolution for higher density screens. For example, to resize images using Mac's Preview you can visit the 'Tools' menu and select 'Adjust Size', from there you can change the image's width while making sure 'Scale Proportionally' and 'Resample Image' are checked. Once ready, each version of the image should be processed with an image optimizer such as ImgOptim.

Finally after processing, the images should be added to the S3 bucket, `portal-ui-images-s3-origin`,
to be delivered by the cloudfront CDN.
SVG files larger than 5KB should also be stored in S3 and delivered by the CDN.
SVG files smaller than 5KB can be included in the repository in `context/app/static/assets/svg/`.
The CDN responds with a `cache-control: max-age=1555200` header for all items,
but can be overridden on a per image basis by setting the `cache-control` header for the object in S3.

For the homepage carousel, images should have a 16:9 aspect ratio, a width of at least 1400px, a title, a description, and, if desired, a url to be used for the 'Get Started' button.

</details>

## Testing
Python unit tests use Pytest, front end tests use Jest, an end-to-end tests use Cypress.
Each suite is run separately on Gihub CI.

Load tests [are available](end-to-end/artillery/), but they are not run as part of CI.

### Linting and pre-commit hooks
CI lints the codebase, and to save time, we also lint in a pre-commit hook.
If you want to bypass the hook, set `HUSKY_SKIP_HOOKS=1`.

You can also lint and auto-correct from the command-line:
```
npm run lint
npm run lint:fix
```

### Storybook
To start storybook locally you can either run `etc/dev/dev-start.sh`, or just `npm run storybook`,
and after it has started, visit [localhost:6006](http://localhost:6006).

## Build, tag, and deploy
The build, tag, deploy, and QA procedures are [detailed here](https://hms-dbmi.atlassian.net/wiki/spaces/GL/pages/3009282049/Deployment).

### Understanding the build

<details><summary>Webpack</summary>

To view visualizations of the production webpack bundle run `npm run build:analyze`.
The script will generate two files, report.html and stats.html, inside the public directory each showing a different visual representation of the bundle.

</details>

<details><summary>Docker</summary>

To build and run the docker image locally:
```sh
etc/dev/docker.sh 5001 --follow
```
Our base image is based on [this template](https://github.com/tiangolo/uwsgi-nginx-flask-docker#quick-start-for-bigger-projects-structured-as-a-python-package).

</details>

<details><summary>Docker Compose</summary>

In the deployments, our container is behind a NGINX reverse reproxy;
Here's a [simple demonstration](compose/) of how that works.

</details>

## Related projects and dependencies

### Search and Metadata

The metadata that we have for each dataset ultimately comes from the data providers,
but the fields they supply are determined by the schemas in [`ingest-validation-tools`](https://github.com/hubmapconsortium/ingest-validation-tools#readme).
That repo is also included as a submodule here, and human-readable field descriptions are pulled from it.

The portal team contributes code to a [subdirectory within `search-api`](https://github.com/hubmapconsortium/search-api/tree/main/src/elasticsearch/addl_index_transformations)
to clean up the raw Neo4J export and provide us with clean, usable facets.
Within that directory, [`config.yaml`](https://github.com/hubmapconsortium/search-api/blob/test-release/src/elasticsearch/addl_index_transformations/portal/config.yaml) configures the Elasticsearch index itself.

### Visualization

Data visualization is an integral part of the portal, allowing users to view the results of analysis pipelines or raw uploaded data easily directly in the browser.  How such data is processed and prepared for visualization in the client-side Javascript via [`vitessce`](https://github.com/hubmapconsortium/vitessce) can be found [here](https://github.com/hubmapconsortium/portal-visualization#readme).

General-purpose tools:
- [`viv`](https://github.com/hms-dbmi/viv): JavaScript library for rendering OME-TIFF and OME-NGFF (Zarr) directly in the browser. Packaged as [deck.gl](https://deck.gl/) layers.
- [`vitessce`](https://github.com/hubmapconsortium/vitessce): Visual integration tool for exploration of spatial single-cell experiments. Built on top of [deck.gl](https://deck.gl/).
- [`vitessce-python`](https://github.com/vitessce/vitessce-python): Python wrapper classes which make it easier to build configurations.

Particular to HuBMAP:
- [`portal-visualization`](https://github.com/hubmapconsortium/portal-visualization): Given HuBMAP Dataset JSON, creates a Vitessce configuration.
- [`portal-containers`](https://github.com/hubmapconsortium/portal-containers): Docker containers for visualization preprocessing.
- [`airflow-dev`](https://github.com/hubmapconsortium/airflow-dev): CWL pipelines wrapping those Docker containers.
