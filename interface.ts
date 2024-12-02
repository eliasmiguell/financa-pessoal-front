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

export interface IUser {
  user: {
    id: number;
    email: string;
    username: string;
    userimg: string;
    bgimg: string;
  } | undefined;

  setUser: (newState: any) => void;
}

export interface ContextProps {
  children: React.ReactNode;
}

