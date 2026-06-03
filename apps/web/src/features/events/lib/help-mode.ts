// Canonical help modes offered by the form (form-two.tsx / edit-modal.tsx).
export const ALLOWED_HELP_MODES = ['Online', 'Személyes', 'Hibrid'] as const;

/** Keeps only supported help modes, falling back to the schema default when none are valid. */
export function sanitizeHelpMode(modes: string[]): string[] {
  const valid = modes.filter((m) => (ALLOWED_HELP_MODES as readonly string[]).includes(m));
  return valid.length > 0 ? valid : ['Személyes'];
}
