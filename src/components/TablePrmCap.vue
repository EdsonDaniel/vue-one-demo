<script setup>
import { baseUrl } from "@/stores/main";
import { computed, ref, reactive } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { mdiEye, mdiTrashCan, mdiPencil  } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";

const props = defineProps({
  checkable: Boolean,
  promos: [Array, Object],
});

//console.log(props.promos, "loading prom")

const getEstado = (estado) => {
  switch(estado){
    case "0": 
      return 'En revisión';
    case "1":
      return 'Autorizada';
    case "2":
      return 'Descartada';
    case "-2":
      return 'Eliminada';
    case "-1":
    default:
      return 'Por revisar';
    
  }
}
const getTipoPrm = (tipo) => {
  tipo = parseInt(tipo);
  switch(tipo){
    case 1: 
      return 'Precio Promoción';
    case 5:
      return 'mercancía sin cargo';
    default:
      return 'no identificada';
    
  }
}

const router = useRouter();
const user = useMainStore();
const isModalActive = ref(false);
const isModalDangerActive = ref(false);
const perPage = ref(10);
const currentPage = ref(0);
const checkedRows = ref([]);
const itemsPaginated = computed(() =>
  props.promos.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(props.promos.length / perPage.value));
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
  for (let i = 0; i < props.promos.length; i++) {
    if(props.promos[i].cve == cve_art)
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

function refto(event){
  let element = event.target.closest('td')
  //console.log(element);
  //console.log(user)
  user.numProm = element.getAttribute("data-label");
  //console.log(user.numProm);
  router.push({ path : '/detalle-prom' });
}

function reftoEdit(event){
  let element = event.target.closest('button')
  user.numProm = element.getAttribute("data-label");
  //console.log(user.numProm);
  router.push({ path : '/editar-prom' });
}

</script>

<template>
  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table class="px-3">
    <thead>
      <tr>
        <th v-if="checkable" />
        <th class="text-center">ID PRM</th>
        <th>Proveedor</th>
        <th>Descripcion</th>
        <th class="text-center">Fec Ini</th>
        <th class="text-center">Fec Fin</th>
        <th class="text-center">Tipo</th>
        <th class="text-center">Estado</th>
        <th/>
      </tr>
    </thead>
    <tbody>
    
      <tr v-for="promo in itemsPaginated" 
      :key="promo.id">
        <td :data-label="promo.id" to="/capturar"
        @click="refto" class="cursor-pointer text-center">
          {{ promo.id }}
        </td>
        <td :data-label="promo.id" @click="refto" class="cursor-pointer">
          {{ promo.proveedor }} <br>
          <span class="text-sm">{{promo.nom_prov.trim()}}</span>
        </td>
        <td :data-label="promo.id" @click="refto" class="cursor-pointer">
          {{ promo.desProm }}
        </td>
        <td :data-label="promo.id" @click="refto" class="cursor-pointer">
          {{ promo.fec_ini }}
        </td>
        <td :data-label="promo.id" @click="refto" class="cursor-pointer">
          {{ promo.fec_fin }}
        </td>
        <td :data-label="promo.id" class="uppercase cursor-pointer text-center" @click="refto">
          {{ getTipoPrm(promo.tpoProm) }}
        </td>
        <td :data-label="promo.id" class="uppercase cursor-pointer text-center" @click="refto">
          {{ getEstado(promo.status) }}
        </td>
        
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <!----
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              :data-label="promo.id"
              @click="borrarArt(promo.id)"
              v-if="promo.status == '-1'"
            />
            -->
            <BaseButton
            color="info"
              :icon="mdiPencil "
              small
              :data-label="promo.id"
              @click="reftoEdit"
              v-if="promo.status == '-1'"

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
