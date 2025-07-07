# import os
# from flask import Flask, send_from_directory
# from flask_migrate import Migrate
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# from api.models import db
# # from api.auth import ns as auth_ns
# # from flask_restx import Api

# # Inicializa Flask
# app = Flask(__name__, static_folder='../front/dist', static_url_path='/')
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
#     'DATABASE_URL', 'sqlite:////tmp/test.db'
# ).replace('postgres://', 'postgresql://')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['JWT_SECRET_KEY'] = os.getenv('FLASK_APP_KEY', 'super-secret')

# # Extensiones
# db.init_app(app)
# Migrate(app, db)
# CORS(app, supports_credentials=True)
# JWTManager(app)

# # # API RESTX
# # api = Api(app, version='1.0', title='Mi API', doc='/api/docs')
# # api.add_namespace(auth_ns, path='/api/auth')

# # Rutas estáticas y SPA
# @app.route('/')
# def index():
#     return send_from_directory(app.static_folder, 'index.html')

# @app.route('/<path:path>')
# def static_proxy(path):
#     return send_from_directory(app.static_folder, path)

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=int(os.getenv('PORT', 3001)), debug=True)
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager



# Configura la extensión Flask-JWT-Extended


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "super-secret"  # ¡Cambia las palabras "super-secret" por otra cosa!
jwt = JWTManager(app)


# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))