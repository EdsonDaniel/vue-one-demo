<!-- SFC file -->
<template>
    <div class="flex">
      <litepie-datepicker
      i18n="es"
        v-model="dateValue"
        :id="idDate"
        :formatter="formatter"
        :shortcuts="customShortcuts"
        placeholder="Vigencia de la promoción"
      ></litepie-datepicker>
    </div>
  </template>
  
  <script>
    import { ref } from 'vue';
    import LitepieDatepicker from 'litepie-datepicker';
    //import "./css/main.css";
    export default {
      components:{
        LitepieDatepicker
      },
      //name: 'RangeDate',
      props:['idDate'],
      setup() {
        const dateValue = ref([]);
        const formatter = ref({
          date: 'DD MMM YYYY',
          month: 'MMM'
        })
        const customShortcuts = () => {
            return [
              {
                label: 'Este mes',
                atClick: () => {
                  const date = new Date();
                  return [
                    // Iniciar en este año, este mes, en el día 1
                    new Date(date.getFullYear(), date.getMonth(), 1),
                    new Date(date.getFullYear(), date.getMonth() + 1, 0)
                  ];
                }
              },
              {
                label: 'Los siguientes 15 días',
                atClick: () => {
                  const date = new Date();
                  return [
                    date,
                    new Date(date.getFullYear(), date.getMonth(),date.getDate() + 15), 
                  ];
                }
              },
            ];
        }
        
        return {
          dateValue, formatter, customShortcuts
        };
      }
    }
  </script>