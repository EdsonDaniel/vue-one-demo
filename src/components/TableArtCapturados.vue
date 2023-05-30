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
  console.log("A editar", cve)
  let sucBase = document.getElementById("sucbase").value;
  let prov = (document.getElementById("prov").value).slice(0,9);
  loading.value = true;
  document.getElementById("inputConsultar").setAttribute("cve",cve);

  await consultarCodigo(cve, sucBase, prov)
  //await cargarValoresEditar();
}
const datos = ref({});
function limpiarPrecios(){
    for (let i = 1; i < 6; i++) {
      let precio = document.getElementById("precio" + i);
      precio.textContent = "";
      let pre_prom = document.getElementById("pre_prom" + i);
      pre_prom.classList.remove("ring", "ring-red-500")
      pre_prom.value = ""
      let emp = document.getElementById("emp" + i);
      emp.textContent = "";
      let porcent = document.getElementById("porcen_prom" + i); 
      porcent.classList.remove("ring", "ring-red-500")
      porcent.value = "";
      document.getElementById("dif" + i).textContent = "";

    }
  }

async function cargarValoresEditar(){
  document.getElementById("btn_add").classList.add("hidden");
  document.getElementById("btn_edit").classList.remove("hidden")
  document.getElementById("btn_cancel").classList.remove("hidden")
  let inputConsultar = document.getElementById("inputConsultar");
  let precio1 = document.getElementById("pre_prom1")
  let precio2 = document.getElementById("pre_prom2")
  let precio3 = document.getElementById("pre_prom3")
  let precio4 = document.getElementById("pre_prom4")
  let precio5 = document.getElementById("pre_prom5")
  inputConsultar.value = datos.value.art.trim();
  console.log(props.arts)
  let art = buscarPreciosByCve(datos.value.art.trim());
  precio1.value = parseFloat( art.precio1)
  precio2.value = parseFloat( art.precio2)
  precio3.value = parseFloat( art.precio3)
  precio4.value = parseFloat( art.precio4)
  precio5.value = parseFloat( art.precio5)


}
function buscarPreciosByCve(cve){
  for (let i = 0; i < props.arts.length; i++) {
    const element = props.arts[i];
    if(element.cve == cve){
      return element;
    }
  }
  return {}
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
async function consultarCodigo(codigo, sucBase, proveedor){
    //loading.value = true;
    fetch(baseUrl + 'art?art=' + codigo + '&suc=' + sucBase + '&prov=' +proveedor)
    .then(function(response) {
      loading.value = false;
      if(response.ok) {
        limpiarPrecios();
        response.json().then(data => {
          datos.value = data;
          console.log(datos.value, "YEY!")
          let flag = cargarPrecios(datos.value);
          if(flag){
            cargarValoresEditar();
           document.getElementById("pre_prom1").focus()
           //let disabledBtn = document.getElementById("btn_add").hasAttribute("")
           //btnDisabled.value = false;
          }
          //activarCampos(flag);
        });
      } else {
        response.json().then(
          async data => {
            document.getElementById("desc_art").textContent = data.message;
            errorMsg.value = data.message;
            isModalNoEncontrado.value = true;
            await sleep(1500);
            isModalNoEncontrado.value = false;
          }
        )
        console.log('Respuesta de red OK pero respuesta HTTP no OK');
      }
    })
    .catch(function(error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
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
        <th class="text-center">Art</th>
        <th>Descripcion</th>
        <th class="text-center">Precio1</th>
        <th class="text-center">Precio2</th>
        <th class="text-center">Precio3</th>
        <th class="text-center">Precio4</th>
        <th class="text-center">Precio5</th>
        <th/>
        <!--<th v-if="regalo" />-->
      </tr>
    </thead>
    <tbody>
      <tr v-for="art in itemsPaginated" :key="art.cve">
        <td :data-label="art.cve" class="text-center cursor-pointer" @click="paraEditar">
          {{ art.cve }}
        </td>
        <td :data-label="art.cve" @click="paraEditar" class="cursor-pointer">
          {{ art.des1 }}
        </td>
        <td :data-label="art.cve" class="text-center cursor-pointer" @click="paraEditar">
          {{ formatPre( art.precio1) }}
        </td>
        <td :data-label="art.cve" class="text-center cursor-pointer" @click="paraEditar">
          {{ formatPre(art.precio2) }}
        </td>
        <td :data-label="art.cve" class="text-center cursor-pointer" @click="paraEditar">
          {{ formatPre(art.precio3) }}
        </td>
        <td :data-label="art.cve" class="text-center cursor-pointer" @click="paraEditar">
          {{ formatPre(art.precio4) }}
        </td>
        <td :data-label="art.cve" class="text-center cursor-pointer" @click="paraEditar">
          {{ formatPre(art.precio5) }}
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
