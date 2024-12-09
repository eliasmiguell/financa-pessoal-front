import Link from 'next/link';
import { UltimasTransacoes } from '../../../hooks/useSaldoAtual';
import { UltmaTransacao } from '../../../interface';
import { CardDescription } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

function TodasTrasacoes() {

  const TransacoesQuery= UltimasTransacoes();
  return(
    <div className='py-6'>
            {TransacoesQuery.data?.todasTrasacoes.map((transacao:UltmaTransacao) => (
            <CardDescription className='flex w-full h-14 items-center gap-3 border-b py-3' key={transacao.transacao_id}>
            <Link href='#'  
                    className='flex h-4 w-4 bg-primary rounded-full text-lg items-center
                     justify-center text-primary-foreground md:text-base gap-2' >
                      <Avatar>
                    <AvatarImage src={transacao?.usuario_imagem && transacao?.usuario_imagem} alt={transacao.usuario_nome} className=' h-10 w-10 object-cove rounded-full'/>
                    <AvatarFallback>CN</AvatarFallback>
                    <span className='sr-only'>Imagem do useuario</span>
                      </Avatar>
                    </Link>
                      <p className='ml-3 font-semibold'>{transacao.usuario_nome}</p>
                      <p>Tipo: {transacao.tipo}</p>
                      <p className='font-bold'>Valor: R${transacao.valor}</p>
                      <p>Data: {transacao.date}</p>
              </CardDescription>
        ))}
      </div>

  )
  
}
export default TodasTrasacoes