import React from "react";
import "./recipe.css";

export const Recipe = () => {
    return (
        <div className="container-recipe">
            <h1 className="title-recipe">Recipe name</h1>
            <div className="recipe-content-idea">
                <div className="recipe-details">
                    <img
                        className="recipe-imagen"
                        src="https://editorialtelevisa.brightspotcdn.com/58/eb/b537a4714c11890dfba66649ee13/flautas-transformed.jpeg"
                        alt="img-recipe"
                    />
                    <div className="recipe-information">
                        <p>⏱️ 30 min</p>
                        <p>🔥 Fácil</p>
                    </div>
                </div>
                <div className="recipe-steps">
                    <h3>Empecemos a crear</h3>
                    <ol className="recipe-li">
                        <li>step1..</li>
                        <li>step2..</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};