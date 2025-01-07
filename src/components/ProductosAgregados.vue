<template>
  <div>
    <h2>Productos Agregados</h2>
    <div style="display: flex; margin: 5px">
      <div>
        <input
          type="text"
          v-model="nEmpresa"
          class="form-control"
          placeholder="Escribe Empresa..."
        />
      </div>
      <div>
        <input
          type="text"
          v-model="nVendedor"
          class="form-control"
          placeholder="Escribe Vendedor..."
        />
      </div>
      <div>
        <input
          type="text"
          v-model="nSector"
          class="form-control"
          placeholder="Escribe Sector..."
        />
      </div>
    </div>
    <!-- Botones para exportar en diferentes formatos -->
    <div style="display: flex; gap: 5px">
      <button @click="exportarAExcel" class="btn btn-success">
        Exportar a Excel
      </button>
      <button @click="exportarProformaAExcel" class="btn btn-info">
        Exportar como Proforma
      </button>
      <button @click="exportarPedidoAExcel" class="btn btn-primary">
        Exportar como Pedido
      </button>
    </div>

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
          <td>${{ producto.PVP.toFixed(2) || "N/A" }}</td>
          <td>{{ producto.Promocion || "N/A" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// Importar las librerías necesarias
import { ref, onMounted } from "vue";
import ExcelJS from "exceljs";

const nEmpresa = ref("");
const nVendedor = ref("");
const nSector = ref("");

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
    // Vaciar el localStorage después de cargar los datos
    localStorage.removeItem("productosAgregados"); // Elimina solo el item "productosAgregados"
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
  }
};

