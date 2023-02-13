<?php

namespace EmailReplyParser\Tests\Parser;

use EmailReplyParser\Parser\EmailParser;
use EmailReplyParser\Tests\TestCase;

class EmailParserTest extends TestCase
{
    const COMMON_FIRST_FRAGMENT = 'Fusce bibendum, quam hendrerit sagittis tempor, dui turpis tempus erat, pharetra sodales ante sem sit amet metus.
Nulla malesuada, orci non vulputate lobortis, massa felis pharetra ex, convallis consectetur ex libero eget ante.
Nam vel turpis posuere, rhoncus ligula in, venenatis orci. Duis interdum venenatis ex a rutrum.
Duis ut libero eu lectus consequat consequat ut vel lorem. Vestibulum convallis lectus urna,
et mollis ligula rutrum quis. Fusce sed odio id arcu varius aliquet nec nec nibh.';

    /**
     * @var EmailParser
     */
    private $parser;

    protected function setUp()
    {
        $this->parser = new EmailParser();
    }

    public function testReadsSimpleBody()
    {
        $email     = $this->parser->parse($this->getFixtures('email_1.txt'));
        $fragments = $email->getFragments();

        $this->assertCount(3, $fragments);

        foreach ($fragments as $r) {
            $this->assertFalse($r->isQuoted());
        }

        $this->assertFalse($fragments[0]->isSignature());
        $this->assertTrue($fragments[1]->isSignature());
        $this->assertTrue($fragments[2]->isSignature());

        $this->assertFalse($fragments[0]->isHidden());
        $this->assertTrue($fragments[1]->isHidden());
        $this->assertTrue($fragments[2]->isHidden());

        $this->assertEquals(<<<EMAIL
Hi folks

What is the best way to clear a Riak bucket of all key, values after
running a test?
I am currently using the Java HTTP API.

EMAIL
        , (string) $fragments[0]);

        $this->assertEquals("-Abhishek Kona\n\n", (string) $fragments[1]);
    }

    public function testReusesParser()
    {
        $email1 = $this->parser->parse($this->getFixtures('email_1.txt'));
        $this->assertCount(3, $email1->getFragments());

        $email2 = $this->parser->parse($this->getFixtures('email_1.txt'));
        $this->assertCount(3, $email2->getFragments());
    }

    public function testReadsTopPost()
    {
        $email     = $this->parser->parse($this->getFixtures('email_3.txt'));
        $fragments = $email->getFragments();

        $this->assertCount(5, $fragments);

        $this->assertFalse($fragments[0]->isQuoted());
        $this->assertFalse($fragments[1]->isQuoted());
        $this->assertTrue($fragments[2]->isQuoted());
        $this->assertFalse($fragments[3]->isQuoted());
        $this->assertFalse($fragments[4]->isQuoted());

        $this->assertFalse($fragments[0]->isSignature());
        $this->assertTrue($fragments[1]->isSignature());
        $this->assertFalse($fragments[2]->isSignature());
        $this->assertFalse($fragments[3]->isSignature());
        $this->assertTrue($fragments[4]->isSignature());

        $this->assertFalse($fragments[0]->isHidden());
        $this->assertTrue($fragments[1]->isHidden());
        $this->assertTrue($fragments[2]->isHidden());
        $this->assertTrue($fragments[3]->isHidden());
        $this->assertTrue($fragments[4]->isHidden());

        $this->assertRegExp('/^Oh thanks.\n\nHaving/', (string) $fragments[0]);
        $this->assertRegExp('/^-A/', (string) $fragments[1]);
        $this->assertRegExp('/^On [^\:]+\:/', (string) $fragments[2]);
        $this->assertRegExp('/^_/', (string) $fragments[4]);
    }

    public function testReadsBottomPost()
    {
        $email     = $this->parser->parse($this->getFixtures('email_2.txt'));
        $fragments = $email->getFragments();

        $this->assertCount(6, $fragments);
        $this->assertEquals('Hi,', (string) $fragments[0]);
        $this->assertRegExp('/^On [^\:]+\:/', (string) $fragments[1]);
        $this->assertRegExp('/^You can list/', (string) $fragments[2]);
        $this->assertRegExp('/^>/', (string) $fragments[3]);
        $this->assertRegExp('/^_/', (string) $fragments[5]);
    }

    public function testRecognizesDateStringAboveQuote()
    {
        $email     = $this->parser->parse($this->getFixtures('email_4.txt'));
        $fragments = $email->getFragments();

        $this->assertRegExp('/^Awesome/', (string) $fragments[0]);
        $this->assertRegExp('/^On/', (string) $fragments[1]);
        $this->assertRegExp('/Loader/', (string) $fragments[1]);
    }

