// Seleção de elementos
const todoForm = document.querySelector("#todo-form"); // Seleciona o formulário de adição de tarefas
const todoInput = document.querySelector("#todo-input"); // Seleciona o campo de entrada de texto
const todoList = document.querySelector("#todo-list"); // Seleciona a lista de tarefas
const editForm = document.querySelector("#edit-form"); // Seleciona o formulário de edição de tarefas
const editInput = document.querySelector("#edit-input"); // Seleciona o campo de edição de texto
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); // Seleciona o botão de cancelar edição
const searchInput = document.querySelector("#search-input"); // Seleciona o campo de busca
const eraseBtn = document.querySelector("#erase-button"); // Seleciona o botão de apagar busca
const filterBtn = document.querySelector("#filter-select"); // Seleciona o seletor de filtro
const filterToolbar = document.querySelector("#toolbar"); // Seleciona a barra de ferramentas de filtro

let oldInputValue; // Variável para armazenar o valor anterior do campo de edição

// Funções

// Função para salvar uma nova tarefa na lista
const saveTodo = (text, done = 0, save = 1) => {
    // Cria uma div com classes para os botões das tarefas
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.classList.add("icon-container");

    // Cria um elemento de título para a tarefa
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    // Cria um botão para marcar a tarefa como concluída
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    const doneTooltip = document.createElement("div");
    doneTooltip.classList.add("tooltip");
    doneTooltip.innerText = "Marcar tarefa como concluída";
    doneBtn.appendChild(doneTooltip);
    todo.appendChild(doneBtn);

    // Cria um botão para editar a tarefa
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    const editTooltip = document.createElement("div");
    editTooltip.classList.add("tooltip");
    editTooltip.innerText = "Editar tarefa";
    editBtn.appendChild(editTooltip);
    todo.appendChild(editBtn);

    // Cria um botão para excluir a tarefa
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    const deleteTooltip = document.createElement("div");
    deleteTooltip.classList.add("tooltip");
    deleteTooltip.innerText = "Excluir tarefa";
    deleteBtn.appendChild(deleteTooltip);
    todo.appendChild(deleteBtn);

    // Se a tarefa estiver concluída, adiciona a classe "done"
    if (done) {
        todo.classList.add("done");
    }

    // Salva a tarefa na localStorage
    if (save) {
        saveTodoLocalStorage({ text, done });
    }

    // Adiciona a tarefa à lista
    todoList.appendChild(todo);

    // Limpa o campo de entrada e foca nele
    todoInput.value = "";
    todoInput.focus();
}

// Função para alternar entre o formulário de edição e o de adição de tarefas
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
    filterToolbar.classList.toggle("hide");
};

// Função para atualizar o título de uma tarefa
const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        // Se o título da tarefa for igual ao valor antigo, atualiza o título
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;

            // Atualiza a tarefa na localStorage
            updateTodoLocalStorage(oldInputValue, text);
        }
    });
};

// Função para filtrar tarefas com base na pesquisa
const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        // Define o estilo de exibição da tarefa com base na pesquisa
        todo.style.display = "flex";

        if (!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }
    });
};

// Função para filtrar tarefas com base no filtro selecionado
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
            break;

        case "done":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        case "todo":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        default:
            break;
    }
};

// Eventos

// Evento de envio do formulário de adição de tarefas
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
});

// Evento de clique em elementos da lista de tarefas
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText || "";
    }

    // Evento de marcação de tarefa como concluída
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        // Atualiza o status da tarefa na localStorage
        updateTodoStatusLocalStorage(todoTitle);
    }

    // Evento de edição de tarefa
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }

    // Evento de exclusão de tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        removeTodoLocalStorage(todoTitle);
    }
});

// Evento de clique no botão de cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});

// Evento de envio do formulário de edição de tarefas
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

// Evento de digitação no campo de busca
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchTodos(search);
});

// Evento de clique no botão de apagar busca
eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    // Dispara o evento keyup para reexibir todas as tarefas
    searchInput.dispatchEvent(new Event("keyup"));
});

// Evento de mudança no seletor de filtro
filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
});

// Local Storage

// Função para obter as tarefas da localStorage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

// Função para carregar as tarefas da localStorage e exibi-las na página
const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
};

// Função para salvar uma tarefa na localStorage
const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));
};

// Função para remover uma tarefa da localStorage
const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

// Função para atualizar o status de uma tarefa na localStorage
const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) =>
        todo.text === todoText ? (todo.done = !todo.done) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos));
};

// Função para atualizar o texto de uma tarefa na localStorage
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos));
};

// Carrega as tarefas da localStorage ao carregar a página
loadTodos();
