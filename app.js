document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('transaccion-form'); /* ingresa la transaccion */
    const tipo = document.getElementById('tipo'); /* seleccion tipo de transaccion */
    const cantidad = document.getElementById('cantidad');
    const historial = document.getElementById('historial');
    const balance = document.getElementById('balance');
    const balanceChart = document.getElementById('balanceChart').getContext('2d');
  
    
    let transacciones = [];
    let balanceTotal = 0;
    let chart;
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const tipoValor = tipo.value;
      const cantidadValor = parseFloat(cantidad.value);
  
      if (isNaN(cantidadValor) || cantidadValor <= 0) {
        alert('Por favor, ingrese una cantidad válida');
        return;
      }
  
      const transaccion = {
        tipo: tipoValor,
        cantidad: cantidadValor
      };
  
      transacciones.push(transaccion);
      actualizarHistorial();
      actualizarBalance();
      actualizarGrafico();
      cantidad.value = '';
    });
  
    function actualizarHistorial() {
      historial.innerHTML = '';
      transacciones.forEach((transaccion) => {
        const li = document.createElement('li');
        li.textContent = `${transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.cantidad}`;
        historial.appendChild(li);
      });
    }
  
    function actualizarBalance() {
      balanceTotal = transacciones.reduce((acc, transaccion) => {
        return transaccion.tipo === 'ingreso' ? acc + transaccion.cantidad : acc - transaccion.cantidad;
      }, 0);
  
      balance.textContent = `Balance: ${balanceTotal.toFixed(2)}`;
    }
  
    function actualizarGrafico() {
      const fechas = transacciones.map((_, index) => `Transacción ${index + 1}`);
      const valores = transacciones.reduce((acc, transaccion, index) => {
        if (transaccion.tipo === 'ingreso') {
          acc.push((acc[index - 1] || 0) + transaccion.cantidad);
        } else {
          acc.push((acc[index - 1] || 0) - transaccion.cantidad);
        }
        return acc;
      }, []);
  
      if (chart) {
        chart.destroy();
      }
  
      chart = new Chart(balanceChart, {
        type: 'line',
        data: {
          labels: fechas,
          datasets: [{
            label: 'Balance',
            data: valores,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  });