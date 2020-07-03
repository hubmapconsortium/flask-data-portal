from flask import Flask, session, render_template

from . import routes_main, routes_auth, routes_markdown, default_config


def bad_request(e):
    '''A 400 means the request to the API failed.'''
    return render_template('errors/400.html', types={}), 400


def not_found(e):
    '''A 404 means Flask routing failed.'''
    return render_template('errors/404.html', types={}), 404


def unauthorized(e):
    '''A 401 probably means Globus credentials have expired.'''
    # Go ahead and clear the flask session for the user.
    # Without this, the button still says "Logout", as if they were still logged in.
    # We check group membership on login, which is a distinct 401,
    # with its own template.
    session.clear()
    return render_template('errors/401-expired.html', types={}), 401


def gateway_timeout(e):
    '''A 504 means the API has timed out.'''
    return render_template('errors/504.html', types={}), 504


def create_app(testing=False):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(default_config.DefaultConfig)
    if testing:
        app.config['TESTING'] = True
    else:
        # We should not load the gitignored app.conf during tests.
        app.config.from_pyfile('app.conf')

    app.register_blueprint(routes_main.blueprint)
    app.register_blueprint(routes_auth.blueprint)
    app.register_blueprint(routes_markdown.blueprint)

    app.register_error_handler(400, bad_request)
    app.register_error_handler(401, unauthorized)
    app.register_error_handler(404, not_found)
    app.register_error_handler(504, gateway_timeout)

    @app.context_processor
    def inject_template_globals():
        return {
            'is_authenticated': session.get('is_authenticated')
        }

    @app.before_request
    def set_default_nexus_token():
        if 'nexus_token' not in session:
            session.update(
                nexus_token='',
                is_authenticated=False)

    return app


app = create_app()
