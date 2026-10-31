/* CALIBRE — autenticação Supabase (chave pública apenas) */
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
// Reconsulta o plano sem exigir logout ou recarregar a página.
let calibrePlanRefreshInProgress = false;
async function refreshCalibrePlan() {
  const userId = window.CALIBRE_USER_ID;
  if (!client || !userId || calibrePlanRefreshInProgress) return;
  calibrePlanRefreshInProgress = true;
  try {
    const { data, error } = await client
      .from("user_plans")
      .select("plan, premium_until, trial_until")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao consultar plano:", error.message);
      return;
    }
    // Ignora resposta de uma sessão que já foi substituída.
    if (window.CALIBRE_USER_ID !== userId) return;

    const plan = data?.plan || "free";
    const now = Date.now();
    const premiumUntil = data?.premium_until || null;
    const trialUntil = data?.trial_until || null;
    const premiumPagoAtivo = plan === "premium" &&
      premiumUntil && Date.parse(premiumUntil) > now;
    const trialAtivo = plan === "free" &&
      trialUntil && Date.parse(trialUntil) > now;

    window.CALIBRE_PLAN = plan;
    window.CALIBRE_PREMIUM_UNTIL = premiumUntil;
    window.CALIBRE_TRIAL_UNTIL = trialUntil;
    window.CALIBRE_TRIAL = Boolean(trialAtivo);
    window.CALIBRE_PREMIUM = Boolean(
      plan === "admin" || premiumPagoAtivo || trialAtivo
    );
    window.dispatchEvent(new Event("calibre:plan-updated"));
  } catch (error) {
    console.error("Erro ao atualizar plano CALIBRE:", error);
  } finally {
    calibrePlanRefreshInProgress = false;
  }
}

// Verifica alterações de assinatura enquanto a conta estiver aberta.
setInterval(() => {
  if (!document.hidden) void refreshCalibrePlan();
}, 60000);
window.addEventListener("focus", () => { void refreshCalibrePlan(); });
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) void refreshCalibrePlan();
});

