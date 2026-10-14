/* CONCURSADO — autenticação Supabase (chave pública apenas) */
const SUPABASE_URL = 'https://uuhugqmakngtlrfuilyk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_R5VfMPZeDtQQiCRAf5OQ4g_1yl6rjRO';
const statusEl = document.getElementById('authStatus');
const form = document.getElementById('authForm');
const google = document.getElementById('authGoogle');
const change = document.getElementById('authSwitch');
const forgot = document.getElementById('authForgot');
let signup = false;
let client;
function status(message) { statusEl.textContent = message || ''; }
function unlock(user) {
  if (!user) return;
  window.CONCURSADO_USER_ID = user.id;
  document.getElementById('authUserEmail').textContent = user.email || 'Minha conta';
  const meta = user.user_metadata || {};
  document.getElementById('authUserName').textContent = meta.full_name || meta.name || user.email?.split('@')[0] || 'Minha conta';
  const photo = meta.avatar_url || meta.picture;
  const avatar = document.getElementById('authAvatar');
  const fallback = document.getElementById('authAvatarFallback');
  avatar.hidden = true; fallback.hidden = false;
  if (photo && /^https:\/\//i.test(photo)) {
    avatar.onload = () => { avatar.hidden = false; fallback.hidden = true; };
    avatar.onerror = () => { avatar.hidden = true; fallback.hidden = false; };
    avatar.src = photo;
  }
  document.getElementById('authAccount').hidden = false;
  document.getElementById('authScreen').hidden = true;
  document.body.classList.remove('auth-locked');
  if (!document.querySelector('script[data-concursado-app]')) {
    const script = document.createElement('script');
    script.src = 'script.js';
    script.dataset.concursadoApp = 'true';
    document.body.appendChild(script);
  }
}
function lock() {
  document.getElementById('authAccount').hidden = true;
  document.getElementById('authScreen').hidden = false;
  document.body.classList.add('auth-locked');
}
async function start() {
  if (!SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY === 'COLE_AQUI_SUA_PUBLISHABLE_KEY') {
    status('Falta configurar a Publishable key no arquivo auth.js.');
    return;
  }
  if (!window.supabase?.createClient) { status('Não foi possível carregar a biblioteca Supabase.'); return; }
  client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const { data, error } = await client.auth.getUser();
  if (data?.user && !error) { unlock(data.user); return; }
  status(''); form.hidden = false; google.hidden = false; change.hidden = false; forgot.hidden = false;
  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      const newPassword = window.prompt("Digite uma nova senha (mínimo de 8 caracteres):");
      if (newPassword && newPassword.length >= 8) client.auth.updateUser({password:newPassword}).then(({error}) => alert(error ? error.message : "Senha atualizada!"));
      else if (newPassword) alert("A senha deve ter pelo menos 8 caracteres.");
    }
    if (session?.user && !window.CONCURSADO_USER_ID) unlock(session.user);
    if (!session && window.CONCURSADO_USER_ID) window.location.reload();
  });
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!client) return;
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  status('Aguarde...');
  const result = signup ? await client.auth.signUp({email,password}) : await client.auth.signInWithPassword({email,password});
  if (result.error) { status(result.error.message); return; }
  if (result.data.session?.user) unlock(result.data.session.user);
  else status('Confira seu e-mail para confirmar o cadastro.');
});
change.addEventListener('click', () => {
  signup = !signup;
  document.getElementById('authHeading').textContent = signup ? 'Crie sua conta' : 'Entre para continuar';
  document.getElementById('authSubmit').textContent = signup ? 'Cadastrar' : 'Entrar';
  change.textContent = signup ? 'Já tenho uma conta' : 'Criar uma conta';
  status('');
});
google.addEventListener('click', async () => {
  if (!client) return;
  status('Redirecionando para o Google...');
  const {error} = await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin + '/'}});
  if (error) status(error.message);
});
forgot.addEventListener('click', async () => {
  if (!client) return;
  const email = document.getElementById('authEmail').value.trim();
  if (!email) { status('Digite seu e-mail primeiro.'); return; }
  const {error} = await client.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin + '/'});
  status(error ? error.message : 'Confira seu e-mail para redefinir a senha.');
});
document.getElementById('authLogout').addEventListener('click', async () => {
  if (!client) return;
  await client.auth.signOut();
  window.location.reload();
});
start().catch(error => status('Erro de conexão: ' + error.message));
