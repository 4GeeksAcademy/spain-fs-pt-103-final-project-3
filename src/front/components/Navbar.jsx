import { Link } from "react-router-dom";
import TrueFocus from '../components/TrueFocus';



export const Navbar = () => {

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
					<Link className="me-2"to="/register">
						<button className="btn btn-primary ">Register</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-primary">Login</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

