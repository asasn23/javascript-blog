'use strict';

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
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
      const linkHtml = '<li><a href="#tag-' + singleTag + '">' + singleTag + '</a></li>';
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
  let allTagsHtml = '';
  const tagsParams = calculateTagsParams(allTags);

  for (let singleTag in allTags) {
    const tagLinkHtml = '<li><a href="#tag-' + singleTag + '" class="' + calculateTagClass(allTags[singleTag], tagsParams) + '">' + singleTag + '</a></li>';
    allTagsHtml += tagLinkHtml;
  }
  tagList.innerHTML = allTagsHtml;
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

  let allAuthorsHtml = '';

  let allAuthors = {};
  for (let article of articles) {
    const authorWrapper = article.querySelector(opts.ArticleAuthorsSelector);
    authorWrapper.innerHTML = '';
    const articleAuthor = article.getAttribute("data-author");
    const linkHtml = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    authorWrapper.innerHTML = linkHtml;

    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }

  for (let articleAuthor in allAuthors) {
    const singleLinkHtml = '<li><a href="#author-' + articleAuthor + '"><span class="author-name">' + articleAuthor + ' (' + allAuthors[articleAuthor] + ') </span></a></li>';

    allAuthorsHtml += singleLinkHtml;
  }

  const lastLinkHtml = '<li><a href="#author-all"><span class="author-name">Show all</span></a></li>';
  allAuthorsHtml += lastLinkHtml;

  authorsList.innerHTML = allAuthorsHtml;
}


function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  const hrefAuthor = clickedElement.getAttribute('href');

  const author = hrefAuthor.replace('#author-', '');

  const activeLinks = document.querySelectorAll('.post-author a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  const authorLinks = document.querySelectorAll('a[href="' + hrefAuthor + '"]');

  for (let authorLink of authorLinks) {
    authorLink.classList.add('active');
  }

  if (author == 'all') {
    console.log('all');
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