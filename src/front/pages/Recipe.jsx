import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./recipe.css";
import { li } from "framer-motion/client";

export const Recipe = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const recipe = location.state.recipe;

    return (
        <div className="container-recipe">
            <h1 className="title-recipe">{recipe.name}</h1>
            <div className="recipe-content-idea">
                <div className="recipe-details">
                    <img
                        className="recipe-imagen"
                        src={recipe.img}
                        alt={recipe.name}
                    />
                    <div className="recipe-information">
                        <p>⏱️ {recipe.time}</p>
                        <p>🔥 {recipe.dificult}</p>
                    </div>
                </div>
                <div className="recipe-steps">
                    <h3 className="ms-4">Empecemos a crear</h3>
                    <ol className="recipe-li">
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
                <div>
                    <button className="return-user" onClick={() => navigate(-1)}>Go back!</button>
                </div>
            </div>
        </div>
    );
};