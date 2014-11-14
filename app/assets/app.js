$(function() {
  'use strict';

  // Font Awesome Icons
  $('.tags li').prepend($('<i/>').addClass('fa fa-tag'));
  $('.repository.bitbucket').prepend($('<i/>').addClass('fa fa-bitbucket'));
  $('.repository.github').prepend($('<i/>').addClass('fa fa-github'));
  $('.coming-soon').prepend($('<span/>').addClass('coming-soon-tag'));
});