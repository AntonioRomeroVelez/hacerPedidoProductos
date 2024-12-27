import { createRouter, createWebHistory } from 'vue-router';

// Importar las vistas o componentes que se navegarán
import IndexProductos from './components/IndexProductos.vue';
import ProductosList from './components/ProductosList.vue';
import ProductosAgregados from './components/ProductosAgregados.vue';

const routes = [
   {
      path: '/IndexProductos',
      name: 'home',
      component: IndexProductos, // Componente que muestra la lista de productos
   },
   {
      path: '/ProductosList',
      name: 'Productos',
      component: ProductosList, // Componente que muestra la lista de productos
   },
   {
      path: '/ProductosAgregados',
      name: 'ProductosAgregados',
      component: ProductosAgregados, // Componente que muestra el carrito de productos
   },
];

const router = createRouter({
   history: createWebHistory(), // Usar el historial HTML5 para la navegación
   routes,
});

export default router;
