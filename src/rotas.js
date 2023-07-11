
import React from 'react';

import { Route, Routes, BrowserRouter } from 'react-router-dom';

import ListagemUsuarios from './views/listagem-usuarios';
import ListagemClientes from './views/listagem-clientes';
import ListagemProdutos from './views/listagem-produtos';
import ListagemPedidos from './views/listagem-pedidos';
import ListagemCarrinhos from './views/listagem-carrinhos';

import Login from './views/login';
import CadastroUsuario from './views/cadastro-usuario';
import CadastroCliente from './views/cadastro-cliente';
import CadastroProduto from './views/cadastro-produto';
import CadastroPedido from './views/cadastro-pedido';
import CadastroCarrinho from './views/cadastro-carrinho';


function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />

        <Route path='/cadastro-usuario/:idParam?' element={<CadastroUsuario />} />

        <Route path='/cadastro-clientes/:idParam?' element={<CadastroCliente />} />

        <Route path='/cadastro-produto/:idParam?' element={<CadastroProduto/>} />

        <Route path='/cadastro-pedido/:idParam?' element={<CadastroPedido />} />

        <Route path='/cadastro-carrinho/:idParam?' element={<CadastroCarrinho />} />

        <Route path='/listagem-usuarios' element={<ListagemUsuarios />} />

        <Route path='/listagem-clientes' element={<ListagemClientes />} />

        <Route path='/listagem-produtos' element={<ListagemProdutos />} />

        <Route path='/listagem-pedidos' element={<ListagemPedidos />} />

        <Route path='/listagem-carrinhos' element={<ListagemCarrinhos />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
