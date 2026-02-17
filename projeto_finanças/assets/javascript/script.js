document.addEventListener("DOMContentLoaded", function(){

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const form = document.querySelector("form");
    const tbody = document.querySelector("tbody");
    const totalElemento = document.querySelector(".total strong");

    let assinaturas = JSON.parse(localStorage.getItem("assinaturas_" + id)) || [];
    let editandoIndex = null;

    // =============================
    // CARTÕES EXTRAS (BOTÃO +)
    // =============================

    const lista = document.getElementById("lista-cartoes");
    const btnAdd = document.getElementById("btn-add");

    if(lista && btnAdd){

        let cartoesExtras = JSON.parse(localStorage.getItem("cartoesExtras")) || [];

        function salvarCartoes(){
            localStorage.setItem("cartoesExtras", JSON.stringify(cartoesExtras));
        }

        function renderizarExtras(){

            document.querySelectorAll(".card.extra").forEach(e => e.remove());

            cartoesExtras.forEach((nome, index) => {

                const novoId = index + 3;

                const a = document.createElement("a");
                a.href = `cartao.html?id=${novoId}`;
                a.classList.add("card", "extra", "dynamic-card");

                a.innerHTML = `
                    <span class="nome-cartao">${nome}</span>
                    <span class="remover-cartao" data-index="${index}">✖</span>
                `;

                lista.insertBefore(a, btnAdd);
            });

            // evento remover
            document.querySelectorAll(".remover-cartao").forEach(botao => {
                botao.addEventListener("click", function(e){

                    e.preventDefault(); 
                    e.stopPropagation();

                    const index = this.getAttribute("data-index");

                    cartoesExtras.splice(index, 1);
                    localStorage.setItem("cartoesExtras", JSON.stringify(cartoesExtras));

                    renderizarExtras();
                });
            });
        }

        btnAdd.addEventListener("click", function(){

            const nome = prompt("Nome do novo cartão:");

            if(!nome) return;

            cartoesExtras.push(nome);
            salvarCartoes();
            renderizarExtras();
        });

        renderizarExtras();
    }


    /* ======================== */
    function salvar(){
        localStorage.setItem("assinaturas_" + id, JSON.stringify(assinaturas));
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
        let total = assinaturas.reduce((acc, item) => acc + item.valor, 0);
        totalElemento.textContent = formatar(total);
    }

    function renderizar(){
        tbody.innerHTML = "";

        assinaturas.forEach((item, index) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${formatarData(item.data)}</td>
                <td>${item.descricao}</td>
                <td>${item.cartao}</td>
                <td class="valor">${formatar(item.valor)}</td>
                <td class="acoes">
                    <button class="editar" data-index="${index}">✏️</button>
                    <button class="lixeira" data-index="${index}">🗑️</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        atualizarTotal();
    }

    /* ======================== */
    /* REMOVER */
    tbody.addEventListener("click", function(e){

        const index = e.target.getAttribute("data-index");

        if(e.target.classList.contains("lixeira")){
            assinaturas.splice(index, 1);
            salvar();
            renderizar();
        }

        if(e.target.classList.contains("editar")){
            const item = assinaturas[index];

            // preencher formulário
            document.querySelector("input[placeholder='DD/MM/AA']").value = formatarData(item.data);
            document.querySelector("input[placeholder='Descrição']").value = item.descricao;
            document.querySelector("select").value = item.cartao;
            document.querySelector("input[placeholder='Valor (R$)']").value = item.valor;

            editandoIndex = index;

            document.querySelector(".adicionar").textContent = "Atualizar";

            document.querySelector(".formulario").classList.add("editando");
            document.querySelector(".adicionar").classList.add("atualizando");
        }
    });

    /* ======================== */
    /* ADICIONAR */

        const inputData = document.querySelector("input[placeholder='DD/MM/AA']");
        inputData.addEventListener("input", function(e){
        let valor = e.target.value.replace(/\D/g, "");

        if(valor.length > 2) valor = valor.slice(0,2) + "/" + valor.slice(2);
        if(valor.length > 5) valor = valor.slice(0,5) + "/" + valor.slice(5,7);

        e.target.value = valor;
        });

        form.addEventListener("submit", function(e){
        e.preventDefault();

        const inputData = form.querySelector("input[placeholder='DD/MM/AA']");
        let dataBR = inputData.value;

        if(!/^\d{2}\/\d{2}\/\d{2}$/.test(dataBR)){
          alert("Data inválida!");
          return;
        }

        // converter para ISO antes de salvar
        const partes = dataBR.split("/");
        const data = `${partes[2]}-${partes[1]}-${partes[0]}`;

        const descricao = form.querySelector("input[placeholder='Descrição']").value;
        const cartao = form.querySelector("select").value;
        let valorDigitado = form.querySelector("input[placeholder='Valor (R$)']").value;
        valorDigitado = valorDigitado.replace(",", ".");
        const valor = parseFloat(valorDigitado);


        if(editandoIndex !== null){

            document.querySelector(".formulario").classList.remove("editando");
            document.querySelector(".adicionar").classList.remove("atualizando");

            assinaturas[editandoIndex] = {
            data,
            descricao,
            cartao,
            valor
            };

            editandoIndex = null;
            document.querySelector(".adicionar").textContent = "Adicionar";

        } else {
            assinaturas.push({
            data,
            descricao,
            cartao,
            valor
            });
        }

        salvar();
        renderizar();
        form.reset();
        document.querySelector(".formulario").classList.remove("editando");
        document.querySelector(".adicionar").classList.remove("atualizando");
    });

    /* ======================== */
    renderizar();

});
