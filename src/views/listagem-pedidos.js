import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function ListagemPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const response = await axios.get(`${BASE_URL}/pedidos`);
        const pedidosFinalizados = response.data.filter(pedido => pedido.status === 'Finalizado');
        setPedidos(pedidosFinalizados);
      } catch (error) {
        console.log('Ocorreu um erro ao carregar os pedidos.', error);
      }
    }
    carregarPedidos();
  }, []);

  return (
    <div className='container'>
      <h2>Listagem de Pedidos Finalizados</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.cliente}</td>
              <td>{pedido.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListagemPedidos;
