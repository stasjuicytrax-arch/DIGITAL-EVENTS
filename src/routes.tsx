import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from './Layout'
import { RouteError } from './pages/RouteError'
import { catalog } from './content/catalog'

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/Layout.tsx',
    // ошибки загрузки чанков и прочие сбои маршрутов — своя страница вместо «Unexpected Application Error»
    errorElement: <RouteError />,
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
      { path: 'portfolio', lazy: () => import('./pages/Portfolio') },
      { path: 'about', lazy: () => import('./pages/About') },
      { path: 'contacts', lazy: () => import('./pages/Contacts') },
      { path: 'kit', lazy: () => import('./pages/Kit') },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
