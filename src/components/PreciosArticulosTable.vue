<script setup>
import { baseUrl } from "@/stores/main";
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiContrastBox, mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import {mdiCurrencyUsd,mdiPercentOutline} from "@mdi/js";

const props =defineProps({
  checkable: Boolean,
  arts: Array
});

onMounted(() => {
  let precios = document.getElementsByClassName("pre");
  let percents = document.getElementsByClassName("per");

  //asignaEvento(precios,keyNavigation,"keyup")

})

/*function asignaEvento(coleccion, funcion, evento){
  for (let i = 0; i < coleccion.length; i++) {
    coleccion[i].addEventListener(evento, funcion, false);
    
  }
}*/

const mainStore = useMainStore();

const items = computed(() => mainStore.clients);

const isModalActive = ref(false);
const isModalAddArtActive = ref(false);
const isModalDangerActive = ref(false);
const isModalDuplicadoActive = ref(false);
const isModalNoEncontrado = ref(false);
const btnDisabled = ref(true)
const loading = ref(false);

const errorMsg = ref("");

//const baseUrl = 'http://localhost/promocionesycombos/api/'

// const perPage = ref(5);

// const currentPage = ref(0);

// const checkedRows = ref([]);

/*
const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

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
*/
  async function inputConsultar(event){
    //console.log("Value: " + event.target.value)
    let sucBase = document.getElementById("sucbase").value;
    let prov = (document.getElementById("prov").value).slice(0,9);
    await consultarCodigo(event.target.value, sucBase, prov);
  }
  var datos = {};
  async function consultarCodigo(codigo, sucBase, proveedor){
    //sucBase = sucBase.slice(1)
    //console.log(codigo,sucBase,proveedor)
    //console.log(baseUrl + 'art?art=' + codigo + '&suc=' + sucBase + '&prov=' +proveedor)

    loading.value = true;
    fetch(baseUrl + 'art?art=' + codigo + '&suc=' + sucBase + '&prov=' +proveedor)
    .then(function(response) {
      loading.value = false;
      if(response.ok) {
        limpiarPrecios();
        response.json().then(data => {
          datos = data;
          console.log(datos)
          let flag = cargarPrecios(datos);
          if(flag){
           document.getElementById("pre_prom1").focus()
           btnDisabled.value = false;
          }
          activarCampos(flag);
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

  function activarCampos(estado){
    let porcentajes = document.getElementsByClassName("per");
    let precios = document.getElementsByClassName("pre");
    
    [].forEach.call(porcentajes,element => {
      if(estado){
        element.removeAttribute("disabled");
      }
      else { 
        element.setAttribute("disabled",true);
      }
      element.value = "";
    });

    [].forEach.call(precios,element => {
      if(estado)
        element.removeAttribute("disabled");
      else 
        element.setAttribute("disabled",true);
      element.value = "";
    });
  }
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
    /*[].forEach.call(porcentajes,element => {
      element.value = 0;
      let ev = new InputEvent("input")
      element.dispatchEvent(ev);
      onPrecioInput(ev);
    });*/
    return true;
  }

  function formatPre(precio){
    const preciof = new Intl.NumberFormat('es-MX',
          { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
    return preciof.format(precio);
  }

  const keyNavPrev = function(event){
    var invalidChars = ["-","+","e", 'ArrowDown', 'ArrowUp'];
    if(invalidChars.includes(event.key) )
      event.preventDefault();
  }

  const keyNavigation = function(event){
     if(event.key == 'Enter' || event.key == 'ArrowDown'){
        let element = event.target.id;
        let num_elem = parseInt(element.slice(-1));
        if(num_elem < 5){
          num_elem++;
          let nextElement = element.slice(0, -1) + num_elem;
          document.getElementById(nextElement).focus();
          return;
        }
        if(num_elem == 5 ){
          document.getElementById("btn_add").focus();
        }
     }
     if(event.key == 'ArrowUp'){
        let element = event.target.id;
        let num_elem = parseInt(element.slice(-1));
        if(num_elem > 1){
          num_elem--;
          let nextElement = element.slice(0, -1) + num_elem;
          document.getElementById(nextElement).focus();
        }
        else if(num_elem == 1){
          document.getElementById("inputConsultar").focus();
        }
     }
  }

  const onPrecioInput = function(event){
    let id = event.target.id.slice(-1);
    let inputPrecioPrm = document.getElementById("pre_prom" + id);
    let inputPorcent = document.getElementById("porcen_prom" + id);
    let precioInicial = document.getElementById("precio" + id).textContent.slice(1);
    precioInicial = precioInicial.replace(",","");
    precioInicial = parseFloat(precioInicial);
    //let pr = document.getElementById("precio" + id).textContent.slice(1);//.textContent.slice(0,-1);
    //console.log(inputPrecioPrm, inputPorcent, precioInicial);
    let diferencia = {};
    if(event.target == inputPrecioPrm){
      diferencia = calcularDiferencia(precioInicial, inputPrecioPrm.value, "")
      //console.log("dif: ", diferencia)
      //console.log(diferencia.porcentaje)
      inputPorcent.value = diferencia.porcentaje
    }
    else {
      diferencia = calcularDiferencia(precioInicial, "", inputPorcent.value)
      inputPrecioPrm.value = diferencia.precio;
      //console.log(diferencia)
    }

    document.getElementById("dif" + id).textContent = formatPre(diferencia.neta);
  }

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

  function validarPrecios(event){
    let id = event.target.id.slice(-1);
    let inputPrecioPrm = document.getElementById("pre_prom" + id);
    let inputPorcent = document.getElementById("porcen_prom" + id);
    let preini = document.getElementById("precio" + id).textContent.slice(1);
    preini = preini.replace(",","");
    preini = parseFloat(preini);

    if(preini < inputPrecioPrm.value){
      inputPrecioPrm.classList.add("ring", "ring-red-500")
      inputPorcent.classList.add("ring", "ring-red-500")
      inputPrecioPrm.title = "El precio de promoción debe ser menor o igual al precio actual"
      inputPorcent.title = "El precio de promoción debe ser menor o igual al precio actual"
      //console.log("mayor preprom")
    }
    else {
      inputPrecioPrm.classList.remove("ring", "ring-red-500")
      inputPorcent.classList.remove("ring", "ring-red-500")
      inputPrecioPrm.title = ""
      inputPorcent.title = ""
    }
    //console.log("validando", event.target);
    //ring ring-red-500
  }

  function limpiarCampos(event){
    //console.log(event.target)
    let btn = event.target.closest("button");
    //console.log(btn)
    let id = btn.id.slice(-1);
    let inputPrecioPrm = document.getElementById("pre_prom" + id);
    let inputPorcent = document.getElementById("porcen_prom" + id);
    inputPorcent.value = 0;
    let ev = new InputEvent("input")
    inputPorcent.dispatchEvent(ev);
    onPrecioInput(ev);
    inputPrecioPrm.focus();
  }

const agregarArticulo = async function(){
  let articulo = validaModificacionPrecio();
  if(estaDuplicado(articulo.cve)){
    isModalDuplicadoActive.value = true;
    btnDisabled.value = true;
    //document.getElementById("inputConsultar").focus()
    return;
  }
  //if(articulo) aqui debo modificar para validar agregar vacio con and sobre todos 
  //los campos
  if(articulo.cve == "" && articulo.precio1 == "" && articulo.precio2 == ""
     && articulo.precio3 == ""  &&  articulo.precio4 == "" && articulo.precio5 == ""){
      isModalDangerActive.value = true
     }
  if(Object.keys(articulo).length !== 0){
    props.arts.push(articulo);
    isModalAddArtActive.value = true;
    limpiarPrecios();
    await sleep(500);
    isModalAddArtActive.value = false;
    
    let input = document.getElementById("inputConsultar");
    input.value = "";
    document.getElementById("desc_art").textContent = ""
    input.focus()
  }
  /*props.arts.push(
    {"cve":'28', "des1":"Prueba", "precio1":1,
    "precio2":1,"precio3":1,"precio4":1,"precio5":1,});*/
  else{
    isModalDangerActive.value = true
  }
}

function validaModificacionPrecio(){
  let art = {};
  let preciosIni = [datos.precio_vta0, datos.precio_vta1,datos.precio_vta2,
  datos.precio_vta3,datos.precio_vta4]
  let precios = document.getElementsByClassName("pre");
  let tieneCambios = false;
  for (let i = 0; i < precios.length; i++) {
    //console.log(parseFloat(precios[i].value), parseFloat(preciosIni[i]))
    if((precios[i].value != "" || precios[i].value > 0)
        && parseFloat(preciosIni[i]) != parseFloat(precios[i].value)){
          tieneCambios = true;
          break;
    }
  }
  if(!tieneCambios)
    return {};
  //let cve = document.getElementById("inputConsultar").value;
  let cve = datos.art.trim()
  let pre1 = document.getElementById("pre_prom1").value;
  let pre2 = document.getElementById("pre_prom2").value;
  let pre3 = document.getElementById("pre_prom3").value;
  let pre4 = document.getElementById("pre_prom4").value;
  let pre5 = document.getElementById("pre_prom5").value;
  art.cve = cve;
  art.precio1 = pre1
  art.precio2 = pre2
  art.precio3 = pre3
  art.precio4 = pre4
  art.precio5 = pre5
  art.des1 = document.getElementById("desc_art").textContent;
  //let reg = document.getElementById("pre_prom1").value;
  return art;
}
function estaDuplicado(art){
  for (let i = 0; i < props.arts.length; i++) {
    if(props.arts[i].cve == art)
      return true;
  }
  return false;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function actualizarPrecios(){
  let cve = document.getElementById("inputConsultar").getAttribute("cve");
  let index = buscarInArrayPrecios(cve)
  console.log(props.arts[index])

  props.arts[index].precio1 = document.getElementById("pre_prom1").value
  props.arts[index].precio2 = document.getElementById("pre_prom2").value
  props.arts[index].precio3 = document.getElementById("pre_prom3").value
  props.arts[index].precio4 = document.getElementById("pre_prom4").value
  props.arts[index].precio5 = document.getElementById("pre_prom5").value

  cancelarCambios();
}

function buscarInArrayPrecios(cve){
  for (let i = 0; i < props.arts.length; i++) {
    const element = props.arts[i];
    if(element.cve == cve){
      return i;
    }
    
  }
  return -1;
}

function cancelarCambios(){
  limpiarPrecios();
  document.getElementById("desc_art").textContent = ""
  document.getElementById("inputConsultar").value = ""
  document.getElementById("btn_add").classList.remove("hidden")
  document.getElementById("btn_edit").classList.add("hidden")
  document.getElementById("btn_cancel").classList.add("hidden")
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

  <CardBoxModal
    v-model="isModalDangerActive"
    title="No hubo cambio de Precio"
    button="secondary"
    hasButton
  >
    <p>Favor de capturar un precio diferente a los actuales</p>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalNoEncontrado"
    title="Error al capturar el artículo"
    :hasFooter="false"
    titleClass="mx-auto mb-3"
    :blocked="true"
  >
    <img src="/img/cancelar.png" alt="" class="block mx-auto">
    <p>{{errorMsg}}</p>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDuplicadoActive"
    title="Artículo ya capturado"
    button="secondary"
    hasButton
    :blocked="true"
  >
    <p>Favor de capturar uno diferente o eliminar el existente</p>
  </CardBoxModal>
  
  <CardBoxModal
    :hasFooter="false"
    v-model="isModalAddArtActive"
    title="Artículo agregado"
    :blocked="true"
  >
    <img src="/img/checked.png" alt="" class="block mx-auto">
  </CardBoxModal>
  
  
  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th>Código</th>
        <th>Emp</th>
        <!--<th>Descripción</th>-->
        <th >Precio Actual</th>
        <th>Precio Oferta</th>
        <th>Diferencia</th>
        <th></th>
      </tr>
    </thead>
    <tbody class="rounded">
      <tr >
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="w-48 align-top" rowspan="5">
          <input type="number" id="inputConsultar" 
          class="px-3 py-2 max-w-full focus:ring focus:outline-none border
          border-gray-700 rounded w-full dark:placeholder-gray-400 bg-transparent
          text-right ring" @keyup.enter="inputConsultar"
          @keyup.prevent="keyNavigation" @keydown="keyNavPrev">
          <p class="mt-3" id="desc_art"></p>
        </td>
        <td class="w-8 text-center" id="emp1">
          1
        </td>
        <!--<td class="w-8"> 1 </td> -->
        <td class="text-right px-5" id="precio1">
          
        </td>
        <td class="w-1/3">
          <FormField otherClasses="mb-3" wrapClass="row">
            <FormControl type="number" :icon="mdiCurrencyUsd" id="pre_prom1" 
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right pre" parentClasses="basis-2/3"/>
            
            <FormControl type="number" :icon="mdiPercentOutline" @keydown="keyNavPrev"
            iconSide='right' id="porcen_prom1" @keyup.prevent="keyNavigation"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right per pl-0" parentClasses="basis-1/3"/>
          </FormField>
        </td>
        <td class="text-right px-5" id="dif1" > <!--class="lg:w-32"-->
          
        </td>
        <!--<td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            
            ></small
          >
        </td>-->
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="limpiarCampos"
              id="btn_erase1"
            />
          </BaseButtons>
        </td>
      </tr>

      <tr >
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="w-8 text-center" id="emp2">
          1
        </td>
        <!--<td> 2 </td>-->
        <td id="precio2" class="text-right px-5">
          
        </td>
        <td data-label="pre_prm2">
          <FormField otherClasses="mb-3" wrapClass="row">
            <FormControl type="number" :icon="mdiCurrencyUsd" id="pre_prom2" 
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right pre" parentClasses="basis-2/3"/>
            
            <FormControl type="number" :icon="mdiPercentOutline" 
            iconSide='right' id="porcen_prom2" 
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right per pl-0" parentClasses="basis-1/3"/>
          </FormField>
        </td>
        <td class="text-right px-5" id="dif2" > <!--class="lg:w-32"-->
         
        </td>
        <!--<td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            
            ></small
          >
        </td>-->
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="limpiarCampos"
              id="btn_erase2"
            />
          </BaseButtons>
        </td>
      </tr>

      <tr >
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="w-8 text-center" id="emp3">
          1
        </td>
        <!--<td> 3 </td>-->
        <td id="precio3" class="text-right px-5">
          
        </td>
        <td >
          <FormField otherClasses="mb-3" wrapClass="row">
            <FormControl type="number" :icon="mdiCurrencyUsd" id="pre_prom3"
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right pre" parentClasses="basis-2/3"/>
            
            <FormControl type="number" :icon="mdiPercentOutline" 
            iconSide='right' id="porcen_prom3"
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right per pl-0" parentClasses="basis-1/3"/>
          </FormField>
        </td>
        <td class="text-right px-5" id="dif3" > <!--class="lg:w-32"-->
         
        </td>
        <!--<td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            
            ></small
          >
        </td>-->
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="limpiarCampos"
              id="btn_erase3"
            />
          </BaseButtons>
        </td>
      </tr>

      <tr >
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="w-8 text-center" id="emp4">
          1
        </td>
        <!--<td> 4 </td>-->
        <td id="precio4" class="text-right px-5">
          
        </td>
        <td data-label="pre_prm2">
          <FormField otherClasses="mb-3" wrapClass="row">
            <FormControl type="number" :icon="mdiCurrencyUsd" id="pre_prom4"
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right pre" parentClasses="basis-2/3"/>
            
            <FormControl type="number" :icon="mdiPercentOutline" id="porcen_prom4"
            iconSide='right' @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right per pl-0" parentClasses="basis-1/3"/>
          </FormField>
        </td>
        <td class="text-right px-5" id="dif4"> <!--class="lg:w-32"-->
         
        </td>
        <!--<td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            
            ></small
          >
        </td>-->
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="limpiarCampos"
              id="btn_erase4"
            />
          </BaseButtons>
        </td>
      </tr>

      <tr >
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="w-8 text-center" id="emp5">
          1
        </td>
        <!--<td> 5 </td>-->
        <td id="precio5" class="text-right px-5">
          
        </td>
        <td >
          <FormField otherClasses="mb-3" wrapClass="row">
            <FormControl type="number" :icon="mdiCurrencyUsd" id="pre_prom5"
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios" title=""
            otherClasses="text-right pre" parentClasses="basis-2/3"/>
            
            <FormControl type="number" :icon="mdiPercentOutline"
            iconSide='right' id="porcen_prom5"  title=""
            @keyup.prevent="keyNavigation" @keydown="keyNavPrev"
            @input="onPrecioInput" @change="validarPrecios"
            otherClasses="text-right per pl-0" parentClasses="basis-1/3"/>
          </FormField>
        </td>
        <td class="text-right px-5" id="dif5" > <!--class="lg:w-32"-->
         
        </td>
        <!--<td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            
            ></small
          >
        </td>-->
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="limpiarCampos"
              id="btn_erase5"
            />
          </BaseButtons>
        </td>
      </tr>

      
    </tbody>
  </table>

  <BaseButton label="Agregar Artículo" id="btn_add" 
  type="button" :disabled="btnDisabled"
          color="info" @click="agregarArticulo"/>

  <BaseButton label="Actualizar Precios" id="btn_edit" 
  type="button"  otherClasses="hidden mr-4"
          color="success" @click="actualizarPrecios"/>

  <BaseButton label="Cancelar" id="btn_cancel" 
  type="button"  otherClasses="hidden"
          color="danger" @click="cancelarCambios"/>
</template>
