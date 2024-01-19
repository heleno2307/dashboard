import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import Image from 'next/image';
import logo from '../../../public/logo.png'
import style from './Login.module.scss'
import { FormEvent, useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import getUser from "@/routes/getUser";
import Toast from "../Toast/Toast";
import { useToast } from "@/context/toastContext";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/router";

type Data ={
  access_token:string;
  refresh_token:string;
  expires_in:number;
  scope: string;
  token_type:string
}

const Login = ()=>{
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const inputUserRef = useRef<HTMLInputElement>(null);
  const [btn,setBtn] = useState(true);
  const {showToast} = useToast();
  const {hendlerUser} = useUserContext();
  const router = useRouter()
  const BASE_URL = process.env.NEXT_PUBLIC_API_LOGIN;


  const hendlerForm = async(ev:FormEvent)=>{
    ev.preventDefault();
    setBtn(false);

    const user =inputUserRef.current?.value;
    const password = inputPasswordRef.current?.value;

    // checa se algum campo não foi preenchido.
    if(!password || !user){
      setBtn(true);
      showToast('erro','Usuário não informado',2000);
      return;
    } 

    try {
      if(!BASE_URL)return;
      const data = await getUser(BASE_URL,user,password);

      // checa se o retorno da api veio com algum erro.
      if(!checkData(data)){
        setBtn(true);
        inputPasswordRef.current.value = '';
        inputUserRef.current.value = '';
        return;
      } 
      
      //altera os estados 
      setBtn(true);
      saveUser(data,user);
      router.push('/Dashboard');
    } catch (error) {
      console.log(error)
    }
  }

  //CHECA O RETORNO DA API 
  const checkData = (data:{data:{code:number},status?:number})=>{
    if(data.data?.code == 401){
      setBtn(true);
      showToast('erro','Usuario invalido',2000);
      return false;
    }else if(data?.status == 404){
      showToast('erro','Erro 02 Falha de conexão',2000);
      return false;
    }else{
      return true;
    }
  }

  //SALVA OS DADOS DO USUARIO
  const saveUser = (data:Data,userLogin:string)=>{
    const user = {
      code:userLogin,
      data,
    }
    sessionStorage.setItem('user',JSON.stringify(user));
    hendlerUser(userLogin,data);
  }
  
  return(
      <main className={style.main_login}>
      <form 
        className={style.login}
        onSubmit={hendlerForm}
      >
        <Image src={logo} alt='logo' width={200} height={45} className={style.img}/>
        <div className={style.input_login}>
          <label htmlFor="user">
            <FaUser className={style.icon_login} />
          </label>
          <input type="text" placeholder='Digite o seu Usuário' id='user' ref={inputUserRef}/>
        </div>
        <div className={style.input_login}>
          <label htmlFor="password">
            <RiLockPasswordLine className={style.icon_login} />
          </label>
          <input type="password" placeholder='Digite sua senha'  id='password' ref={inputPasswordRef}/>
        </div>
        <button 
          type="submit" 
          className={style.btn_login}
          disabled={btn?false:true}
        >
          {btn?<p>Entrar</p>:null}
          {btn?<CiLogin className={style.icon}/>:<ImSpinner2 className={style.spin}/>}
        </button>
      </form>
      <Toast/>
    </main>
  );
}


export default Login;