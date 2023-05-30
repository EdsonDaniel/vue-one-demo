<!-- SFC file -->
<script>
    import { ref } from 'vue';
    import Sucursales from '@/components/SucursalCheckBox.vue';
    import BaseButton from "@/components/BaseButton.vue";
    export default {
      components:{
        Sucursales, BaseButton
      },
      name: 'Regiones',
      setup() {
        const dateValue = ref([]);
        return {
          dateValue
        };
      },
      methods: {
        seleccionarSucursales(event) {
            //this.desactivarSucursales(false);
            switch(event.target.value){
                case 'VALLES':
                    //console.log("valles");
                    this.marcarZona(1);
                    break;
                case 'COSTA':
                    //console.log('COSTA');
                    this.marcarZona(2);
                    break;
                case 'ISTMO':
                    //console.log('ISTMO');
                    this.marcarZona(3);
                    break;
                default: 
                    //console.log("default");
                    this.desactivarSucursales(true);
                    break;

            }
        },

        desmarcarSucursales(marcar){
            let options = document.querySelectorAll("[zona]");
            options.forEach(element => {
                element.checked = marcar;
            });
        },

        desactivarSucursales(activar){
            let options = document.querySelectorAll("[zona]");
            if(activar)
                options.forEach(element => {
                    element.removeAttribute("disabled");
                    element.nextElementSibling.classList.remove("opacity-50", "cursor-not-allowed")
                    element.nextElementSibling.classList.add("cursor-pointer")
                });
            else
                options.forEach(element => {
                    element.setAttribute("disabled",true);
                    element.nextElementSibling.classList.remove("cursor-pointer")
                    element.nextElementSibling.classList.add("opacity-50", "cursor-not-allowed")
                });
        },

        marcarZona(zona = 1){
            this.desmarcarSucursales(false);
            this.desactivarSucursales(false);
            let options = document.querySelectorAll('[zona="' + zona +'"]');
            options.forEach(element => {
                element.removeAttribute("disabled");
                element.nextElementSibling.classList.remove("opacity-50", "cursor-not-allowed")
                element.nextElementSibling.classList.add("cursor-pointer")
                element.checked = true;
            });
        },

        personalizado(){
            //this.desmarcarSucursales(false);
            this.desactivarSucursales(false);
        },

        limpiar(){
            this.desmarcarSucursales(false);
            this.desactivarSucursales(true);
            document.getElementById("country-option-4").checked = true;
        }

      }
    }
  </script>
<template>
    <div class="grid grid-flow-col grid-rows-1">
        <div class=" mx-5">
            <div class="max-w-lg mx-auto">
                <fieldset class="mb-1">
                    <legend class="sr-only">
                        Regiones
                    </legend>

                    <div class="mb-3"><h3><b>Regiones:</b></h3></div>
            
                    <div class="flex items-center mb-3 pl-2">
                        <input 
                        id="country-option-1" type="radio" name="zona" 
                        value="VALLES" class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" 
                        aria-labelledby="country-option-1" 
                        aria-describedby="country-option-1" 
                        @change="seleccionarSucursales">
                        <label for="country-option-1" class="text-sm font-medium  pl-2 block">
                            Valles
                        </label>
                    </div>
            
                    <div class="flex items-center mb-3 pl-2">
                        <input 
                        id="country-option-2" 
                        type="radio" name="zona" value="COSTA" 
                        class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" 
                        aria-labelledby="country-option-2" aria-describedby="country-option-2"
                        @change="seleccionarSucursales">
                        <label for="country-option-2" class="text-sm font-medium  pl-2 block">
                        Costa
                        </label>
                    </div>
            
                    <div class="flex items-center mb-3 pl-2">
                        <input 
                        id="country-option-3" type="radio" name="zona" value="ISTMO" 
                        class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" 
                        aria-labelledby="country-option-3" aria-describedby="country-option-3"
                        @change="seleccionarSucursales">
                        <label for="country-option-3" class="text-sm font-medium  pl-2 block">
                        Istmo
                        </label>
                    </div>
            
                    <div class="flex items-center mb-1 pl-2">
                        <input 
                        id="country-option-4" type="radio" name="zona" value="CUSTOM" 
                        class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" 
                        aria-labelledby="country-option-4" aria-describedby="country-option-4"
                        @change="seleccionarSucursales" checked="" >
                        <label for="country-option-4" class="text-sm font-medium  pl-2 block">
                        Personalizado
                        </label>
                    </div>

                    <BaseButton label="Limpiar" id="btn_clean_suc" otherClasses="w-full mt-3"
                        type="button" :small="true" color="info" @click="limpiar"/>
                </fieldset>
            </div>
            
            <div class="max-w-lg mx-auto">
                <fieldset class="">
                    <legend class="sr-only">Aplica para:</legend>
                    <div class="mt-2 mb-3"><h3><b>Aplica para:</b></h3></div>
                    <!--
                    <div class="flex items-center items-start mb-3 pl-2">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                        class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded" checked="">
                        <label for="checkbox-1" class="text-sm pl-3 font-medium ">Ruta</label>
                    </div>
                    -->

                    <div class="flex items-start items-center mb-3 pl-2">
                        <input id="mostrador" aria-describedby="checkbox-3" 
                        type="checkbox" name="mostrador" value="1"
                        checked
                        class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded">
                        <label for="mostrador" class="text-sm pl-3 font-medium ">
                            Mostrador    
                        </label>
                    </div>
            
                    <div class="flex items-start items-center mb-3 pl-2">
                        <input id="retail" aria-describedby="checkbox-2" 
                        type="checkbox"  name="retail" value="1"
                        class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded">
                        <label for="retail" class="text-sm pl-3 font-medium ">
                            Retail
                        </label>
                    </div>
            
                    
                    
                </fieldset>
            
            </div>
            
        </div>

        <div class="flex justify-center">
            <div class="px-5 mx-5 flex flex-wrap py-12" style="height:fit-content; margin:auto;">
                <Sucursales></Sucursales>
            </div>
        </div>
    </div>
  </template>
  
  