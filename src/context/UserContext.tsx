import { createContext, useEffect, useState } from 'react';
import { IUser as User, ContextProps} from '../../interface';

const initialValue = {
  user: undefined,
  setUser: () => {},
};

export const UserContext = createContext<User>(initialValue);

export const UserContextProvider = ({ children }: ContextProps) => {
  const [user, setUser] = useState(initialValue.user);
  
  useEffect(() => {
      const UserJSON = localStorage.getItem("rede-social:user");
      if (UserJSON) {
        setUser(JSON.parse(UserJSON));
      }
   
  }, []); // O useEffect executa uma vez, após o componente ser montado

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


// const initialValue = {
//   user: undefined,
//   setUser: () => {},
// };

// interface UserContextType {
//   user: User | undefined;
//   setUser: (user: User | undefined) => void;
// }

// export const UserContext = createContext<UserContextType>(initialValue);

// export const UserContextProvider = ({ children }: ContextProps) => {
//   const [user, setUser] = useState<User | undefined>(undefined);
  
//   useEffect(() => {
//       const UserJSON = localStorage.getItem("rede-social:user");
//       if (UserJSON) {
//         setUser(JSON.parse(UserJSON));
//       }
   
//   }, []); 

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };


