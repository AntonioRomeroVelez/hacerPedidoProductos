<template>
  <div v-if="producto" class="container">
    <!-- Mostrar los detalles del producto -->
    <div>
      <!-- <strong>Nombre: </strong> -->
      <p>{{ producto.NombreProducto }}</p>
    </div>
    <div class="cajas">
      <div>
        <strong>Principio Activo: </strong> {{ producto.PrincipioActivo }}
      </div>

      <div><strong>Presentación: </strong> {{ producto.Presentacion }}</div>

      <div>
        <strong>Promoción: </strong>
        <span v-if="producto.Promocion" class="text-primary">{{
          producto.Promocion
        }}</span>
        <span v-else class="text-warning"> No tiene promoción</span>
      </div>
      <div><strong>Marca: </strong> {{ producto.Marca }}</div>

      <div style="display: inline-flex">
        <strong>PVP: </strong> ${{ producto.PVP }}
      </div>
      <div style="display: inline-flex">
        <strong>Precio Farmacia: </strong>
        ${{ producto.PrecioFarmacia }}
      </div>

      <div>
        <strong>Precio con IVA: </strong>
        <span v-if="producto.IVA == 'SI'"
          >&nbsp; {{ producto.IVA }} tiene IVA - ${{
            (producto.PVP * 15) / 100 + producto.PVP
          }}</span
        >
        <span v-else>&nbsp; {{ producto.IVA }} tiene IVA</span>
      </div>
    </div>

    <!-- Entrada para la cantidad -->
    <strong>Cantidad:</strong>
    <input v-model="cantidad" type="number" min="1" class="cantidad" />

    <!-- Botón para agregar al carrito -->
    <button @click="agregarCarrito" class="btn btn-success" style="margin: 4px">
      Agregar al Carrito
    </button>
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

.container {
  border: solid 1px silver;
  background-color: rgb(245, 244, 233);
  display: inline-table;
  margin: 10px;
  padding: 5px;
  width: 300px;
  border-radius: 5px;
}

.cantidad {
  border: solid 1px silver;
  width: 100px;
  height: 40px;
  border-radius: 5px;
  text-align: center;
  outline: none;
  font-size: 1.5rem;
  margin-right: 5px;
}
p {
  font-weight: bolder;
  text-align: center;
}

.cajas > div {
  border: solid 1px rgb(199, 199, 243);
  background-color: azure;
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
  display: table;
}
</style>
