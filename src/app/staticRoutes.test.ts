import { describe, expect, it } from 'vitest';
import { labActivityPaths } from '../progress/labProgress';
import { documentTitle, staticRoutes } from './staticRoutes';

describe('staticRoutes', () => {
  const paths = staticRoutes.map((route) => route.path);

  it('lists each path once', () => {
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('covers every lecture and exercise', () => {
    for (const path of labActivityPaths) expect(paths).toContain(path);
  });

  it('gives every route a description', () => {
    for (const route of staticRoutes) expect(route.description).not.toBe('');
  });

  it('formats titles like usePageTitle', () => {
    expect(documentTitle({ path: '/faq', title: 'FAQ', description: 'x' })).toBe('FAQ | Materialize Learning Lab');
    expect(documentTitle({ path: '/', description: 'x' })).toBe('Materialize Learning Lab');
  });
});
