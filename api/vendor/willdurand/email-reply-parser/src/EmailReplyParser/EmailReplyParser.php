<?php

/**
 * This file is part of the EmailReplyParser package.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @license    MIT License
 */

namespace EmailReplyParser;

use EmailReplyParser\Parser\EmailParser;

/**
 * @author William Durand <william.durand1@gmail.com>
 */
class EmailReplyParser
{
    /**
     * @param string $text An email as text.
     *
     * @return Email
     */
    public static function read($text)
    {
        $parser = new EmailParser();

        return $parser->parse($text);
    }

    /**
     * @param string $text An email as text.
     *
     * @return string
     */
    public static function parseReply($text)
    {
        return static::read($text)->getVisibleText();
    }
}
