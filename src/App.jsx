import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/add";
import Edit from "./pages/edit";


function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/add"
                    element={<Add />}
                />

                <Route
                    path="/edit"
                    element={<Edit />}
                />

            </Routes>

        </BrowserRouter>
    );
}


export default App;