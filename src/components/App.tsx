// Styles
import "@/styles/App.sass";

import React, { useEffect, useState } from "react";

const App: React.FC = () => {

	const [count, setCount] = useState(0);
	useEffect(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000);
		return () => clearTimeout(timer);
	}, [count, setCount]);

	return (
		<>
			<h1 className="big">
				LOL
			</h1>
			<p>
				Page has been opened for {count} seconds.
			</p>
		</>
	);
};

export default App;