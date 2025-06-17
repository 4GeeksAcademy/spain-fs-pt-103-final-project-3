from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)
CORS(api)

bcrypt = Bcrypt()  

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y contraseña requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario ya existe"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(email=email, password=hashed_password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity=user.email)
    return jsonify(access_token=access_token), 200


SPOONACULAR_API_KEY = "2eb6935b9d2748ff93eaf15a59470a6f"
SPOONACULAR_ENDPOINT = "https://api.spoonacular.com/food/ingredients/search"

@api.route("/ingredients", methods=["GET"])
def get_ingredients():
    ingredients_raw = request.args.get("ingredients") 
    if not ingredients_raw:
        return jsonify({"msg": "Faltan ingredientes"}), 400

    ingredients_list = ingredients_raw.split(",")

    # Spoonacular solo admite búsquedas de un ingrediente a la vez, toca que añadamos los ingredientes uno a uno.
    matched_ingredients = []

    for ing in ingredients_list:
        response = requests.get(SPOONACULAR_ENDPOINT, params={
            "query": ing.strip(),
            "number": 5,
            "apiKey": SPOONACULAR_API_KEY
        })

        if response.status_code == 200:
            data = response.json()
            matched_ingredients.extend(data)
        else:
            matched_ingredients.append({"name": ing.strip(), "error": "No encontrado en API"})

    return jsonify(matched_ingredients), 200



@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    return jsonify({"msg": f"Hola usuario con ID {user_id}"}), 200
