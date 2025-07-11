import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TrueFocus from '../components/TrueFocus';



export const Navbar = () => {

	const [isLog, setIsLog] = useState(!!localStorage.getItem('access_token'));
	const navigate = useNavigate();

	useEffect(() => {
		const handleStorageModify = () => {
			setIsLog(!!localStorage.getItem('access_token'));
		};
		window.addEventListener('storage', handleStorageModify);
		return () => window.removeEventListener('storage', handleStorageModify);
	},[]);

	const handleLogOut = () => {
		localStorage.removeItem('access_token' );
		setIsLog(false);
		navigate('/');
	};

	return (
		<nav className="navbar navbar">
			<div className="container">

				<TrueFocus
					sentence="LET'S COOK APP"
					manualMode={false}
					blurAmount={5}
					borderColor="white"
					animationDuration={1}
					pauseBetweenAnimations={1}
				/>
				
				<div className="ml-auto">
					{ isLog ? ( 
						<button className="btn btn-dark" onClick={handleLogOut}>Log out</button>
					) : (
						<>
					<Link className="me-2"to="/register">
						<button className="btn btn-dark ">Register</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-dark">Login</button>
					</Link>
					</>
					)}
				</div>
			</div>
		</nav>
	);
};



