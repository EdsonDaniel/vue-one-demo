<script setup>
import { ref } from 'vue'

const parentMessage = ref('Parent')
const items = ref(["001",
            "002",
            "003",
            "004",
            "005",
            "006",
            "007",
            "008",
            "009",
            "011",
            "012",
            "013",
            "014",
            "015",
            "016",
            "017",
            "018",
            "020",
            "021",
            "022",
            "023",
            "024",
            //"030",
            "031",
            "032",
            "033",
            "035",
            "036",
            "037",
            "038",
            "039",
            "040",
            "041",
            "042" ,
            "043",
            "044",
            "045",
            "046",
            "047",
            "048",
            "049",
            "050",
            "051",
            "052" ,
            "053",
            "055",
            "056",
            "057",
            "058",
            "059",
            "060",
            "061",
            "063",
            "065",
            "066",
            "067",
            "068",
            "070",
            "071",
            "072",
            "077"],)

function getZonaPorSuc(sucursal){
      switch(sucursal){
            //Valles
            case '001':
            case '002':
            case '003':
            case '004':
            case '005':
            case '006':
            case '007':
            case '008':
            case '009':
            case '011':
            case '014':
            case '017':
            case '018':
            case '020':
            case '021':
            case '022':
            case '031':
            case '032':
            case '037':
            case '040':
            case '041':
            case '043':
            case '045':
            case '047':
            case '048':
            case '050':
            case '051':
            case '052':
            case '055':
            case '056':
            case '057':
            case '058':
            case '059':
            case '060':
            case '063':
            case '065':
            case '066':
            case '067':
            case '070':
            case '071':
            case '072':
            case '077':
                  return 1;
            
            //Costa
            case '012':
            case '013':
            case '035':
            case '042':
            case '044':
            case '049':
            case '053':
            case '061':
                  return 2;
            
            //Istmo
            case '015':
            case '016':
            case '023':
            case '024':
            case '033':
            case '036':
            case '038':
            case '039':
            case '046':
            case '068':
                  return 3;
            default:
                  return 1;
      }
}
</script>


<template>
      <div v-for="item in items" :key="item" class="flex items-start items-center 
      inline-flex mr-3 w-16" > <!--mb-4 inline-flex mr-3 w-16" -->
        
            <input :id="'suc_'+item" :aria-describedby="'suc_'+item" 
            type="checkbox" :value="item"
            class="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 
            h1 my-1 w-4 rounded cursor-pointer py-2 disabled:opacity-50 
            disabled:cursor-not-allowed sucursal" 
            :zona="getZonaPorSuc(item)">
            <label :for="'suc_'+item" 
            class="text-sm py-2 pl-3 font-medium cursor-pointer">
                {{item}}
            </label>
        
      </div>
</template>
  
  