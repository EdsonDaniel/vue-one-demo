  <script setup>
  import { baseUrl } from "@/stores/main";
  import { prmvacio } from "@/stores/prmhdrvacio";
  import { computed, ref, reactive, onMounted, registerRuntimeCompiler } from "vue";
  import { useMainStore } from "@/stores/main";
  import { useRouter } from "vue-router";
  import { mdiEye, mdiTrashCan } from "@mdi/js";
  import CardBoxModal from "@/components/CardBoxModal.vue";
  import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import UserAvatar from "@/components/UserAvatar.vue";
  import { DoughnutController } from "chart.js";
  const props = defineProps({
    checkable: Boolean,
    prmhdr:{
      type: [Object, Array],
      default: prmvacio ,
    },
    sucs:{
      type: [Object, Array],
      default: [],
    },
  });
  onMounted(async function() {
    //console.log("mopunting")
    //console.log(props.prmhdr)
    formatFolio();
    //formatEstado();
  })
  //console.log(props.promos, "loading prom")
  const mainStore = useMainStore();
  const isModalActive = ref(false);
  const isModalDangerActive = ref(false);

  const formatFolio = () => {
    if(props.prmhdr.id == null || props.prmhdr.id == "") 
    return
    let fol = props.prmhdr.id.toString();
    for (let i = fol.length; i < 7; i++) {
      fol = '0' + fol;
    }
    document.getElementById("folioprm").textContent = fol;
  }

  const formatEstado = () => {
    let estado = props.prmhdr.status
    if(estado == "") return;
    let label = document.getElementById("estado")
    //console.log(label, "label")
    estado = parseInt(estado);
    let tipo = document.getElementById("tpoProm");
    if(props.prmhdr.tpoProm == 1){
      tipo.classList.add("text-blue-500")
    }else{
      tipo.classList.add("text-violet-500")
    }
    switch(estado){
      case 1:
        label.classList.add("text-teal-600")
        return "AUTORIZADA";
      case -1:
        return "POR REVISAR";
      case 0:
        label.classList.add("text-rose-200")
        return "EN REVISIÓN";
      case -2:
        label.classList.add("text-red-600")
        return "ELIMINADA"
      case 2:
        label.classList.add("text-red-600")
        return "DENEGADA"
      default:
        return ""
    }

  }
  
  const formatFolioMks = () => {
    if(props.prmhdr.numProm == "" || props.prmhdr.numProm == null)
      return "----------"
    return props.prmhdr.numProm 
  }

  const formatFecha = (fecha) => {
    if(fecha == "" || fecha == null)
      return "----------"
    //console.log(fecha)
    let f = fecha.slice(6) + '/' + fecha.slice(4,6) + '/' + fecha.slice(0,4) ;
    return f;
  }

  const sucursales = () => {
    if(props.sucs.length == 0) return "----------"
    let suc = "";
    for (let i = 0; i < props.sucs.length; i++) {
      suc += props.sucs[i].suc + ', ';
    }
    suc = suc.slice(0,-2)
    return suc;
  }
  const paga = () =>{
    if(props.prmhdr.paga == "") return "----------"
    switch(props.prmhdr.paga){
      case 1:
      case "1":
        return "PROVEEDOR";
      case 2:
      case "2":
        return "MINIABASTOS";
      case 3:
      case "3":
        return "PROVEEDOR Y MINIABASTOS";
      default:
        return "----------"
    }
  }

  const aplicaA = () =>{
    let cadena = ""
    let retail = (props.prmhdr.retail != null && props.prmhdr.retail != "0");
    let mostrador = (props.prmhdr.mostrador != null && props.prmhdr.mostrador != "0")
    if(mostrador){
      cadena += 'MOSTRADOR'
      if(retail) cadena += ', RETAIL'
      return cadena
    };
    if(retail) return 'RETAIL'
    return '----------'
  }
  </script>

  <template>

    <table class="px-3">
      <tbody>
        <tr>
          <td class="py-2 text-sm"><b>FOLIO:</b></td>
          <td class="py-2 text-sm" id="folioprm">{{props.prmhdr.id}}</td>
          <td class="py-2 text-sm"><b>ESTADO:</b></td>
          <td class="py-2 text-sm tracking-wider font-medium" id="estado">{{formatEstado()}}</td>
          <td class="py-2 text-sm"><b>FOLIO MKS:</b></td>
          <td class="py-2 text-sm">{{formatFolioMks()}}</td>
          <td class="py-2 text-sm"><b>AUTORIZADA POR:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.autoriza}}</td>
        </tr>
        
        <tr>
          <td class="py-2 text-sm"><b>DESCRIPCIÓN:</b></td>
          <td class="py-2 text-sm" colspan="3">{{props.prmhdr.desProm}}</td>
          <td class="py-2 text-sm"><b>PAGA:</b></td>
          <td class="py-2 text-sm">{{paga()}}</td>
          <td class="py-2 text-sm"><b>Tipo Promoción:</b></td>
          <td class="py-2 text-sm tracking-wider font-medium" id="tpoProm">{{props.prmhdr.tpoProm == 1 
          ? "PROMOCIÓN DE PRECIO" : "MERCANCÍA SIN CARGO"}}</td>
        </tr>

        <tr>
          <td class="py-2 text-sm"><b>PROVEEDOR:</b></td>
          <td class="py-2 text-sm" colspan="3">
          {{props.prmhdr.proveedor +' - '+ props.prmhdr.nom_prov}}
          </td>
          <td class="py-2 text-sm"><b>ACUERDO:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.folio_ac}}</td>
          <td class="py-2 text-sm"><b>BOLETÍN:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.boletin}}</td>
          
        </tr>

        <tr>
          
          <td class="py-2 text-sm"><b>PERIODO:</b></td>
          <!--<td class="py-2 text-sm">01/03/2023 - 15/03/2023</td>-->
          <td class="py-2 text-sm">{{formatFecha(props.prmhdr.fec_ini)}} 
          - {{formatFecha(props.prmhdr.fec_fin)}} </td>
          <td class="py-2 text-sm"><b>APLICA SIM:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.inc_similares}}</td>
          <td class="py-2 text-sm"><b>CLIENTE:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.cte}}</td>
          <td class="py-2 text-sm"><b>SUC PRECIO BASE:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.suc_prec_base}}</td>
        </tr>

        <tr>
          <td class="py-2 text-sm"><b>SUCURSALES:</b></td>
          <td class="py-2 text-sm" colspan="5">
            <!--<p >
            3, 4,5,6,7,8,9,11,12,14,15,16,17,18,20,21,22,23,31,32,33,35,36, 38,39,40,41,42,
            43,44,45,46,47,48,49,50,52,53,55,56,58,59,60,61,63,65,66 ,67 ,68 ,69 ,70
            </p>-->
            <p>{{sucursales()}}</p>
          </td>
          <td class="py-2 text-sm"><b>APLICA A:</b></td>
          <td class="py-2 text-sm">{{aplicaA()}}</td>
        </tr>
        <tr>
          <td class="py-2 text-sm"><b>SEG 1:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.seg_0}}</td>
          <td class="py-2 text-sm"><b>SEG 2:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.seg_1}}</td>
          <td class="py-2 text-sm"><b>SEG 3:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.seg_2}}</td>
          <td class="py-2 text-sm"><b>SEG 4:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.seg_3}}</td>
        </tr>
        <tr>
          <td class="py-2 text-sm"><b>LIM A:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.uds_limite}}</td>
          <td class="py-2 text-sm"><b>UNI X VTA:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.uds_por_cte}}</td>
          <td class="py-2 text-sm"><b>CANT MIN:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.cantidad_minima}}</td>
          <td class="py-2 text-sm"><b>MONTO MIN:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.compra_minima}}</td>
          
        </tr>
        <tr>
          <td class="py-2 text-sm"><b>COND PAG:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.con_pag}}</td>
          <td class="py-2 text-sm" colspan="5"><b>CAPTURADA POR:</b></td>
          <td class="py-2 text-sm">{{props.prmhdr.u_alt}}</td>
        </tr>

      </tbody>
    </table>
  </template>
