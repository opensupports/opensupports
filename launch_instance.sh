:: INSTALL WEBSERVER :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
sudo yum update -y
sudo su
rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-6.noarch.rpm
rpm -Uvh https://mirror.webtatic.com/yum/el6/latest.rpm
yum install -y php70w php70w-opcache php70w-cli php70w-gd php70w-intl php70w-mbstring php70w-mysql php70w-pdo php70w-soap php70w-xml php70w-xmlrpc php70w-pspell php70w-mcrypt
yum install -y aspell aspell-en cvs memcached mysql mysql-server mod22_ssl
sudo /sbin/chkconfig mysqld on
sudo /sbin/service mysqld start
sudo /sbin/chkconfig httpd on
sudo /sbin/service httpd start

:: CONFIGURE VHOSTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

sudo nano /etc/httpd/conf.d/vhosts.conf

<create log and vhost folders in html>

<VirtualHost *:80>
    ServerName localhost
    DocumentRoot "/var/www/html"
    ErrorLog "/var/www/html/logs/error_log"
    CustomLog "/var/www/html/logs/access_log" combined

    <Directory "/var/www/html">
        Options All
        AllowOverride All
    </Directory>
</VirtualHost>


ls -l /var/www
sudo groupadd www
sudo usermod -a -G www ec2-user
<exit>
<login>
groups
sudo chown -R root:www /var/www
sudo chmod 2775 /var/www
find /var/www -type d -exec sudo chmod 2775 {} +
find /var/www -type f -exec sudo chmod 0664 {} +

sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 fs-dfa92296.efs.us-east-1.amazonaws.com:/ /var/www/html