<script setup>
import { baseUrl } from "@/stores/main";
import { computed, ref, reactive } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";

const props = defineProps({
  checkable: Boolean,
  arts: Array,
  campos: Object, Array
});
const mainStore = useMainStore();
const isModalActive = ref(false);
const isModalDangerActive = ref(false);
const perPage = ref(5);
const currentPage = ref(0);
const checkedRows = ref([]);
const itemsPaginated = computed(() =>
  props.arts.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(props.arts.length / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];
  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });
  return newArr;
};
function borrarArt(cve_art){
  let index = getIndexArtCap(cve_art);
  if(index < 0)
    return;
  props.arts.splice(index,1)
  limpiarCamposRegalo()

}
function getIndexArtCap(cve_art){
  for (let i = 0; i < props.arts.length; i++) {
    if(props.arts[i].cve == cve_art)
      return i;
  }
  return  -1;
}
const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === client.id
    );
  }
};

const loading = ref(false);

async function paraEditar(event){
  let element = event.target.closest('td')
  let cve = element.getAttribute("data-label");
  document.getElementById("cod_cob").setAttribute("data-label", cve)
  //console.log("A editar", cve)
  //console.log("datos form", props.campos)
  //console.log("datos form", props)
  //console.log("datos form2", props)
  //console.log("datos array", props.arts)
  let campos = props.campos;
  let index = buscarArt(cve)
  let articulo = props.arts[index];
  //console.log(articulo);
  
  campos.cobradas = articulo.cobradas
  campos.regaladas = articulo.regaladas
  campos.fac_min_reg = articulo.emp_reg
  campos.fac_min_compra = articulo.emp_cob
  campos.fac_min_regalo = articulo.fac_min_reg,
  campos.cod_reg = articulo.cod_reg
  //campos.art = articulo.art
  campos.cve = articulo.cve
  document.getElementById("desc_art_cob").value = articulo.des1
  document.getElementById("desc_art_reg").value = articulo.desc_reg

  document.getElementById("btn-upd-reg").classList.remove("hidden")
  document.getElementById("btn-cancel-reg").classList.remove("hidden")
  document.getElementById("add-reg").classList.add("hidden")
}

function limpiarCamposRegalo(){
  let campos = props.campos;
  
  campos.cobradas = 1
  campos.regaladas = 1
  campos.fac_min_reg = "PZA"
  campos.fac_min_compra = "PZA"
  campos.fac_min_regalo = 1
  campos.cod_reg = ""
  campos.cod_cob = ""
  campos.cve = ""
  document.getElementById("desc_art_cob").value = ""
  document.getElementById("desc_art_reg").value = ""

  document.getElementById("btn-upd-reg").classList.add("hidden")
  document.getElementById("btn-cancel-reg").classList.add("hidden")
  document.getElementById("add-reg").classList.remove("hidden")
}
const datos = ref({});
function buscarArt(cve){
  for(let i = 0; i<props.arts.length; i++){
    if(props.arts[i].cve == cve){
      return i;
    }
  }
  return -1;
}
function cargarPrecios(articulo){
    //console.log(articulo)
    if(!articulo.des1){
     document.getElementById("desc_art").textContent = "Código no encontrado";
     //document.getElementById("desc_art").classList.add("text-red-800")
     return false;
    }
    //cargando descripcion
    document.getElementById("desc_art").textContent = articulo.des1;
    //Cargando empaques
    document.getElementById("emp1").textContent = articulo.cant_pre0;
    document.getElementById("emp2").textContent = articulo.cant_pre1;
    document.getElementById("emp3").textContent = articulo.cant_pre2;
    document.getElementById("emp4").textContent = articulo.cant_pre3;
    document.getElementById("emp5").textContent = articulo.cant_pre4;
     //Cargando precios
    document.getElementById("precio1").textContent = formatPre(articulo.precio_vta0);
    document.getElementById("precio2").textContent = formatPre(articulo.precio_vta1);
    document.getElementById("precio3").textContent = formatPre(articulo.precio_vta2);
    document.getElementById("precio4").textContent = formatPre(articulo.precio_vta3);
    document.getElementById("precio5").textContent = formatPre(articulo.precio_vta4);
    let porcentajes = document.getElementsByClassName("per");
   
    return true;
}

function formatPre(precio){
  if(precio == null || precio == "" ){
    return "--------"
  }
  const preciof = new Intl.NumberFormat('es-MX',
        { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
  return preciof.format(precio);
}

</script>

<template>
<CardBoxModal
    :hasFooter="false"
    v-model="loading"
    :blocked="true"
    title="Cargando la información"
  >
    <img src="/img/loading.gif" alt="" class="block mx-auto">
  </CardBoxModal>
  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th class="text-center">Comprando</th>
        <th class="text-center" >Emp</th>
        <th class="text-center">Art</th>
        <th>Descripcion</th>
        <th class="text-center">Se regalan</th>
        <th class="text-center">Emp Reg</th>
        <th class="text-center">Art Reg</th>
        <th class="">Descripcion regalo</th>
        <th class="text-center">Fac Min Reg</th>
        <th/>
        <!--<th v-if="regalo" />-->
      </tr>
    </thead>
    <tbody>
      <tr v-for="art in itemsPaginated" :key="art.cve">
        <td :data-label="art.cve" class="text-center cursor-pointer" 
        @click="paraEditar">
          {{ parseFloat(art.cobradas) }}
        </td>
        <td :data-label="art.cve" class="text-center cursor-pointer" 
        @click="paraEditar">
          {{ art.emp_cob }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" 
        class="cursor-pointer text-center">
          {{ art.cve }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" class="cursor-pointer">
          {{ art.des1 }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" 
        class="cursor-pointer text-center">
          {{ parseFloat(art.regaladas) }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" 
        class="cursor-pointer text-center">
          {{ art.emp_reg }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" 
        class="cursor-pointer text-center">
          {{ art.cod_reg }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" class="cursor-pointer">
          {{ art.desc_reg }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" 
        class="cursor-pointer text-center">
          {{ parseFloat(art.fac_min_reg) }}
        </td>
        
        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              :data-label="art.cve"
              @click="borrarArt(art.cve)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Página {{ currentPageHuman }} de {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
