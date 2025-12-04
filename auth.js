// auth.js
async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Sign up successful! Please login.');
}

async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
        document.getElementById('auth-section').querySelectorAll('form').forEach(form => form.classList.add('hidden'));
        document.getElementById('logout-btn').classList.remove('hidden');
        document.getElementById('marker-form').classList.remove('hidden');
        loadMarkers();
    }
}

async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    else {
        document.getElementById('auth-section').querySelectorAll('form').forEach(form => form.classList.remove('hidden'));
        document.getElementById('logout-btn').classList.add('hidden');
        document.getElementById('marker-form').classList.add('hidden');
        markersLayer.clearLayers();
        document.getElementById('marker-table-body').innerHTML = '';
    }
}

document.getElementById('signup-form').addEventListener('submit', e => {
    e.preventDefault();
    signUp(document.getElementById('signup-email').value, document.getElementById('signup-password').value);
});

document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    login(document.getElementById('login-email').value, document.getElementById('login-password').value);
});

document.getElementById('logout-btn').addEventListener('click', logout);

// Check session on load
supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
        document.getElementById('auth-section').querySelectorAll('form').forEach(form => form.classList.add('hidden'));
        document.getElementById('logout-btn').classList.remove('hidden');
        document.getElementById('marker-form').classList.remove('hidden');
        loadMarkers();
    }
});