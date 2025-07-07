import { useNavigate } from "react-router-dom";

export const Private = ({children}) => {
    const token = localStorage.getItem("access_token");

    const navigate = useNavigate();

    useEffect(() =>{
        if (!token) {
            navigate("/login")
        }
    }, [])


    return children
}