document.addEventListener("DOMContentLoaded", function(){

    const form = document.querySelector("form");
    const tbody = document.querySelector("tbody");
    const totalElemento = document.querySelector(".total strong");

    let assinaturas = JSON.parse(localStorage.getItem("assinaturas")) || [];

    /* ======================== */
    function salvar(){
        localStorage.setItem("assinaturas", JSON.stringify(assinaturas));
    }

    function formatar(valor){
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function atualizarTotal(){
        let total = assinaturas.reduce((acc, item) => acc + item.valor, 0);
        totalElemento.textContent = formatar(total);
    }

    function renderizar(){
        tbody.innerHTML = "";

      function formatarData(dataISO){
        const data = new Date(dataISO);
        return data.toLocaleDateString("pt-BR");
      }

        assinaturas.forEach((item, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${formatarData(item.data)}</td>
                <td>${item.descricao}</td>
                <td>${item.cartao}</td>
                <td class="valor">${formatar(item.valor)}</td>
                <td class="lixeira" data-index="${index}">🗑️</td>
            `;

            tbody.appendChild(tr);
        });

        atualizarTotal();
    }

    /* ======================== */
    /* REMOVER */
    tbody.addEventListener("click", function(e){
        if(e.target.classList.contains("lixeira")){
            const index = e.target.getAttribute("data-index");
            assinaturas.splice(index, 1);
            salvar();
            renderizar();
        }
    });

    /* ======================== */
    /* ADICIONAR */

        const inputData = document.querySelector("input[placeholder='DD/MM/AAAA']");
        inputData.addEventListener("input", function(e){
        let valor = e.target.value.replace(/\D/g, "");

        if(valor.length > 2) valor = valor.slice(0,2) + "/" + valor.slice(2);
        if(valor.length > 5) valor = valor.slice(0,5) + "/" + valor.slice(5,9);

        e.target.value = valor;
        });

    form.addEventListener("submit", function(e){
        e.preventDefault();

        // const data = form.querySelector("input[type='date']").value;

        let dataBR = inputData.value;

        if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dataBR)){
          alert("Data inválida!");
          return;
        }

// converter para ISO antes de salvar
const partes = dataBR.split("/");
const data = `${partes[2]}-${partes[1]}-${partes[0]}`;

        const descricao = form.querySelector("input[type='text']").value;
        const cartao = form.querySelector("select").value;
        // const valor = parseFloat(form.querySelector("input[type='number']").value);
        let valorDigitado = form.querySelector("input[type='text'][placeholder='Valor (R$)']").value;
        valorDigitado = valorDigitado.replace(",", ".");
        const valor = parseFloat(valorDigitado);


        if(!data || !descricao || !cartao || isNaN(valor)) return;

        assinaturas.push({
            data,
            descricao,
            cartao,
            valor
        });

        salvar();
        renderizar();
        form.reset();
    });

    /* ======================== */
    renderizar();

});
