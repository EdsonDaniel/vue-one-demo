<script setup>
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub,} from "@mdi/js";
import { baseUrl } from "@/stores/main";
import { reactive, ref,onMounted,onBeforeMount, computed } from "vue";

import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TablePrmCapAut from "@/components/TablePrmCapAut.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLine from "@/components/SectionTitleLine.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import {postData} from "@/stores/postData.js";
import {getData} from "@/stores/getData.js";

import { useMainStore } from "@/stores/main.js";
const user = useMainStore();
const loading = ref(true);
const tieneCapturas = ref(false);
//const errores = ref(false);
const promos = computed(() => promociones.value);
const promociones = ref([]);
const detProm = ref("/capturar")

//const artCapturados = computed(() => artcap.value);
//const artcap = ref([]);


const getPromociones = async function (){
  let response = await getData(baseUrl + 'prom-aut?compr=' + user.nomCto)
  //console.log("response", response);
  if(response.ok) {
    await response.json().then(data => {
      //console.log(data)
      promociones.value = data;
      //console.log(promociones.value)
      });
  } else {
    console.log('Respuesta de red OK pero respuesta HTTP no OK');
    return {};
  }
}

onMounted(async function() {
  await getPromociones();
  tieneCapturas.value = Object.keys(promociones).length > 0;
  loading.value = false;
})

</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal
    :hasFooter="false"
    v-model="loading"
    :blocked="true"
    title="Cargando la información"
  >
    <img src="/img/loading.gif" alt="" class="block mx-auto">
  </CardBoxModal>
    <!--<CardBoxModal
      v-model="errores"
      title="No se pudo guardar la promoción"
      button="secondary"
      hasButton
    >
      <p>{{errMsg}}</p>
    </CardBoxModal>
-->

    <SectionMain>
      <SectionTitleLine :icon="mdiTableBorder" 
      title="Promociones Para Autorizar" main>
      </SectionTitleLine>
      <!---->
      <CardBox v-if="tieneCapturas" class="mb-6" has-table>
        <TablePrmCapAut :promos="promos" />
      </CardBox>

      <CardBox v-else>
        <CardBoxComponentEmpty />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
