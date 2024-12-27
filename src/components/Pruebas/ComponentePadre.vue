<template>
  <div>Padre</div>

  <ComponenteHijo
    :nombre="nombre"
    :edad="edad"
    @modificarNombre="cambiarValor"
  ></ComponenteHijo>
</template>

<script setup>
import { ref } from "vue";
import ComponenteHijo from "./componenteHijo.vue";

const nombre = ref("Juan");
const edad = ref(9);

const cambiarValor = (nombreEnviado, edadEnviada) => {
  nombre.value = nombreEnviado;
  edad.value = edadEnviada;
};
</script>

<style scope></style>
