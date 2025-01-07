<template>
  <div id="app" style="margin: 10px">
    <!-- Agregar un enlace de navegación -->
    <!-- <nav >
      <router-link to="/IndexProductos">Inicio</router-link> |
      <router-link to="/ProductosList">Mostrar Productos</router-link> |
      <router-link to="/ProductosAgregados">Productos Agregados</router-link>
    </nav> -->

    <nav
      class="navbar navbar-expand-sm navbar-dark bg-dark"
      style="padding: 10px"
    >
      <div class="">
        <router-link to="/IndexProductos" class="navbar-brand"
          >Inicio</router-link
        >
      </div>
      <div class="" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/ProductosList" class="nav-link"
              >Mostrar Productos</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/ProductosAgregados" class="nav-link"
              >Productos Agregados</router-link
            >
          </li>
        </ul>
      </div>
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
