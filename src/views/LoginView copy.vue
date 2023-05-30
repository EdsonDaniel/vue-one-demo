<script setup>
import { reactive } from "vue";
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

import loginHeader from "@/components/HeaderLogin.vue";
import { useMainStore } from "@/stores/main.js";

const form = reactive({
  //login: "john.doe",
  login: "",
  //pass: "highly-secure-password-fYjUw-",
  pass: "",
  remember: true,
});

const router = useRouter();

const submit2 = () => {
 
  router.push("/dashboard");
};
const user = useMainStore();
const login = function(){
  console.log("login");
  user.setUser({
  name: "John Doe",
  email: "john@example.com",
  avatar:
    "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",

});
  console.log(user);
  console.log(user.userName);
  router.push("/dashboard");
  console.log("login2")
  //console.log(router)
  router.push({ path : '/dashboard' });
}

const submitLogin = function(){
  const user = postData("")
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      
      <div class="mtneg">
        <div>
          <loginHeader></loginHeader>
        </div>
      
        <div>
          <CardBox :class="cardClass" is-form has-header @submit.prevent="login">
          
            <!--<FormField label="Login" help="Please enter your login">-->
            <FormField label="Usuario" >
              <FormControl
                v-model="form.login"
                :icon="mdiAccount"
                name="login"
                otherClasses="uppercase"
                required=true
                refs="input-focus"
              />
            </FormField>
    
            <FormField label="Clave">
              <FormControl
                v-model="form.pass"
                :icon="mdiAsterisk"
                type="password"
                name="password"
                
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
                <BaseButton type="submit" color="info" label="Iniciar Sesión" otherClasses="w-full"/>
                <!--<BaseButton to="/dashboard" color="info" outline label="Back" />-->
              </BaseButtons>
            </template>
          </CardBox>
        </div>
        
      </div>
      
    </SectionFullScreen>
  </LayoutGuest>
</template>
