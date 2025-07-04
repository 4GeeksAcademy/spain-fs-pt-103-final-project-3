from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from sqlalchemy import select
from .models import Recipes
import json 

api = Blueprint('api', __name__)
CORS(api)

bcrypt = Bcrypt()  

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200


@api.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    user_email = get_jwt_identity()
    user = db.session.execute(select(User).where(User.email == user_email)).scalar_one_or_none()

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email
    }), 200


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

@api.route("/password", methods=["PUT"])
@jwt_required()
def change_password():
    data = request.get_json() 
    new_password = data.get("new_password")

    if not new_password:
        return jsonify({"msg": "La nueva contraseña es obligatoria"}), 400


    user_email = get_jwt_identity()
    user = db.session.execute(select(User).where(User.email == user_email)).scalar_one_or_none()


    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.password = bcrypt.generate_password_hash(new_password).decode("utf-8")

    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada correctamente"}), 200



@api.route("/recipes", methods=["POST"])
@jwt_required()
def save_recipe():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email = user_email).first()
    data = request.get_json()
    name = data.get("name")
    ingredients = data.get("ingredients")
    instructions = data.get("instructions")
    cook_time = data.get("cook_time")
  


    if not all([name, ingredients, instructions]):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    if isinstance(ingredients, list):
        ingredients = json.dumps(ingredients)

    new_recipe = Recipes(
        name=name,
        ingredients=ingredients,
        instructions=instructions,
        cook_time=cook_time,
        user_id = user.id
    )

    db.session.add(new_recipe)
    db.session.commit()

    return jsonify({
    "msg": "Receta guardada",
    "recipe_id": new_recipe.id}), 201




@api.route("/recipes/saved", methods=["GET"])
@jwt_required()
def get_saved_recipes():
    user_email = get_jwt_identity()
    get_user = select(User).where(User.email==user_email)
    user = db.session.execute(get_user).scalars().one_or_none()

    if user is None:
        return jsonify({"err":"no existe el usuario"})
    

    get_recipe = select(Recipes).where(Recipes.user_id == user.id)
    result = db.session.execute(get_recipe).scalars().all()

    recipes = list(map(lambda recipe:recipe.serialize(),result))




    return jsonify(recipes), 200



@api.route("/recipes/saved/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_saved_recipe(id):
    user_email = get_jwt_identity()
    get_user = select(User).where(User.email==user_email)
    user = db.session.execute(get_user).scalars().one_or_none()

    if user is None:
        return jsonify({"err":"no existe el usuario"})
    

    kill_recipe = select(Recipes).where(Recipes.id == id, Recipes.user_id == user.id)
    recipe = db.session.execute(kill_recipe).scalar_one_or_none()

    if not recipe:
        return jsonify({"msg": "Receta no encontrada"}), 404

    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"msg": "Receta eliminada"}), 200




