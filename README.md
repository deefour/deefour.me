# Deefour.me

http://deefour.me - My personal website.

(c) 2013 Jason Daly (jason@deefour.me)

## Description

Deefour.me is my personal online profile; a static site running on [Amazon S3](http://aws.amazon.com/s3/) through their [static website hosting](http://docs.amazonwebservices.com/AmazonS3/latest/dev/WebsiteHosting.html) built with [Brunch](http://brunch.io/).

## Code Used

The following packages/libraries/services have been used

  - [Brunch](http://brunch.io/)
  - [Sass](http://sass-lang.com/)
  - [Compass](http://compass-style.org/)
  - [s3cmd](http://s3tools.org/s3cmd) for deploys
  - [Amazon S3](http://aws.amazon.com/s3/) for hosting
  - [CloudFlare](https://cloudflare.com) for DNS

## Installation

The following [`s3cmd`](http://s3tools.org/s3cmd) command should be run with the root of this repo as the current working directory.

```bash
s3cmd -P sync public/* s3://www.deefour.me
```

### Version 2.0.0 - August 12 2013

Removing a lot of dependencies; simplifying the design.

### Version 1.0.0 - November 09 2012

Initial project release