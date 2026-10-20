import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './Layout'
import { catalog } from './content/catalog'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/Layout.tsx',
    children: [
      { index: true, lazy: () => import('./pages/Home') },
      { path: 'uslugi', lazy: () => import('./pages/Catalog') },
      {
        path: 'uslugi/:dir',
        lazy: () => import('./pages/ServicePage'),
        // пре-рендер всех 10 направлений (TZ §2, SEO)
        getStaticPaths: () => catalog.map((d) => `uslugi/${d.slug}`),
      },
      {
        path: 'uslugi/:dir/:item',
        lazy: () => import('./pages/ItemPage'),
        // пре-рендер всех позиций
        getStaticPaths: () => catalog.flatMap((d) => d.items.map((i) => `uslugi/${d.slug}/${i}`)),
      },
      { path: 'kit', lazy: () => import('./pages/Kit') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
