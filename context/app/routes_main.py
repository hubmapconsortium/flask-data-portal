from os.path import dirname

from flask import (Blueprint, render_template, current_app,
                   session, request)

import frontmatter

from .utils import get_default_flask_data


blueprint = Blueprint('main', __name__, template_folder='templates')


@blueprint.route('/')
def index():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        flask_data=flask_data,
        title='HuBMAP Data Portal',
        is_home_page=True
    )


@blueprint.route('/services')
def service_status():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        flask_data=flask_data,
        title='Services'
    )


@blueprint.route('/ccf-eui')
def ccf_eui():
    return render_template(
        'pages/ccf-eui.html',
        config=current_app.config,
        url_root=request.url_root,
        nexus_token=(
            session['nexus_token']
            if 'nexus_token' in session
            else ''
        )
    )


@blueprint.route('/search')
@blueprint.route('/cells-search')
def search():
    entity_type = request.args.get('entity_type[0]')
    title = f'{entity_type}s' if entity_type else 'Search'
    flask_data = {
        **get_default_flask_data(),
        'title': title,
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        flask_data=flask_data,
    )


@blueprint.route('/dev-search')
def dev_search():
    title = 'Dev Search'
    flask_data = {
        **get_default_flask_data(),
        'title': title,
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        flask_data=flask_data
    )


@blueprint.route('/vis')
def vis():
    title = 'Visualizations'
    flask_data = {
        **get_default_flask_data(),
        'title': title
    }
    return render_template(
        'pages/base_react.html',
        title=title,
        flask_data=flask_data
    )


@blueprint.route('/preview/<name>')
def preview_view(name):
    filename = dirname(__file__) + '/preview/' + name + '.md'
    metadata_content = frontmatter.load(filename)
    preview_metadata = metadata_content.metadata
    markdown = metadata_content.content
    flask_data = {
        **get_default_flask_data(),
        'title': preview_metadata['title'],
        'markdown': markdown,
        'entity': {
            'group_name': preview_metadata['group_name'],
            'created_by_user_displayname': preview_metadata['created_by_user_displayname'],
            'created_by_user_email': preview_metadata['created_by_user_email'],
        },
        'vitessce_conf':
            ('vitessce_conf' in preview_metadata) and preview_metadata['vitessce_conf']
    }
    return render_template(
        'pages/base_react.html',
        title='Preview',
        flask_data=flask_data
    )


@blueprint.route('/collections')
def collections():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        title='Collections',
        flask_data=flask_data
    )


@blueprint.route('/my-lists')
def my_lists():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'pages/base_react.html',
        title='My Lists',
        flask_data=flask_data
    )


@blueprint.route('/my-lists/<saved_list_uuid>')
def list_page(saved_list_uuid):
    flask_data = {
        **get_default_flask_data(),
        'list_uuid': saved_list_uuid
    }
    return render_template(
        'pages/base_react.html',
        title='Saved List',
        flask_data=flask_data
    )
