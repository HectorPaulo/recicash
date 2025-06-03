import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Home from "../pages/Home/Home.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthProvider} from "../contexts/AuthContext";
import {PuntosProvider} from "../contexts/PuntosProvider.tsx";
import Login from "../pages/Auth/Login/Login.jsx";

// Wrapper component para mantener la consistencia
const PreviewWrapper = ({ children }) => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <PuntosProvider>
                    <Routes>
                        <Route path="*" element={children} />
                    </Routes>
                </PuntosProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Home">
                <PreviewWrapper>
                    <Home/>
                </PreviewWrapper>
            </ComponentPreview>
            <ComponentPreview path="/Login">
                <PreviewWrapper>
                    <Login/>
                </PreviewWrapper>
            </ComponentPreview>
            <ComponentPreview path="/Login">
                <Login/>
            </ComponentPreview>
            <ComponentPreview path="/Home">
                <Home/>
            </ComponentPreview>
            <ComponentPreview path="/Home">
                <Home/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews