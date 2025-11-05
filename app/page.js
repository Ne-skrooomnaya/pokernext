// app/page.js

// Импортируем нашу обертку. 
// Поскольку PageWrapper не использует хуки и не содержит ssr:false, 
// нам не нужно делать app/page.js клиентским!
import PageWrapper from '../components/PageWrapper';

export default function Page() {
  return <PageWrapper />;
}

