<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useMainStore } from "@/stores/main";
import FormControlIcon from "@/components/FormControlIcon.vue";

const props = defineProps({
  name: {
    type: String,
    default: null,
  },
  id: {
    type: String,
    default: null,
  },
  autocomplete: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  inputmode: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  options: {
    type: Array,
    default: null,
  },
  type: {
    type: String,
    default: "text",
  },
  title: {
    type: String,
    default: null,
  },
  modelValue: {
    type: [String, Number, Boolean, Array, Object],
    default: "",
  },
  //****************Proiedades Extra ***********************
  otherClasses:{
    type: String,
    default: null,
  },
  parentClasses:{
    type:String,
    default: null
  },
  errorMsg:{
    type: String,
    default: null
  },
  refs:{
    type:String,
    default:""
  },


  iconSide: {
    type: String,
    default: null,
  },
  required: Boolean,
  borderless: Boolean,
  transparent: Boolean,
  ctrlKFocus: Boolean,
  disabled:Boolean,
  multiple:Boolean,
  list: {
    type: String,
    default: null
  },
  //dataList:Array,
  keyList:String,

  attrr:{
    type:String,
    default: null
  }

});

const emit = defineEmits(["update:modelValue", "setRef"]);

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const parentClass = computed(() => {
  const base = ["relative",
    props.parentClasses ? props.parentClasses : ""
  ];

  return base;
})

const inputElClass = computed(() => {
  const base = [
    "px-3 py-2 max-w-full focus:ring focus:outline-none border-gray-700 rounded w-full",
    "dark:placeholder-gray-400",
    computedType.value === "textarea" ? "h-24" : "h-12",
    props.borderless ? "border-0" : "border",
    props.transparent ? "bg-transparent" : "bg-white dark:bg-slate-800",
    props.otherClasses ? props.otherClasses : ""
  ];

  if (props.icon) {
    if(props.iconSide === "right")
      base.push("pr-10 pl-5");
    else{
      base.push("pl-10 pr-5");
    }
    //base.push("px-5")
  }

  return base;
});

const computedType = computed(() => (props.options ? "select" : props.type));

const controlIconH = computed(() =>
  props.type === "textarea" ? "h-full" : "h-12"
);

const mainStore = useMainStore();

const selectEl = ref(null);

const textareaEl = ref(null);

const inputEl = ref(null);

//const errorMsg = computed(() => ())
onMounted(() => {
  if (selectEl.value) {
    emit("setRef", selectEl.value);
  } else if (textareaEl.value) {
    emit("setRef", textareaEl.value);
  } else {
    emit("setRef", inputEl.value);
  }
  if(props.refs==="input-focus"){
    inputEl.value.focus()
    //inputEl.addEventListener("")
  }

  //this.$refs.input.focus()


});

if (props.ctrlKFocus) {
  const fieldFocusHook = (e) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      inputEl.value.focus();
    } else if (e.key === "Escape") {
      inputEl.value.blur();
    }
  };

  onMounted(() => {
    if (!mainStore.isFieldFocusRegistered) {
      window.addEventListener("keydown", fieldFocusHook);
      mainStore.isFieldFocusRegistered = true;
    } else {
      // console.error('Duplicate field focus event')
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", fieldFocusHook);
    mainStore.isFieldFocusRegistered = false;
  });
}
</script>

<template>
  <div :class="parentClass">
    <FormControlIcon v-if="icon && iconSide==='right'" :icon="icon" 
    :side="iconSide" :h="controlIconH" />
    <select
      v-if="computedType === 'select'"
      :id="id"
      v-model="computedValue"
      :name="name"
      :class="inputElClass"
      :title="title"
      :atr="props.attrr"
      :disabled="disabled"
    >
      <option
        v-for="option in options"
        :key="option"
        :value="option.id ?? option"
      >
        {{ option.label ?? option }}
      </option>
    </select>
    <textarea
      v-else-if="computedType === 'textarea'"
      :id="id"
      v-model="computedValue"
      :class="inputElClass"
      :name="name"
      :placeholder="placeholder"
      :required=required
      :disabled=disabled
    />
    <input
      v-else
      :id="id"
      ref="inputEl"
      v-model="computedValue"
      :name="name"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :required=required
      :placeholder="placeholder"
      :type="computedType"
      :class="inputElClass"
      :disabled="disabled"
      :title="title"      
      :multiple="multiple"
      :list="list"
      :atr="props.attrr"
    />

   
    <FormControlIcon v-if="icon && iconSide!=='right'" :icon="icon" :side="iconSide" 
    :h="controlIconH" />
    <div v-if="errorMsg" 
    class="text-xs text-red-500 dark:text-red-500 mt-1">
      {{ errorMsg }}
    </div>
  </div>
  
</template>