    public function testDoesNotModifyInputString()
    {
        $input = 'The Quick Brown Fox Jumps Over The Lazy Dog';
        $this->parser->parse($input);

        $this->assertEquals('The Quick Brown Fox Jumps Over The Lazy Dog', $input);
    }

    public function testComplexBodyWithOnlyOneFragment()
    {
        $email = $this->parser->parse($this->getFixtures('email_5.txt'));

        $this->assertCount(1, $email->getFragments());
    }

    public function testDealsWithMultilineReplyHeaders()
    {
        $email     = $this->parser->parse($this->getFixtures('email_6.txt'));
        $fragments = $email->getFragments();

        $this->assertRegExp('/^I get/', (string) $fragments[0]);
        $this->assertRegExp('/^On/', (string) $fragments[1]);
        $this->assertRegExp('/Was this/', (string) $fragments[1]);
    }

    public function testEmailItalian()
    {
        $email     = $this->parser->parse($this->getFixtures('email_7.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailDutch()
    {
        $email     = $this->parser->parse($this->getFixtures('email_8.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailUkrainian()
    {
        $email     = $this->parser->parse($this->getFixtures('email_23.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));

        // Find flaw in original Ukrainian regex "/^[\S\s]+ (написа(л|ла|в)+|wrote)+:/msu"
        $email     = $this->parser->parse($this->getFixtures('email_23_1.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(<<<EMAIL
Fusce bibendum, quam hendrerit sagittis tempor, dui turpis tempus erat, pharetra sodales ante sem sit amet metus.
Nulla malesuada, orci non vulputate lobortis, massa felis pharetra ex, convallis consectetur ex libero eget ante.
Nam vel turpis posuere, rhoncus ligula in, venenatis orci. Duis interdum venenatis ex a rutrum.

Something wrote:
Duis ut libero eu lectus consequat consequat ut vel lorem. Vestibulum convallis lectus urna,
et mollis ligula rutrum quis. Fusce sed odio id arcu varius aliquet nec nec nibh.

EMAIL
        , (string) $fragments[0]);
    }

    public function testEmailSignatureWithEqual()
    {
        $email     = $this->parser->parse($this->getFixtures('email_9.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailHotmail()
    {
        $email     = $this->parser->parse($this->getFixtures('email_10.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailWhitespaceBeforeHeader()
    {
        $email     = $this->parser->parse($this->getFixtures('email_11.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailWithSquareBrackets()
    {
        $email     = $this->parser->parse($this->getFixtures('email_12.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailDaIntoItalian()
    {
        $email     = $this->parser->parse($this->getFixtures('email_13.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailHeaderPolish()
    {
        $email     = $this->parser->parse($this->getFixtures('email_14.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailHeaderSimplifiedChinese()
    {
        $email     = $this->parser->parse($this->getFixtures('email_22.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailSentFromMy()
    {
        $email     = $this->parser->parse($this->getFixtures('email_15.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailHeaderPolishWithDniaAndNapisala()
    {
        $email     = $this->parser->parse($this->getFixtures('email_16.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailHeaderPolishWithDateInIso8601()
    {
        $email     = $this->parser->parse($this->getFixtures('email_17.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testEmailOutlookEn()
    {
        $email     = $this->parser->parse($this->getFixtures('email_18.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testGetVisibleTextReturnsOnlyVisibleFragments()
    {
        $email = $this->parser->parse($this->getFixtures('email_2_1.txt'));
        $visibleFragments = array_filter($email->getFragments(), function ($fragment) {
            return !$fragment->isHidden();
        });

        $this->assertEquals(rtrim(implode("\n", $visibleFragments)), $email->getVisibleText());
    }

    public function testEmailGmailNo()
    {
        $email     = $this->parser->parse($this->getFixtures('email_norwegian_gmail.txt'));
        $fragments = $email->getFragments();
        $this->assertEquals(static::COMMON_FIRST_FRAGMENT, trim($fragments[0]));
    }

    public function testReadsEmailWithCorrectSignature()
    {
        $email     = $this->parser->parse($this->getFixtures('correct_sig.txt'));
        $fragments = $email->getFragments();

        $this->assertCount(2, $fragments);

        $this->assertFalse($fragments[0]->isQuoted());
        $this->assertFalse($fragments[1]->isQuoted());

        $this->assertFalse($fragments[0]->isSignature());
        $this->assertTrue($fragments[1]->isSignature());

        $this->assertFalse($fragments[0]->isHidden());
        $this->assertTrue($fragments[1]->isHidden());

        $this->assertRegExp('/^--\nrick/', (string) $fragments[1]);
    }

    public function testReadsEmailWithSignatureWithNoEmptyLineAbove()
    {
        $email     = $this->parser->parse($this->getFixtures('sig_no_empty_line.txt'));
        $fragments = $email->getFragments();

        $this->assertCount(2, $fragments);

        $this->assertFalse($fragments[0]->isQuoted());
        $this->assertFalse($fragments[1]->isQuoted());

        $this->assertFalse($fragments[0]->isSignature());
        $this->assertTrue($fragments[1]->isSignature());

        $this->assertFalse($fragments[0]->isHidden());
        $this->assertTrue($fragments[1]->isHidden());

        $this->assertRegExp('/^--\nrick/', (string) $fragments[1]);
    }

    public function testReadsEmailWithCorrectSignatureWithSpace()
    {
        // A common convention is to use "-- " as delimitor, but trailing spaces are often stripped by IDEs, so add them here
        $content = str_replace('--', '-- ', $this->getFixtures('correct_sig.txt'));

        $email     = $this->parser->parse($content);
        $fragments = $email->getFragments();

        $this->assertCount(2, $fragments);

        $this->assertFalse($fragments[0]->isQuoted());
        $this->assertFalse($fragments[1]->isQuoted());

        $this->assertFalse($fragments[0]->isSignature());
        $this->assertTrue($fragments[1]->isSignature());

        $this->assertFalse($fragments[0]->isHidden());
        $this->assertTrue($fragments[1]->isHidden());

        $this->assertRegExp('/^-- \nrick/', (string) $fragments[1]);
    }

    public function testReadsEmailWithCorrectSignatureWithNoEmptyLineWithSpace()
    {
        // A common convention is to use "-- " as delimitor, but trailing spaces are often stripped by IDEs, so add them here
        $content = str_replace('--', '-- ', $this->getFixtures('sig_no_empty_line.txt'));

        $email     = $this->parser->parse($content);
        $fragments = $email->getFragments();

        $this->assertCount(2, $fragments);

        $this->assertFalse($fragments[0]->isQuoted());
        $this->assertFalse($fragments[1]->isQuoted());

        $this->assertFalse($fragments[0]->isSignature());
        $this->assertTrue($fragments[1]->isSignature());

        $this->assertFalse($fragments[0]->isHidden());
        $this->assertTrue($fragments[1]->isHidden());

        $this->assertRegExp('/^-- \nrick/', (string) $fragments[1]);
    }

    public function testOneIsNotOn()
    {
        $email     = $this->parser->parse($this->getFixtures('email_one_is_not_on.txt'));
        $fragments = $email->getFragments();

        $this->assertRegExp('/One outstanding question/', (string) $fragments[0]);
        $this->assertRegExp('/^On Oct 1, 2012/', (string) $fragments[1]);
    }

    public function testCustomQuoteHeader()
    {
        $regex   = $this->parser->getQuoteHeadersRegex();
        $regex[] = '/^(\d{4}(.+)rta:)$/ms';
        $this->parser->setQuoteHeadersRegex($regex);

        $email = $this->parser->parse($this->getFixtures('email_custom_quote_header.txt'));

        $this->assertEquals('Thank you!', $email->getVisibleText());
    }

    public function testCustomQuoteHeader2()
    {
        $regex   = $this->parser->getQuoteHeadersRegex();
        $regex[] = '/^(From\: .+ .+test\@webdomain\.com.+)/ms';
        $this->parser->setQuoteHeadersRegex($regex);

        $email = $this->parser->parse($this->getFixtures('email_customer_quote_header_2.txt'));
        $fragments = $email->getFragments();
        $this->assertCount(2, $fragments);

        $this->assertEquals('Thank you very much.', $email->getVisibleText());
        $this->assertTrue($fragments[1]->isHidden());
        $this->assertTrue($fragments[1]->isQuoted());
    }

    public function testCustomQuoteHeader3()
    {
        $regex   = $this->parser->getQuoteHeadersRegex();
        $regex[] = '/^(De \: .+ .+someone\@yahoo.fr\.com.+)/ms';
        $this->parser->setQuoteHeadersRegex($regex);

        $email = $this->parser->parse($this->getFixtures('email_customer_quote_header_3.txt'));
        $fragments = $email->getFragments();
        $this->assertCount(2, $fragments);

        $this->assertEquals("bonjour,
je n'ai pas eu de retour sur ma précision..
merci d'avance", $email->getVisibleText());
        $this->assertTrue($fragments[1]->isHidden());
        $this->assertTrue($fragments[1]->isQuoted());
    }

    public function testVisibleTextSeemsLikeAQuoteHeader1()
    {
        $email = $this->parser->parse($this->getFixtures('email_19.txt'));
        $fragments = $email->getFragments();
        $this->assertRegexp('/^On Thursday/', (string) $fragments[0]);
        $this->assertRegexp('/^On Dec 16/', (string) $fragments[1]);
        $this->assertRegExp('/Was this/', (string) $fragments[1]);
    }

    public function testVisibleTextSeemsLikeAQuoteHeader2()
    {
        $email = $this->parser->parse($this->getFixtures('email_20.txt'));
        $fragments = $email->getFragments();
        $this->assertRegexp('/^On Thursday/', (string) $fragments[0]);
        $this->assertRegexp('/^> On May 17/', (string) $fragments[1]);
        $this->assertRegExp('/fix this parsing/', (string) $fragments[1]);
    }

    public function testEmailWithFairAmountOfContent()
    {
        $email = $this->parser->parse($this->getFixtures('email_21.txt'));
        $fragments = $email->getFragments();
        $this->assertRegexp('/^On Thursday/', (string) $fragments[0]);
    }

    /**
     * override regexp, not to match too greedy signature.
     *
     * See: https://github.com/willdurand/EmailReplyParser/pull/42
     */
    public function testCustomSignatureRegex()
    {
        $signatureRegex = '/(?:^\s*--|^\s*__|^-- $)|(?:^Sent from my (?:\s*\w+){1,3})$/s';
        $this->parser->setSignatureRegex($signatureRegex);
        $email = $this->parser->parse($this->getFixtures('email_ls-l.txt'));
        $fragments = $email->getFragments();

        // this should match two blocks, body and a signature
        $this->assertCount(2, $fragments);
        $this->assertFalse($fragments[0]->isSignature());
        $this->assertTrue($fragments[1]->isSignature());
    }

    /**
     * @dataProvider getDateFormats
     */
    public function testDateQuoteHeader($date)
    {
        $email = $this->parser->parse(str_replace('[DATE]', $date, $this->getFixtures('email_with_date_headers.txt')));

        $this->assertEquals('Thank you very much.', $email->getVisibleText());
    }

    public function getDateFormats()
    {
        return array(
            array('On Tue, 2011-03-01 at 18:02 +0530, Abhishek Kona wrote:'),
            array('2014-03-20 8:48 GMT+01:00 Rémi Dolan <do_not_reply@dolan.com>:'), // Gmail
            array('2014-03-20 20:48 GMT+01:00 Rémi Dolan <do_not_reply@dolan.com>:'), // Gmail
            array('2014-03-09 20:48 GMT+01:00 Rémi Dolan <do_not_reply@dolan.com>:'), // Gmail
            array('Le 19 mars 2014 10:37, Cédric Lombardot <cedric.lombardot@gmail.com> a écrit :'), // Gmail
            array('El 19/03/2014 11:34, Juan Pérez <juan.perez@mailcatch.com> escribió:'), // Gmail in spanish
            array('W dniu 7 stycznia 2015 15:24 użytkownik Paweł Brzoski <pbrzoski91@gmail.com> napisał:'), //Gmail in polish
            array('Le 19/03/2014 11:34, Georges du chemin a écrit :'), // Thunderbird
            array('W dniu 2015-01-07 14:23, pbrzoski91@gmail.com pisze: '), // Thunderbird in polish
            array('Den 08/06/2015 kl. 21.21 skrev Test user <test@example.com>:'), // Danish
            array('Am 25.06.2015 um 10:55 schrieb Test user:'), // German 1
            array('Test user <test@example.com> schrieb:'), // German 2
            array('在 2016年11月8日，下午2:23，Test user <test@example.com> 写道：'), // Chinese Apple Mail iPhone parsed html
            array('2016. 11. 8. 오후 12:39 Test user <test@example.com> 작성:'), // Korean Apple Mail iPhone
            array('2016/11/08 14:26、Test user <test@example.com> のメッセージ:'), // Japanese Apple Mail iPhone
            array("tir. 18. apr. 2017 kl. 13:09 skrev Test user <test@example.com>:"), // Norwegian Gmail
        );
    }

    /**
     * @dataProvider getFromHeaders
     */
    public function testFromQuoteHeader($from)
    {
        $email = $this->parser->parse(str_replace('[FROM]', $from, $this->getFixtures('email_with_from_headers.txt')));
        $fragments = $email->getFragments();
        $this->assertSame(<<<CONTENT
{$from}

My email is <foo@example.com>
CONTENT
        , $fragments[1]->getContent());
    }

    public function getFromHeaders()
    {
        return array(
            array('From: foo@example.com <foo@example.com>'),
            array('De: foo@example.com <foo@example.com>'),
            array('Van: foo@example.com <foo@example.com>'),
            array('Da: foo@example.com <foo@example.com>'),
        );
    }
}
