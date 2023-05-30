<script setup>
import { baseUrl } from "@/stores/main";
import { reactive, ref,onMounted,onBeforeMount, computed } from "vue";
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub,mdiContentSave, mdiCardsPlayingSpade, mdiContentCopy  } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import FormCheckRadioGroup from "@/components/FormCheckRadioGroup.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import SectionTitle from "@/components/SectionTitle.vue";
import SectionTitleLine from "@/components/SectionTitleLine.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import NotificationBarInCard from "@/components/NotificationBarInCard.vue";
import RangeDate from "@/components/RangeDatePicker.vue";
import Regiones from "@/components/Regiones.vue";
import TablePrecios from "@/components/PreciosArticulosTable.vue";
import TableRegalos from "@/components/RegaloArticulosTable.vue";
import TableArtCapturados from "@/components/TableArtCapturados.vue";
import TableArtCapturadosRegalo from "@/components/TableArtCapturadosRegalo.vue";
import Accordion from "@/components/Accordion.vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main.js";

const router = useRouter();

const selectOptions = [
  { id: 1, label: "Business development" },
  { id: 2, label: "Marketing" },
  { id: 3, label: "Sales" },
];

const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul","ago", "sep","ago", "oct", "nov", "dic"];

// Variables de inputs
const preciosForzados = [
  { id: "001", label: "001" },
  { id: "002", label: "002", default : true },
  { id: "003", label: "003" },
  { id: "013", label: "013" },
  { id: "024", label: "024" },
  { id: "025", label: "Sucursal seleccionada" },
];
const tiposPromocion = [
  { id: 1, label: "Promoción De Precio", default : true },
  //{ id: 2, label: "% De Descuento Sobre Venta" },
  //{ id: 3, label: "% De Descuento Sobre Precio" },
  //{ id: 4, label: "Regalo Por Monto De Compra" },
  { id: 5, label: "Mercancía sin Cargo" },
];
const condicionPago = [
  { id: 'CRED', label: "CRÉDITO" },
  { id: 'CTDO', label: "CONTADO" },
  { id: 'XCOB', label: "POR COBRAR" },
];
const acuerdoPago = [
  { id: 1, label: "Paga Proveedor" },
  { id: 2, label: "Paga MiniAbastos" },
  { id: 3, label: "Pagan Ambos" },
];

const empaques = [
  { id: 'PZA', label: "PIEZA" },
  { id: 'PAQ', label: "PAQUETE" },
  { id: 'CJA', label: "CAJA" },
  { id: 'BTO', label: "BULTO" },
  { id: 'KGS', label: "KILOGRAMOS" },
  { id: 'TIR', label: "TIRA" },
  { id: 'EXH', label: "EXHIBIDOR" },
];

const segMer = [
  { id: 'BAS', label: "TARJETA BASICA" },
  { id: 'CON', label: "CONSUMO TIENDA" },
  { id: 'ESP', label: "CLIENTE ESPECIAL" },
  { id: 'EXP', label: "CLIENTE CREDITO EXPO" },
  { id: 'INA', label: "INAPAM" },
  { id: 'MAY', label: "PRUEBA SEG MAY" },
  { id: 'MIN', label: "MINORISTAS" },
  { id: 'MUJ', label: "MUJER" },
  { id: 'PRF', label: "TARJETA PREFERENCIAL" },
  { id: 'PRM', label: "TARJETA PREMIUM" },
  { id: 'PUB', label: "PUBLICO" },
  { id: 'RUT', label: "VENTA EN RUTA" },
];

const errorMsgProv = ref("");
const errorMsgAc = ref("");

