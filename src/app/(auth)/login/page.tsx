"use client";
import AuthInput from '@/components/InputAuth';
import Link from 'next/link';

import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== email) {
      alert('As senhas não coincidem!');
      return;
    }
        
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

