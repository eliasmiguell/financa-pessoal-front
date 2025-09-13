'use client'
import Link from 'next/link';
import { UltimasTransacoes } from '../../../hooks/useSaldoAtual';
import { UltmaTransacao } from '../../../interface';
import { CardDescription } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

function TodasTransacoes() {
  const TransacoesQuery = UltimasTransacoes();
  
  if (TransacoesQuery.isLoading) {
    return (
      <div className="py-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (TransacoesQuery.isError) {
    return (
      <div className="py-6">
        <div className="text-center text-red-500">
          Erro ao carregar transações
        </div>
      </div>
    );
  }

  const transacoes = TransacoesQuery.data?.todasTrasacoes || [];

  return (
    <div className="py-6">
      {transacoes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Nenhuma transação encontrada
        </div>
      ) : (
        transacoes.map((transacao: UltmaTransacao) => (
          <CardDescription
            className="flex w-full h-14 items-center gap-3 border-b py-3"
            key={transacao.transacao_id}
          >
            <Link
              href="#"
              className="flex h-4 w-4 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
            >
              <Avatar>
                <AvatarImage
                  src={transacao?.usuario_imagem ?? ""}
                  alt={transacao.usuario_nome}
                  className="h-10 w-10 object-cover rounded-full"
                />
                <AvatarFallback>CN</AvatarFallback>
                <span className="sr-only">Imagem do usuário</span>
              </Avatar>
            </Link>
            <p className="ml-3 font-semibold">{transacao.usuario_nome}</p>
            <p>Tipo: {transacao.tipo}</p>
            <p className="font-bold">Valor: R${transacao.valor}</p>
            <p>Data: {transacao.date}</p>
          </CardDescription>
        ))
      )}
    </div>
  );
}

export default TodasTransacoes;