const errorMsgArt1 = ref("");
const errorMsgArt2 = ref("");
//const sucSelected = ref([]);
const artCapturados = computed(() => artcap.value);
const dataForm = computed(() => form);
const artcap = ref([]);
const vig = ref([]);
const form = reactive({
  nombre: "",
  tipo: tiposPromocion[0].id,
  proveedor: "",
  paga: acuerdoPago[0].id,
  folioAcuerdo: "",
  limPzs: "",
  udsVenta:"",
  cantMin:"",
  montoMin:"",
  vigencia:"",
  fec_ini:"",
  fec_fin:"",
  aplicaSim:"",
  cliente:"",
  condPago:"",
  seg1:"",
  seg2:"",
  seg3:"",
  seg4:"",
  sucSelected:[],
  aplicaA:"",
  mostrador:null,
  retail:null,
  u_alta:"",
  precBase: preciosForzados[1].id,
  arts:artcap,
  fac_min_reg:empaques[0].id,
  fac_min_compra:empaques[0].id,
  cobradas:1,
  regaladas:1,
  fac_min_regalo:1,
  cod_reg:"",
  cod_cob:"",
  boletin:"",
  cve:""
});

const preciosFor  = reactive({});
const user = useMainStore();
const proveedores = computed(() => pro.value);
const pro = ref({});

const acuerdos = computed(() => ac.value);
const ac = ref({});

const errores = ref(false);
const errMsg = ref("");

const loading = ref(false);
const isModalNoEncontrado = ref(false);

const submit = () => {
  //
};

const formStatusWithHeader = ref(true);
const formStatusCurrent = ref(0);

const formStatusOptions = ["info", "success", "danger", "warning"];

const formStatusSubmit = () => {
  formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
    ? formStatusCurrent.value + 1
    : 0;
};

async function getProveedores(){
  let comprador = user.numComprador;
  //console.log(comprador)
  return await fetch(baseUrl + 'prov?compr=' +comprador)
    .then(async function(response) {
      if(response.ok) {
        await response.json().then(data => {
          pro.value = data;
          //console.log("getting prov")
          //console.log(data)
          return datos;
        });
      } else {
        console.log('Respuesta de red OK pero respuesta HTTP no OK');
        return {};
      }
    })
    .catch(function(error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
      return {};
    });
}
async function getAcuerdos(){
  let comprador = user.numComprador;
  let prov = form.proveedor.trim().split(' ');
  prov = prov[0];

  //console.log(comprador)
  return await fetch(baseUrl + 'acuerdos?compr='+comprador+'&prov='+prov)
    .then(async function(response) {
      if(response.ok) {
        await response.json().then(data => {
          ac.value = data;
          //console.log(data)
          return datos;
        });
      } else {
        console.log('Respuesta de red OK pero respuesta HTTP no OK');
        return {};
      }
    })
    .catch(function(error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
      return {};
    });
}
onMounted(async () => {
  //console.log(user)
  //console.log(user.numComprador);
  let obj = await getProveedores();
  let acuer = await getAcuerdos();
  document.getElementById('acc_desc').click()
  document.getElementById('acc_prov').click()
  document.getElementById('acc_suc').click()
})
var datos = {};
function mostrarTablaRegalos(){
  artCapturados.value = []
  if(form.tipo == 5){
    let campo_art1 = document.getElementById("cod_cob");
    let campo_art2 = document.getElementById("art_reg");
    campo_art1.addEventListener("blur", consultarCodigo, true);
    campo_art2.addEventListener("blur", consultarCodigo, true);
  }
}
function cambioAcuerdo(event){
  console.log(acuerdos);
  let boletin = ""
  for(let i = 0; i<acuerdos.value.length; i++){
    if(acuerdos.value[i].Folio == event.target.value){
      //document.getElementById("boletin").value = "";
      //document.getElementById("boletin").value = acuerdos.value[i].boletin
      form.boletin = acuerdos.value[i].boletin
      return;
    }
  }
  
}
//Hasta aqui control de cambios
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const isModalValidaCamposActive = ref(false);
const creadaCorrectamente = ref(false);
const artAgregado = ref(false);

