<?php

$app->get('/hello/:name', function ($name) {
  $book = RedBean::dispense('book');
  $book->title = $name;
  $book->author = 'Charles Xavier';
  $id = RedBean::store($book);

  echo $id;
});

$app->run();
