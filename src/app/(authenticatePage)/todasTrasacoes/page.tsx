'use client'

import TodasTransacoes from "@/components/transacaes/Transacoes";


function TodasTrasacoesPage() {

 
  return(
    <>
    <div className='sm:ml-[180px] ml-3 mt-4 flex fi items-center text-gray-600 select-none'>
              <span className='text-3xl font-bold'>Ultimas transações</span>        
    </div>
    <div className='sm:ml-[200px]  px-6'>
       
          <TodasTransacoes/> 
    </div>
    </>
  )
  
}
export default TodasTrasacoesPage