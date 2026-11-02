/**
 * A route as a URL segment, and back.
 *
 * The home page is `/`, which cannot be a path segment, so it travels as
 * `home`; `/404` travels as `404`. Everything else is the route without its
 * leading slash.
 */
export function paramForRoute(route: string): string {
  if (route === '/') return 'home';
  return route.replace(/^\//, '');
}

export function routeForParam(param: string): string {
  if (param === 'home') return '/';
  return `/${param}`;
}

export function pageLabel(param: string): string {
  return routeForParam(param);
}
