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
Genera 3 recetas usando solo estos ingredientes: ${ingredients}.
Para cada receta, incluye:
- El nombre de la receta ("name")
- Un array con el paso a paso muy bien desarrollado y extenso donde indique que utensilios debo usar ("steps")
- Indica la dificultad para realizarla("dificult")
- Tiempo de elaboración ("time")
Devuélvelo en un JSON con este formato:
[
  {
    "name": "Nombre de la receta",
    "steps": ["Paso 1", "Paso 2", ...]
    "dificult": "Fácil/Media/Difícil"
    "time": "45 min"
  },
    ...
]
No agregues texto fuera del JSON.
`

    const generateImg = async (recipeName) => {
        try{
            const imageResponse = await client.images.generate({
                model: "dall-e-2",
                prompt: `Deliciosa ${recipeName}, fotografía de la comida, luz profesional, apetitosa y sobre mesa de madera `,
                n:1,
                size: "256x256"
            });
            return imageResponse.data[0].url;
        }
        catch(err){
            return null;
        }
    };


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

            
                const match = content.match(/\[.*\]/s);
                if (!match) {
                setError('No se encontró un array JSON en la respuesta.');
                return;
            }

            const recipesJson = JSON.parse(match[0]);
            console.log('Recetas parseadas:', recipesJson);
           
            
            const recipesWithImages = await Promise.all(
                recipesJson.map(async (recipe, index) => {
                    console.log(`Procesando receta ${index + 1}/${recipesJson.length}: ${recipe.name}`);
                    const img = await generateImg(recipe.name);
                    return { 
                        ...recipe, 
                        img: img || '' 
                    };
                })
            );

            console.log('✅ Recetas con imágenes completadas:', recipesWithImages);
            setRecipes(recipesWithImages);


        }
        catch (error) {
            console.error('Error de la API:', error);
            setError('Error:' + error.message);
        }
        finally {
            setLoading(false);
            setIngredients('');
        }
    }


    console.log(recipes)

    return (

        <div className="userContainer">
            <h1 className="userTitle">Let's cook</h1>

            <form onSubmit={handleSubmit}>
                <div className="formIngredients">
                    <label htmlFor="">Indica tus ingredientes</label>
                    <input
                        type="text"
                        value={ingredients}
                        onChange={e => setIngredients(e.target.value)}
                        placeholder="Ej: tomate , arroz, leche..."
                        required
                    />
                    <button className="buscador" type="submit" disabled={loading}>
                        {loading ? "Generando recetas" : "Generar receta"}
                    </button>
                </div>
            </form>

        

            {loading && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                    <lottie-player
                        src="/loader.json"
                        background="transparent"
                        speed="1"
                        style={{ width: "300px", height: "300px" }}
                        loop
                        autoplay
                    ></lottie-player>
                </div>
            )}

            {!loading && recipes.length > 0 && (
            <div>
                <h2 className="ms-5 mb-4">Recetas pensadas para ti:</h2>
                <ul>
                    {recipes.map((recipe, index) => (
                        <li key={index}>
                            <div className="header-recipe">
                            <h3>{recipe.name}</h3>
                            <i className="fa-solid fa-heart heart text-danger fa-2xl  m-5"></i>
                            </div>
                            <div className="recipe-body">
                            {recipe.img && <img src={recipe.img} alt={recipe.name} className="recipe-img" />}
                            <div className="recipe-info me-4">
                            <p>{recipe.time}</p>
                            <p>{recipe.dificult}</p>
                            </div>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>
            )}

        </div>
    )
}