async function validaCamposRequeridos(){
  let obligatorios = document.querySelectorAll("[atr='requerido']")
  for(let i = 0; i<obligatorios.length; i++){
    if(obligatorios[i].value == "" || obligatorios[i].value == null){
      errores.value = true;
      errMsg.value = 'El campo "' + obligatorios[i].name + '" no puede quedar vacío';
      return;
    }
  }

  let vigen = document.getElementById("idvig").value;
  if(vigen == ""){
    errores.value = true;
    errMsg.value = 'El campo "vigencia" no puede quedar vacío';
    return;
  }
  let fechas = vigen.split('~');
  let fec_ini = new Date(fechas[0]);
  let fec_fin = new Date(fechas[1]);
  //console.log(fechas, fec_ini, fec_fin)
  form.vigencia = vigen;
  //form.fec_ini = '' + fec_ini.getFullYear()
  //+''+ twoDigits(fec_ini.getMonth()+1)+'' + twoDigits(fec_ini.getDate()) + ''

  form.fec_ini = formatFecMks(fechas[0]);
  form.fec_fin = formatFecMks(fechas[1]);
  //console.log("fecha: ", form.fec_ini)
  
  //console.log(form.vigencia)
  if(artCapturados.value.length < 1){
    errores.value = true;
    errMsg.value = 'No capturó ningún artículo en la promoción.'
    return;
  }

  form.sucSelected = getSucursalesSeleccionadas();
  
  console.log(form.sucSelected)
  if(form.sucSelected.length < 1){
    errores.value = true;
    errMsg.value = 'No seleccionó ninguna sucursal para aplicar la promoción.'
    return;
  }

  //console.log(form, "Ya esta")
  let mos = document.getElementById("mostrador");
  let retail = document.getElementById("retail");
  mos.checked ? form.mostrador = 1 : form.mostrador = 0;
  retail.checked ? form.retail = 1 : form.retail = 0;
  
  form.u_alta = user.nomCto;
  let prov = form.proveedor.trim().split(' ');
  form.proveedor = prov[0];

  //Enviando datos validados
  let datos= {'datos' : form}
  console.log(datos)
  await postData(baseUrl+'crea-prm', datos)
  .then(async data => {
    console.log("respuesta post")
    console.log(data); // JSON data parsed by `data.json()` call
    //Si tiene errores
    if ('error' in data){
      console.log("Tiene errores")
      errMsg.value = "Ocurrió un error al guardar. " + data.error;
      errores.value = true;
    }else{
      console.log("NO tiene errores")
      creadaCorrectamente.value = true;
      await sleep(1500);
      creadaCorrectamente.value = false;
      router.push({ path : '/mis-capturas' });
    }
  });
}
function twoDigits(num){
  if(num < 10){
    return '0' + num;
  }
  return '' + num;
}

function formatFecMks(fec){
  fec = fec.trim();
  let fecArray = fec.split(' ');
  //let mes = twoDigits(meses.indexOf(fecArray[1]+''));
  let mes = twoDigits((meses.indexOf(fecArray[1]+'')+1));
  let fecha = fecArray[2] + '' + mes + fecArray[0];
  console.log(fecha);
  return fecha;
}
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
  console.log(response);
  return response.json(); 
}


function getSucursalesSeleccionadas(){
  let seleccionados = [];
  let todos = document.getElementsByClassName("sucursal");

  for (let i = 0; i < todos.length; i++) {
    if(todos[i].checked){
      seleccionados.push(todos[i].value)
    }
  }
  
  //console.log(seleccionados);
  return seleccionados;
}

