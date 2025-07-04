import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./recipe.css";
import OpenAI from "openai";

export const Recipe = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { theId } = useParams();
    const [recipe, setRecipe] = useState(location.state.recipe || null);
    const [loading, setLoading] = useState(!theId && !location.state.recipe);
    const [error, setError] = useState('');
    const [img, setImg] = useState('');

    const client = new OpenAI({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true
    });


    const generateImg = async (recipeName) => {
        try {
            const imageResponse = await client.images.generate({
                model: "dall-e-2",
                prompt: `Deliciosa ${recipeName}, fotografía de la comida, luz profesional, apetitosa y sobre mesa de madera `,
                n: 1,
                size: "535x536"
            });
            return imageResponse.data[0].url;
        }
        catch (err) {
            return null;
        }
    };

    useEffect(() => {
        const fetchRecipeAndImg = async () => {
            setLoading(true);

            try {
                let actualRecipe = recipe;
                if (!actualRecipe && theId) {
                    const response = await fetch(`/api/recipe/${theId}`);
                    if (!response.ok) throw new Error('Receta no encontrada');

                    actualRecipe = await response.json();
                    setRecipe(actualRecipe);
                }
                if (actualRecipe) {
                    const img = generateImg(actualRecipe.name);
                    setImg(img);
                }
            }
            catch (err) {
                setError('Rceta no encontrada.');
            }
            finally {
                setLoading(false);
            }
        }
    }, [theId, recipe]);

    if (loading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
            <lottie-player
                src="/loader.json"
                background="transparent"
                speed="1"
                style={{ width: "300px", height: "300px" }}
                loop
                autoplay
            ></lottie-player>
        </div>
    }

    return (
        <div className="container-recipe">
            <h1 className="title-recipe">{recipe.name}</h1>
            <div className="recipe-content-idea">
                <div className="recipe-details">

                    {img ? (
                        <img
                            className="recipe-imagen"
                            src={img}
                            alt={recipe.name}
                        />
                    ) : (

                        recipe.img && <img
                            className="recipe-imagen"
                            src={recipe.img}
                            alt={recipe.name}
                        />
                    )}


                    <div className="recipe-information">
                        <p>⏱️ {recipe.time}</p>
                        <p>🔥 {recipe.dificult}</p>
                    </div>
                </div>
                <div className="recipe-steps">
                    <h3 className="ms-4">Empecemos a crear:</h3>
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