import { Link } from "react-router-dom";

export const Navbar = () => {

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
					<div className="modal fade" id="logInModal" tabindex="-1" aria-labelledby="logInModalLabel" aria-hidden="true">
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h1 className="modal-title fs-5" id="logInModalLabel">Log in</h1>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<form className=" d-flex row">
										<label>Email</label>
									    <input type="email" required />
										<label>Password</label>
										<input type="password" required />
									</form>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
									<button type="button" className="btn btn-warning">Log in</button>
								</div>
							</div>
						</div>
					</div>



					<button type="button" className="btn btn-warning m-4" data-bs-toggle="modal" data-bs-target="#signInModal">
						Sign in 
					</button>
					<div className="modal fade" id="signInModal" tabindex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
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