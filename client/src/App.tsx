import React, { useEffect, useState } from 'react';
import { TEngine } from "./TEngine/TEngine"
import socket from "./Socket/index"
import { BrowserType } from './utils'
import './App.css';
let platform=BrowserType()
function App() {
  const [alpha, setAlpha] = useState(0)
  const [beta, setBeta] = useState(0)
  const [gamma, setGamma] = useState(0)
  const [dtype, setdtype] = useState(0)
  function get(event: any) {

    let a = event.alpha;
    let b = event.beta;
    let g = event.gamma;
    setAlpha(a.toFixed(2))
    setBeta(b.toFixed(2))
    setGamma(g.toFixed(2))
    let t={a,b,g}
    socket.emit('orientation',t)
  }
  useEffect(() => {
    if (dtype===1) {
      
      window.addEventListener('deviceorientation',get );
      //@ts-ignore
      document.querySelector(".canvas-three").innerHTML=null
    } else if(dtype===2){
      window.removeEventListener('deviceorientation',get)
      const threeTarget = document.querySelector(".canvas-three")
      const TE = new TEngine(threeTarget as HTMLDivElement,platform)
      TE.loadGun()
      TE.loadRoom()
      socket.on('getdata',(event:any)=>{
        // console.log('getdata',event)
        let {a,b,g}=event
        TE.setRotate(a, b, g)
        setAlpha(a.toFixed(2))
        setBeta(b.toFixed(2))
        setGamma(g.toFixed(2))
      })
      window.addEventListener("keydown", (e) => {
        if (e.keyCode === 27) {
  
          TE.disableControls()
  
        } else if (e.keyCode === 17) {
          TE.enableControls()
        }
      })
    }
      
    


    

  }, [dtype])

  return (
    <div className="App">
<div className='info'>
        <div>左右：{
        alpha
      }</div>
      <div>前后：{
        beta
      }</div>
      <div>扭转：{
        gamma
      }</div>
       <div>{platform}</div>
      <div className='weaponbtn' onClick={(e)=>{
        let dom=e.target as HTMLDivElement;
        if(dtype===0){
          setdtype(1)
          dom.innerHTML='切换为环境'
        }else if(dtype===1){
          setdtype(2)
          dom.innerHTML='切换为环境'
        }else if( dtype===2){
          setdtype(1)
          dom.innerHTML='切换为武器'

        }
       
      }}>武器</div>
</div>

      <div className='canvas-three'></div>
     
    </div>
  );
}

export default App;
