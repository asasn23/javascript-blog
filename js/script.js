'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagcloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-authorcloud-link').innerHTML)
}

const opts = {
  ArticleSelector: '.post',
  TitleSelector: '.post-title',
  TitleListSelector: '.titles',
  ArticleTagsSelector: '.post-tags .list',
  ArticleAuthorsSelector: '.post-author',
  AuthorsListSelector: '.authors',
  TagsListSelector: '.tags',
  CloudClassCount: 5,
  CloudClassPrefix: 'tag-size-'
}

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  const hrefAtribute = clickedElement.getAttribute("href");
  const allArticles = document.querySelectorAll('.posts article');
  for(let singleArticle of allArticles){
    if (("#" + singleArticle.getAttribute("id")) == hrefAtribute) {
      singleArticle.classList.add('active');
    }
  }
}

function generateTitleLinks(customSelector = ''){

  const titleList = document.querySelector(opts.TitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(opts.ArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute("id");
    const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    html = html + linkHTML;
  }

  titleList.innerHTML = html;


  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

function calculateTagsParams(tags) {
  const params = {max: 0, min: 999999};

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.CloudClassCount - 1) + 1 );
  return (opts.CloudClassPrefix + classNumber);
}

function generateTags(){

  const articles = document.querySelectorAll(opts.ArticleSelector);
  let allTags = {};
  for (let article of articles) {
    const tagsWrapper = article.querySelector(opts.ArticleTagsSelector);
    tagsWrapper.innerHTML = '';
    let html = '';
    const articleTags = article.getAttribute("data-tags");
    const articleTagsArray = articleTags.split(' ');
    for (let singleTag of articleTagsArray) {
      const linkHTMLData = {id: singleTag, title: singleTag};
      const linkHtml = templates.tagLink(linkHTMLData);
      html = html + linkHtml;

      if(!allTags.hasOwnProperty(singleTag)){
        allTags[singleTag] = 1;
      } else {
        allTags[singleTag]++;
      }
    }
    tagsWrapper.innerHTML = html;
  }

  const tagList = document.querySelector(opts.TagsListSelector);
  const allTagsData = {tags: []};
  const tagsParams = calculateTagsParams(allTags);

  for (let singleTag in allTags) {
    allTagsData.tags.push({
      tag: singleTag,
      count: allTags[singleTag],
      className: calculateTagClass(allTags[singleTag], tagsParams)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const activeTagLinks = document.querySelectorAll('.post-tags .list a.active');
  for (let activeTagLink of activeTagLinks) {
    activeTagLink.classList.remove('active');
  }

  const activeTags = document.querySelectorAll('.tags a');

  for (let activeTag of activeTags) {
    activeTag.classList.remove('active');
  }

  const activeAuthors = document.querySelectorAll('.authors a');

  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }

  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }

  if (tag == 'all') {
    console.log('all');
    generateTitleLinks();
  } else {
    console.log(tag);
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
}

function addClickListenersToTags(){
  const links = document.querySelectorAll('a[href^="#tag-"]');
  for (let link of links) {
    link.addEventListener('click', tagClickHandler);
  }
}

function generateAuthors(){
  const articles = document.querySelectorAll(opts.ArticleSelector);
  const authorsList = document.querySelector(opts.AuthorsListSelector);
  authorsList.innerHTML = '';

  const allAuthorsData = {authors: []};

  let allAuthors = {};
  for (let article of articles) {
    const authorWrapper = article.querySelector(opts.ArticleAuthorsSelector);
    authorWrapper.innerHTML = '';
    const articleAuthor = article.getAttribute("data-author");
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHtml = templates.authorLink(linkHTMLData);
    authorWrapper.innerHTML = linkHtml;

    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  for (let articleAuthor in allAuthors) {
    allAuthorsData.authors.push({
      author: articleAuthor,
      count: allAuthors[articleAuthor]
    });
  }

  authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
}


function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  const hrefAuthor = clickedElement.getAttribute('href');

  const author = hrefAuthor.replace('#author-', '');

  const activeLinks = document.querySelectorAll('.post-author a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.add('active');
  }
  
  const authorLinks = document.querySelectorAll('a[href="' + hrefAuthor + '"]');

  for (let authorLink of authorLinks) {
    authorLink.classList.remove('active');
  }

  if (author == 'all') {
    generateTitleLinks();
  } else {
    generateTitleLinks('[data-author="' + author + '"]');
  }
}

function addClickListenersToAuthors(){
  const links = document.querySelectorAll('a[href^="#author-"]');
  for (let link of links) {
    link.addEventListener('click', authorClickHandler);
  }
}

generateTags();
generateAuthors();
generateTitleLinks();
addClickListenersToTags();
addClickListenersToAuthors();