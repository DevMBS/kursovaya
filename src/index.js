import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';

// Создание корневого элемента React-приложения, который будет отрендерен в DOM-элементе с id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендеринг основного компонента приложения
root.render(
    // React.StrictMode - это инструмент для выявления потенциальных проблем в приложении
    // Включает дополнительные проверки и предупреждения для своих потомков
    <React.StrictMode>
        {/* BrowserRouter - компонент для управления маршрутизацией с использованием HTML5 History API */}
        <BrowserRouter>
            {/* Routes - контейнер для всех Route-компонентов, определяет правила сопоставления URL с компонентами */}
            <Routes>
                {/* Route для корневого пути '/' - отображает основной компонент App */}
                <Route path="/" element={<App/>} />
                {/* Route для пути '/login' - отображает компонент страницы входа Login */}
                <Route path="/login" element={<Login/>} />
                {/* Route для пути '/register' - отображает компонент страницы регистрации Register */}
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);