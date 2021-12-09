import React from "react";
import { render } from "react-dom";

import App from "@/components/App";

render(<App/>, document.getElementById("root"));
   
// Hot Module Replacement
if (undefined /* [snowpack] import.meta.hot */ ) {
	// @ts-ignore
	undefined /* [snowpack] import.meta.hot */ .accept();
}