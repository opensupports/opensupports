$agent = Mechanize.new

$apiURL = ENV['API_URL'] || 'http://localhost:8080'

def plainRequest(path, data = {}, method = 'POST')
    uri = $apiURL + path

    if method == 'POST'
        @response = $agent.post(uri, data)
    else
        @response = $agent.get(uri, data)
    end

    return @response
end

def request(path, data = {})
    uri = $apiURL + path
    response = $agent.post(uri, data)

    return JSON.parse(response.body)
end

class Database
    def initialize()
        mysqlHost = ENV['MYSQL_HOST'] || 'localhost'
        mysqlPort = ENV['MYSQL_PORT'] || '3306'
        mysqlUser = ENV['MYSQL_USER'] || 'root'
        mysqlPass = ENV['MYSQL_PASSWORD'] || ''
        @connection = Mysql2::Client.new(
            host: mysqlHost,
            username: mysqlUser,
            password: mysqlPass,
            port: mysqlPort.to_i,
            database: 'development'
        )
    end

    def close()
        @connection.close
    end

    def getRow(table, value, field = 'id')
        queryResponse = @connection.query("select * from #{table} where #{field}='#{value.to_s}'")

        return queryResponse.first
    end

    def getLastRow(table)
        queryResponse = @connection.query("select * from #{table} order by id desc limit 1")

        return queryResponse.first
    end

    def query(query_string)
        return @connection.query(query_string)
    end
end

class MailServer
    def initialize
        @smtp_server     = ENV['OPENSUPPORTS_SMTP_SERVER']
        @smtp_port       = ENV['OPENSUPPORTS_SMTP_PORT']

        @imap_server     = ENV['OPENSUPPORTS_IMAP_SERVER']
        @imap_port       = ENV['OPENSUPPORTS_IMAP_PORT']

        @admin_user      = ENV['OPENSUPPORTS_EMAIL_ADMIN_USERNAME']
        @admin_password  = ENV['OPENSUPPORTS_EMAIL_ADMIN_PASSWORD']

        @client_user     = ENV['OPENSUPPORTS_EMAIL_CLIENT_USERNAME']
        @client_password = ENV['OPENSUPPORTS_EMAIL_CLIENT_PASSWORD']

        @admin_imap = Net::IMAP.new(@imap_server, {port: @imap_port})
        @client_imap = Net::IMAP.new(@imap_server, {port: @imap_port})

        @admin_imap.authenticate('LOGIN', @admin_user, @admin_password)
        @client_imap.authenticate('LOGIN', @client_user, @client_password)

        @client_stmp = Net::SMTP.start(@smtp_server, @smtp_port, @smtp_server, @client_user, @client_password, :plain)
    end

    def clear_mails
        self.clear_admin_mails
        self.clear_client_mails
    end

    def clear_admin_mails
        @admin_imap.examine('INBOX')
        puts @admin_imap.list("", "*")

        @admin_imap.store(2, "+FLAGS", [:Deleted])
        @admin_imap.uid_search(['NOT','DELETED']).each do |uid|
            puts "deleteing #{uid}"
            @admin_imap.uid_copy(uid, "INBOX.Trash")
            @admin_imap.uid_store(uid, "+FLAGS", [:Deleted])
            puts @admin_imap.uid_fetch(uid, ['FLAGS', 'UID'])[0]
        end

        puts @admin_imap.expunge
        @admin_imap.logout
        @admin_imap.disconnect
    end

    def clear_client_mails
        @client_imap.examine('INBOX')

        @client_imap.search(['NOT','DELETED']).each do |message_id|
            @client_imap.copy(message_id, "INBOX.Trash")
            @client_imap.store(message_id, "+FLAGS", [:Deleted])
        end

        @client_imap.expunge
    end

    def send_mail(subject, text, file = nil)
        # message = MailFactory.new
        # message.to = @admin_user
        # message.from = @client_user
        # message.subject = subject
        # message.html = text
        message = <<MESSAGE_END
From: Client <#{@client_user}>
To: Support <#{@admin_user}>
Subject: #{subject}

#{text}
MESSAGE_END

        # unless file.nil?
        #     message.attach(file)
        # end

        @client_stmp.send_message(message, @client_user, @admin_user)
    end

    def check
        puts 'checking...'
        @admin_imap.examine('INBOX')
        @admin_imap.search(['NOT','DELETED']).each do |message_id|
            envelope = @admin_imap.fetch(message_id, "ENVELOPE")[0].attr["ENVELOPE"]
            # puts "#{envelope.from[0].name}: \t#{envelope.subject}"
            puts envelope.subject
        end
    end
end

# $mail_server = MailServer.new
$database = Database.new

# $mail_server.clear_mails
# $mail_server.send_mail('support message 1', 'texttexttext tex')
# $mail_server.check

$staff = {
    :email => 'admin@opensupports.com',
    :password => 'admin22'
}
