import { z } from 'zod';

export const despesaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  type: z.enum(['FIXA', 'IMPREVISTA', 'PENDENTE'], {
    required_error: 'Tipo de despesa é obrigatório',
  }),
  status: z.enum(['PAGO', 'PENDENTE', 'ATRASADO'], {
    required_error: 'Status é obrigatório',
  }),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.string().optional(),
});

export type DespesaFormData = z.infer<typeof despesaSchema>;

export const receitaSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Valor deve ser um número positivo'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  receivedDate: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.string().optional(),
});

export type ReceitaFormData = z.infer<typeof receitaSchema>;
