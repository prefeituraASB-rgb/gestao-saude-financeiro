// Carregar itens ao abrir a página
document.addEventListener('DOMContentLoaded', buscarItens);

async function buscarItens() {
    const res = await fetch('/api/itens');
    const itens = await res.json();
    const lista = document.getElementById('listaItens');
    lista.innerHTML = '';
    
    itens.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.nome;
        lista.appendChild(li);
    });
}

async function adicionarItem() {
    const input = document.getElementById('itemNome');
    const nome = input.value.trim();
    if (!nome) return;

    await fetch('/api/itens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
    });

    input.value = '';
    buscarItens();
}
