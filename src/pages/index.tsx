import * as prismic from '@prismicio/client';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import styles from './home.module.scss';
import { useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  function hancleMorePosts(): void {
    fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(jsonData => {
        const newPosts = jsonData.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: post.data,
          };
        });
        setPosts(oldPosts => [...oldPosts, ...newPosts]);
        setNextPage(jsonData.next_page);
      });
  }
  return (
    <>
      <Head>
        <title>Spacetraveling</title>
      </Head>
      <main className={styles.contentContainer}>
        <div className={styles.hero}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <div className={styles.postInfo}>
                  <time>
                    <FiCalendar />
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </time>
                  <span>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {nextPage && (
          <button
            className={styles.morePost}
            type="button"
            onClick={hancleMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const client = getPrismicClient({});

  const response = await client.get({
    predicates: prismic.predicate.at('document.type', 'publication'),
  });

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: post.data,
    };
  });
  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: response.next_page,
      },
    },
    redirect: 60 * 30,
  };
};
