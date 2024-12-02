"use client";
import AuthInput from '@/components/InputAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import React, { useContext, useState } from 'react';
import { makeRequest } from '../../../../axios';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser}= useContext(UserContext)

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await makeRequest.post('/authlogin', {email, password})
     .then((res)=>{
      localStorage.setItem("financa:user", JSON.stringify(res.data.user))
      setUser(res.data.user)
      router.push('/main')
      return true;
     }).catch((error)=>{
      toast.error(error.response.data.message);
      console.log(error);
      return null;
     })
        
  };

  return (
    <>
          <h2 className="text-3xl font-semibold text-center text-gray-700">Finanças Pessoal</h2>
            <div>
              <div>
                <AuthInput placeholder="Digite seu email" label={'E-mail'} newState={setEmail}/>
              </div>
              <div>
               <AuthInput placeholder="Digite sua senha" label='Senha' newState={setPassword}  Ispassword/>
              </div>
              <button
              onClick={(e)=>handleSubmit(e)}
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Entrar
              </button>

            </div>
          <p className="text-center text-sm text-gray-500">
            Não tem uma conta? 
            <Link href='/register' className="text-blue-600 hover:underline">
              Criar uma conta
            </Link>
          </p>
     
          </>
  );
};

export default LoginPage;

