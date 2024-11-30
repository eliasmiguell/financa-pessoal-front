import { IAuthInput } from '../../interface'

 const AuthInput = (props:IAuthInput)=>{
  return(
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-600">{props.label}</label>
      <input
      required
      placeholder={props.placeholder}
      onChange={(e)=>props.newState(e.currentTarget.value)}
        type={props.Ispassword? 'password':'text'}
        className="w-full mt-2 p-3 mt-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  )
}

export default AuthInput;