async function provChange(event){
  let prov = form.proveedor
  //console.log(artCapturados)
  artcap.value = [];
  //console.log(artCapturados)
  //console.log("prov changed");
  //console.log(form.proveedor);
  event.target.classList.remove("ring", "ring-red-500")
  errorMsgProv.value = ""
  let existe = false;
  let acuerdo = document.getElementById("acuerdo");
  form.folioAcuerdo = "";
  acuerdo.removeAttribute("disabled");
  acuerdo.classList.remove("ring", "ring-red-500");
  errorMsgAc.value = ""
  for (let i = 0; i < pro.value.length; i++) {
    //console.log(pro.value[i])
    //console.log(form.proveedor)
    if(pro.value[i].proveedor == form.proveedor.trim().split(' ')[0] ){
      existe = true;
      //console.log("si existe")
      break;
    }
  }

  if(!existe){
    //console.log("no existe")
    event.target.classList.add("ring", "ring-red-500")
    errorMsgProv.value = "Proveedor no existe o no está ligado a su usuario"
  }
  await getAcuerdos();
  //console.log(ac.value)
  //console.log(ac.value.length == 0)

  if(ac.value.length == 0){
    acuerdo.setAttribute("disabled","");
    acuerdo.classList.add("ring", "ring-red-500");
    errorMsgAc.value = "No se encontró ningún acuerdo ligado a este proveedor"
  }
}


async function consultarCodigo(event){
  //console.log("Consultando.......",event.target.id)
  let campoDesc = "";
  if(event.target.id == "cod_cob"){
    //console.log("Fue el cobrado")
    campoDesc = document.getElementById("desc_art_cob");
  }
  else{
    campoDesc = document.getElementById("desc_art_reg");
  }
  let codABuscar = event.target.value;
  let sucBase = document.getElementById("sucbase").value;
  let prov = (document.getElementById("prov").value).slice(0,9);
  await buscarCodigo(codABuscar, sucBase, prov, event.target)
}

async function buscarCodigo(codigo, sucBase, proveedor, input){
    //sucBase = sucBase.slice(1)
    //console.log(codigo,sucBase,proveedor)
    //console.log(baseUrl + 'art?art=' + codigo + '&suc=' + sucBase + '&prov=' +proveedor)
    loading.value = true;
    fetch(baseUrl + 'art?art=' + codigo + '&suc=' + sucBase + '&prov=' +proveedor)
    .then(function(response) {
      loading.value = false;
      if(response.ok) {
        //limpiarPrecios();
        response.json().then(data => {
          datos = data;
          input.value = codigo
          console.log(datos)
          /*let flag = cargarPrecios(datos);
          if(flag){
           document.getElementById("pre_prom1").focus()
           btnDisabled.value = false;
          }
          activarCampos(flag);*/
          if(input.id == 'cod_cob'){
              errorMsgArt1.value = "";
              document.getElementById("desc_art_cob").value = data.des1
            }else{
              errorMsgArt2.value = "";
              document.getElementById("desc_art_reg").value = data.des1
            }
        });
      } else {
        response.json().then(
          async data => {
            //document.getElementById("desc_art").textContent = data.message;
            errMsg.value = data.message;
            isModalNoEncontrado.value = true;
            await sleep(1500);
            isModalNoEncontrado.value = false;
            if(input.id == 'cod_cob'){
              errorMsgArt1.value = data.message;
            }else{
              errorMsgArt2.value = data.message;
            }
            //input.focus();
          }
        )
        console.log('Respuesta de red OK pero respuesta HTTP no OK');
      }
    })
    .catch(function(error) {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
      input.value = codigo
    });
}

function pe(event) {
  validaCamposRequeridos(event)
  let art = {};
  art.cve = cve;
  art.precio1 = pre1
  art.precio2 = pre2
  art.precio3 = pre3
  art.precio4 = pre4
  art.precio5 = pre5
  art.des1 = document.getElementById("desc_art").textContent;
}

function estaDuplicado(art){
  console.log(artCapturados.value, "artscapturados")
  for (let i = 0; i < artCapturados.value.length; i++) {
    //if(artCapturados.value[i].cod_cob == art)
    if(artCapturados.value[i].cve == art)
      return true;
  }
  return false;
}

