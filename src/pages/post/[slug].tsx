import * as prismic from '@prismicio/client';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }) {
  const route = useRouter();

  if (route.isFallback) {
    return <p>Carregando...</p>;
  }
  const totalTime = post.data.content.reduce((acc, time) => {
    const total = RichText.asText(time.body).split(' ');

    const min = Math.ceil(total.length / 200);
    return acc + min;
  }, 0);

  return (
    <>
      <Head>
        <title>space traveling | {post.data.title}</title>
      </Head>
      <img className={styles.banner} src={post.data.banner.url} alt="banner" />
      <main className={styles.postContainer}>
        <strong>{post.data.title}</strong>
        <div className={styles.postInfo}>
          <time>
            <FiCalendar />
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
          <span>
            <FiUser />
            {post.data.author}
          </span>

          <span>
            <FiClock />
            {totalTime} min
          </span>
        </div>
        <section className={styles.postContent}>
          {post.data.content.map(p => (
            <div key={p.heading}>
              <strong>{p.heading}</strong>
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(p.body) }}
              />
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      ...response.data,
    },
  };
  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
