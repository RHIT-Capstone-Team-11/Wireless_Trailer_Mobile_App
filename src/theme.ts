export const colors = {
  background: '#F6F4EF',
  surface: '#FFFFFF',
  ink: '#111C24',
  inkSoft: '#1E2A33',
  text: '#14181C',
  textMuted: '#6B7280',
  textOnInk: '#FFFFFF',
  textOnInkMuted: '#B6BFC7',
  border: '#E7E3DA',
  amber: '#E8A230',
  amberSoft: '#FDEFC8',
  amberText: '#8A5A00',
  success: '#3BB273',
  danger: '#A33A2E',
  dangerSoft: '#FBEFEC',
  dangerBorder: '#F2D3CD',
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const type = {
  eyebrow: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
  },
  title: { fontSize: 30, fontWeight: '800' as const, color: colors.text },
  heading: { fontSize: 20, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
};
