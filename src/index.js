import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider , defaultSystem} from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './context/socketContext';
import { UserProvider } from './context/userContext';
// import MensajesChat from './components/mensajesChat';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <SocketProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </SocketProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);


