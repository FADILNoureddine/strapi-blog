import Moment from "react-moment";
import ReactMarkdown from "react-markdown";

import Seo from "../../components/seo";
import Layout from "../../components/layout";
import { useState, useEffect } from "react";

import { fetchAPI } from "../../lib/api";
import { getStrapiMedia } from "../../lib/media";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const Article = ({ article, categories, articles }) => {
  const imageUrl = getStrapiMedia(article.attributes.image);

  const router = useRouter();
  const { slug } = router.query
  const index = articles.findIndex((a) => a.attributes.slug === slug)
  const prevArticle = articles[(index - 1 + articles.length) % articles.length]
  const nextArticle = articles[(index + 1) % articles.length]
  
  const urlStrapi = "http://localhost:1337"
  const sortByDate = articles.sort((a, b) => {
    const beforeDate = a.attributes.createdAt;
    const afterDate = b.attributes.createdAt;

    return (afterDate - beforeDate ? 1 : -1)
  }) 

  const recentArticles = articles.slice(0, 4)


  const [relatedArticles, setRelatedArticles] = useState([]);
  

  useEffect(() => {
      async function fetchRelatedArticles() {
        // const res = await fetch(`http://localhost:1337/api/articles?populate[relatedArticle][populate]=data&populate[relatedArticle][populate]=image`);
        const res = await fetch(`http://localhost:1337/api/articles?populate[relatedArticle][populate]=*`);
        const relatedData = await res.json();
        setRelatedArticles(relatedData);
        
    }
    fetchRelatedArticles();
  }, [article.id]);
  
  const seo = {
    metaTitle: article.attributes.title,
    metaDescription: article.attributes.description,
    shareImage: article.attributes.image,
    article: true,
  };
  return (
    
   <>   
    <Layout categories={categories.data} />
    <div className="container">
      <div className="row">
        <div className="main-content">
          <div className="content-blog">
          <Seo seo={seo} />
            <div
              id="banner"
              className="uk-height-medium uk-flex uk-background-cover uk-light uk-padding uk-margin"
              data-src={imageUrl}
              data-srcset={imageUrl}
              data-uk-img 
              alt={article.attributes.title}
            >
              <h1>{article.attributes.title}</h1>        
            </div>
          
            <div className="uk-section">
              <div className="uk-container uk-container-small">
                <ReactMarkdown children={article.attributes.content} />
                <hr className="uk-divider" />
                  <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
                    <div>
                      {article.attributes.author.data.attributes.picture && (                        
                        <img
                          src={getStrapiMedia(
                            article.attributes.author.data.attributes.picture
                          )}
                          alt={
                            article.attributes.author.data.attributes.picture.data
                              .attributes.alternativeText
                          }
                          style={{
                            position: "static",
                            borderRadius: "20%",
                            height: 60,
                          }}
                        />
                      )}
                    </div>
                    <div className="uk-width-expand">
                      <p className="uk-margin-remove-bottom">
                        By {article.attributes.author.data.attributes.name}
                      </p>
                      <p className="uk-text-meta uk-margin-remove-top">
                        <Moment format="MMM Do YYYY">
                          {article.attributes.publishedAt}
                        </Moment>
                      </p>
                    </div>                                 
             
                  </div>
              </div>
            </div>          
          </div>
          <nav className="uk-navbar-pagination">
              <div className="uk-navbar-pagination-left">
                <div className="uk-pagination-label-left">Previous</div>              
                <div className="uk-pagination-link-left">                               
                  <Link href={`/article/${prevArticle.attributes.slug}`}>{prevArticle.attributes.title}</Link>
                </div>                                          

              </div>
              <div className="uk-navbar-pagination-right">              
                <div className="uk-pagination-label-right">Next</div>                                    
                <div className="uk-pagination-link-right">                               
                  <Link href={`/article/${nextArticle.attributes.slug}`}>{nextArticle.attributes.title}</Link>               
                </div>                   
              </div>
            </nav>
                
        </div>
        
        {/********    Sidebar    *********/}
        <div className ="sidebar">
          <div className="content-sidebar">
            <div className ="col-lg-12">
              <div className ="sidebar-item recent-posts">
                <div className ="sidebar-heading">
                  <h2>Related Posts</h2>
                </div>                
                <div className ="content">
                          
                        {relatedArticles?.data?.map(relatedarticle =>(
                          
                          relatedarticle.attributes.relatedArticle.data.length > 0 && 
                          relatedarticle.attributes.relatedArticle.data.map((article =>(
                          article.attributes.article.data.attributes.slug === slug &&
                            <>           
                              <div className="uk-simalar-post" key={article.id}>
                                  <div className="uk-simalar-post-media">                                                                    
                                    <Link href={article.attributes.slug}>  
                                      <Image id="banner_slider" 
                                          src={ urlStrapi + article.attributes.image.data.attributes.url } width={100} height={150}
                                          alt={ article.attributes.title } />                                        
                                    </Link>                    
                                </div>
                                
                                <div className="uk-simalar-post-content">
                                  <Link href={`/article/${article.attributes.slug}`} >
                                    <h4>{article.attributes.title}</h4>
                                  </Link>
                                  <span className="uk-text-meta uk-margin-remove-top">
                                      <Moment format="MMM Do YYYY">
                                        {article.attributes.createdAt}
                                      </Moment>
                                  </span>
                                </div>  
                              </div> 
                              <hr className="uk-divider-article" />     
                            </>
                          )))              
                        ))}
                      

              </div>
            </div>
          </div>  

          <div className ="col-lg-12">
            <div className ="sidebar-item categories">
              <div className ="sidebar-heading">
                <h2>Recent Posts</h2>
              </div>
              <div className ="content">           
                  {recentArticles.map((article) => (
                    <>
                      <li className="uk-recent-post" key={article.id}>

                        <div className="uk-recent-post-media">
                          <Link href={article.attributes.slug}>
                            <Image id="banner_slider" 
                                  src={ urlStrapi + article.attributes.image.data.attributes.url } 
                                  alt={ article.attributes.title } width={100} height={150} />                        
                          </Link>
                        </div>

                        <div className="uk-recent-post-content">
                          <Link href={`/article/${article.attributes.slug}`} >
                            <h4>{article.attributes.title}</h4>
                          </Link>
                          <span className="uk-text-meta uk-margin-remove-top">
                              <Moment format="MMM Do YYYY">
                                {article.attributes.createdAt}
                              </Moment>
                          </span>
                        </div>
                      </li>
                      <hr className="uk-divider-article" />
                    </> 
                  ))}      
                  
                </div>
            </div>
          </div> 
          </div>   
        </div>
      </div>
    </div>
   </> 
  );
};

export async function getStaticPaths() {
  const articlesRes = await fetchAPI("/articles", { fields: ["slug"] });

  return {
    paths: articlesRes.data.map((article) => ({
      params: {
        slug: article.attributes.slug,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articlesRes = await fetchAPI("/articles", { populate: "*" })
  const articleRes = await fetchAPI("/articles", {
    filters: {
      slug: params.slug,
    },
    populate: ["image", "category", "author.picture"],
  });
  const categoriesRes = await fetchAPI("/categories");
  

  return {
    props: { 
        articles: articlesRes.data,
        article: articleRes.data[0],
        categories: categoriesRes
    },
    revalidate: 1,
  };
}

export default Article;
