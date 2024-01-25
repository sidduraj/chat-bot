import { createRoot } from "react-dom/client";

import App from "./App";

const domNode = document.getElementById('root');
const root =  domNode && createRoot(domNode);
root?.render(<App />);