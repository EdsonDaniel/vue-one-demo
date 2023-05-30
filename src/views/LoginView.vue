<script setup>
import { reactive,ref } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import {postData} from "@/stores/postData.js";
import LoginCard from "@/components/LoginCard.vue"
import { baseUrl } from "@/stores/main";
import loginHeader from "@/components/HeaderLogin.vue";
import { useMainStore } from "@/stores/main.js";
import CardBoxModal from "@/components/CardBoxModal.vue";

const form = reactive({
  usuario: "",
  clave: "",
  remember: true,
});
const loading = ref(false);
const router = useRouter();
const user = useMainStore();
const login = function(nombre, token, nom_corto, tipo_rol, numComprador, sexo){
  //console.log("login");
  nombre = nombre.split(" ");
  //let gen = sexo == 1 ? "/img/man.png" : "/img/woman.png"
  user.setUser({
  name: nombre[0],
  email: token,
  nomCto: nom_corto,
  rol: tipo_rol,
  numComprador: numComprador,
  avatar: sexo == 1 ? "/img/man.png" : "/img/woman.png"
    //"https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",
    //"/img/man.png"

});
  //console.log("user loged:")
  //console.log(user);
  //console.log(user.userName);
  //console.log(user.rol);
  //router.push("/capturar");
  //console.log(router)
  router.push({ path : '/capturar' });
}

function setErrores(msg, input){
  document.getElementById(input).textContent(msg);
}

const submitLogin =async function(){
  loading.value = true;
  const respuesta = await postData(baseUrl + "login",form)
  //console.log("submiting")
  //console.log(respuesta);
  let data = await respuesta.json();
  if(respuesta.ok){
    //console.log(data, data.nombre_lar, data.rol, data.nomCto)
    login(data.nombre_lar, data.token, data.nomCto, data.rol, data.numcomp,data.sexo);
    return;
  }
  
  loading.value = false;
  switch(respuesta.status){
    case 420:
      errorMsg2.value = data.message;
      return
    case 421:
    case 422:
      errorMsg1.value = data.message;
      return
  }
}


const downNavigation = function(event){
  if(event.key == 'Enter' || event.key == 'ArrowDown'){
    event.preventDefault();
    document.getElementById('password').focus();
  }
}

const upNavigation = function(event){
  if(event.key == 'ArrowUp'){
    let prev = document.getElementById('login').focus();
    return;
  }
}

function prevent(event) {
  if(event.key == 'Enter'){
    event.preventDefault()
    return;
  }
}

function onInputChange(event) {
  errorMsg1.value=""
  errorMsg2.value=""
}
const errorMsg1 = ref("");
const errorMsg2 = ref("");
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">

    <CardBoxModal
    :hasFooter="false"
    v-model="loading"
    :blocked="true"
    title="Cargando información"
  >
      <img src="/img/loading.gif" alt="" class="block mx-auto">
    </CardBoxModal>
      
        <div class="mtneg">
          <loginHeader></loginHeader> 
        </div>
        
          <CardBox :class="cardClass" is-form has-header 
          @submit.prevent="submitLogin"
          >
            
      
            <!--<FormField label="Login" help="Please enter your login">-->
            <FormField label="Usuario" class="mb-5" >
              <FormControl
                v-model="form.usuario"
                :icon="mdiAccount"
                id="login"
                name="login"
                otherClasses="uppercase"
                required
                refs="input-focus"
                @keydown="downNavigation"
                @keyup.prevent="prevent"
                @change="onInputChange"
                :errorMsg="errorMsg1"
              />
            </FormField>
    
            <FormField label="Clave">
              <FormControl
                v-model="form.clave"
                id="password"
                :icon="mdiAsterisk"
                required
                type="password"
                name="password"
                @keydown="upNavigation"
                @keyup.prevent
                @change="onInputChange"
                :errorMsg="errorMsg2"
              />
            </FormField>
    
            <!--
            <FormCheckRadio
              v-model="form.remember"
              name="remember"
              label="Remember"
              :input-value="true"
            />-->
    
            <template #footer>
              <BaseButtons>
                <BaseButton type="submit" color="info" 
                label="Iniciar Sesión" otherClasses="w-full"/>
                <!--<BaseButton to="/dashboard" color="info" outline label="Back" />-->
              </BaseButtons>
            </template>
          </CardBox>
        
        
      
    </SectionFullScreen>
  </LayoutGuest>
</template>
