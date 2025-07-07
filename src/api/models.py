from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, ForeignKey, Integer

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)

    # Relación uno-a-muchos con Recipes
    recipes: Mapped[list["Recipes"]] = relationship(back_populates="user")


class Recipes(db.Model):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True)
    ingredients: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    instructions: Mapped[str] = mapped_column(String, nullable=False)
    cook_time: Mapped[int] = mapped_column(nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="recipes")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "instructions" : self.instructions,
            "cook_time" : self.cook_time
        }