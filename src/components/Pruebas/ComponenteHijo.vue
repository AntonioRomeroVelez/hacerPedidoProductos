<template>
  <div>Componente Hijo</div>
  <h2>hola soy {{ nombre }} y tengo {{ edad }} años</h2>

  <input type="text" v-model="nombreHijo" />
  <button @click="modificar">Cambiar Nombre y edad</button>
</template>

<script setup>
import { ref } from "vue";
let nombreHijo = ref("");

const emit = defineEmits(["modificarNombre"]);

const modificar = () => {
  emit("modificarNombre", nombreHijo.value, 12);
};

const props = defineProps({
  nombre: String,
  edad: Number,
});
</script>

<style scope></style>
