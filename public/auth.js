import { supabase } from './supabaseClient.js';

const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const forgotPasswordForm = document.getElementById('forgotPasswordFormElement');
const authMessage = document.getElementById('authMessage');

function showMessage(message, type) {
  authMessage.textContent = message;
  authMessage.className = `auth-message show ${type}`;
  setTimeout(() => {
    authMessage.classList.remove('show');
  }, 5000);
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.getElementById(`${targetTab}Form`).classList.add('active');
  });
});

document.getElementById('showForgotPassword').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  document.getElementById('forgotPasswordForm').classList.add('active');
});

document.getElementById('backToLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  document.getElementById('loginForm').classList.add('active');
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showMessage(error.message, 'error');
  } else {
    showMessage('Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('registerFullName').value;
  const email = document.getElementById('registerEmail').value;
  const studentId = document.getElementById('registerStudentId').value;
  const school = document.getElementById('registerSchool').value;
  const major = document.getElementById('registerMajor').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters', 'error');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    showMessage(error.message, 'error');
  } else {
    const { error: profileError } = await supabase
      .from('student_profiles')
      .insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        student_id: studentId || null,
        school: school || null,
        major: major || null
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    showMessage('Registration successful! Redirecting to login...', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }
});

forgotPasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('forgotEmail').value;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/index.html'
  });

  if (error) {
    showMessage(error.message, 'error');
  } else {
    showMessage('Password reset link sent to your email!', 'success');
    setTimeout(() => {
      document.getElementById('backToLogin').click();
    }, 3000);
  }
});

(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = 'index.html';
  }
})();
