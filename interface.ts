import { ReactNode } from 'react'

export interface IAuthInput{
  label:string,
  newState:(state: string)=>void,
  Ispassword?:boolean,
  placeholder?:string
}

export interface IFROM{
  handleSubmit:(e: React.FormEvent)=>void,
  children:ReactNode
}