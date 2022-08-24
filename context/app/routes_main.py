from flask import (render_template, current_app, abort,
                   session, request)

from .utils import get_default_flask_data, make_blueprint, get_organs


blueprint = make_blueprint(__name__)


@blueprint.route('/')
def index():
    organs = get_organs()
    flask_data = {**get_default_flask_data(), 'organs': organs}
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title='HuBMAP Data Portal',
        is_home_page=True
    )


@blueprint.route('/services')
def service_status():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        flask_data=flask_data,
        title='Services'
    )


@blueprint.route('/ccf-eui')
def ccf_eui():
    return render_template(
        'special-pages/ccf-eui.html',
        config=current_app.config,
        url_root=request.url_root,
        groups_token=(
            session['groups_token']
            if 'groups_token' in session
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
        'base-pages/react-content.html',
        title=title,
        flask_data=flask_data,
    )


@blueprint.route('/test-search/<type>')
def test_search(type):
    if type not in ['donors', 'samples', 'datasets']:
        abort(404)
    title = f'{type.capitalize()} Test Search'
    flask_data = {
        **get_default_flask_data(),
        'title': title,
    }
    return render_template(
        'base-pages/react-content.html',
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
        'base-pages/react-content.html',
        title=title,
        flask_data=flask_data
    )


@blueprint.route('/diversity')
def vis():
    title = 'Donor Diversity'
    flask_data = {
        **get_default_flask_data(),
        'title': title
    }
    return render_template(
        'base-pages/react-content.html',
        title=title,
        flask_data=flask_data
    )


@blueprint.route('/collections')
def collections():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
        title='Collections',
        flask_data=flask_data
    )


@blueprint.route('/my-lists')
def my_lists():
    flask_data = {**get_default_flask_data()}
    return render_template(
        'base-pages/react-content.html',
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
        'base-pages/react-content.html',
        title='Saved List',
        flask_data=flask_data
    )


@blueprint.route('/iframe/<path:path>')
def iframe_page(path):
    flask_data = {
        **get_default_flask_data()
    }
    return render_template(
        'special-pages/organ.html' if path == 'organ' else 'base-pages/react-content.html',
        title=f'{path} iframe',
        flask_data=flask_data
    )
