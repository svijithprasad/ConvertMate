import {  Loader2 } from 'lucide-react'


const Spinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin" />
    </div>
  )
}

export default Spinner
