const API = 'https://proweb.leoproti.com.br/alunos';
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const tbody = $('#alunos-table tbody');
const loading = $('#loading');
const message = $('#message');

function setLoading(on) {
  if (!loading) return;
  loading.style.display = on ? 'block' : 'none';
}

function showMessage(text, type = 'success') {
  if (!message) return;
  message.textContent = text;
  message.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
  message.style.display = 'block';
  setTimeout(() => message.style.display = 'none', 3000);
}

async function callApi(path = '', opts = {}) {
  const res = await fetch(API + path, {
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const txt = await res.text();
  try {
    return { ok: res.ok, data: txt ? JSON.parse(txt) : null };
  } catch {
    return { ok: res.ok, data: txt };
  }
}

async function carregarAlunos() {
  setLoading(true);
  try {
    const r = await callApi('');
    if (r.ok && Array.isArray(r.data)) renderizar(r.data);
    else renderizar([]);
  } catch {
    renderizar([]);
    showMessage('Erro ao carregar alunos', 'error');
  } finally {
    setLoading(false);
  }
}

function renderizar(alunos) {
  tbody.innerHTML = '';
  if (!alunos || alunos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhum aluno cadastrado</td></tr>';
    return;
  }

  alunos.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.id}</td>
      <td>${a.nome}</td>
      <td>${a.turma}</td>
      <td>${a.curso}</td>
      <td>${a.matricula}</td>
      <td class="d-flex justify-content-center gap-2">
        <a href="form.html?id=${a.id}" class="btn btn-sm btn-primary">
          <i class="fas fa-edit"></i> Editar
        </a>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${a.id}" data-nome="${a.nome}">
          <i class="fas fa-trash-alt"></i> Excluir
        </button>
      </td>`;
    tbody.appendChild(tr);
  });

  $$('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const nome = btn.dataset.nome;
      if (confirm(`Excluir aluno "${nome}"?`)) await excluirAluno(id);
    });
  });
}

async function excluirAluno(id) {
  setLoading(true);
  try {
    const r = await callApi('/' + id, { method: 'DELETE' });
    if (r.ok) {
      showMessage('Aluno excluído com sucesso', 'success');
      carregarAlunos();
    } else showMessage('Erro ao excluir aluno', 'error');
  } catch {
    showMessage('Erro de conexão', 'error');
  } finally {
    setLoading(false);
  }
}

window.addEventListener('DOMContentLoaded', carregarAlunos);
