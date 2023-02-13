EmailReplyParser
================

[![Build
Status](https://secure.travis-ci.org/willdurand/EmailReplyParser.png)](http://travis-ci.org/willdurand/EmailReplyParser)
[![Total
Downloads](https://poser.pugx.org/willdurand/email-reply-parser/downloads.png)](https://packagist.org/packages/willdurand/email-reply-parser)
[![Latest Stable
Version](https://poser.pugx.org/willdurand/email-reply-parser/v/stable.png)](https://packagist.org/packages/willdurand/email-reply-parser)
![PHP7 ready](https://img.shields.io/badge/PHP7-ready-green.svg)

**EmailReplyParser** is a PHP library for parsing plain text email content,
based on GitHub's [email_reply_parser](http://github.com/github/email_reply_parser)
library written in Ruby.


Installation
------------

The recommended way to install EmailReplyParser is through
[Composer](http://getcomposer.org/):

``` shell
composer require willdurand/email-reply-parser
```

Usage
-----

Instantiate an `EmailParser` object and parse your email:

``` php
<?php

use EmailReplyParser\Parser\EmailParser;

$email = (new EmailParser())->parse($emailContent);
```

You get an `Email` object that contains a set of `Fragment` objects. The `Email`
class exposes two methods:

* `getFragments()`: returns all fragments;
* `getVisibleText()`: returns a string which represents the content considered
  as "visible".

The `Fragment` represents a part of the full email content, and has the
following API:

``` php
<?php

$fragment = current($email->getFragments());

$fragment->getContent();

$fragment->isSignature();

$fragment->isQuoted();

$fragment->isHidden();

$fragment->isEmpty();
```

Alternatively, you can rely on the `EmailReplyParser` to either parse an email
or get its visible content in a single line of code:

``` php
$email = \EmailReplyParser\EmailReplyParser::read($emailContent);

$visibleText = \EmailReplyParser\EmailReplyParser::parseReply($emailContent);
```


Known Issues
------------

### Quoted Headers

Quoted headers aren't picked up if there's an extra line break:

    On <date>, <author> wrote:

    > blah

Also, they're not picked up if the email client breaks it up into
multiple lines.  GMail breaks up any lines over 80 characters for you.

    On <date>, <author>
    wrote:
    > blah

The above `On ....wrote:` can be cleaned up with the following regex:

``` php
$fragment_without_date_author = preg_replace(
    '/\nOn(.*?)wrote:(.*?)$/si',
    '',
    $fragment->getContent()
);
```

Note though that we're search for "on" and "wrote".  Therefore, it won't work
with other languages.

Possible solution: Remove "reply@reply.github.com" lines...

### Weird Signatures

Lines starting with `-` or `_` sometimes mark the beginning of
signatures:

    Hello

    --
    Rick

Not everyone follows this convention:

    Hello

    Mr Rick Olson
    Galactic President Superstar Mc Awesomeville
    GitHub

    **********************DISCLAIMER***********************************
    * Note: blah blah blah                                            *
    **********************DISCLAIMER***********************************



### Strange Quoting

Apparently, prefixing lines with `>` isn't universal either:

    Hello

    --
    Rick

    ________________________________________
    From: Bob [reply@reply.github.com]
    Sent: Monday, March 14, 2011 6:16 PM
    To: Rick


Unit Tests
----------

Setup the test suite using Composer:

    $ composer install

Run it using PHPUnit:

    $ phpunit


Contributing
------------

See CONTRIBUTING file.


Credits
-------

* GitHub
* William Durand <william.durand1@gmail.com>


License
-------

EmailReplyParser is released under the MIT License. See the bundled LICENSE
file for details.
