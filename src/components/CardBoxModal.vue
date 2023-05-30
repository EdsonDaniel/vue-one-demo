<script setup>
import { computed } from "vue";
import { mdiClose } from "@mdi/js";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  button: {
    type: String,
    default: "info",
  },
  buttons: {
    type: String,
    default: "danger",
  },
  buttonLabel: {
    type: String,
    default: "Aceptar",
  },
  hasCancel: Boolean,
  hasButton: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: null,
  },
  widthAuto: {
    type: Boolean,
    default: null
  },
  hasFooter: {
    type: Boolean,
    default: true
  },
  titleClass:{
    type: String,
    default: null
  },
  blocked:{
    type: Boolean,
    default: false
  }
});

const inputElClass = computed(() => {
  const base = ["shadow-lg max-h-modal z-50",
    props.widthAuto ? "w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12": "w-auto"
  ];
  return base;
});

const titleAddClass = computed(() => {
  const base = [ props.titleClass ? props.titleClass : ""
  ];
  return base;
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};

const confirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("cancel");

const overlayClick = () => props.blocked ? "" : cancel();

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && value.value && !props.blocked) {
    //console.log("tipo", props.blocked)
    cancel();
  }
});
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="overlayClick">
    <CardBox
      v-show="value"
      :class="inputElClass"
      is-modal
    >
      <CardBoxComponentTitle :title="title" :titleClass="titleClass">
        <BaseButton
          v-if="hasCancel"
          :icon="mdiClose"
          color="whiteDark"
          small
          rounded-full
          @click.prevent="cancel"
        />
      </CardBoxComponentTitle>

      <div class="space-y-3">
        <slot />
      </div>

      <template v-if="hasFooter" #footer>
        <BaseButtons>
          <BaseButton v-if="hasButton"
          :label="buttonLabel" :color="button" @click="confirm" />
          <BaseButton
            color="danger"
            v-if="hasCancel"
            label="Cancelar"
            @click="cancel"
          />
        </BaseButtons>
      </template>
    </CardBox>
  </OverlayLayer>
</template>
