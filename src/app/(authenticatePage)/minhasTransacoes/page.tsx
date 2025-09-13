'use client'

import TodasTransacoes from "../../../components/transacaes/Transacoes";

export default function MinhasTransacoes(){
  return(
    <div className=" px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Minhas Transações</h1>
        <p className="text-gray-600 mt-2">Gerencie suas transações pessoais</p>
      </div>
      <TodasTransacoes/> 
    </div>
  )
}