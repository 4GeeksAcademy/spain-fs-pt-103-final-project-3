from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    email         = db.Column(db.String(120), unique=True)
    avatar_url    = db.Column(db.String(255))
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)