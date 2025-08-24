import {Sheet, SheetTrigger, SheetContent} from '../ui/sheet';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Package, PanelBottom, Settings2, LogOut, LayoutDashboard, BarChart, DollarSign, HelpCircle, HelpCircleIcon} from 'lucide-react';
import {TooltipProvider, Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { useMutation } from '@tanstack/react-query';
import { makeRequest } from '../../../axios';
import { useRouter } from 'next/navigation';
export function Sidebar() {
  const {user, setUser}= useContext(UserContext);
  const router = useRouter()
   
  useEffect(() => {
    if (user && Array.isArray(user) && user.length > 0) {
      setUser({
        name: user[0].name,
        avatar: user[0].avatar,
        id: user[0].id,
        email: user[0].email,
      });
    }
  }, [user, setUser]);

  // useEffect(() => {
  //     if (user) {
  //       if(!user){
  //         return;
  //       }
  //     }
  //   }, [user, setUser]);

  const mutate = useMutation({
      mutationFn:async ()=> await makeRequest.post('/authlogout')
      .then((res)=>res.data),
      onSuccess:()=>{
        setUser(undefined)
        localStorage.removeItem("financa:user");
        router.push('/login')
        return true
      }, onError:((error)=>{
        console.log(error)
        return null
      })
      
  }
  )

  return(
    
    <div className='flex w-full flex-col bg-muted/40'>
      <aside 
      className="fixed inset-y-0 left-0 z-10 hidden border-r bg-background sm:flex flex-col"
      >
        <nav className='flex flex-col w-40  items-start gap-4 px-3 py-5'>
          <TooltipProvider>
          <div className='flex flex-row items-center justify-center gap-2'>
              <Link href={''} className='flex h-9 w-9  rounded-full items-center justify-center '>
              <Avatar >
              <AvatarImage src={user?.avatar && user?.avatar} className=' h-8 w-8 rounded-full'/>
              <AvatarFallback>CN</AvatarFallback>
              <span className='sr-only'>foto do usuario</span>
              </Avatar>
              </Link>
              <p className='font-bold'>{user?.name}</p>
              </div>
              
            <Tooltip>
              <TooltipTrigger asChild>
              
                <Link href='/main' className='flex  h-9 w-9 shrink-0  rounded-lg items-center justify-center text-muted-foreground  transition-colors hover:text-foreground'>
                <div className='flex  items-center justify-center gap-2 ml-[60px]'>
                <div className='flex shrink-0  justify-center items-center gap-2'>
                <LayoutDashboard className=' h-4 w-4 '/>
                <span className='sr-only'>Dashboard</span>
                </div>
                 <p>Dashboard</p>
                </div>
                </Link>
              </TooltipTrigger>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={'/todasTrasacoes'} className='flex h-9 w-9 shrink-0  rounded-lg items-center justify-center text-muted-foreground  transition-colors hover:text-foreground'>
                <div className='flex  items-center justify-center gap-2 ml-[60px]'>
                <div className='flex shrink-0  justify-center items-center gap-2'>
                <DollarSign className=' h-4 w-4 '/>
                <span className='sr-only'>Minhas Transações</span>
                </div>
                <p>Minhas Transações</p>
                </div>
                </Link>
              </TooltipTrigger>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={''} className='flex h-9 w-9 shrink-0  rounded-lg items-center justify-center text-muted-foreground  transition-colors hover:text-foreground'>
                <div className='flex  items-center justify-center gap-2 ml-[60px]'>
                <div className='flex shrink-0  justify-center items-center gap-2'>
                <BarChart className=' h-4 w-4 '/>
                <span className='sr-only'>Relatórios</span>
                </div>
                <span>Relatórios</span>
                </div>
                </Link>
              </TooltipTrigger>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={''} className='flex h-9 w-9 shrink-0  rounded-lg items-center justify-center text-muted-foreground  transition-colors hover:text-foreground'>
                <div className='flex  items-center justify-center gap-2 ml-10'>
                <div className='flex shrink-0  justify-center items-center gap-2'>
                <Settings2 className=' h-4 w-4 '/>
                <span className='sr-only'>configurações</span>
                </div>
                <span >config</span>
                </div>
                </Link>
              </TooltipTrigger>
              {/* <TooltipContent side="right">
                  Clientes
              </TooltipContent> */}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={''} className='flex h-9 w-9 shrink-0  rounded-lg items-center justify-center text-muted-foreground  transition-colors hover:text-foreground'>
                <div className='flex  items-center justify-center gap-2 ml-10'>
                <div className='flex shrink-0  justify-center items-center gap-2'>
                <HelpCircle className=' h-4 w-4 '/>
                <span className='sr-only'>Ajuda</span>
                </div>
                <span >Ajuda</span>
                </div>
                </Link>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
          
        </nav>
        <nav className='mt-auto flex flex-col  gap-4 px-2 py-5'>
            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={''} className='flex h-9 w-9 shrink-0  rounded-lg items-center justify-center text-muted-foreground  transition-colors hover:text-foreground'>
                <div className='flex  items-center justify-center gap-2 ml-10'>
                <div className='flex shrink-0  justify-center items-center gap-2'>
                <LogOut className=' h-4 w-4 text-red-500' onClick={()=>mutate.mutate()}/>
                <span className='sr-only'>Sair</span>
                </div>
                </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                  Sair 
              </TooltipContent>
            </Tooltip>
               
            </TooltipProvider>
        </nav>

      </aside>
      <div className='sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <header 
        className='sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 
        sm:h-auto sm:border-0 sm:bg-transparent sm:px-6
        '>
          <Sheet >
              <SheetTrigger>
                        <span className="sm:hidden">
              <PanelBottom className="w-6 h-6" />
              <span className="sr-only">Abrir / fechar menu</span>
            </span>
                  
              </SheetTrigger>
              <SheetContent side={'left'} className='sm:max-w-x'>
                <nav className='grid gap-6 text-lg font-medium'>
                  <span className='sr-only'>Imagem do useuario</span>
                  <div className='flex flex-row justify-center, items-center gap-3'>
                    <Link href={''}  
                    className='flex h-10 w-10 bg-primary rounded-full text-lg items-center
                     justify-center text-primary-foreground md:text-base gap-2' prefetch={false}>
                      <Avatar>
                    <AvatarImage src={user?.avatar && user?.avatar} className=' h-8 w-8 rounded-full'/>
                    <AvatarFallback>CN</AvatarFallback>
                    <span className='sr-only'>Imagem do useuario</span>
                      </Avatar>
                    </Link>
                    <p>{user?.name}</p>
                    </div>
                    <Link href={'/main'}  
                    className='flex items-center md:text-base px-2.5 gap-4 text-muted-foreground hover:text-foreground'>
                    <LayoutDashboard className='h-5 w-5 transition-all'/>
                    Dashboard
                    </Link>
                    <Link href={'/todasTrasacoes'}  
                    className='flex items-center md:text-base px-2.5 gap-4 text-muted-foreground hover:text-foreground'>
                    < DollarSign className='h-5 w-5 transition-all'/>
                    Minhas Transações
                    </Link>
                    <Link href={''}  
                    className='flex items-center md:text-base px-2.5 gap-4 text-muted-foreground hover:text-foreground'>
                    <BarChart className='h-5 w-5 transition-all'/>
                    Relatórios
                    </Link>
                    <Link href={''}  
                    className='flex items-center md:text-base px-2.5 gap-4 text-muted-foreground hover:text-foreground'>
                    <Settings2 className='h-5 w-5 transition-all'/>
                    Configurações
                    </Link>
                    <Link href={''}  
                    className='flex items-center md:text-base px-2.5 gap-4 text-muted-foreground hover:text-foreground'>
                    <HelpCircleIcon className='h-5 w-5 transition-all'/>
                    Ajuda
                    </Link>

                    <nav className='mt-auto flex-col'>
                     <Link href={'#'}  
                    className='flex  items-center md:text-base px-2.5 gap-4 text-muted-foreground hover:text-red-500'
                    onClick={()=>mutate.mutate()}
                    >
                    <LogOut className='h-5 w-5 transition-all' />
                    Sair
                    </Link>
                  </nav>
                </nav>
               
               
              </SheetContent>
             
              <h2>Menu</h2>
              
          </Sheet>
          
        </header>
      </div>

    </div>



  )
  
}