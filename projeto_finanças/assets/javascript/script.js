const contasPadrao = [
      "Aluguel",
      "Internet",
      "Energia",
      "Água",
      "Cartão de Crédito",
      "Empréstimo"
    ];

    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    let estado = JSON.parse(localStorage.getItem("pagamentos")) || {
      mes: new Date().getMonth(),
      pagos: {}
    };

    const lista = document.getElementById("listaContas");
    const mesAtual = document.getElementById("mesAtual");
    const botaoReset = document.getElementById("resetar");

    function salvar() {
      localStorage.setItem("pagamentos", JSON.stringify(estado));
    }

    function render() {
      lista.innerHTML = "";
      mesAtual.textContent = meses[estado.mes];

      contasPadrao.forEach(conta => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = estado.pagos[conta] || false;

        checkbox.addEventListener("change", () => {
          estado.pagos[conta] = checkbox.checked;
          salvar();
          render();
        });

        if (checkbox.checked) li.classList.add("pago");

        li.appendChild(document.createTextNode(conta));
        li.appendChild(checkbox);
        lista.appendChild(li);
      });

      const todosPagos = contasPadrao.every(c => estado.pagos[c]);
      botaoReset.disabled = !todosPagos;
    }

    botaoReset.addEventListener("click", () => {
      estado.mes = (estado.mes + 1) % 12;
      estado.pagos = {};
      salvar();
      render();
    });

    render();