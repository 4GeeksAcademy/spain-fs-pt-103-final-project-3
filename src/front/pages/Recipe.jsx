import React, { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"



export const Recipe = () =>{

    const location = useLocation();
    const {id} = useParams();
    const navigate = useNavigate

    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState(location.state.recipe || null);




    return (
         <div>
            <h1>{recipe.name}</h1>
            <div>
                {recipe.img} && (
                    <img src="recipe.img" alt="recipe.name" />
                )
                <div>
                    <p>{recipe.time}</p>
                    <p>{recipe.dificult}</p>
                </div>
                <div>
                    <h3>Empezemos a crear</h3>
                    <ol>
                        {recipe.steps.map((step, index) =>
                        <li key={index}>
                            <strong>Paso {index + 1}:</strong>{step}
                        </li>
                    )}
                    </ol>
                </div>
            </div>
         </div>
    )
}