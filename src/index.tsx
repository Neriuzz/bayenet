import React from "react";
import { render } from "react-dom";

const App = () => {
    return (
        <>
            <h1>Test</h1>
        </>
    );
};

render(<App/>, document.getElementById("root"));

// Hot Module Replacement
if (undefined /* [snowpack] import.meta.hot */ ) {
    // @ts-ignore
    undefined /* [snowpack] import.meta.hot */ .accept();
}