function unlock(user) {
  if (!user) return;
  window.CALIBRE_USER_ID = user.id;
  window.CALIBRE_PLAN = "free";
  window.CALIBRE_PREMIUM = false;
  window.CALIBRE_TRIAL = false;
  window.CALIBRE_TRIAL_UNTIL = null;
  window.CALIBRE_PREMIUM_UNTIL = null;

  void refreshCalibrePlan();

  document.getElementById('authUserEmail').textContent = user.email || 'Minha conta';
  const meta = user.user_metadata || {};
  document.getElementById('authUserName').textContent = meta.full_name || meta.name || user.email?.split('@')[0] || 'Minha conta';
  const photo = meta.avatar_url || meta.picture;
  window.CALIBRE_GOOGLE_PHOTO = photo || '';
  window.CALIBRE_PROFILE_PHOTO = photo || '';
  window.CALIBRE_CURRENT_USER = user;
  const avatar = document.getElementById('authAvatar');
  const fallback = document.getElementById('authAvatarFallback');
  avatar.hidden = true; fallback.hidden = false;
  if (photo && /^https:\/\//i.test(photo)) {
    avatar.onload = () => { avatar.hidden = false; fallback.hidden = true; };
    avatar.onerror = () => { avatar.hidden = true; fallback.hidden = false; };
    avatar.src = photo;
  }
  void loadCalibreProfilePhoto(user);
  document.getElementById('authAccount').hidden = false;
  document.getElementById('authScreen').hidden = true;
  document.body.classList.remove('auth-locked');
  if (!document.querySelector('script[data-calibre-app]')) {
    const script = document.createElement('script');
    script.src = 'script.js';
    script.dataset.calibreApp = 'true';
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
  window.CALIBRE_SUPABASE = client;
  const { data, error } = await client.auth.getUser();
  if (data?.user && !error) { unlock(data.user); return; }
  status(''); form.hidden = false; google.hidden = false; change.hidden = false; forgot.hidden = false;
  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      const newPassword = window.prompt("Digite uma nova senha (mínimo de 8 caracteres):");
      if (newPassword && newPassword.length >= 8) client.auth.updateUser({password:newPassword}).then(({error}) => alert(error ? error.message : "Senha atualizada!"));
      else if (newPassword) alert("A senha deve ter pelo menos 8 caracteres.");
    }
    if (session?.user && !window.CALIBRE_USER_ID) unlock(session.user);
    if (!session && window.CALIBRE_USER_ID) window.location.reload();
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

/* Foto personalizada: Storage privado, URL assinada por sessão. */
async function loadCalibreProfilePhoto(user) {
  const path = user?.user_metadata?.calibre_avatar_path;
  if (!path || path !== `${user.id}/avatar.jpg` || !client) return;
  const { data, error } = await client.storage.from('profile-avatars').createSignedUrl(path, 3600);
  if (error || !data?.signedUrl || window.CALIBRE_USER_ID !== user.id) {
    if (error) console.warn('CALIBRE: não foi possível carregar foto personalizada:', error.message);
    return;
  }
  window.CALIBRE_PROFILE_PHOTO = data.signedUrl;
  const avatar = document.getElementById('authAvatar');
  const fallback = document.getElementById('authAvatarFallback');
  avatar.onload = () => { avatar.hidden = false; fallback.hidden = true; };
  avatar.onerror = () => { avatar.hidden = true; fallback.hidden = false; };
  avatar.src = data.signedUrl;
}

/* Perfil: altera apenas metadados de exibição e foto, sem mudar o e-mail. */
(function setupCalibreProfileEditor() {
  const openButton = document.getElementById('authEditProfile');
  const overlay = document.getElementById('calibreProfileOverlay');
  const form = document.getElementById('calibreProfileForm');
  const nameInput = document.getElementById('calibreProfileName');
  const photoInput = document.getElementById('calibreProfilePhoto');
  const preview = document.getElementById('calibreProfilePreview');
  const previewFallback = document.getElementById('calibreProfilePreviewFallback');
  const message = document.getElementById('calibreProfileStatus');
  const saveButton = document.getElementById('calibreProfileSave');
  if (!openButton || !overlay || !form || !nameInput || !photoInput || !preview) return;
  let previewUrl = null;
  let busy = false;
  let priorFocus = null;
  function setPreview(url) {
    if (url) { preview.src = url; preview.hidden = false; previewFallback.hidden = true; }
    else { preview.removeAttribute('src'); preview.hidden = true; previewFallback.hidden = false; }
  }
  function cleanup() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    photoInput.value = '';
  }
  function close() {
    if (busy) return;
    overlay.hidden = true;
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    cleanup();
    priorFocus?.focus();
  }
  openButton.addEventListener('click', () => {
    priorFocus = document.activeElement;
    document.querySelector('#authAccount .auth-account-details').open = false;
    nameInput.value = document.getElementById('authUserName').textContent.trim();
    cleanup();
    setPreview(window.CALIBRE_PROFILE_PHOTO);
    message.textContent = '';
    overlay.hidden = false;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    nameInput.focus();
  });
  document.getElementById('calibreProfileClose').addEventListener('click', close);
  document.getElementById('calibreProfileCancel').addEventListener('click', close);
  overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const focusable = [...overlay.querySelectorAll('button:not(:disabled),input:not([type="hidden"]):not(:disabled),label.calibre-profile-upload')].filter(el => el.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  photoInput.addEventListener('change', () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    const file = photoInput.files?.[0];
    if (!file) { setPreview(window.CALIBRE_PROFILE_PHOTO); return; }
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      message.textContent = 'Escolha uma imagem JPG, PNG ou WebP de até 5 MB.';
      photoInput.value = '';
      setPreview(window.CALIBRE_PROFILE_PHOTO);
      return;
    }
    previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    message.textContent = '';
  });
  async function compressPhoto(file) {
    const bitmap = await createImageBitmap(file);
    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#12241b'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      return await new Promise((resolve,reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Falha ao preparar a foto.')), 'image/jpeg', .85));
    } finally { bitmap.close(); }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !client) return;
    const name = nameInput.value.trim().replace(/\s+/g,' ');
    if (name.length < 2 || name.length > 60) { message.textContent = 'Digite um nome entre 2 e 60 caracteres.'; return; }
    const file = photoInput.files?.[0];
    if (file && (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      message.textContent = 'Foto inválida. Escolha JPG, PNG ou WebP de até 5 MB.'; return;
    }
    busy = true; saveButton.disabled = true; message.textContent = 'Salvando perfil...';
    try {
      const { data: current, error: sessionError } = await client.auth.getUser();
      if (sessionError || !current?.user || current.user.id !== window.CALIBRE_USER_ID) throw new Error('Sessão expirada. Entre novamente.');
      const user = current.user;
      const metadata = { full_name: name };
      let uploaded = false;
      if (file) {
        const blob = await compressPhoto(file);
        const path = `${user.id}/avatar.jpg`;
        const { error: uploadError } = await client.storage.from('profile-avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '60' });
        if (uploadError) throw new Error('Não foi possível salvar a foto. Confira se o bucket privado profile-avatars e as políticas foram configurados. ' + uploadError.message);
        metadata.calibre_avatar_path = path;
        uploaded = true;
      }
      const { data, error } = await client.auth.updateUser({ data: metadata });
      if (error) throw error;
      window.CALIBRE_CURRENT_USER = data.user;
      document.getElementById('authUserName').textContent = name;
      if (typeof updateGreeting === 'function') updateGreeting();
      if (uploaded) await loadCalibreProfilePhoto(data.user);
      message.textContent = 'Perfil atualizado com sucesso!';
      busy = false; saveButton.disabled = false;
      close();
    } catch (error) {
      console.error('CALIBRE: erro ao salvar perfil:', error);
      message.textContent = error.message || 'Erro ao salvar perfil.';
      busy = false; saveButton.disabled = false;
    }
  });
})();

