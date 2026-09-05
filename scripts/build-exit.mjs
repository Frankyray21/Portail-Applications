// Le CLI appelle process.exit immédiatement après son prérendu HTTP.
// Windows/Node 24 peut alors interrompre la fermeture d'un handle Undici :
// https://github.com/nodejs/node/issues/56645
// Laisser finir cette fermeture ne change aucun code de retour et ne masque
// aucune erreur. Linux (GitHub Actions) utilise la sortie native sans détour.
if (process.platform === 'win32') {
  const quitter = process.exit.bind(process);
  let temporisateur;
  process.exit = (code = process.exitCode ?? 0) => {
    if (code !== 0 || process.exitCode === undefined) process.exitCode = code;
    if (!temporisateur)
      temporisateur = setTimeout(() => quitter(process.exitCode), 150);
  };
}
