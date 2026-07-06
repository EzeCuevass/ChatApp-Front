import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider , defaultSystem} from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from './context/socketContext';
import { UserProvider } from './context/userContext';
import { OnlineProvider } from './context/OnlineContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <SocketProvider>
          <OnlineProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </OnlineProvider>
        </SocketProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);


