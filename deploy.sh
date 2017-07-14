sudo scp -i ~/work/aws/opensupports_saas.pem opensupports_dev.zip ec2-user@ec2-52-1-218-7.compute-1.amazonaws.com:/var/www/html/opensupports_dev.zip
ssh -i ~/work/aws/opensupports_saas.pem ec2-user@ec2-52-1-218-7.compute-1.amazonaws.com "sudo unzip /var/www/html/opensupports_dev.zip -d /var/www/html; sudo rm /var/www/html/opensupports_dev.zip"
