// type SignInPayload = { email: string; password: string }
// type SignUpPayload = { name: string; email: string; password: string }

// const API_BASE = import.meta.env.VITE_API_URL || ''

// async function request(path: string, options: any = {}) {
//   const res = await fetch(`${API_BASE}${path}`, {
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     ...options,
//   })

//   if (!res.ok) {
//     const text = await res.text()
//     let msg = text || res.statusText
//     try {
//       const data = JSON.parse(text)
//       // if backend returns an object with message field, prefer it
//       msg = (data && typeof data === 'object' && 'message' in data) ? (data as any).message : JSON.stringify(data)
//     } catch (_) {
//       // ignore parse errors
//     }
//     throw new Error(msg)
//   }

//   return res.json().catch(() => null)
// }

// export default {
//   async signIn(payload: SignInPayload) {
//     return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
//   },
//   async signUp(payload: SignUpPayload) {
//     return request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) })
//   },
// }
