<?php

namespace EmailReplyParser\Tests;

use EmailReplyParser\EmailReplyParser;

class EmailReplyParserTest extends TestCase
{
    public function testReadWithNullContent()
    {
        $email = EmailReplyParser::read(null);

        $this->assertInstanceOf('EmailReplyParser\Email', $email);
        $this->assertEmpty($email->getVisibleText());
    }

    public function testReadWithEmptyContent()
    {
        $email = EmailReplyParser::read('');

        $this->assertInstanceOf('EmailReplyParser\Email', $email);
        $this->assertEmpty($email->getVisibleText());
    }

    public function testParseReply()
    {
        $body = $this->getFixtures('email_2.txt');

        $this->assertEquals(<<<EMAIL
Hi,
You can list the keys for the bucket and call delete for each. Or if you
put the keys (and kept track of them in your test) you can delete them
one at a time (without incurring the cost of calling list first.)

Something like:

        String bucket = "my_bucket";
        BucketResponse bucketResponse = riakClient.listBucket(bucket);
        RiakBucketInfo bucketInfo = bucketResponse.getBucketInfo();

        for(String key : bucketInfo.getKeys()) {
            riakClient.delete(bucket, key);
        }


would do it.

See also

http://wiki.basho.com/REST-API.html#Bucket-operations

which says

"At the moment there is no straightforward way to delete an entire
Bucket. There is, however, an open ticket for the feature. To delete all
the keys in a bucket, you’ll need to delete them all individually."
EMAIL
        , EmailReplyParser::parseReply($body));
    }

    public function testParseOutSentFromIPhone()
    {
        $body = $this->getFixtures('email_iphone.txt');

        $this->assertEquals('Here is another email', EmailReplyParser::parseReply($body));
    }

    public function testParseOutSentFromBlackBerry()
    {
        $body = $this->getFixtures('email_blackberry.txt');

        $this->assertEquals('Here is another email', EmailReplyParser::parseReply($body));
    }

    public function testParseOutSendFromMultiwordMobileDevice()
    {
        $body = $this->getFixtures('email_multi_word_sent_from_my_mobile_device.txt');

        $this->assertEquals('Here is another email', EmailReplyParser::parseReply($body));
    }

    public function testDoNotParseOutSendFromInRegularSentence()
    {
        $body = $this->getFixtures('email_sent_from_my_not_signature.txt');

        $this->assertEquals(
            "Here is another email\n\nSent from my desk, is much easier then my mobile phone.",
            EmailReplyParser::parseReply($body)
        );
    }

    public function testParseOutJustTopForOutlookReply()
    {
        $body = $this->getFixtures('email_2_1.txt');

        $this->assertEquals('Outlook with a reply', EmailReplyParser::parseReply($body));
    }

    public function testRetainsBullets()
    {
        $body = $this->getFixtures('email_bullets.txt');

        $this->assertEquals(
            "test 2 this should list second\n\nand have spaces\n\nand retain this formatting\n\n\n   - how about bullets\n   - and another",
            EmailReplyParser::parseReply($body)
        );
    }

    public function testUnquotedReply()
    {
        $body = $this->getFixtures('email_unquoted_reply.txt');

        $this->assertEquals('This is my reply.', EmailReplyParser::parseReply($body));
    }

    public function testEmailThreadPreservesNewLines()
    {
        $body = $this->getFixtures('email_thread.txt');

        $fragments = EmailReplyParser::read($body)
            ->getFragments();

        $this->assertEquals(<<<EMAIL
On Nov 21, 2014, at 10:18, John Doe <john@doe123.com> wrote:

> Ok. Thanks.
>
> On Nov 21, 2014, at 9:26, Jim Beam <jim@beam123.com> wrote:
>
>>> On Nov 20, 2014, at 11:03 AM, John Doe <john@doe123.com> wrote:
>>>
>>> if you take a look at a short video from attachment, why full-typed filename does not stay in CMD+T pane?
>>> When I type last character, it is not shown anymore.
>>
>> We think we’ve tracked down the cause of this issue, write back if you see the issue after the next update. (Which will be out shortly.)
>>
>> --
>> Jim Beam – Acme Corp
>>
>
EMAIL
        , (string) $fragments[1]);
    }
}
