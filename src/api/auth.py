import datetime
from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import User, db
from werkzeug.security import generate_password_hash, check_password_hash

ns = Namespace('auth', description='Autenticación de usuarios')

# Modelos para la documentación Swagger
user_model = ns.model('User', {
    'username':   fields.String(required=True, description='Nombre de usuario único'),
    'email':      fields.String(required=True, description='Correo electrónico'),
    'password':   fields.String(required=True, description='Contraseña en texto plano'),
    'avatar_url': fields.String(description='URL del avatar (opcional)'),
})

login_model = ns.model('Login', {
    'email':    fields.String(required=True, description='Correo electrónico'),
    'password': fields.String(required=True, description='Contraseña en texto plano'),
})

token_model = ns.model('Token', {
    'access_token': fields.String(description='JWT para autenticación'),
})

profile_model = ns.model('Profile', {
    'id':         fields.Integer,
    'username':   fields.String,
    'email':      fields.String,
    'avatar_url': fields.String,
    'created_at': fields.DateTime,
})


@ns.route('/register')
class Register(Resource):
    @ns.expect(user_model, validate=True)
    @ns.response(201, 'Usuario creado', token_model)
    @ns.response(400, 'Faltan datos')
    @ns.response(409, 'Usuario ya existe')
    def post(self):
        """Registra un nuevo usuario y devuelve un JWT"""
        data = request.json or {}
        # Validaciones básicas
        if not data.get('username') or not data.get('email') or not data.get('password'):
            ns.abort(400, 'Faltan datos obligatorios')

        # ¿Existe el email o el username?
        if User.query.filter_by(email=data['email']).first():
            ns.abort(409, 'Ya existe un usuario con ese correo')
        if User.query.filter_by(username=data['username']).first():
            ns.abort(409, 'Ya existe un usuario con ese nombre de usuario')

        # Creamos el usuario
        user = User(
            username=data['username'],
            email=data['email'],
            avatar_url=data.get('avatar_url')
        )
        # Hasheamos la contraseña
        user.password_hash = generate_password_hash(data['password'])
        user.created_at = datetime.datetime.utcnow()

        db.session.add(user)
        db.session.commit()

        # Generamos token
        token = create_access_token(identity=user.email)
        return {'access_token': token}, 201


@ns.route('/login')
class Login(Resource):
    @ns.expect(login_model, validate=True)
    @ns.response(200, 'Login exitoso', token_model)
    @ns.response(401, 'Credenciales inválidas')
    def post(self):
        """Valida credenciales y devuelve un JWT"""
        data = request.json or {}
        user = User.query.filter_by(email=data.get('email')).first()
        if not user or not check_password_hash(user.password_hash, data.get('password', '')):
            ns.abort(401, 'Email o contraseña incorrectos')

        token = create_access_token(identity=user.email)
        return {'access_token': token}, 200


@ns.route('/me')
class Me(Resource):
    @ns.response(200, 'Perfil obtenido', profile_model)
    @ns.response(401, 'Token inválido o expirado')
    @jwt_required()
    def get(self):
        """Devuelve la información del usuario autenticado"""
        current_email = get_jwt_identity()
        user = User.query.filter_by(email=current_email).first()
        if not user:
            ns.abort(401, 'Usuario no encontrado')
        return {
            'id':         user.id,
            'username':   user.username,
            'email':      user.email,
            'avatar_url': user.avatar_url,
            'created_at': user.created_at.isoformat()
        }, 200
