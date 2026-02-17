document.addEventListener("DOMContentLoaded", function(){

    const form = document.querySelector("form");
    const tbody = document.querySelector("#tabela-compras tbody");
    const totalElemento = document.querySelector(".total strong");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if(id === null){
        alert("Cartão não encontrado!");
        window.location.href = "index.html";
        return;
    }
    
    const titulo = document.getElementById("titulo-cartao");
    
    const fixos = ["Nubank", "Mercado Pago", "Santander"];
    let extras = JSON.parse(localStorage.getItem("cartoesExtras")) || [];
    
    if(Number(id) < 3){
        titulo.textContent = fixos[Number(id)];
    } else {
        titulo.textContent = extras[Number(id) - 3];
    }

    let compras = JSON.parse(localStorage.getItem("compras_" + id)) || [];
    let editandoIndex = null;


    // =========================
    function salvar(){
        localStorage.setItem("compras_" + id, JSON.stringify(compras));
    }

    function formatar(valor){
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function formatarData(dataSalva){
        const partes = dataSalva.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function atualizarTotal(){
        let total = compras.reduce((acc, item) => acc + item.valor, 0);
        totalElemento.textContent = formatar(total);
    }

    function renderizar(){
        tbody.innerHTML = "";

        compras.forEach((item, index) => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${formatarData(item.data)}</td>
                <td>${item.descricao}</td>
                <td>${item.tipo}</td>
                <td class="valor">${formatar(item.valor)}</td>
                <td>${item.parcelas}x</td>
                <td>
                    <div class="acoes">
                        <span class="editar" data-index="${index}">✏️</span>
                        <span class="lixeira" data-index="${index}">🗑️</span>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        atualizarTotal();
    }

    // =========================
    // MÁSCARA DATA IGUAL INDEX

    const inputData = document.querySelector("input[placeholder='DD/MM/AA']");
    inputData.addEventListener("input", function(e){
        let valor = e.target.value.replace(/\D/g, "");

        if(valor.length > 2) valor = valor.slice(0,2) + "/" + valor.slice(2);
        if(valor.length > 5) valor = valor.slice(0,5) + "/" + valor.slice(5,7);

        e.target.value = valor;
    });

    // =========================
    // EDITAR / EXCLUIR

    tbody.addEventListener("click", function(e){

        const index = e.target.getAttribute("data-index");

        if(e.target.classList.contains("lixeira")){
            compras.splice(index, 1);
            salvar();
            renderizar();
        }

        if(e.target.classList.contains("editar")){

            const item = compras[index];

            document.querySelector("input[placeholder='DD/MM/AA']").value = formatarData(item.data);
            document.querySelector("input[placeholder='Descrição']").value = item.descricao;
            document.getElementById("tipo").value = item.tipo;
            document.querySelector("input[placeholder='Valor (R$)']").value = item.valor;
            document.querySelector("input[placeholder='Parcelas']").value = item.parcelas;

            editandoIndex = index;

            const botao = document.querySelector(".adicionar");
            botao.textContent = "Atualizar";
            document.querySelector(".formulario").classList.add("editando");
            botao.classList.add("atualizando");
        }
    });

    // =========================
    // ADICIONAR

    form.addEventListener("submit", function(e){

        e.preventDefault();

        let dataBR = document.querySelector("input[placeholder='DD/MM/AA']").value;

        if(!/^\d{2}\/\d{2}\/\d{2}$/.test(dataBR)){
            alert("Data inválida!");
            return;
        }

        const partes = dataBR.split("/");
        const data = `${partes[2]}-${partes[1]}-${partes[0]}`;

        const descricao = document.querySelector("input[placeholder='Descrição']").value;
        const tipo = document.getElementById("tipo").value;

        let valorDigitado = document.querySelector("input[placeholder='Valor (R$)']").value;
        valorDigitado = valorDigitado.replace(",", ".");
        const valor = parseFloat(valorDigitado);

        const parcelas = parseInt(document.querySelector("input[placeholder='Parcelas']").value) || 1;

        if(!descricao || isNaN(valor)){
            alert("Preencha corretamente!");
            return;
        }

        if(editandoIndex !== null){

            compras[editandoIndex] = {
                data,
                descricao,
                tipo,
                valor,
                parcelas
            };

            editandoIndex = null;

            const botao = document.querySelector(".adicionar");
            botao.textContent = "Adicionar";
            document.querySelector(".formulario").classList.remove("editando");
            botao.classList.remove("atualizando");

        } else {

            compras.push({
                data,
                descricao,
                tipo,
                valor,
                parcelas
            });

        }

        salvar();
        renderizar();
        form.reset();

    });

    renderizar();

});
