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


    useEffect(()=>{
        const generateImg = async (recipeName) => {
            try {
                const imageResponse = await client.images.generate({
                    model: "dall-e-2",
                    prompt: `Deliciosa ${recipeName}, fotografía de la comida, luz profesional, apetitosa y sobre mesa de madera `,
                    n: 1,
                    size: "512x512"
                });
                setImg(imageResponse.data[0].url);
                return imageResponse.data[0].url;
            }
            catch (err) {
                return null;
            }
        };
        generateImg(recipe.name);
      
   },[])
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
    console.log(img);
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
                        <p>⏱️ {recipe.cook_time}</p>
                        <p>🔥 {recipe.dificult}</p>
                    </div>
                </div>
                <div className="recipe-steps">
                    <h3 className="ms-4">Empecemos a crear:</h3>
                    <ol className="recipe-li">
                        {recipe.instructions.map((step, index) => (
                            <li key={index} style={{height: "110px"}}>{step}</li>
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