async function mostrarErrorAlCapturar(mensaje, event){
  loading.value = false;
  errMsg.value = mensaje;
  isModalNoEncontrado.value = true;
  event.target.removeAttribute("disabled")
  await sleep(1500)
  isModalNoEncontrado.value = false;
}

async function agregarArticuloRegalo(event){
  event.target.setAttribute("disabled",true);
  loading.value = true;
  if(errorMsgArt1.value != "" || errorMsgArt2.value != ""){
    return mostrarErrorAlCapturar("El código capturado no existe, o no corresponde al proveedor seleccionado", event)
  }
  //if(estaDuplicado(form.cod_cob)){
  if(estaDuplicado(form.cve)){
    console.log("Esta duplicada")
    return mostrarErrorAlCapturar("El artículo ya está capturado", event);
  }
  let art = {};
  //art.cod_cob = form.cod_cob;
  art.cve = form.cve;
  art.cod_reg = form.cod_reg;
  art.cobradas = form.cobradas;
  art.regaladas = form.regaladas;
  art.emp_cob = form.fac_min_compra;
  art.emp_reg = form.fac_min_reg;
  //art.desc_cob = document.getElementById("desc_art_cob").value;
  art.des1 = document.getElementById("desc_art_cob").value;
  art.desc_reg = document.getElementById("desc_art_reg").value;
  art.fac_min_reg = form.fac_min_regalo

  /*console.log("!!", art.cve)
  console.log("!!", art.cod_reg)
  console.log("!!", art.regaladas)
  console.log("!!", art.cobradas)
  console.log("!!", art.emp_cob)
  console.log("!!", art.emp_reg)
  console.log("!!", art.des1)
  console.log("!!", art.desc_reg)
  console.log("!!", art.fac_min_reg)*/

  if(art.cve == "" || art.cve == null ||
     art.cod_reg == "" || art.cod_reg == null ||
     art.regaladas == "" || art.regaladas == null ||
     art.cobradas == "" || art.cobradas == null ||
     art.emp_cob == "" || art.emp_cob == null ||
     art.emp_reg == "" || art.emp_reg == null ||
     art.des1 == "" || art.des1 == null ||
     art.desc_reg == "" || art.desc_reg == null ||
     art.fac_min_reg == "" || art.fac_min_reg == null 
     ){
    return mostrarErrorAlCapturar("Debe capturar todos los campos requeridos",event);
  }
  
  console.log(art)
  artCapturados.value.push(art)
  loading.value = false;
  event.target.removeAttribute("disabled")
  limpiarCamposRegalo()

}
const keyNavPrev = function(event){
    var invalidChars = [".","-","+","e", 'ArrowDown', 'ArrowUp'];
    if(invalidChars.includes(event.key) )
      event.preventDefault();
  }

