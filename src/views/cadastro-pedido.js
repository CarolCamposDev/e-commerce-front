import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroPedido() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/pedidos`;

  const [id, setId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [status, setStatus] = useState('');
  const [listaProdutos, setListaProdutos] = useState([]);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    async function buscarDados() {
      if (idParam != null) {
        try {
          const response = await axios.get(`${baseURL}/${idParam}`);
          setDados(response.data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            mensagemErro('Pedido não encontrado. Verifique o ID do pedido.');
          } else {
            mensagemErro('Ocorreu um erro ao buscar os dados do pedido.');
          }
        }
      }
    }
    buscarDados();
  }, [idParam]);

  useEffect(() => {
    if (dados) {
      setId(dados.id);
      setClienteId(dados.cliente.id);
      setProdutos(dados.produtos);
      setStatus(dados.status);
    }
  }, [dados]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const response = await axios.get(`${BASE_URL}/produtos`);
        setListaProdutos(response.data);
      } catch (error) {
        mensagemErro('Ocorreu um erro ao carregar os produtos.');
      }
    }
    carregarProdutos();
  }, []);

  function inicializar() {
    setId('');
    setClienteId('');
    setProdutos([]);
    setStatus('');
  }

 async function salvar() {
  if (clienteId.trim() === '') {
    mensagemErro('O campo Cliente Id é obrigatório.');
    return;
  }

  if (produtos.length === 0) {
    mensagemErro('É necessário adicionar pelo menos um produto ao pedido.');
    return;
  }

  if (status === '') {
    mensagemErro('O campo Status é obrigatório.');
    return;
  }

  const data = { id, cliente: { id: clienteId }, produtos, status };
  try {
    // Verificar se o cliente existe antes de salvar o pedido
    const response = await axios.get(`${BASE_URL}/clientes/${clienteId}`);
    if (response.status === 200) {
      if (idParam) {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso('Pedido alterado com sucesso!');
      } else {
        await axios.post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso('Pedido cadastrado com sucesso!');
      }
      navigate('/listagem-pedidos');
    } else {
      mensagemErro('Cliente não encontrado. Verifique o ID do cliente.');
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        mensagemErro('Cliente não encontrado. Verifique o ID do cliente.');
      } else {
        mensagemErro(error.response.data);
      }
    } else {
      mensagemErro('Ocorreu um erro de rede.');
    }
  }
}



  function adicionarProduto(produtoId) {
    const produto = listaProdutos.find((p) => p.id === produtoId);
    if (produto) {
      setProdutos([...produtos, produto]);
    }
  }

  function removerProduto(produtoId) {
    const updatedProdutos = produtos.filter((p) => p.id !== produtoId);
    setProdutos(updatedProdutos);
  }

  return (
    <div className='container'>
      <Card title='Cadastro de Pedido'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Cliente Id:' htmlFor='inputClienteId'>
                <input
                  type='text'
                  id='inputClienteId'
                  value={clienteId}
                  className='form-control'
                  name='clienteId'
                  onChange={(e) => setClienteId(e.target.value)}
                />
              </FormGroup>

              <div className='form-group'>
                <label htmlFor='selectProduto'>Produtos:</label>
                <select
                  id='selectProduto'
                  className='form-control'
                  onChange={(e) => adicionarProduto(Number(e.target.value))}
                >
                  <option value=''>Selecione um produto</option>
                  {listaProdutos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {produtos.map((produto) => (
                  <div key={produto.id}>
                    <span>{produto.nome}</span>
                    <button
                      onClick={() => removerProduto(produto.id)}
                      className='btn btn-sm btn-danger'
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <FormGroup label='Status:' htmlFor='inputStatus'>
                <select
                  id='inputStatus'
                  value={status}
                  className='form-control'
                  name='status'
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value=''>Selecione o status</option>
                  <option value='Em andamento'>Em andamento</option>
                  <option value='Concluído'>Concluído</option>
                  <option value='Cancelado'>Cancelado</option>
                </select>
              </FormGroup>

              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={inicializar}
                  type='button'
                  className='btn btn-danger'
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroPedido;
