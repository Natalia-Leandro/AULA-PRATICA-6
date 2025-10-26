const API = 'https://proweb.leoproti.com.br/alunos';
const $ = s => document.querySelector(s);
const form = $('#aluno-form');
const idInput = $('#aluno-id');
const nomeInput = $('#nome');
const turmaInput = $('#turma');
const cursoInput = $('#curso');
const matriculaInput = $('#matricula');
const title = $('#form-title');
const message = $('#message');

function showMessage(text, type = 'success') {
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

async function carregarAluno(id) {
  const r = await callApi('/' + id);
  if (r.ok && r.data) {
    nomeInput.value = r.data.nome;
    turmaInput.value = r.data.turma;
    cursoInput.value = r.data.curso;
    matriculaInput.value = r.data.matricula;
    title.textContent = 'Editar Aluno';
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const aluno = {
    nome: nomeInput.value,
    turma: turmaInput.value,
    curso: cursoInput.value,
    matricula: matriculaInput.value
  };

  const id = idInput.value;
  const method = id ? 'PUT' : 'POST';
  const path = id ? '/' + id : '';

  const r = await callApi(path, { method, body: JSON.stringify(aluno) });

  if (r.ok) {
    showMessage('Aluno salvo com sucesso!');
    setTimeout(() => location.href = 'index.html', 1000);
  } else {
    showMessage('Erro ao salvar aluno', 'error');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (id) {
    idInput.value = id;
    carregarAluno(id);
  }
});
