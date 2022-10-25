import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';
import Link from 'next/link';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <div>
            <Link href={'/post'}>
              <h1>Como utilizar Hooks1</h1>
            </Link>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <section>
              <time>
                <img src="/images/calendar.svg" alt="iconCalendar" />
                15 mar 2021
              </time>
              <span>
                <img src="/images/user.svg" alt="iconUser" />
                Jose da Silva
              </span>
            </section>
          </div>
          <div>
            <h1>Como utilizar Hooks2</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <section>
              <img src="/images/calendar.svg" alt="iconCalendar" />
              <time>15 mar 2021</time>
              <span>
                <img src="/images/user.svg" alt="iconUser" />
                Jose da Silva
              </span>
            </section>
          </div>
          <div>
            <h1>Como utilizar Hooks3</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <section>
              <time>
                <img src="/images/calendar.svg" alt="iconCalendar" />
                15 mar 2021
              </time>
              <span>
                <img src="/images/user.svg" alt="iconUser" />
                Jose da Silva
              </span>
            </section>
          </div>
        </section>
        <a href="">Carregar mais posts</a>
      </main>
    </>
  );
}

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  /* const postsResponse = await prismic.getByType();

  const post = {
    slug,
    title: RichText.asText(postsResponse.data.title),
    content: RichText.asHtml(postsResponse.data.content.splice(0, 3)),
    updateAt: new Date(postsResponse.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30,
  };
*/
};
