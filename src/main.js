import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importar el archivo de rutas
import 'bootstrap/dist/css/bootstrap.min.css';



// Crear la aplicación y usar Vue Router
createApp(App)
   .use(router) // Usar Vue Router
   .mount('#app');
