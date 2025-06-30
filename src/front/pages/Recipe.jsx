import React, { useState } from "react"
import { useNavigate } from "react-router-dom"



export const Recipe = () => {







    return (
        <div className="d-flex justify-content-center">
            <div>
                <h1>Recipe name </h1>
                <img src="https://editorialtelevisa.brightspotcdn.com/58/eb/b537a4714c11890dfba66649ee13/flautas-transformed.jpeg" alt="img-recipe" style={{width:150}} />
                <div>

                    <div>
                        <p>time</p>
                        <p>difi</p>
                    </div>
                    <div>
                        <h3>Empezemos a crear</h3>
                        <ol>
                            <li>step1..</li>
                            <li>step2..</li>
                        </ol>

                    </div>
                </div>
            </div>
        </div>
    )
}