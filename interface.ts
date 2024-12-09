import { ReactNode } from 'react'

export interface IAuthInput{
  label:string,
  newState:(state: string )=>void,
  Ispassword?:boolean,
  placeholder?:string,
  value?: string | number
}

export interface IFROM{
  handleSubmit:(e: React.FormEvent)=>void,
  children:ReactNode
}


export interface NewReceita {
  user_id: number;
  conta_id: number;
  categoria_id: number;
  descricao?: string;
  valor: number;
  tipo: string;
}

// Interface para uma transação
export interface Transacao {
  categoria_id: number;
  date: string;  
  tipo: 'receita' | 'despesa';
  valor: string; 
}

// Interface para uma categoria
export interface Categoria {
  categoria_id: number;
  categoria_nome: string;
  total_receita: string;
  total_despesa: string;
}

export interface UltmaTransacao {
  transacao_id: number;
  usuario_imagem:string;
  usuario_nome: string;
  tipo: string;
  valor: number;
  date: string;
}
// Interface para os dados da API
export interface GraficoData {
  dbtransacoes: Transacao[];
  dbcategorias: Categoria[];
}
