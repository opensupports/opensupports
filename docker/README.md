# Docker

### Mysql

Criando database com usuário e permissão para o host do container.

```
CREATE DATABASE opensupport;

CREATE USER 'openuser'@'192.168.1.164' IDENTIFIED BY '1q2w3e';

GRANT ALL PRIVILEGES ON opensupport.* TO 'openuser'@'192.168.1.164' IDENTIFIED BY '1q2w3e' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
