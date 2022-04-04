// Styles
import "@styles/App.scss";

// Components
import Canvas from "@components/Canvas";
import Sidebar from "./Sidebar";


const App = () => {
	return (
		<>
			<Sidebar />
			<Canvas />
		</>
	);
};

export default App;
