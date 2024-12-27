<template>
  <div>
    <h2>Productos Agregados</h2>
    <!-- Botones para exportar en diferentes formatos -->
    <button @click="exportarAExcel" class="btn btn-success">
      Exportar a Excel
    </button>
    <button @click="exportarProformaAExcel" class="btn btn-info">
      Exportar como Proforma
    </button>
    <button @click="exportarPedidoAExcel" class="btn btn-primary">
      Exportar como Pedido
    </button>

    <!-- Mostrar mensaje si no hay productos en el carrito -->
    <div v-if="productosAgregados.length === 0">
      <p>No has agregado productos al carrito.</p>
    </div>

    <!-- Mostrar la tabla con los productos agregados -->
    <table class="table table-striped" v-else ref="productosTable">
      <thead>
        <tr>
          <th>Acción</th>
          <th>Cantidad</th>
          <th>Nombre</th>
          <th>Principio Activo</th>
          <th>Presentación</th>
          <th>Precio Farmacia</th>
          <th>Marca</th>
          <th>PVP</th>
          <th>Promoción</th>
          <th>Precio Unitario</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <!-- Iteración a través de los productosAgregados -->
        <tr v-for="producto in productosAgregados" :key="producto.ID">
          <td>
            <button
              @click="eliminarProducto(producto.ID)"
              class="btn btn-danger"
            >
              Eliminar
            </button>
          </td>
          <td>{{ producto.cantidad }}</td>
          <td>{{ producto.NombreProducto }}</td>
          <td>{{ producto.PrincipioActivo }}</td>
          <td>{{ producto.Presentacion }}</td>
          <td>${{ producto.PrecioFarmacia.toFixed(2) }}</td>
          <td>{{ producto.Marca }}</td>
          <td>{{ producto.PVP || "N/A" }}</td>
          <td>{{ producto.Promocion || "N/A" }}</td>
          <td>
            ${{
              (
                producto.PrecioFarmacia * (producto.IVA === "SI" ? 1.15 : 1)
              ).toFixed(2)
            }}
          </td>
          <td>
            ${{
              (
                producto.PrecioFarmacia *
                producto.cantidad *
                (producto.IVA === "SI" ? 1.15 : 1)
              ).toFixed(2)
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// Importar las librerías necesarias
import { ref, onMounted } from "vue";
import ExcelJS from "exceljs";

// Declarar las referencias
const productosAgregados = ref([]);

// Cargar los productos desde localStorage
onMounted(() => {
  const datosGuardados = JSON.parse(localStorage.getItem("productosAgregados"));
  if (datosGuardados) {
    productosAgregados.value = datosGuardados;
  }
});

// Función para eliminar productos
const eliminarProducto = (productoID) => {
  const index = productosAgregados.value.findIndex(
    (producto) => producto.ID === productoID
  );
  if (index !== -1) {
    productosAgregados.value.splice(index, 1);
    localStorage.setItem(
      "productosAgregados",
      JSON.stringify(productosAgregados.value)
    );
  }
};

// Función para exportar como Excel
const exportarAExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Productos");

    // Definir los encabezados de la tabla
    worksheet.columns = [
      { header: "Acción", key: "accion" },
      { header: "Cantidad", key: "cantidad" },
      { header: "Nombre", key: "nombre" },
      { header: "Principio Activo", key: "principioActivo" },
      { header: "Presentación", key: "presentacion" },
      { header: "Precio Farmacia", key: "precioFarmacia" },
      { header: "PVP", key: "pvp" },
      { header: "Promoción", key: "promocion" },
      { header: "Precio Unitario", key: "precioUnitario" },
      { header: "Total", key: "total" },
    ];

    // Llenar los datos de la tabla
    productosAgregados.value.forEach((producto) => {
      worksheet.addRow({
        accion: "Eliminar",
        cantidad: producto.cantidad,
        nombre: producto.NombreProducto,
        principioActivo: producto.PrincipioActivo,
        presentacion: producto.Presentacion,
        precioFarmacia: producto.PrecioFarmacia.toFixed(2),
        pvp: producto.PVP || "N/A",
        promocion: producto.Promocion || "N/A",
        precioUnitario: (
          producto.PrecioFarmacia * (producto.IVA === "SI" ? 1.15 : 1)
        ).toFixed(2),
        total: (
          producto.PrecioFarmacia *
          producto.cantidad *
          (producto.IVA === "SI" ? 1.15 : 1)
        ).toFixed(2),
      });
    });

    // Ajustar el tamaño de las celdas
    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;

    // Establecer estilo (alineación y ajuste de texto)
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });

    // Ajustar el contenido de las celdas para que se adapte a la celda y habilitar el ajuste de texto
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        // Alineación del texto
        if (colNumber === 1) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          }; // Para el primer campo
        } else {
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          }; // Para el resto de las celdas
        }

        // Establecer bordes para las celdas
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generar archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "productos.xlsx";
    link.click();
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
  }
};

