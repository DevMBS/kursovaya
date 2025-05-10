import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import config from '../config';

/**
 * Кастомный хук useSocket для управления WebSocket соединением
 * Создает и поддерживает соединение с сервером через Socket.IO
 * Автоматически добавляет токен аутентификации при подключении
 *
 * @param {string|null} token - Токен аутентификации пользователя (может быть null)
 * @returns {React.MutableRefObject} Ref-объект, содержащий экземпляр сокета
 */
export function useSocket(token) {
    // Используем useRef для сохранения сокета между рендерами
    const socketRef = useRef(null);

    useEffect(() => {
        // Создаем новое соединение с сервером
        const socket = io(config.serverHost, {
            auth: token ? { token } : {}, // Передаем токен в параметрах аутентификации
        });

        // Сохраняем экземпляр сокета в ref
        socketRef.current = socket;

        // Функция очистки - отключаем сокет при размонтировании компонента
        return () => socket.disconnect();
    }, [token]); // Эффект зависит от изменения токена

    // Возвращаем ref, содержащий экземпляр сокета
    return socketRef;
}