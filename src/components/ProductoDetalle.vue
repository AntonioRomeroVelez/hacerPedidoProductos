<template>
  <div v-if="producto" class="container">
    <!-- Mostrar los detalles del producto -->
    <div><strong>Nombre:</strong> {{ producto.NombreProducto }}</div>
    <div><strong>Presentación:</strong> {{ producto.Presentacion }}</div>
    <div><strong>Principio Activo:</strong> {{ producto.PrincipioActivo }}</div>
    <div>
      <strong>Promoción:</strong>
      <span v-if="producto.Promocion" class="text-primary">{{
        producto.Promocion
      }}</span>
      <span v-else class="text-warning"> No tiene promoción</span>
    </div>
    <div><strong>Precio Farmacia:</strong> ${{ producto.PrecioFarmacia }}</div>
    <div><strong>PVP:</strong> ${{ producto.PVP }}</div>
    <div><strong>Marca:</strong> {{ producto.Marca }}</div>
    <div><strong>IVA:</strong> {{ producto.IVA }}</div>
    <div><strong>Precio con IVA:</strong> ${{ precioConIVA }}</div>

    <!-- Entrada para la cantidad -->
    <div>
      <strong>Cantidad:</strong>
      <input v-model="cantidad" type="number" min="1" class="cantidad" />
    </div>

    <!-- Botón para agregar al carrito -->
    <div class="text-center">
      <button @click="agregarCarrito" class="btn btn-success">
        Agregar al Carrito
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// import ProductosAgregados from "./ProductosAgregados";

const cantidad = ref();

const emit = defineEmits(["agregarProductoHijo"]);

const agregarCarrito = () => {
  if (cantidad.value > 0) {
    // Validamos que la cantidad sea un número positivo
    emit("agregarProductoHijo", cantidad.value, props.producto);
    cantidad.value = ""; // Limpiar el campo después de agregar
  } else {
    alert("Por favor, ingresa una cantidad válida.");
  }
};

const props = defineProps({
  producto: {
    type: Object,
    required: true, // Aseguramos que 'producto' sea obligatorio
  },
  cantidad: {
    type: Number,
    default: 1, // Valor predeterminado para la cantidad
  },
});

// Calcular el precio con IVA (suponiendo que IVA sea "SI" y el porcentaje sea 15%)
const precioConIVA = computed(() => {
  if (props.producto.IVA === "SI") {
    return (props.producto.PrecioFarmacia * 1.15).toFixed(2); // Agregar 15% de IVA
  }
  return props.producto.PrecioFarmacia.toFixed(2); // Si no tiene IVA, mostrar el precio normal
});
</script>

<style scoped>
/* Estilos opcionales para el componente hijo */
div {
  margin-bottom: 10px;
}
.container {
  border: solid 1px silver;
  display: inline-table;
  width: 300px;
  margin: 10px;
  padding: 5px;
  border-radius: 5px;
}
.cantidad {
  border: solid 1px silver;
  width: 80px;
  border-radius: 5px;
  text-align: center;
  outline: none;
}
</style>
