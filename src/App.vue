<template>
  <div id="app">
    <!-- Agregar un enlace de navegación -->
    <nav>
      <router-link to="/IndexProductos">Inicio</router-link> |
      <router-link to="/ProductosList">Mostrar Productos</router-link> |
      <router-link to="/ProductosAgregados">Productos Agregados</router-link>
    </nav>

    <!-- El contenido del componente se inyectará aquí -->
    <router-view></router-view>
  </div>
</template>

<script setup>
// No necesitas agregar nada aquí para Vue Router
</script>

<style>
/* Estilos opcionales */
nav {
  margin-bottom: 20px;
}

router-link {
  margin-right: 10px;
  text-decoration: none;
  color: #42b983;
}

router-link:hover {
  text-decoration: underline;
}
</style>
