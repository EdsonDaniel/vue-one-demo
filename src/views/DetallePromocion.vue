<script setup>
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub,} 
from "@mdi/js";
import { reactive, ref,onMounted,onBeforeMount, computed } from "vue";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import Accordion from "@/components/Accordion.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import TableHdrPrm from "@/components/TableHdrPrm.vue";
import TableDetPrm from "@/components/TableDetPrm.vue";
import TableDetPrmReg from "@/components/TableDetPrmReg.vue";
import {getData} from "@/stores/getData.js";
import { useMainStore } from "@/stores/main.js";
import { baseUrl } from "@/stores/main";
import { useRouter } from "vue-router";
const cabecera = computed(() => datos.value.prom)
//(/console.log(cabecera, "cabecera")
const router = useRouter();
const loading = ref(true);
//const artCapturados = computed(() => artcap.value);
const user = useMainStore();
const datos = ref([]);
const sucursales = computed(() => datos.value.suc)
async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  //console.log(response);
  return response.json(); 
}
const arts = computed(() => articulos.value)
const getDetalles = async function (){
  let response = await getData(baseUrl 
  + 'promocion?idprom='+ user.numProm +'&compr=' + user.nomCto)
  //console.log("response", response);
  if(response.ok) {
    await response.json().then(data => {
      //console.log(data.prom)
      datos.value = data;
      articulos.value = datos.value.arts;
      console.log(datos.value.arts)
      });
  } else {
    console.log('Respuesta de red OK pero respuesta HTTP no OK');
    return {};
  }
}
const articulos = ref([]);
const estado = ref(1);
onMounted(async function() {
  await getDetalles();
  //console.log("datos")
  //console.log(datos.value)
  let creado = new Date(datos.value.prom.created_at)
  let actualizado = "------------";
  if(datos.value.prom.updated_at != null){
    let updated_at = new Date(datos.value.prom.updated_at);
    actualizado  = updated_at.toLocaleString('es', { timeZone: 'America/Chihuahua' })
  }
  creado = creado.toLocaleString('es', { timeZone: 'America/Chihuahua' })
  document.getElementById("created_at").textContent = creado
  document.getElementById("updated_at").textContent = actualizado
  loading.value = false;
  estado.value = datos.value.prom.status;
  /*switch(parseInt(estado.value)){
    case -2:
    case 0:
    case 1:
    case 2:

      
  }*/
  if(parseInt(estado.value) == -1){
    mostrarBtns();
    //console.log("Se puede editar")
  }else {
    ocultarBtns();
    //console.log("No se puede editar")
  }

  //console.log(cabecera.value)
  //console.log(cabecera.value.tpoProm)
  //console.log(promPrecio.value, "tipo de promo")
  promPrecio.value = cabecera.value.tpoProm == 1
})

function ocultarBtns(){
  let btns = document.getElementsByClassName("btns")
  for (let i = 0; i < btns.length; i++) {
    const element = btns[i];
    element.classList.add("hidden")
  }
}
function mostrarBtns(){
  let btns = document.getElementsByClassName("btns")
  for (let i = 0; i < btns.length; i++) {
    const element = btns[i];
    element.classList.remove("hidden")
  }
}
const errores = ref(false);
const promPrecio = ref(true)
const confirmEliminar = ref(false);
const eliminadaCorrectamente = ref(false);
const errMsg = ref("");
function eliminar(){
  confirmEliminar.value = true;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function eliminarProm(){
  loading.value = true;
  postData(baseUrl+'delete-prm?idprom='+user.numProm, "")
  .then(async data => {
    console.log("respuesta post")
    console.log(data);
    //Si tiene errores
    if ('error' in data){
      console.log("Tiene errores")
      loading.value = false;
      errMsg.value = "Ocurrió un error al guardar. " + data.error;
      errores.value = true;
    }else{
      console.log("NO tiene errores")
      loading.value = false;
      eliminadaCorrectamente.value = true;
      await sleep(1500);
      eliminadaCorrectamente.value = false;
      router.push({ path : '/mis-capturas' });
    }
  });
  console.log("Eliminado")
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBoxModal
        :hasFooter="false"
        v-model="loading"
        :blocked="true"
        title="Cargando la información"
      >
        <img src="/img/loading.gif" alt="" class="block mx-auto">
      </CardBoxModal>

      <CardBoxModal
        v-model="confirmEliminar"
        title="Eliminar formato de promoción"
        button="success"
        :hasFooter="true"
        hasButton
        hasCancel
        @confirm="eliminarProm"
      >
          <p>¿Está seguro que desea eliminar esta promoción? </p>
      </CardBoxModal>

      <CardBoxModal
        :hasFooter="false"
        v-model="eliminadaCorrectamente"
        title="Promoción eliminada correctamente"
        :blocked="true"
      >
        <img src="/img/checked.png" alt="" class="block mx-auto">
      </CardBoxModal>

      <CardBoxModal
        v-model="errores"
        title="No se pudo guardar la promoción"
        button="secondary"
        hasButton
      >
          <p>{{errMsg}}</p>
      </CardBoxModal>

      <SectionTitleLineWithButton 
      title="Detalle de Promoción" hasBack="/mis-capturas" alto="h-8" ancho="w-8">
      <div>Creada el: <span id="created_at"></span></div>
      <div>Últ. actualización: <span id="updated_at"></span></div>
      <div>
        <BaseButton
            id="btn_edit"
            color="info"
            class="hidden btns mr-3"
              label="Editar"
              small
              data-label="promo.id"
              to="/editar-prom"
            />

        <BaseButton
            id="btn_delete"
            color="danger"
            class="hidden btns"
              label="Eliminar"
              small
              data-label="promo.id"
              @click="eliminar"
            />
      </div>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6">
        <TableHdrPrm :prmhdr="cabecera" :sucs="sucursales"/>
        <BaseDivider />

        <h1 class="leading-tight text-lg underline 
        underline-offset-4  font-medium">Artículos Capturados: {{arts.length}}</h1>
        <div class="my-6"></div>
        <TableDetPrm :promos="articulos" v-if="promPrecio"/>
        <!-- v-if="cabecera.value.tpoProm == '1'"
        <Accordion label="Descripción y Tipo" id="acc_desc">
        </Accordion>
        -->
        <TableDetPrmReg :promos="articulos" v-else/>
      </CardBox>

      <!--<CardBox class="mb-6" has-table>
        <TableSampleClients checkable />
      </CardBox>
-->
      <!--<SectionTitleLineWithButton :icon="mdiTableOff" title="Empty variation" />-->

      <!--<NotificationBar color="danger" :icon="mdiTableOff">
        <b>Empty table.</b> When there's nothing to show
      </NotificationBar>
      -->

      <!--
      <CardBox>
        <CardBoxComponentEmpty />
      </CardBox>
      -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
