"use client";

import ChartOverview from '@/components/chart';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users } from 'lucide-react';
function Main() {
  return(
    <main className='sm:ml-40 p-4'>
      <section className=' grid grid-cols-2 gap-4 lg:grid-cols-4 '>
          <Card className='p-5'>
            <div className='flex items-center justify-center '>
              <CardTitle className='text-ls sm:text-xl text-gray-600 select-none'>
                  Total Vendas
              </CardTitle>
              <DollarSign className='ml-auto w-4 h-4'/>
            </div>

            <CardDescription>
              Total vendas em 90 dias
            </CardDescription>
            <CardHeader>
              <p>R$ 400.000</p>
            </CardHeader>

          </Card>

          <Card className='p-5'>
            <div className='flex items-center justify-center '>
              <CardTitle className='text-ls sm:text-xl text-gray-600 select-none'>
                  Novos Clientes 
              </CardTitle>
              <Users className='ml-auto w-4 h-4'/>
            </div>

            <CardDescription>
              Novos Clientes em 30 dias
            </CardDescription>
            <CardHeader>
              <p>3265</p>
            </CardHeader>

          </Card>
      </section>

      <ChartOverview/>
    </main>
  )
}

export default Main;