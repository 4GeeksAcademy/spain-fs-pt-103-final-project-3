import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import OpenAI from "openai";
import TextPressure from '../components/TextPressure';






export const UserView = () => {

    const [ingredients, setIngredients] = useState([]);
    const [ingredienteAñadido, setIngredienteAñadido] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [guardados, setGuardados] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [sideBar, setSideBar] = useState(false)
    const navigate = useNavigate();

    const client = new OpenAI({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const generadorId = () => {
        return 'id-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
    };

    useEffect(() => {

        const fetchFavorites = async () => {

            try {
                const response = await fetch("/api/recipe");
                if (!response.ok) throw new Error ("Error al cargar tus favoritos");
                const data = await response.json();
                setGuardados(data);
            }
            catch (err){
                setError("Error al cargar tus favoritos");
            }
        };
        fetchFavorites();
    }, []);

    const addFavorite = async (recipe) => {
        if (guardados.some((fav) => fav.name === recipe.name)){
            alert("Receta ya guardada en favoritos");
            return;
        }

        const favoriteRecipe = {
            id: generadorId(),
            name: recipe.name,
            steps: recipe.steps,
            dificult: recipe.dificult,
            time: recipe.time,
            timeSaved: new Date().toISOString()
        };

        try {

            const response = await fetch("/api/recipe", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(favoriteRecipe)
            });

            if (!response.ok) throw new Error("Error al guardar favorito");
            const favoritoGuardado = await response.json();
            setGuardados((prev) => [...prev, favoritoGuardado]);
        }
        catch (err){
            setError("Error al guardar favorito");
        }
    };

    const eliminarFavorito = async (id) => {
        try{
            const response = await fetch(`/api/recipe/${id}`, {
                method: "DELETE"
            });
            if (!response.ok) throw new Error("Error al eliminar favorito");
            setGuardados((prev) => prev.filter((fav) => fav.id !== id));
        }
        catch (err){
            setError("Error al eliminar favorito");
        }
    };


    const addIngredient = (e) => {
        e.preventDefault();

        if (!ingredienteAñadido.trim()) return;

        const ingredient = ingredienteAñadido.trim().toLowerCase();

        if (!ingredients.includes(ingredient) && ingredients.length < 11) {
            setIngredients(prev => [...prev, ingredient])
            setIngredienteAñadido('');
        }
        if (ingredients.includes(ingredient)) {
            setError('Ingrediente ya añadido');
            alert('Ingrediente ya añadido')
        }
        else {
            setError('Máximo de ingredientes alcanzados')
        }
    }

    const eliminarIngrediente = (ingredieteToRemove) => {
        setIngredients(prev => prev.filter(ingredient => ingredient !== ingredieteToRemove));
    }

    const recipeDetail = (recipe) => {
        navigate('/recipe', { state: { recipe } })
    }


    //prompt que pasamos a la IA para que genere la receta 
    const prompt = `
Genera 3 recetas usando un lenguaje de chef profesional, usando solo y unicamente (sin añadir ingredientes extra) estos ingredientes: ${ingredients}, damos por hecho que disponemos de aceite, sal y pimienta.
Para cada receta, incluye:
- El nombre de la receta ("name")
- Un array con el paso a paso muy bien desarrollado y extenso donde indique que utensilios debo usar ("steps")
- Indica la dificultad para realizarla("dificult")
- Tiempo de elaboración ("time")
Devuélvelo en un JSON con este formato:
[
  {
    "name": "Nombre de la receta",
    "steps": ["Paso 1", "Paso 2", ...],
    "dificult": "Fácil/Media/Difícil",
    "time": "45 min",
  },
    ...
]
No agregues texto fuera del JSON.
`
    // configuración para la creación de imagenes de la receta 
    const generateImg = async (recipeName) => {
        try {
            const imageResponse = await client.images.generate({
                model: "dall-e-2",
                prompt: `Deliciosa ${recipeName}, fotografía de la comida, luz profesional, apetitosa y sobre mesa de madera `,
                n: 1,
                size: "256x256"
            });
            return imageResponse.data[0].url;
        }
        catch (err) {
            return null;
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (ingredients.length === 0) {
            setError('Añade ingredientes')
            alert('Añade un ingrediente')
        }


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
            {/* sidebar para favoritos */}
            <button className={`sidebarButton${sideBar ? " moved" : ""}`} onClick={() => setSideBar(!sideBar)}>
                <i className="fa-solid fa-heart text-white"></i>
            </button>
            <div className={`sidebarContainer${sideBar ? " open" : ""}`}>
                <div>
                    <h4 className="mt-4 d-flex justify-content-center">Tus Favoritas</h4>
                    {guardados.length === 0 ? (
                        <p className="text-center mt-5">No has añadido recetas aún</p>) : (
                        <ul>
                            {guardados.map((favorite, index) => (
                                <li key={index} className="favoritedLi mt-4">
                                    <div className="favoriteContent">
                                        <div className="starFav">
                                            <i class="fa-solid fa-lemon fa-2xl text-warning"></i>
                                        </div>
                                        <div className="textFav">
                                            <strong>{favorite.name}</strong>
                                        </div>
                                        <div className="trashFav">
                                            <i className="fa fa-trash" onClick={() => eliminarFavorito(favorite.name)}></i>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                    }

                </div>
            </div>


            <div className="mt-5 mb-3" style={{ position: 'relative', height: '100px', width: '300px' }}>
                <TextPressure
                    text="LET'S COOK"
                    flex={true}
                    alpha={false}
                    stroke={false}
                    width={true}
                    weight={true}
                    italic={true}
                    textColor="black"
                    strokeColor="#ff0000"
                    minFontSize={58}
                />
            </div>

            <form onSubmit={addIngredient}>
                <div>
                    <label className="d-flex justify-content-center fs-1 fw-medium">Añade un ingrediente</label>
                </div>
                <div>
                    <input
                        type="text"
                        value={ingredienteAñadido}
                        onChange={e => setIngredienteAñadido(e.target.value)}
                        placeholder="Ej: tomate, arroz, pollo..."
                        disabled={ingredients.length >= 10}
                    />
                </div>

            </form>

            {ingredients.length > 0 && (
                <div>
                    <ul className="listadoIngredientes">
                        {ingredients.map((ingredient, index) => (
                            <li key={index} onClick={() => eliminarIngrediente(ingredient)} className="ingrediente">
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {ingredients.length > 0 && (
                <div>
                    <button className="buscador" onClick={handleSubmit} disabled={loading || ingredients.length === 0}>{loading ? "Generando recetas..." : "Generar recetas"}</button>
                </div>
            )}


            {loading && (

                // generador de animación para cuando carga las recetas 

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
                            <li key={index} 
                                className="col-12 col-md-12 col-lg-12"
                                style={{cursor: 'pointer'}}
                                role="button"
                                onClick={()=> recipeDetail(recipe)}>
                                <div className="header-recipe">
                                    <h3>{recipe.name}</h3>
                                    <i className="fa-solid fa-heart heart text-danger fa-2xl  m-5" style={{ cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); addFavorite(recipe)}}></i>
                                </div>
                                <div className="recipe-body">
                                    {recipe.img && <img src={recipe.img} alt={recipe.name} className="recipe-img" />}
                                    <div className="recipe-info me-4">
                                        <p>⏱️ {recipe.time}</p>
                                        <p>🔥 {recipe.dificult}</p>
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
