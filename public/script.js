import { supabase } from './supabaseClient.js';

const form = document.getElementById('transactionForm');
const transactionsDiv = document.getElementById('transactions');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const balanceEl = document.getElementById('balance');
const searchInput = document.getElementById('search');
const filterType = document.getElementById('filterType');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const userGreeting = document.getElementById('userGreeting');
const profileModal = document.getElementById('profileModal');
const profileForm = document.getElementById('profileForm');
const closeModal = document.querySelector('.close-modal');

let chart;
let currentUser = null;

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'auth.html';
    return;
  }

  currentUser = session.user;
  await loadUserProfile();
  await loadTransactions();
}

async function loadUserProfile() {
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', currentUser.id)
    .maybeSingle();

  if (data) {
    userGreeting.textContent = `Welcome, ${data.full_name || 'Student'}`;
  } else {
    userGreeting.textContent = `Welcome, ${currentUser.email}`;
  }
}

async function loadTransactions() {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('date', { ascending: false });

  if (filterType.value) {
    query = query.eq('type', filterType.value);
  }

  if (searchInput.value) {
    const searchTerm = searchInput.value.toLowerCase();
    query = query.or(`category.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error loading transactions:', error);
    return;
  }

  renderTransactions(data || []);
  updateDashboard(data || []);
  updateChart(data || []);
}

function renderTransactions(data) {
  if (data.length === 0) {
    transactionsDiv.innerHTML = '<p class="no-data">No transactions yet. Add your first transaction above.</p>';
    return;
  }

  transactionsDiv.innerHTML = data.map(t => `
    <div class="card ${t.type}">
      <p><b>${t.type.toUpperCase()}</b> - ₱${parseFloat(t.amount).toFixed(2)}</p>
      <p>${t.category || 'No category'} | ${t.description || 'No description'}</p>
      <small>${new Date(t.date).toLocaleDateString()}</small>
      <div class="card-actions">
        <button onclick="window.editTransaction('${t.id}')">Edit</button>
        <button onclick="window.deleteTransaction('${t.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const transaction = {
    user_id: currentUser.id,
    type: form.type.value,
    amount: parseFloat(form.amount.value),
    category: form.category.value || '',
    description: form.description.value || '',
    date: form.date.value ? new Date(form.date.value).toISOString() : new Date().toISOString()
  };

  const { error } = await supabase
    .from('transactions')
    .insert([transaction]);

  if (error) {
    console.error('Error adding transaction:', error);
    alert('Failed to add transaction');
    return;
  }

  form.reset();
  await loadTransactions();
});

window.deleteTransaction = async (id) => {
  if (!confirm('Are you sure you want to delete this transaction?')) return;

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    alert('Failed to delete transaction');
    return;
  }

  await loadTransactions();
};

window.editTransaction = async (id) => {
  const newAmount = prompt("Enter new amount:");
  if (!newAmount || isNaN(newAmount)) return;

  const newDesc = prompt("Enter new description:");

  const updates = {
    amount: parseFloat(newAmount),
    description: newDesc || ''
  };

  const { error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating transaction:', error);
    alert('Failed to update transaction');
    return;
  }

  await loadTransactions();
};

function updateDashboard(data) {
  const income = data.filter(t => t.type === 'income').reduce((a, b) => a + parseFloat(b.amount), 0);
  const expense = data.filter(t => t.type === 'expense').reduce((a, b) => a + parseFloat(b.amount), 0);
  const balance = income - expense;

  totalIncomeEl.textContent = `₱${income.toFixed(2)}`;
  totalExpenseEl.textContent = `₱${expense.toFixed(2)}`;
  balanceEl.textContent = `₱${balance.toFixed(2)}`;
}

function updateChart(data) {
  const income = data.filter(t => t.type === 'income').reduce((a, b) => a + parseFloat(b.amount), 0);
  const expense = data.filter(t => t.type === 'expense').reduce((a, b) => a + parseFloat(b.amount), 0);
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
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ₱' + context.parsed.toFixed(2);
            }
          }
        }
      }
    }
  });
}

logoutBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = 'auth.html';
  }
});

profileBtn.addEventListener('click', async () => {
  const { data } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', currentUser.id)
    .maybeSingle();

  if (data) {
    document.getElementById('profileFullName').value = data.full_name || '';
    document.getElementById('profileEmail').value = data.email || '';
    document.getElementById('profileStudentId').value = data.student_id || '';
    document.getElementById('profileSchool').value = data.school || '';
    document.getElementById('profileMajor').value = data.major || '';
  }

  profileModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  profileModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === profileModal) {
    profileModal.style.display = 'none';
  }
});

profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const updates = {
    full_name: document.getElementById('profileFullName').value,
    student_id: document.getElementById('profileStudentId').value || null,
    school: document.getElementById('profileSchool').value || null,
    major: document.getElementById('profileMajor').value || null
  };

  const { error } = await supabase
    .from('student_profiles')
    .update(updates)
    .eq('id', currentUser.id);

  if (error) {
    console.error('Error updating profile:', error);
    alert('Failed to update profile');
    return;
  }

  alert('Profile updated successfully!');
  profileModal.style.display = 'none';
  await loadUserProfile();
});

searchInput.addEventListener('input', loadTransactions);
filterType.addEventListener('change', loadTransactions);

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = 'auth.html';
  }
});

checkAuth();
