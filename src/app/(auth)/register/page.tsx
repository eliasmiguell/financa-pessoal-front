"use client";
import React, { useState } from 'react';
import { toast} from 'react-toastify';
import AuthInput from '@/components/InputAuth';
import Link from 'next/link';
import { makeRequest } from '../../../../axios';




const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await makeRequest.post("/authregister", {username, email, password, confirmPassword})
    .then((res)=>{
      setUsername(' ');
      setEmail(' ');
      setPassword(' ');
      setConfirmPassword(' ');
      toast.success(res.data.message)
      return true
    }).catch((err)=>{
    toast.error(err.response.data.message)
     console.log(err)
     return null
    }) 
  };

  return (
  <>
    <h2 className="text-3xl font-semibold text-center text-gray-700">Crie sua conta</h2>
      <div>
        <div>
          <AuthInput placeholder="Digite seu nome" label='Nome' newState={setUsername}/>
        </div>
        <div>
          <AuthInput placeholder="Digite seu e-mail" label='E-mail' newState={setEmail}/>
        </div>
        <div>
          <AuthInput placeholder="Digite sua senha" label='Senha' newState={setPassword} Ispassword/>
        </div>
        <div>
          <AuthInput placeholder="Confirme sua senha" label='Confirme senha' newState={setConfirmPassword} Ispassword/>
        </div>
          <button
            type="submit"
            onClick={(e)=>handleSubmit(e)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Criar Conta
          </button>
      </div>
      <p className="text-center text-sm text-gray-500">
          Já tem uma conta?
      <Link href="/login" className="text-blue-600 hover:underline">
        Fazer Login
      </Link>
    </p>
  </>
  );
};

export default RegisterPage;