// Función para exportar como Proforma
const exportarProformaAExcel = async () => {
  try {
    // Validar que los campos nEmpresa, nVendedor y nSector no estén vacíos ni sean null
    if (!nEmpresa.value || !nVendedor.value || !nSector.value) {
      alert(
        "Por favor, complete los campos de EMPRESA, VENDEDOR y SECTOR antes de exportar."
      );
      return; // Detener la ejecución si falta algún campo
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Proforma");

    // Si las variables están vacías, asignarles un valor predeterminado
    const empresa = nEmpresa.value || "Empresa no especificada";
    const vendedor = nVendedor.value || "Vendedor no especificado";
    const sector = nSector.value || "Sector no especificado";

    // Agregar las primeras 3 filas con los títulos "EMPRESA", "VENDEDOR", "SECTOR"

    worksheet.addRow(["EMPRESA"]);
    worksheet.addRow(["VENDEDOR"]);
    worksheet.addRow(["SECTOR"]);
    worksheet.addRow(); // Agregar un salto de fila

    // Fusionar las celdas B1 y C1 para colocar el valor de la empresa
    worksheet.mergeCells("B1:D1"); // Fusionar las celdas B1 y C1
    worksheet.getCell("B1").value = empresa; // Asignar el valor de 'empresa' a la celda fusionada
    // Fusionar las celdas B1 y C1 para colocar el valor de la empresa
    worksheet.mergeCells("B2:D2"); // Fusionar las celdas B1 y C1
    worksheet.getCell("B2").value = vendedor; // Asignar el valor de 'empresa' a la celda fusionada
    // Fusionar las celdas B1 y C1 para colocar el valor de la empresa
    worksheet.mergeCells("B3:D3"); // Fusionar las celdas B1 y C1
    worksheet.getCell("B3").value = sector; // Asignar el valor de 'empresa' a la celda fusionada

    // Agregar los encabezados a partir de la fila 5
    worksheet.addRow([
      "Nombre",
      "Precio Farmacia",
      "Promoción",
      "Marca",
      "Presentación",
    ]);

    // Verificar si productosAgregados.value es un array y contiene productos
    if (
      Array.isArray(productosAgregados.value) &&
      productosAgregados.value.length > 0
    ) {
      productosAgregados.value.forEach((producto) => {
        // Verificar que cada producto tenga las propiedades correctas
        if (producto.NombreProducto && producto.PrecioFarmacia !== undefined) {
          // Asegurarse de que PrecioFarmacia es un número
          const precioFarmacia = parseFloat(producto.PrecioFarmacia) || 0;

          // Verificar que las propiedades necesarias estén definidas
          const promocion = producto.Promocion || "N/A";
          const marca = producto.Marca || "N/A";
          const presentacion = producto.Presentacion || "N/A";

          // Agregar la fila al Excel
          worksheet.addRow([
            producto.NombreProducto,
            precioFarmacia.toFixed(2), // Asegurarse que tiene 2 decimales
            promocion,
            marca,
            presentacion,
          ]);
        } else {
          console.warn("Producto sin propiedades necesarias:", producto);
        }
      });
    } else {
      console.warn(
        "No se encontró productos en productosAgregados.value o no es un array."
      );
    }

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
    link.download = `Proforma_${empresa}_${sector}.xlsx`;
    link.click();

    // Vaciar el localStorage después de cargar los datos
    localStorage.removeItem("productosAgregados"); // Elimina solo el item "productosAgregados"
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
    // Validar que los campos nEmpresa, nVendedor y nSector no estén vacíos ni sean null
    if (!nEmpresa.value || !nVendedor.value || !nSector.value) {
      alert(
        "Por favor, complete los campos de EMPRESA, VENDEDOR y SECTOR antes de exportar."
      );
      return; // Detener la ejecución si falta algún campo
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Proforma");

    // Si las variables están vacías, asignarles un valor predeterminado
    const empresa = nEmpresa.value || "Empresa no especificada";
    const vendedor = nVendedor.value || "Vendedor no especificado";
    const sector = nSector.value || "Sector no especificado";

    // Agregar las primeras 3 filas con los títulos "EMPRESA", "VENDEDOR", "SECTOR"

    worksheet.addRow(["EMPRESA"]);
    worksheet.addRow(["VENDEDOR"]);
    worksheet.addRow(["SECTOR"]);
    worksheet.addRow(); // Agregar un salto de fila

    // Fusionar las celdas B1 y C1 para colocar el valor de la empresa
    worksheet.mergeCells("B1:D1"); // Fusionar las celdas B1 y C1
    worksheet.getCell("B1").value = empresa; // Asignar el valor de 'empresa' a la celda fusionada
    // Fusionar las celdas B1 y C1 para colocar el valor de la empresa
    worksheet.mergeCells("B2:D2"); // Fusionar las celdas B1 y C1
    worksheet.getCell("B2").value = vendedor; // Asignar el valor de 'empresa' a la celda fusionada
    // Fusionar las celdas B1 y C1 para colocar el valor de la empresa
    worksheet.mergeCells("B3:D3"); // Fusionar las celdas B1 y C1
    worksheet.getCell("B3").value = sector; // Asignar el valor de 'empresa' a la celda fusionada

    // Agregar los encabezados a partir de la fila 5
    worksheet.addRow([
      "Nombre",
      "Precio Farmacia",
      "Promoción",
      "Marca",
      "Presentación",
      "Lote",
      "Fecha Vencimiento",
    ]);

    // Verificar si productosAgregados.value es un array y contiene productos
    if (
      Array.isArray(productosAgregados.value) &&
      productosAgregados.value.length > 0
    ) {
      productosAgregados.value.forEach((producto) => {
        // Verificar que cada producto tenga las propiedades correctas
        if (producto.NombreProducto && producto.PrecioFarmacia !== undefined) {
          // Asegurarse de que PrecioFarmacia es un número
          const precioFarmacia = parseFloat(producto.PrecioFarmacia) || 0;

          // Verificar que las propiedades necesarias estén definidas
          const promocion = producto.Promocion || "N/A";
          const marca = producto.Marca || "N/A";
          const presentacion = producto.Presentacion || "N/A";

          // Agregar la fila al Excel
          worksheet.addRow([
            producto.NombreProducto,
            precioFarmacia.toFixed(2), // Asegurarse que tiene 2 decimales
            promocion,
            marca,
            presentacion,
            "", // Lote
            "", // Fecha Vencimiento
          ]);
        } else {
          console.warn("Producto sin propiedades necesarias:", producto);
        }
      });
    } else {
      console.warn(
        "No se encontró productos en productosAgregados.value o no es un array."
      );
    }

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
    link.download = `Pedido_${empresa}_${sector}.xlsx`;
    link.click();

    // Vaciar el localStorage después de cargar los datos
    localStorage.removeItem("productosAgregados"); // Elimina solo el item "productosAgregados"
  } catch (error) {
    console.error("Error al exportar como Proforma:", error);
  }
};
</script>
