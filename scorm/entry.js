import { createSession, bindLifecycle } from './runtime.js';

function boot() {
  const text = document.getElementById('scorm-message');
  const button = document.getElementById('scorm-exit');
  const app = document.getElementById('app');
  const session = createSession(window, status => {
    document.getElementById('scorm-session').dataset.state = status.phase;
    button.disabled = status.phase === 'finished';
    button.textContent = status.phase === 'unavailable' ? 'Verbindung erneut prüfen' : 'Sitzung beenden';
    app.inert = status.phase === 'finished';
    text.textContent = ({
      active: 'Fortschritt wird nur auf diesem Gerät gespeichert.',
      unavailable: 'Keine Verbindung zur Lernplattform. Das Spiel bleibt nutzbar.',
      error: 'Die Lernplattform meldet ein Verbindungsproblem. Das Spiel bleibt nutzbar.',
      finished: status.error ? 'Sitzung beendet. Die Lernplattform hat zuvor einen Speicherfehler gemeldet.' : 'Sitzung beendet. Du kannst den SCORM-Player schließen.'
    })[status.phase] || '';
  });
  button.addEventListener('click', () => {
    if (!session.isActive()) session.initialize();
    else session.finish();
  });
  bindLifecycle(window, session);
  session.initialize();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
