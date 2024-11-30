import { IFROM } from '../../interface';

function Form(props:IFROM) {
  return(
    <form onSubmit={props.handleSubmit} className="space-y-6">
      {props.children}
    </form>
  )
}

export default Form;