import React from 'react';
import ReactDOM from 'react-dom'; // O Modelo de Objeto de Documento (DOM) é uma interface de programação para documentos HTML, XML e SVG . Ele fornece uma representação estruturada do documento como uma árvore
import App from './App';

ReactDOM.render(
  <App />,
  document.getElementById('root') // renderiza a tag HTML (nesse caso o App) no root do index.html
);
