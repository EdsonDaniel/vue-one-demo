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
        <th class="text-center">Código</th>
        <th>Descripción</th>
        <th class="text-center">Emp</th>
        <!--<th>Descripción</th>-->
        <th class="text-center">Precio Actual</th>
        <th class="text-center">Precio Oferta</th>
        <th class="text-center">Diferencia</th>
        <th class="text-center">% Descuento</th>
      </tr>
    </thead>

    <tbody>

      <template v-for="art in props.promos" :key="art.cve_art">
        <tr>
          <td class="py-1 text-center" rowspan="5"><b>{{art.cve_art}}</b></td>
          <td class="py-1" rowspan="5">{{art.des_art}}</td>
          <td class="py-1 text-center">{{art.cant_pre0}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_vta0) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_0) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{calcularDiferencia(art.precio_vta0, art.precio_0,"").neta}}</td>
          <td class="py-1 text-center">{{calcularDiferencia(art.precio_vta0, art.precio_0,"").porcentaje}} %</td>

      
        </tr>

        <tr>
          <td class="py-1 text-center">{{art.cant_pre1}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_vta1) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_1) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{calcularDiferencia(art.precio_vta1, art.precio_1,"").neta}}</td>
          <td class="py-1 text-center">{{calcularDiferencia(art.precio_vta1, art.precio_1,"").porcentaje}} %</td>
        </tr>

        <tr>
          <td class="py-1 text-center">{{art.cant_pre2}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_vta2) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_2) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{calcularDiferencia(art.precio_vta2, art.precio_2,"").neta}}</td>
          <td class="py-1 text-center">{{calcularDiferencia(art.precio_vta2, art.precio_2,"").porcentaje}} %</td>
        </tr>

        <tr>
          <td class="py-1 text-center">{{art.cant_pre3}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_vta3) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_3) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{calcularDiferencia(art.precio_vta3, art.precio_3,"").neta}}</td>
          <td class="py-1 text-center">{{calcularDiferencia(art.precio_vta3, art.precio_3,"").porcentaje}} %</td>
        </tr>


        <tr>
          <td class="py-1 text-center">{{art.cant_pre4}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_vta4) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{
            (Math.round(parseFloat(art.precio_4) * 100) / 100).toFixed(2)}}</td>
          <td class="py-1 text-center">$ {{calcularDiferencia(art.precio_vta4, art.precio_4,"").neta}}</td>
          <td class="py-1 text-center">{{calcularDiferencia(art.precio_vta4, art.precio_4,"").porcentaje}} %</td>
        </tr>

        <tr>
          <td colspan="7" class="p-1">
            <div class="bg-red px-1"></div>
          </td>
        </tr>
      </template>

    </tbody>
  </table>
</template>
