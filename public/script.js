const form = document.getElementById('transactionForm');
const transactionsDiv = document.getElementById('transactions');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const searchInput = document.getElementById('search');
const filterType = document.getElementById('filterType');
const API_URL = 'http://localhost:5000/api/transactions';
let chart;

// Load and render
async function loadTransactions() {
  const params = new URLSearchParams();
  if (filterType.value) params.append('type', filterType.value);
  if (searchInput.value) params.append('search', searchInput.value);

  const res = await fetch(`${API_URL}?${params.toString()}`);
  const data = await res.json();
  renderTransactions(data);
  updateDashboard(data);
  updateChart(data);
}

function renderTransactions(data) {
  transactionsDiv.innerHTML = data.map(t => `
    <div class="card ${t.type}">
      <p><b>${t.type.toUpperCase()}</b> - ₱${t.amount}</p>
      <p>${t.category || ''} | ${t.description || ''}</p>
      <small>${new Date(t.date).toLocaleDateString()}</small>
      <div class="card-actions">
        <button onclick="editTransaction('${t._id}')">Edit</button>
        <button onclick="deleteTransaction('${t._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const transaction = {
    type: form.type.value,
    amount: form.amount.value,
    category: form.category.value,
    description: form.description.value,
    date: form.date.value || new Date()
  };
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });
  form.reset();
  loadTransactions();
});

async function deleteTransaction(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTransactions();
}

async function editTransaction(id) {
  const newAmount = prompt("Enter new amount:");
  const newDesc = prompt("Enter new description:");
  if (!newAmount) return;
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: newAmount, description: newDesc })
  });
  loadTransactions();
}

// Dashboard calculations
function updateDashboard(data) {
  const income = data.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = data.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;
  totalIncomeEl.textContent = `₱${income}`;
  totalExpenseEl.textContent = `₱${expense}`;
  balanceEl.textContent = `₱${balance}`;
}

// Chart
function updateChart(data) {
  const income = data.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = data.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const ctx = document.getElementById('summaryChart');

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#16a34a', '#dc2626']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

// Filters
searchInput.addEventListener('input', loadTransactions);
filterType.addEventListener('change', loadTransactions);

loadTransactions();
