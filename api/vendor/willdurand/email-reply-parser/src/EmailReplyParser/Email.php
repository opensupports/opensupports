<?php

/**
 * This file is part of the EmailReplyParser package.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @license    MIT License
 */

namespace EmailReplyParser;

/**
 * @author William Durand <william.durand1@gmail.com>
 */
final class Email
{
    /**
     * @var Fragment[]
     */
    private $fragments;

    /**
     * @param Fragment[] $fragments
     */
    public function __construct(array $fragments = array())
    {
        $this->fragments = $fragments;
    }

    /**
     * @return Fragment[]
     */
    public function getFragments()
    {
        return $this->fragments;
    }

    /**
     * @return string
     */
    public function getVisibleText()
    {
        $visibleFragments = array_filter($this->fragments, function (Fragment $fragment) {
            return !$fragment->isHidden();
        });

        return rtrim(implode("\n", $visibleFragments));
    }
}
