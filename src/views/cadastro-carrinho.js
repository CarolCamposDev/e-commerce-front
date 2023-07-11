import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastrarCarrinho() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/carrinhos`;

  const [id, setId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [precoTotal, setPrecoTotal] = useState(0);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [status, setStatus] = useState('');
  const [dados, setDados] = useState(null);
  const [listaClientes, setListaClientes] = useState([]);

  useEffect(() => {
    async function buscarDados() {
      if (idParam != null) {
        try {
          const response = await axios.get(`${baseURL}/${idParam}`);
          setDados(response.data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            mensagemErro('Carrinho não encontrado.');
          } else {
            mensagemErro('Ocorreu um erro ao buscar os dados do carrinho.');
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
      setPrecoTotal(dados.precoTotal);
      setStatus(dados.status);
    }
  }, [dados]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const response = await axios.get(`${BASE_URL}/produtos`);
        setListaProdutos(response.data);
      } catch (error) {
        mensagemErro('Ocorreu um erro ao carregar a lista de produtos.');
      }
    }
    carregarProdutos();
  }, []);

  useEffect(() => {
    async function carregarClientes() {
      try {
        const response = await axios.get(`${BASE_URL}/clientes`);
        setListaClientes(response.data);
      } catch (error) {
        mensagemErro('Ocorreu um erro ao carregar a lista de clientes.');
      }
    }
    carregarClientes();
  }, []);

  function inicializar() {
    setId('');
    setClienteId('');
    setProdutos([]);
    setPrecoTotal(0);
    setStatus('');
  }

  async function salvar() {
    try {
      // Verificar se o campo Cliente Id está preenchido
      if (!clienteId) {
        mensagemErro('Por favor, preencha o campo Cliente Id.');
        return;
      }

      // Verificar se pelo menos um produto foi selecionado
      if (produtos.length === 0) {
        mensagemErro('Por favor, selecione pelo menos um produto.');
        return;
      }

      // Verificar se o cliente existe
      const clienteResponse = await axios.get(`${BASE_URL}/clientes/${clienteId}`);
      const cliente = clienteResponse.data;

      if (!cliente) {
        mensagemErro('Cliente não encontrado. Verifique o ID do cliente.');
        return;
      }

    

      const data = { id, cliente: { id: clienteId }, produtos, precoTotal, status };

      if (idParam) {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso(`Carrinho alterado com sucesso!`);
      } else {
        await axios.post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso(`Carrinho cadastrado com sucesso!`);
      }

      navigate(`/listagem-carrinhos`);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          mensagemErro('Cliente não encontrado. Verifique o ID do cliente.');
        } else if (error.response && error.response.status === 500) {
            mensagemErro('O cliente já possui um carrinho.');
        }
      } else {
        mensagemErro('Ocorreu um erro de rede.');
      }
    }
  }

  function adicionarProduto(produtoId) {
    const produto = listaProdutos.find((p) => p.id === produtoId);
    if (produto) {
      const updatedProdutos = [...produtos, produto];
      const updatedPrecoTotal = updatedProdutos.reduce(
        (total, produto) => total + produto.preco,
        0
      );
      setProdutos(updatedProdutos);
      setPrecoTotal(updatedPrecoTotal);
    }
  }

  function removerProduto(produtoId) {
    const updatedProdutos = produtos.filter((p) => p.id !== produtoId);
    const updatedPrecoTotal = updatedProdutos.reduce(
      (total, produto) => total + produto.preco,
      0
    );
    setProdutos(updatedProdutos);
    setPrecoTotal(updatedPrecoTotal);
  }

  return (
    <div className='container'>
      <Card title='Cadastro de Carrinho'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Cliente Id:' htmlFor='inputClienteId'>
                <select
                  id='inputClienteId'
                  className='form-control'
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value=''>Selecione um cliente</option>
                  {listaClientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
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

              <FormGroup label='Preço Total:' htmlFor='inputPrecoTotal'>
                <input
                  type='number'
                  id='inputPrecoTotal'
                  value={precoTotal}
                  className='form-control'
                  name='precoTotal'
                  readOnly
                />
              </FormGroup>

              <FormGroup label='Status:' htmlFor='inputStatus'>
                <select
                  id='inputStatus'
                  className='form-control'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value=''>Selecione o status</option>
                  <option value='Em andamento'>Em andamento</option>
                  <option value='Finalizado'>Finalizado</option>
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

export default CadastrarCarrinho;
