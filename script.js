document.addEventListener("DOMContentLoaded", () => {
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  let modoEdicao = false;
  let indexEditando = null;

  const modal = document.getElementById("modal");
  const abrirModalBtn = document.getElementById("abrirModal");
  const fecharModalBtn = document.getElementById("fecharModal");
  const confirmarBtn = document.getElementById("confirmarBtn");
  const modalTitulo = document.getElementById("modalTitulo").querySelector("span");

  // Carrega tarefas ao iniciar
  renderizarTarefas();

  abrirModalBtn.addEventListener("click", () => {
    modoEdicao = false;
    indexEditando = null;
    modalTitulo.textContent = "Nova Tarefa";
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("prazo").value = "";
    confirmarBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
    
    // Mostrar modal com animação
    modal.classList.remove("oculto");
    setTimeout(() => {
      modal.classList.add("visible");
    }, 10);
  });

  fecharModalBtn.addEventListener("click", fecharModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  });

  confirmarBtn.addEventListener("click", () => {
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const prazo = document.getElementById("prazo").value;

    if (titulo === "") {
      alert("O título é obrigatório.");
      return;
    }

    if (modoEdicao) {
      tarefas[indexEditando] = { titulo, descricao, prazo };
    } else {
      tarefas.push({ titulo, descricao, prazo });
    }

    salvarTarefas();
    renderizarTarefas();
    fecharModal();
  });

  function fecharModal() {
    modal.classList.remove("visible");
    setTimeout(() => {
      modal.classList.add("oculto");
    }, 300);
  }

  function salvarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }

  function renderizarTarefas() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    if (tarefas.length === 0) {
      lista.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>Nenhuma tarefa encontrada</h3>
          <p>Adicione sua primeira tarefa clicando no botão abaixo</p>
        </div>
      `;
      return;
    }

    tarefas.forEach((tarefa, index) => {
      const div = document.createElement("div");
      div.className = "tarefa";

      const titulo = document.createElement("input");
      titulo.value = tarefa.titulo;
      titulo.disabled = true;

      const descricao = document.createElement("textarea");
      descricao.value = tarefa.descricao;
      descricao.disabled = true;

      const prazo = document.createElement("small");
      const prazoDate = tarefa.prazo ? new Date(tarefa.prazo) : null;
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const prazoFormatado = prazoDate ? prazoDate.toLocaleDateString('pt-BR', options) : 'Sem prazo definido';
      
      prazo.innerHTML = `<i class="far fa-calendar-alt"></i> ${prazoFormatado}`;

      const acoes = document.createElement("div");
      acoes.className = "acoes";

      const editar = document.createElement("button");
      editar.innerHTML = '<i class="far fa-edit"></i> Editar';
      editar.onclick = () => {
        modoEdicao = true;
        indexEditando = index;
        modalTitulo.textContent = "Editar Tarefa";
        document.getElementById("titulo").value = tarefa.titulo;
        document.getElementById("descricao").value = tarefa.descricao;
        document.getElementById("prazo").value = tarefa.prazo || "";
        confirmarBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
        
        modal.classList.remove("oculto");
        setTimeout(() => {
          modal.classList.add("visible");
        }, 10);
      };

      const excluir = document.createElement("button");
      excluir.innerHTML = '<i class="far fa-trash-alt"></i> Excluir';
      excluir.onclick = () => {
        if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
          tarefas.splice(index, 1);
          salvarTarefas();
          renderizarTarefas();
          
          // Efeito de remoção
          div.style.transform = "translateX(-100%)";
          div.style.opacity = "0";
          setTimeout(() => {
            div.remove();
          }, 300);
        }
      };

      acoes.appendChild(editar);
      acoes.appendChild(excluir);

      div.appendChild(titulo);
      div.appendChild(descricao);
      div.appendChild(prazo);
      div.appendChild(acoes);
      lista.appendChild(div);
    });
  }
});