// Función para exportar como Proforma
const exportarProformaAExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Proforma");

    // Definir los encabezados de la proforma
    worksheet.columns = [
      { header: "Nombre", key: "nombre" },
      { header: "Precio Farmacia", key: "precioFarmacia" },
      { header: "Promoción", key: "promocion" },
      { header: "Marca", key: "marca" },
      { header: "Presentación", key: "presentacion" },
    ];

    // Llenar los datos de la proforma
    productosAgregados.value.forEach((producto) => {
      worksheet.addRow({
        nombre: producto.NombreProducto,
        precioFarmacia: producto.PrecioFarmacia.toFixed(2),
        promocion: producto.Promocion || "N/A",
        marca: producto.Marca || "N/A", // Asumí que tienes la propiedad "Marca"
        presentacion: producto.Presentacion,
      });
    });

    // Ajustar el tamaño de las celdas
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;

    // Establecer estilo (alineación y ajuste de texto)
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });
    // Ajustar el contenido de las celdas para que se adapte a la celda y habilitar el ajuste de texto
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        // Alineación del texto
        if (colNumber === 1) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          }; // Para el primer campo
        } else {
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          }; // Para el resto de las celdas
        }

        // Establecer bordes para las celdas
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generar archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "proforma.xlsx";
    link.click();
  } catch (error) {
    console.error("Error al exportar como Proforma:", error);
  }
};

// // Función para exportar como Pedido
// const exportarPedidoAExcel = async () => {
//   // Aquí puedes usar la misma función exportarAExcel si deseas incluir todos los datos
//   await exportarAExcel();
// };

// Función para exportar como Proforma
const exportarPedidoAExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Proforma");

    // Definir los encabezados de la proforma
    worksheet.columns = [
      { header: "Nombre", key: "nombre" },
      { header: "Precio Farmacia", key: "precioFarmacia" },
      { header: "Promoción", key: "promocion" },
      { header: "Marca", key: "marca" },
      { header: "Presentación", key: "presentacion" },
      { header: "Lote", key: "lote" },
      { header: "Fecha Vencimiento", key: "fvencimiento" },
    ];

    // Llenar los datos de la proforma
    productosAgregados.value.forEach((producto) => {
      worksheet.addRow({
        nombre: producto.NombreProducto,
        precioFarmacia: producto.PrecioFarmacia.toFixed(2),
        promocion: producto.Promocion || "N/A",
        marca: producto.Marca || "N/A", // Asumí que tienes la propiedad "Marca"
        presentacion: producto.Presentacion,
        lote: "",
        fvencimiento: "",
      });
    });

    // Ajustar el tamaño de las celdas
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;

    // Establecer estilo (alineación y ajuste de texto)
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      row.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });
    // Ajustar el contenido de las celdas para que se adapte a la celda y habilitar el ajuste de texto
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        // Alineación del texto
        if (colNumber === 1) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          }; // Para el primer campo
        } else {
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          }; // Para el resto de las celdas
        }

        // Establecer bordes para las celdas
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generar archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "proforma.xlsx";
    link.click();
  } catch (error) {
    console.error("Error al exportar como Proforma:", error);
  }
};
</script>
