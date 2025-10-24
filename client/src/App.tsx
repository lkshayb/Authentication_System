import './App.css'
function App() {

  return (
    <div className='overflow max-h-screen max-w-screen '>
      <div className='absolute h-full w-full bg-blue-100/50 backdrop-blur-5xl'></div>
      
      <div className='fixed blur-[100px] -z-10 -right-200 bg-[#7F30FF]  h-[70vh] w-[1500px] rounded-full rotate-[45deg]'></div>
      <div className='fixed blur-[100px]  -z-10 -right-70 top-100 bg-[#00B0FF]  h-[70vh] w-[800px] rounded-full rotate-[45deg]'></div>
      <div className='fixed blur-[100px]  -z-10 right-70 bg-[#0038FF] top-110  h-[600px] w-[600px] rounded-full'></div> 
      <div className='fixed blur-[100px]  -z-10 right-120 bg-[#FF4880] top-110  h-[80vh] w-[900px] rounded-full rotate-[90deg]'></div> 
      <div className='fixed blur-[100px]  -z-10 -left-70 bg-[#FF8000] top-140  h-[80vh] w-[900px] rounded-full rotate-[90deg]'></div> 
     
    </div>
    
  )
}


export default App
