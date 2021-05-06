from flask import (Blueprint, render_template, current_app, request)

from hubmap_api_py_client import Client


blueprint = Blueprint('routes_cells', __name__, template_folder='templates')


@blueprint.route('/cells')
def cells_ui():
    return render_template(
        'pages/base_react.html',
        title='Cells API Demo',
        flask_data={}
    )


@blueprint.route('/cells/datasets-selected-by-gene.json', methods=['POST'])
def datasets_selected_by_gene():
    # Refine what it means for a dataset to match a cells query:
    # It’s probably not useful to include a dataset if only a single cell highly expresses the gene in question.
    # Besides a gene, and an expression level, probably want to say the percent of the total cells in the assay that match.

    gene_name = request.args.get('gene_name')
    min_gene_expression = request.args.get('min_gene_expression')
    min_cell_percentage = request.args.get('min_cell_percentage')

    client = Client(current_app.config['CELLS_API_ENDPOINT'])

    # WARNING: This does not work with the current version of the client.
    dataset_set = client.select_datasets(
        where='gene',
        has=[f'{gene_name} > {min_gene_expression}'],
        min_cell_percentage=min_cell_percentage,
        genomic_modality='rna'
    )
    return list(dataset_set.get_list())


@blueprint.route('/cells/cell-counts-for-datasets.json', methods=['POST'])
def cell_counts_for_datasets():
    # Select a set of datasets where cells express a given gene, and for each dataset, give the number of matching cells, and the total number of cells.

    uuids = request.args.getlist('uuid')
    gene_name = request.args.get('gene_name')
    min_gene_expression = request.args.get('min_gene_expression')

    client = Client(current_app.config['CELLS_API_ENDPOINT'])

    cell_set = client.select_cells(
        where='gene',
        has=[f'{gene_name} > {min_gene_expression}'],
        genomic_modality='rna'
    )

    response = {}
    for uuid in uuids:
        dataset_cells = client.select_cells(where='dataset', has=[uuid])
        response[uuid] = {
            'cells_expressing_gene': len(dataset_cells & gene_cells),
            'total_cells': len(dataset_cells)
        }

    return response


@blueprint.route('/cells/cell-expression-in-dataset.json', methods=['POST'])
def cell_expression_in_dataset():
    # For a single dataset we want to get the expression level of a given gene for all cells.
    # (In our discussion, we started by thinking about the set of matching cells, and then showing expression levels for the two groups, but that’s not needed.)

    uuid = request.args.get('uuid')
    gene_names = request.args.getlist('gene_names')

    client = Client(current_app.config['CELLS_API_ENDPOINT'])

    cells = client.select_cells(where='dataset', has=[uuid])
    # list() will call iterator behind the scenes.
    return list(cells.get_list(values_included=gene_names))
