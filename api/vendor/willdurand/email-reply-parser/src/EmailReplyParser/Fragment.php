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
final class Fragment
{
    /**
     * @var string
     */
    private $content;

    /**
     * @var boolean
     */
    private $isHidden;

    /**
     * @var boolean
     */
    private $isSignature;

    /**
     * @var boolean
     */
    private $isQuoted;

    /**
     * @param string  $content
     * @param boolean $isHidden
     * @param boolean $isSignature
     * @param boolean $isQuoted
     */
    public function __construct($content, $isHidden, $isSignature, $isQuoted)
    {
        $this->content     = $content;
        $this->isHidden    = $isHidden;
        $this->isSignature = $isSignature;
        $this->isQuoted    = $isQuoted;
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @return boolean
     */
    public function isHidden()
    {
        return $this->isHidden;
    }

    /**
     * @return boolean
     */
    public function isSignature()
    {
        return $this->isSignature;
    }

    /**
     * @return boolean
     */
    public function isQuoted()
    {
        return $this->isQuoted;
    }

    /**
     * @return boolean
     */
    public function isEmpty()
    {
        return '' === str_replace("\n", '', $this->getContent());
    }

    public function __toString()
    {
        return $this->getContent();
    }
}
