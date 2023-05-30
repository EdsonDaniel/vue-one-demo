<script setup>
import { baseUrl } from "@/stores/main";
import { computed, ref, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { mdiEye, mdiTrashCan } from "@mdi/js";
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
const mainStore = useMainStore();
const isModalActive = ref(false);
const isModalDangerActive = ref(false);

//console.log(props.promos,"promos")

function calcularDiferencia(precio_ini,precio_prm, porcentaje){
    let diferencia = {};
    if(precio_prm != ""){
      diferencia.precio = precio_prm;
      diferencia.neta = Number((precio_ini - precio_prm).toFixed(2)).toFixed(2);
      diferencia.porcentaje = Number((100 - ((precio_prm * 100)/precio_ini))
      .toFixed(4)).toFixed(4);
      //console.log(diferencia);
    }

    else{
      let pr = 
      Number( precio_ini.toFixed(2) - ((precio_ini * porcentaje)/100).toFixed(2)).toFixed(2);
      //console.log(pr)
      diferencia.precio = pr;
      diferencia.neta = Number(precio_ini - diferencia.precio);
      diferencia.porcentaje = porcentaje;
      //console.log(diferencia);
    }
    
    //return (precio_ini * porcentaje) / 100
    return diferencia;
  }

</script>

<template>

  <table class="px-3 text-sm">
    <thead>
      <tr>
        <th class="" colspan="2">Comprando</th>
        <!--<th>Emp</th>-->
        <th class="" colspan="2">De la CVE</th>
        <!--<th>Descripción</th>-->
        <th class="" colspan="2">Se regalan</th>
        <!--<th class="text-center">Emp</th>-->
        <th class="" colspan="2">De la CVE</th>
      </tr>
    </thead>

    <tbody>

      <template v-for="art in props.promos" :key="art.cve">
        <tr>
          <td class="py-1" >{{parseFloat(art.cobradas)}}</td>
          <td class="py-1 text-center">PZAS</td>
          <td class="py-1 text-center">{{art.cve_art}}</td>
          <td class="py-1">{{art.des_art}}</td>
          <td class="py-1 text-center">{{parseFloat(art.regaladas)}}</td>
          <td class="py-1 text-center">{{art.emp_reg}}</td>
          <td class="py-1 text-center">{{art.art_reg}}</td>
          <td class="py-1">{{art.desc_reg}}</td>
      
        </tr>

        <!--
        <tr>
          <td colspan="7" class="p-1">
            <div class="bg-red px-1"></div>
          </td>
        </tr>
        -->
      </template>

    </tbody>
  </table>
</template>
