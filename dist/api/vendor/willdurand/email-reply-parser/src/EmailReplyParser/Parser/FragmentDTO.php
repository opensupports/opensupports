<?php

/**
 * This file is part of the EmailReplyParser package.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @license    MIT License
 */

namespace EmailReplyParser\Parser;

/**
 * @author William Durand <william.durand1@gmail.com>
 */
class FragmentDTO
{
    /**
     * @var string[]
     */
    public $lines = array();

    /**
     * @var boolean
     */
    public $isHidden = false;

    /**
     * @var boolean
     */
    public $isSignature = false;

    /**
     * @var boolean
     */
    public $isQuoted = false;
}
