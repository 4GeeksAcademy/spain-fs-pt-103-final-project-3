import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import OpenAI from "openai";





export const UserView = () => {

    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [guardados, setGuardados] = useState([]);
    const navigate = useNavigate();
    const client = new OpenAI({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const prompt = `
Genera 5 recetas usando solo estos ingredientes: ${ingredients}.
Para cada receta, incluye:
- El nombre de la receta ("recipe")
- Una URL de imagen representativa ("img") (puedes inventarla si no puedes generarla)
- Un array con el paso a paso ("steps")
Devuélvelo en un JSON con este formato:
[
  {
    "recipe": "Nombre de la receta",
    "img": "https://...",
    "steps": ["Paso 1", "Paso 2", ...]
  },
  ...
]
No agregues texto fuera del JSON.
`


    const handleClick = async () => {
        try {
            const response = await client.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "user", content: prompt }
                ]
            });

            console.log('Respuesta completa de la API:', response);

            setOutput(response.choices[0].message.content);
        } catch (error) {
            setOutput("Error: " + error.message);
        }
    };




    return (

        <div>
            <h1>Let's cook</h1>

            <form>
                <div>
                    <label htmlFor="">Indica tus ingredientes</label>
                    <input type="text" />
                    <button type="submit" onClick={handleClick}>
                        Buscar receta
                    </button>
                </div>
            </form>

            <div>
                <h2>Recetas encontradas</h2>
                <ul>
                    {recipes.map(() => (
                        <li>
                            <h3>{recipe.name}</h3>
                            <img src={recipe.photo} alt={recipe.name} />
                            <button><i class="fa-solid fa-heart" style="color: #ff2600;"></i></button>

                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
} 