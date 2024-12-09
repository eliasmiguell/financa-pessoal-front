"use client";
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserContext } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { DollarSign, Link, LogOut} from 'lucide-react';
import { useContext, useState } from 'react';

import useAdicionarReceita from '../../../../hooks/useAdicionarReceita';
import FinanceCharts from '@/components/chart';
import {useSaldoAtual, UltimasTransacoes} from '../../../../hooks/useSaldoAtual';
import { UltmaTransacao } from '../../../../interface';
function Main() {
  const {user}= useContext(UserContext)
  const [showModal, setShowModal] = useState(false);
  const [errors, setError] = useState('');
  const [clickedButton, setClickedButton] = useState("");
  const [formData, setFormData] = useState({
    user_id:user?.id,
    conta_id:'',
    categoria_id:'',
    descricao: "",
    valor:0,
    tipo: "despesa"
    
  });
  const { mutate } = useAdicionarReceita();
  const saldoAtualQuery= useSaldoAtual();
  const TransacoesQuery= UltimasTransacoes();

  console.log(saldoAtualQuery.data,TransacoesQuery.data?.utlimasCincoTrasacoes )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'conta_id' || name === 'categoria_id' || name === 'valor' ? Number(value) : value,
    }));
  };

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.tipo || !formData.conta_id || !formData.categoria_id || !formData.valor) {
    setError('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Use a mutação
  mutate({
    user_id: Number(user?.id),
    conta_id:Number(formData.conta_id) ,
    categoria_id: Number(formData.categoria_id),
    descricao: formData.descricao,
    valor: formData.valor,
    tipo: formData.tipo,
  });

  setFormData({
    user_id: user?.id,
    conta_id: '',
    categoria_id: '',
    descricao: '',
    valor: 0,
    tipo: '',
  });
  setShowModal(false)
};




 
  
  const despesas = 5
  const receita =   5000
  const saldo = despesas > receita
  // if (TransacoesQuery.isLoading) return <div>Carregando...</div>;
  // if (TransacoesQuery.isError) return <div>Erro ao carregar as transações.</div>;
  // if (saldoAtualQuery.isLoading) return <div>Carregando...</div>;
  // if (saldoAtualQuery.isError) return <div>Erro ao carregar o saldo.</div>;
  return(
    <main className='sm:ml-40 p-4 relative'>

      <section className='p-4 my-6 sm:mb-4'>
        <span className='text-xl'>Olá</span>
        <h1 className='font-bold text-xl text-gray-500 flex '> {user?.username? user.username: "fulano"}</h1>
      </section>

      <section className=' grid grid-cols-1  md:grid-cols-2 gap-4 lg:grid-cols-4 '>
          <Card className='p-5 shadow'>
            <div className='flex items-center justify-center '>
              <CardTitle className='text-ls sm:text-xl text-gray-600 select-none'>
                  Saldo Atual
              </CardTitle>
              <DollarSign className='ml-auto w-4 h-4'/>
            </div>

            <CardDescription>
              Seu saldo atual 
            </CardDescription>
            <CardHeader>
              <p className={`text-4xl ${saldo? "text-red-500": 'text-green-600'} select-none font-bold`}>R$ { 562}</p>
            </CardHeader>

            <div className='flex gap-3 sm:mt-[50px]'>
              <Button onClick={()=>{setShowModal(!showModal), setClickedButton("botaoMaisReceita")}} className='bg-green-400 hover:bg-green-800'>+ Receita</Button>
              <Button onClick={()=>{setShowModal(!showModal), setClickedButton("botaoDespesas")}} className='bg-red-400 hover:bg-red-800'>Registrar despesas</Button>
            </div>
             
          </Card>

          <Card className='p-5 md:w-[30vw] sm:w-full shadow'>
            <div className='flex fi items-center justify-center '>
              <CardTitle className='text-ls sm:text-xl text-gray-600 select-none'>
              Ultimas transações
              </CardTitle>
              <DollarSign className='ml-auto w-4 h-4'/>
            </div>

            <div className='py-6 '>
            <ul>
            {TransacoesQuery.data?.utlimasCincoTrasacoes.map((transacao:UltmaTransacao) => (
             <li key={transacao.transacao_id} className='border-b'>
            <CardDescription className='flex justify-center items-center gap-3 '>
            <Link href='#'  
                    className='flex h-4 w-4 bg-primary rounded-full text-lg items-center
                     justify-center text-primary-foreground md:text-base gap-2' >
                      <Avatar>
                    <AvatarImage src={transacao?.usuario_imagem} alt={transacao.usuario_nome} className=' h-4 w-4 rounded-full'/>
                    <AvatarFallback>CN</AvatarFallback>
                    <span className='sr-only'>Imagem do useuario</span>
                      </Avatar>
                    </Link>
                      <p>{transacao.usuario_nome}</p>
                      <p>Tipo: {transacao.tipo}</p>
                      <p>Valor: R${transacao.valor}</p>
                      <p>Data: {transacao.date}</p>
              </CardDescription>
          </li>
        ))}
      </ul>
            </div>
            
            <div className='flex gap-3'>
              <a  href={'/todasTrasacoes'} className='bg-green-400 hover:bg-green-800 font-bold p-1 text-white rounded-sm'>
              Ver todas
              </a>
              
            </div>
             
  </Card>
      </section>
      <section className='mt-4 sm:w-3/4'>
      <FinanceCharts/>
      </section>
      { showModal && (<section className=' z-10 top-0 bottom-0 right-0 left-0 fixed   justify-center bg-[#00000094] flex '>
        <form
      onSubmit={handleSubmit}
      className="sm:w-1/3 w-5/6 sm:h-[40vh] md:h-[75vh] h-[79vh] mt-[10vh] bg-white flex flex-col rounded-lg p-4"
    >
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold pb-3 text-gray-700">
          {clickedButton === "botaoMaisReceita" ? "Adicionar Receita" : "Registrar Despesa"}
        </h2>
      </div>
      {clickedButton === "botaoMaisReceita" ? (
        <div className="my-4">
        <label>Tipo</label>
        <select
          name="tipo"
          required
          value={formData.tipo}
          onChange={handleChange}
          className="cursor-pointer"
        >
          <option value="receita">receita</option>
        </select>
      </div>

      ) : (

        (
          <div className="my-4">
          <label>Tipo</label>
          <select
            name="tipo"
            required
            value={formData.tipo}
            onChange={handleChange}
            className="cursor-pointer"
          >
            <option value="despesa">despesa</option>
          </select>
        </div>
  
        )
      )}
      

      {/* Input Conta */}
      <div className="my-4">
        <label className="pr-2">Conta</label>
        <select
          name="conta_id"
          value={formData.conta_id || ''}
          onChange={handleChange}
          required
          className="cursor-pointer"
        >
          <option value="">Selecione</option>
          <option value={1}>Conta Corrente</option>
          <option value={2}>Poupança</option>
        </select>
      </div>

      {/* Input Categoria */}
      <div className="my-4">
        <label>Categoria</label>
        <select
        required
          name="categoria_id"
          value={formData.categoria_id || ''}
          onChange={handleChange}
          className="cursor-pointer"
        >
          <option value="">Selecione</option>
          <option value={1}>Alimentação</option>
          <option value={2}>Lazer</option>
          <option value={3}>Salário</option>
        </select>
      </div>

   

      {/* Input Descrição */}
      <div className="my-4">
        <label>Descrição</label>
        <input
          type="text"
          name="descricao"
          placeholder="Descrição opcional"
          value={formData.descricao}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Input Valor */}
      <div className="my-4">
        <label>Valor</label>
        <input
        className="w-full border rounded px-2 py-1"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          required
        />
      </div>
      {errors && <span className="text-red-500 my-3">{errors}</span>}

      {/* Botões */}
      <div className="flex gap-3 sm:mt-[15px]">
        <Button type="submit" className="bg-green-400 hover:bg-green-800 text-lg" >
          Salvar
        </Button>
        <Button
          type="button"
          onClick={() => setShowModal(!showModal)}
          className="bg-red-400 hover:bg-red-800 text-lg"
        >
          Cancelar
        </Button>
      </div>
    </form>
    </section>)

      }

    </main>
  )
}

export default Main;