/* CALIBRE — ações e informações do menu de conta. */
(function setupCalibreAccountMenu() {
  const menuPhoto = document.getElementById('authMenuAvatar');
  const menuFallback = document.getElementById('authMenuAvatarFallback');
  const headerPhoto = document.getElementById('authAvatar');
  function syncMenuPhoto() {
    if (!menuPhoto || !headerPhoto) return;
    const visible = !headerPhoto.hidden && headerPhoto.complete && headerPhoto.naturalWidth > 0;
    menuPhoto.hidden = !visible;
    menuFallback.hidden = visible;
    if (visible && menuPhoto.src !== headerPhoto.src) menuPhoto.src = headerPhoto.src;
  }
  headerPhoto?.addEventListener('load', syncMenuPhoto);
  headerPhoto?.addEventListener('error', syncMenuPhoto);
  document.querySelector('#authAccount .auth-account-details')?.addEventListener('toggle', syncMenuPhoto);
  function updatePlanLabel() {
    const label = document.getElementById('authMenuPlan');
    if (!label) return;
    const plan = window.CALIBRE_PLAN;
    label.textContent = plan === 'admin' ? 'Plano ADMIN' : window.CALIBRE_TRIAL ? 'Teste PREMIUM' : window.CALIBRE_PREMIUM ? 'Plano PREMIUM' : 'Plano FREE';
  }
  window.addEventListener('calibre:plan-updated', updatePlanLabel);
  updatePlanLabel();
  document.getElementById('authChangePhoto')?.addEventListener('click', () => {
    document.getElementById('authEditProfile')?.click();
    document.getElementById('calibreProfilePhoto')?.click();
  });
  /* Consulta as datas já lidas de user_plans; não modifica assinaturas. */
  const subscriptionOverlay = document.getElementById('calibreSubscriptionOverlay');
  const subscriptionDialog = subscriptionOverlay?.querySelector('.calibre-subscription-dialog');
  let subscriptionPreviousFocus = null;
  let subscriptionPreviousOverflow = '';
  function closeSubscription() {
    if (!subscriptionOverlay || subscriptionOverlay.hidden) return;
    subscriptionOverlay.hidden = true;
    document.body.style.overflow = subscriptionPreviousOverflow;
    subscriptionPreviousFocus?.focus();
  }
  function renderSubscription() {
    const plan = document.getElementById('calibreSubscriptionPlan');
    const remaining = document.getElementById('calibreSubscriptionRemaining');
    const price = document.getElementById('calibreSubscriptionPrice');
    const end = document.getElementById('calibreSubscriptionEnd');
    const note = document.getElementById('calibreSubscriptionNote');
    if (!plan || !remaining || !price || !end || !note) return;
    const rawPlan = window.CALIBRE_PLAN || 'free';
    const trial = Boolean(window.CALIBRE_TRIAL);
    const paid = rawPlan === 'premium' && Boolean(window.CALIBRE_PREMIUM);
    const admin = rawPlan === 'admin';
    plan.textContent = admin ? 'ADMIN' : trial ? 'TESTE PREMIUM' : paid ? 'PREMIUM' : 'FREE';
    price.textContent = paid ? 'R$ 12,49' : trial ? 'Gratuito' : '—';
    remaining.textContent = '—';
    end.textContent = '';
    note.textContent = admin ? 'Conta de administrador: sem prazo de assinatura.' :
      trial ? 'Período de teste gratuito de 7 dias.' :
      paid ? 'A data exibida não confirma renovação ou cancelamento na Hotmart.' :
      'Você está no plano gratuito. Para assinar, use o botão Assinar Premium no menu da conta.';
    const expiration = trial ? window.CALIBRE_TRIAL_UNTIL : paid ? window.CALIBRE_PREMIUM_UNTIL : null;
    const timestamp = expiration ? Date.parse(expiration) : NaN;
    if (Number.isFinite(timestamp) && timestamp > Date.now()) {
      const days = Math.ceil((timestamp - Date.now()) / 86400000);
      remaining.textContent = `${days} ${days === 1 ? 'dia' : 'dias'}`;
      end.textContent = `Acesso válido até: ${new Intl.DateTimeFormat('pt-BR', {dateStyle:'long', timeStyle:'short'}).format(new Date(timestamp))}`;
    } else if (trial || paid) {
      note.textContent = 'Não foi possível confirmar a data de término do acesso. Consulte novamente mais tarde.';
    }
  }
  document.getElementById('authSubscription')?.addEventListener('click', async () => {
    if (!subscriptionOverlay) return;
    subscriptionPreviousFocus = document.activeElement;
    document.querySelector('#authAccount .auth-account-details').open = false;
    subscriptionPreviousOverflow = document.body.style.overflow;
    subscriptionOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    renderSubscription();
    subscriptionDialog?.focus();
    // Atualiza o plano antes de apresentar o prazo mais recente, quando possível.
    await refreshCalibrePlan();
    if (!subscriptionOverlay.hidden) renderSubscription();
  });
  document.getElementById('calibreSubscriptionClose')?.addEventListener('click', closeSubscription);
  document.getElementById('calibreSubscriptionDone')?.addEventListener('click', closeSubscription);
  subscriptionOverlay?.addEventListener('click', event => { if (event.target === subscriptionOverlay) closeSubscription(); });
  subscriptionOverlay?.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeSubscription(); }
    if (event.key !== 'Tab') return;
    const focusable = [...subscriptionOverlay.querySelectorAll('button:not(:disabled)')];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener('calibre:plan-updated', () => { if (subscriptionOverlay && !subscriptionOverlay.hidden) renderSubscription(); });
})();
