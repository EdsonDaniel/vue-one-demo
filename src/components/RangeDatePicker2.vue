<!-- SFC file -->
<template>
    <div class="flex">
      <litepie-datepicker
      i18n="es"
        v-model="dateValue"
        :formatter="formatter"
        :shortcuts="customShortcuts"
        placeholder="Vigencia de la promoción"
        :id="idvig"
      ></litepie-datepicker>
    </div>
  </template>
  
  <script>
    import { computed, ref} from "vue";
    import LitepieDatepicker from 'litepie-datepicker';  
    
    export default {
      components:{
        LitepieDatepicker
      },
      //name: 'RangeDate',
      props: ['dateValue','idvig'],
      emits: ['update:dateValue'],
      setup() {
        //const dateValue = ref([]);
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
          formatter, customShortcuts
        };
      }
    }
  </script>