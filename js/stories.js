"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">

      <span>
      <i class="far fa-star"></i>
      </span>

        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}







async function submitStoryToPage() {
  const storyAuthor = $('#addStoryAuthor').val()
  const storyTitle = $('#addStoryTitle').val()
  const storyUrl = $('#addStoryUrl').val()

  // console.log({ 'author': storyAuthor, 'title': storyTitle, 'url': storyUrl })

  const submittedStory = await storyList.addStory(currentUser, { title: storyTitle, author: storyAuthor, url: storyUrl })

  // console.log(submittedStory)

  const $storyOl = $('#all-stories-list')
  const hostname = submittedStory.getHostName()

  console.log('test1')

  $storyOl.add(`<li id='${submittedStory.storyId}'>
  ::marker
  <a href='${submittedStory.url}' target='a_blank' class='story-link'> ${submittedStory.title} </a>
  <small class='story-hostname'>${hostname}</small>
  <small class='story-author'>by ${submittedStory.author}</small>
  <small class='story-user'>posted by ${submittedStory.username}</small>
  </li>`)

  console.log('test2')
}

$('#submitButton').on('click', function (evt) {
  evt.preventDefault();
  submitStoryToPage();

  $('#submitForm').hide()
  $('#addStoryAuthor').val('')
  $('#addStoryTitle').val('')
  $('#addStoryUrl').val('')
}
)

function generateFavoritesMarkup(user) {
  $allStoriesList.empty();


  const favArray = user.favorites

  for (let favStory of favArray) {
    let $story = generateStoryMarkup(favStory);

    $allStoriesList.append($story)
  }
}

$('#nav-favorites').on('click', function () {
  generateFavoritesMarkup(currentUser)
})

