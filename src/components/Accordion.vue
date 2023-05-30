<script setup>
import { computed, useSlots } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  labelFor: {
    type: String,
    default: null,
  },
  help: {
    type: String,
    default: null,
  },

  otherClasses:{
    type: String,
    default: null,
  },

  id:{
    type: String,
    default: null
  }
});

const slots = useSlots();

const wrapperClass = computed(() => {
  const base = ["panel px-2 border-gray-700 border-t-0"
  ];
  //const slotsLength = slots.default().length;  
  return base;
});

const parentClases = computed(() => {
  const base = [" last:mb-0", props.otherClasses ? props.otherClasses : ""];
  return base;
});

function dropdown(event){
    //console.log(event.target)
    event.target.classList.toggle("active");
    var panel = event.target.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      //await sleep(200)
      panel.classList.remove("border-solid","rounded-b","border-2", "pt-3", "pb-4")
      event.target.classList.remove("font-bold");
    } else {
      panel.classList.add("border-solid","rounded-b","border-2", "pt-3", "pb-4")
      event.target.classList.add("font-bold");
      //panel.style.maxHeight = "fit-content";
      panel.style.maxHeight = (panel.scrollHeight + 40) + "px";
      //panel.style.maxHeight = (alturaTotal(panel) + 40) + "px";
    } 
}
function alturaTotal(htmlElement){
    console.log(htmlElement);
    let altura = 0;
    let elementosHijo = htmlElement.children;
    console.log(elementosHijo);
    
    for (let i = 0; i < elementosHijo.length; i++) {
        console.log("hijo1: " + elementosHijo[i])
        altura += elementosHijo[i].style.maxHeight;
    }
    console.log("altura: " + altura)
    return altura;
}
</script>

<template>
  
    <button v-if="label" :id="id"
    class="block accordion hover:bg-blue-600 
    dark:hover:bg-blue-500 border-solid border-gray-700 rounded 
    bg-gray dark:bg-slate-800 border-2 p-3" @click="dropdown">{{
      label
    }}</button>
    <div :class="wrapperClass">
      <slot />
    </div>
  
</template>
