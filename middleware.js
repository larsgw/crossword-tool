export const config = {
  matcher: '/proxy'
}

function isUrlAllowed (url) {
  if (!process.env.ALLOWED_URLS) {
    return false
  }

  const urls = process.env.ALLOWED_URLS.split(';')

  return urls.some(prefix => url.startsWith(prefix))
}

export default function middleware (request) {
  const params = new URL(request.url).searchParams
  const url = params.get('url')

  if (!isUrlAllowed(url)) {
    return new Response('Forbidden', { status: 400 })
  }

  return fetch(url)
}
