export const getInitials = (
  username: string | undefined
): string | undefined => {
  if (!username) return '?'
  const splitted = username.split(' ')
  if (!splitted) return
  return splitted.length > 1
    ? splitted[0].charAt(0).toUpperCase() +
        splitted.pop()?.charAt(0).toUpperCase()
    : username.charAt(0).toUpperCase()
}
