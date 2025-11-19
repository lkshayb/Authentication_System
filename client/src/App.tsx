import { useEffect, useRef, useState } from 'react'
import {Github,Linkedin} from 'lucide-react'
import './App.css'



function App() {
  const [isReturnedUser,setisReturnedUser] = useState<Boolean | null>(false);
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [level,setlevel] = useState(0);
  setlevel(0)
  useEffect(() => {

    if(localStorage.getItem("hasVisited")) setisReturnedUser(true);

    else{
      localStorage.setItem("hasVisited","true");
      setisReturnedUser(false)
    }

  },[])

  if(isReturnedUser === null) return null;
  
  const handleSubmit = () => {
    setLoading(true);

    if(isReturnedUser){
      console.log("Proceeding Login for : \n Email : ",email.current?.value,"\n Password : ",password.current?.value)
    }
    console.log("Submit triggered")
    
  }

  function RootComp(){
    return (
      <div className=' rounded-xl py-10 mx-5 w-110 min-w-80 bg-white/90 shadow-lg flex flex-col text-center duration-300 '>
        <span className='font-sans font-medium text-lg'>{isReturnedUser ? "Welcome back, Captain!" : "Looks like you're new here!"}</span>
        <span className='font-sans font-medium text-xs text-gray-400'>{isReturnedUser ? "We missed you! Please enter your details." : "Let's create a new account for you"}</span> 
        <div className='text-left mt-10 text-sm font-semibold flex flex-col mx-12'>
          <div className='flex-col flex'>
            <span className='ml-4'>{isReturnedUser ? "Email/Username" : "Email"}</span>
            <input type="text" ref={email} className='mt-1 mb-4 duration-300 border-1 border-gray-300 placeholder-gray-300 focus:placeholder-gray-400 placeholder:font-semibold focus:border-gray-500 focus:outline-none rounded-xl py-3 px-4' placeholder={`${isReturnedUser ? "Enter your Email or Username": "Enter your Email"}`} />
          </div>
          <div className={`${isReturnedUser ? "flex flex-col":"hidden"}`}>
            <span className='ml-4'>Password</span>
            <input type="password" ref={password} className='mt-1 duration-300 border-1 border-gray-300 placeholder-gray-300 focus:placeholder-gray-400 placeholder:font-semibold focus:border-gray-500 focus:outline-none rounded-xl py-3 px-4' placeholder='Enter Password ' />
          </div>
          <button onClick={handleSubmit}  className={`mt-6 bg-gradient-to-tr from-blue-400 to-blue-600 text-white/90 px-4 py-3 rounded-xl duration-300 ${loading ? "opacity-70 cursor-not-allowed":"hover:opacity-90 cursor-pointer"}`}>
            {loading ? "Loading" : isReturnedUser ? "Login" : "SignUp" }
          </button>
          <span className='text-gray-600 text-center mt-10'>{isReturnedUser ? "Don't have an account? " : "Already have an account? "} <span onClick={() => setisReturnedUser(e => !e)} className='text-blue-600 cursor-pointer'>{isReturnedUser ? "Sign Up" : "Login"}</span></span>
        </div>
      </div>
    )
  }

  return (
    <div className='overflow max-h-screen max-w-screen '>
      <div className='absolute h-full w-full bg-blue-100/50 backdrop-blur-5xl flex justify-center items-center'>
        <div className='absolute flex gap-5 right-0 bottom-0 mx-7 my-4'>
          <a className=' cursor-pointer hover:text-black/50 duration-300' target='_blank' href='https://github.com/lkshayb'><Github/></a>
          <a className=' cursor-pointer hover:text-black/50 duration-300' target='_blank' href='https://linkedin.com/in/lkshayb'><Linkedin/></a>
        </div>
        {level == 0 ? <RootComp/>: ""}
        
      </div>
      <div className='fixed blur-[100px] -z-10 -right-200 bg-[#7F30FF]  h-[70vh] w-[1500px] rounded-full rotate-[45deg]'></div>
      <div className='fixed blur-[100px]  -z-10 -right-70 top-100 bg-[#00B0FF]  h-[70vh] w-[800px] rounded-full rotate-[45deg]'></div>
      <div className='fixed blur-[100px]  -z-10 right-70 bg-[#0038FF] top-110  h-[600px] w-[600px] rounded-full'></div> 
      <div className='fixed blur-[100px]  -z-10 right-120 bg-[#FF4880] top-110  h-[80vh] w-[900px] rounded-full rotate-[90deg]'></div> 
      <div className='fixed blur-[100px]  -z-10 -left-70 bg-[#FF8000] top-140  h-[80vh] w-[900px] rounded-full rotate-[90deg]'></div> 
      
     
    </div>
    
  )
}


export default App
