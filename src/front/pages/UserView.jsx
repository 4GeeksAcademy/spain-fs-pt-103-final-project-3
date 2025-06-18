import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import OpenAI from "openai";





export const UserView = () => {

    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [guardados, setGuardados] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
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
    "name": "Nombre de la receta",
    "img": "https://...",
    "steps": ["Paso 1", "Paso 2", ...]
  },
    ...
]
No agregues texto fuera del JSON.
`


    const handleSubmit = async (e) => {

        e.preventDefault();
        setRecipes([]);
        setLoading(true);
        setError('');



        try {
            const response = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "user", content: prompt }
                ]
            });

            console.log('Respuesta completa de la API:', response);
            const content = response.choices[0].message.content;
            console.log('Contenido de la respuesta:', content)

            try {
                const recipesJson = JSON.parse(content);
                setRecipes(recipesJson);
            }
            catch (parseError) {
                console.error('Error al parsear el JSON;', parseError);
                setError('No se pudo lograr la respuesta, prueba de nuevo...');
            }

        }
        catch (error) {
            console.error('Error de la API:', error);
            setError('Error:' + error.message);
        }
        finally {
            setLoading(false);
        }
    }




        return (

            <div>
                <h1>Let's cook</h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Write your ingredients</label>
                        <input
                            type="text"
                            value={ingredients}
                            onChange={e => setIngredients(e.target.value)}
                            placeholder="Ej: tomato , rice, milk..."
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Loading recipes" : "Buscar receta"}
                        </button>
                    </div>
                </form>

                <div>
                    <h2>Recipes</h2>
                    <ul>
                        {recipes.map((recipe, index) => (
                            <li key={index}>
                                <h3>{recipe.name}</h3>
                                <img src={recipe.img} alt={recipe.name} />
                                <button><i className="fa-solid fa-heart" style="color: #ff2600;"></i></button>

                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        )
    }
