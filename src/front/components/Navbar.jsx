import { Link } from "react-router-dom";
import TrueFocus from '../components/TrueFocus';



export const Navbar = () => {

	return (
		<nav className="navbar navbar">
			<div className="container">

				<TrueFocus
					sentence="Receta App"
					manualMode={false}
					blurAmount={5}
					borderColor="white"
					animationDuration={2}
					pauseBetweenAnimations={1}
				/>

				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

