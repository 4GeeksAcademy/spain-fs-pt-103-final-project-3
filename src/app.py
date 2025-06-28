import os
from flask import Flask, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.models import db
from api.auth import ns as auth_ns
from flask_restx import Api

# Inicializa Flask
app = Flask(__name__, static_folder='../front/dist', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 'sqlite:////tmp/test.db'
).replace('postgres://', 'postgresql://')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('FLASK_APP_KEY', 'super-secret')

# Extensiones
db.init_app(app)
Migrate(app, db)
CORS(app, supports_credentials=True)
JWTManager(app)

# API RESTX
api = Api(app, version='1.0', title='Mi API', doc='/api/docs')
api.add_namespace(auth_ns, path='/api/auth')

# Rutas estáticas y SPA
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 3001)), debug=True)
