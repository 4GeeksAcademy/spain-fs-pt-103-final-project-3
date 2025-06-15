import { Link } from "react-router-dom";
import {useState, useEffect} from "react";

export const Navbar = () => {
// Principales estados para el log in
	const [logInEmail, setLogInEmail] = useState("");
	const [logInPassword, setLogInPassword] = useState("");
 
// Principales estados para el sign in

    const [signInName, setSignInName] = useState("");
	const [signInEmail, setSignInEmail] = useState("");
	const [signInPassword, setSignInPassword] = useState("");

// acceso a nuestra URL de back

    const backEnd_url = import.meta.env.VITE_BACKEND_URL;

// Uso de useEffect para manejar el bckground con el modal

useEffect(() => {

	const logInModalElement = document.getElementById('logInModal');
	const signInModalElement = document.getElementById('signInModal');

	const addSplineOverlayActive = () => {
		document.body.classList.add('spline-overlay-active');
	};

	const removeSplineOverlayActive = () => {
		document.body.classList.remove('spline-overlay-active');
	};

	if(logInModalElement) {
		logInModalElement.addEventListener('shown.bs.modal', addSplineOverlayActive);
        logInModalElement.addEventListener('hidden.bs.modal', removeSplineOverlayActive);
	}
	if(signInModalElement) {
		signInModalElement.addEventListener('shown.bs.modal', addSplineOverlayActive);
        signInModalElement.addEventListener('hidden.bs.modal', removeSplineOverlayActive);
	}

	return () => {
		if(logInModalElement){
			logInModalElement.removeEventListener('shown.bs.modal', addSplineOverlayActive);
            logInModalElement.removeEventListener('hidden.bs.modal', removeSplineOverlayActive);
		}
		if(signInModalElement){
			signInModalElement.removeEventListener('shown.bs.modal', addSplineOverlayActive);
            signInModalElement.removeEventListener('hidden.bs.modal', removeSplineOverlayActive);
		}
	}
},[]);




	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/" className="no-underline-link">
					<span className="navbar-brand mb-0 h1 text-warning">APPName</span>
				</Link>
				<div className="ml-auto">

					<button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#logInModal">
						Log in
					</button>
					<div className="modal fade" id="logInModal" tabIndex="-1" aria-labelledby="logInModalLabel" aria-hidden="true">
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h1 className="modal-title fs-5" id="logInModalLabel">Log in</h1>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<form className=" d-flex row">
										<label htmlFor="logInEmail" >Email</label>
									    <input 
										type="email" 
										id="logInEmail" 
										required
										value={logInEmail}
										onChange={(e) => setLogInEmail(e.target.value)}  />
										<label htmlFor="logInPassword">Password</label>
										<input 
										type="password"
										id="logInPassword"
										required
										value={logInPassword}
										onChange={(e) => setLogInPassword(e.target.vallue)} />
									</form>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
									<button type="button" className="btn btn-warning">Log in</button>
								</div>
							</div>
						</div>
					</div>



					<button type="button" className="btn btn-warning m-2" data-bs-toggle="modal" data-bs-target="#signInModal">
						Sign in 
					</button>
					<div className="modal fade" id="signInModal" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h1 className="modal-title fs-5" id="signInModalLabel">Sign in</h1>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<form className="d-flex row">
										<label>Name</label>
										<input type="text" required/>
										<label>Email</label>
										<input type="email" name="email" id="email" />
										<label>Password</label>
										<input type="password" name="password" id="password" required />
									</form>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
									<button type="button" className="btn btn-warning">Create user</button>
								</div>
							</div>
						</div>
					</div>


					
				</div>
			</div>
		</nav>
	);
};