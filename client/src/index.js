import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reducer,{initalState} from './Components/ContextApi/reducer';
import { StateProvider } from './Components/ContextApi/StateProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <StateProvider initialState={initalState} reducer={reducer}>
    <App />
    </StateProvider>  
);

