
function Form( {children}:{children:React.ReactNode}) {
  return(
    <main style={{ backgroundImage: `url(${'/image/images-fundo.jpeg'})`}}className=" relative min-h-screen inset-0 bg-center bg-gray-100">
   <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
   <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
    <form className="space-y-6 ">
          {children}
    </form>
    </div>
    </div>
  </main>
  )
}

export default Form;