import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css';

import Home from "./Home";
import Header from "./Home/Header";
import axios from "axios";

function App() {
    const api = axios.create({
        baseURL: 'http://localhost:5000',
        timeout: 5000,
        headers: {'Authorization': 'empty', 'Content-Type': "application/json"},

    });

    return (
        <div className="App">
            <Header api={api}/>
            <Home api={api}/>
        </div>
    );
}

export default App;