function limpiarCamposRegalo(){
  form.fac_min_reg = empaques[0].id,
  form.fac_min_compra=empaques[0].id,
  form.cobradas=1,
  form.regaladas=1,
  form.fac_min_regalo=1,
  form.cod_reg="",
  form.cod_cob=""
  form.cve = ""
  document.getElementById("desc_art_cob").value = ""
  document.getElementById("desc_art_reg").value = ""
  document.getElementById("btn-upd-reg").classList.add("hidden")
  document.getElementById("btn-cancel-reg").classList.add("hidden")
  document.getElementById("add-reg").classList.remove("hidden")
}
function actualizarRegalo(){
  console.log("Actualizando")
  let art = {};
  art.cod_cob = form.cod_cob;
  art.cve = form.cve;
  art.cod_reg = form.cod_reg;
  art.cobradas = form.cobradas;
  art.regaladas = form.regaladas;
  art.emp_cob = form.fac_min_compra;
  art.emp_reg = form.fac_min_reg;
  art.desc_cob = document.getElementById("desc_art_cob").value;
  art.desc_reg = document.getElementById("desc_art_reg").value;
  art.fac_min_reg = form.fac_min_regalo

  //if(art.cod_cob == "" || art.cod_cob == null ||
  if(art.cve == "" || art.cve == null ||
     art.cod_reg == "" || art.cod_reg == null ||
     art.regaladas == "" || art.regaladas == null ||
     art.cobradas == "" || art.cobradas == null ||
     art.emp_cob == "" || art.emp_cob == null ||
     art.emp_reg == "" || art.emp_reg == null ||
     art.desc_cob == "" || art.desc_cob == null ||
     art.desc_reg == "" || art.desc_reg == null ||
     art.fac_min_reg == "" || art.fac_min_reg == null 
     ){
    return mostrarErrorAlCapturar("Debe capturar todos los campos requeridos",event);
  }
  let cve = document.getElementById("cod_cob").getAttribute("data-label")
  let index = buscarArt(cve)
  let articulo = artCapturados.value[index];
  console.log("art modificado", art)
  console.log("art original", articulo)
  artCapturados.value[index] = art;
  //console.log(artCapturados,1)
  
  //artcap = [];

}
function buscarArt(cve){
  for(let i = 0; i<artCapturados.value.length; i++){
    //if(artCapturados.value[i].cod_cob == cve){
    if(artCapturados.value[i].cve == cve){
      return i;
    }
  }
  return -1;
}
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
    
    <CardBoxModal
    v-model="errores"
    title="No se pudo guardar la promoción"
    button="secondary"
    hasButton
  >
      <p>{{errMsg}}</p>
    </CardBoxModal>

    <CardBoxModal
    :hasFooter="false"
    v-model="creadaCorrectamente"
    title="Promoción creada correctamente"
    :blocked="true"
  >
    <img src="/img/checked.png" alt="" class="block mx-auto">
  </CardBoxModal>


  <CardBoxModal
    v-model="isModalNoEncontrado"
    title="Error al capturar el artículo"
    :hasFooter="false"
    titleClass="mx-auto mb-3"
    :blocked="true"
  >
    <img src="/img/cancelar.png" alt="" class="block mx-auto">
    <p>{{errMsg}}</p>
  </CardBoxModal>

  <CardBoxModal
    :hasFooter="false"
    v-model="artAgregado"
    title="Artículo agregado"
    :blocked="true"
  >
    <img src="/img/checked.png" alt="" class="block mx-auto">
  </CardBoxModal>
    
    <SectionMain id="sect">
      <SectionTitleLine
        :icon="mdiBallotOutline"
        title="Capturar nueva Promoción"
        main
      >
      </SectionTitleLine>
      
      <CardBox form @submit.prevent="submit">
        <Accordion label="Descripción y Tipo" id="acc_desc">
          <FormField otherClasses="mb-3">
            <FormField label="Nombre de la promoción*" >
              <FormControl type="text" v-model="form.nombre" attrr="requerido"
              name="nombre" required
              placeholder="Nombre de la promoción*" otherClasses="campo"/>
            </FormField>

            <FormField label="Tipo de promoción*" >
              <FormControl v-model="form.tipo" :options="tiposPromocion" 
              attrr="requerido" required @change="mostrarTablaRegalos"
                name="tipo" title="Tipo De Promoción*" otherClasses="campo"/>
            </FormField>
          </FormField>
        </Accordion>
        
        <Accordion label="Proveedor y Acuerdo" id="acc_prov">
          <FormField >
            <FormField >
              <FormField label="Num Proveedor:*">
                <FormControl type="text" id="prov" v-model="form.proveedor"
                attrr="requerido" name="proveedor" otherClasses="campo"
                placeholder="Número de Proveedor*" required
                :errorMsg="errorMsgProv" @change="provChange"
                multiple list="prov_list" />
              </FormField>

              <FormField>
                <FormField label="Paga:*" >
                  <FormControl :options="acuerdoPago" v-model="form.paga"
                  required
                  attrr="requerido" name="paga" otherClasses="campo"/>
                </FormField>
                <FormField label="Folio Acuerdo:*" >
                  <FormControl type="text" id="acuerdo" 
                  multiple list="ac_list" required
                  attrr="requerido" name="folioAcuerdo" otherClasses="campo"
                   @change="cambioAcuerdo" v-model="form.folioAcuerdo"
                   :errorMsg="errorMsgAc"
                  placeholder="Folio de Acuerdo" />
                </FormField>
                <FormField label="Boletín:" >
                  <FormControl type="text" v-model="form.boletin"
                  disabled placeholder="Boletín" id="boletin"/>
                </FormField>
              </FormField>
            </FormField>
            
            
          </FormField>
          <datalist id="prov_list">
              <option v-for="i in proveedores" :key="i.proveedor"
                :value="i.proveedor+' - '+i.nom" >{{i.proveedor}}</option>
          </datalist>

          <datalist id="ac_list">
              <option v-for="i in acuerdos" :key="i.folio"
                :value="i.Folio" >{{i.Folio}}</option>
          </datalist>
        </Accordion>

        <Accordion label="Restricciones" id="acc_restric">
          <FormField  otherClasses="">
            <FormField label="Limitado a:" >
              <FormControl type="text" v-model="form.limPzs"
              name="limPzs" otherClasses="campo"
              placeholder="Piezas"/>
            </FormField>
        
            <FormField label="Unidades por venta:" >
              <FormControl type="text" v-model="form.udsVenta" 
              name="udsVenta" otherClasses="campo"
              placeholder="PZAS"/>
            </FormField>

            <FormField label="Cantidad mínima:" >
              <FormControl type="text" v-model="form.cantMin" 
              name="cantMin" otherClasses="campo"
              placeholder="PZS" />
            </FormField>

            <FormField label="Monto compra mínima:" >
              <FormControl type="text" v-model="form.montoMin" 
              name="montoMin" otherClasses="campo"
              placeholder="$0.00" />
            </FormField>
          </FormField>
        </Accordion>

        <!--<Accordion label="Vigencia">-->
          <FormField otherClasses="mt-3 mb-6 mx-3" label="Vigencia*">
            
            <RangeDate idDate="idvig" />
            
            <FormCheckRadioGroup class="ml-3"
              attrr="requerido" otherClasses="campo"
              v-model="form.aplicaSim"
              name="similares"
              type="switch"
              :options="{ one: 'Aplica similares'}"
            />
          </FormField>
        <!--</Accordion>-->
       <Accordion label="Cliente y Pago" id="acc_cli">
          <FormField>
            <FormField label="Cliente:" >
              <FormControl type="text" v-model="form.cliente"
              placeholder="Número de Cliente"/>
            </FormField>
            <FormField label="Condición de Pago:" >
              <FormControl :options="condicionPago" v-model="form.condPago"/>
            </FormField>            
          </FormField>
          <FormField label="Segmentos de Mercado:" otherClasses="mt-3">
              <FormControl type="text" :options="segMer" 
              placeholder="SEG1" v-model="form.seg1" />
              <FormControl type="text" :options="segMer" 
              placeholder="SEG2" v-model="form.seg2" />
              <FormControl type="text" :options="segMer" 
              placeholder="SEG3" v-model="form.seg3"/>
              <FormControl type="text" :options="segMer" 
              placeholder="SEG4" v-model="form.seg4"/>
              
          </FormField>
        </Accordion>

        <Accordion label="Aplica para:*" id="acc_suc">
          <FormField >
            <Regiones/>
          </FormField>
        </Accordion>

        

      </CardBox>
    
    </SectionMain>

    <SectionMain class="pt-0">
      <CardBox CardBox form @submit.prevent="submit" >
        
        <FormField label="Artículos">
          <FormField label="Precios según:">
            <FormControl :options="preciosForzados" v-model="form.precBase" id="sucbase"
            name="forzado" title="Precios según: " placeholder="Precios según:"/>
          </FormField>
          
          <div>
            <label>Artículos Capturados: </label>
            <span><b> {{ artCapturados.length}}</b></span>
          </div> 
        </FormField>
        <BaseDivider />

        <TablePrecios :arts="artCapturados" v-if="form.tipo == 1"/>

        <!--<TableRegalos/>-->
        <div v-if="form.tipo == 5">
          <FormField>        
            <FormField label="Comprando:*" >
              <FormControl v-model="form.cobradas"
              type="number" @keydown="keyNavPrev" name="cobradas" otherClasses="campo"/>
            </FormField>

            <FormField label="Emp:*" >
              <FormControl :options="empaques" v-model="form.fac_min_compra"
              name="emp_cob" otherClasses="campo"/>
            </FormField>
            
            <FormField label="Del Código:*" >
              <FormControl type="text" id="cod_cob" v-model="form.cve"
              name="cod_cob" otherClasses="campo" :errorMsg="errorMsgArt1" />
            </FormField>
            
            <FormField label="Descripción" >
              <FormControl type="text" disabled id="desc_art_cob"/>
            </FormField>
          </FormField>

          <FormField class="mt-4">        
            <FormField label="Se regalan:*" >
              <FormControl v-model="form.regaladas" type="number" @keydown="keyNavPrev"
              name="regaladas" otherClasses="campo"/>
            </FormField>

            <FormField label="Emp:*" >
              <FormControl :options="empaques" v-model="form.fac_min_reg"
               name="emp_reg" otherClasses="campo"/>
            </FormField>
            
            <FormField label="Del Código:*" >
              <FormControl type="text" id="art_reg" v-model="form.cod_reg"
              name="art_reg" otherClasses="campo"
              :errorMsg="errorMsgArt2" />
            </FormField>
            
            <FormField label="De Regalo" >
              <FormControl type="text" 
              disabled id="desc_art_reg"/>
            </FormField>

            <FormField label="Fac Min Reg"  help="ATENCIÓN: Se recomienda no modificar este valor">
              <FormControl type="number" v-model="form.fac_min_regalo"
              placeholder="1" id="fac_min_reg" />
            </FormField>

            <div class="mx-auto mt-8">
              <BaseButtons type="justify-start lg:justify-end" no-wrap>
                <BaseButton
                  id="add-reg"
                  color="success"
                  class="f-left"
                  label="Agregar artículo"
                  @click="agregarArticuloRegalo"
                />

                <BaseButton
                  color="success"
                  class="f-left hidden"
                  label="Actualizar artículo"
                  :icon="mdiTrashCan"
                  id="btn-upd-reg"
                  @click="actualizarRegalo"
                />

                <BaseButton
                  color="danger"
                  class="f-left hidden"
                  label="Cancelar"
                  @click="limpiarCamposRegalo"
                  id="btn-cancel-reg"
                />
              </BaseButtons>
            </div>
          </FormField>
        </div>
        
        

        <BaseDivider />

        <div>
            <label>Artículos Capturados: </label>
            <span><b> {{ artCapturados.length}}</b></span>
        </div> 
        
        <tableArtCapturados :arts="artCapturados" v-if="form.tipo == 1" />

        <tableArtCapturadosRegalo :campos="dataForm"
        :arts="artCapturados" v-if="form.tipo == 5" />

        
        <template #footer>
          
        </template>
      </CardBox>

      <BaseButton label="Guardar Promoción" id="btn_save" type="submit" 
          class="mt-4 w-full"
          :icon="mdiContentSave"
          color="success" @click="validaCamposRequeridos"/>
    </SectionMain>
  </LayoutAuthenticated>
</template>
