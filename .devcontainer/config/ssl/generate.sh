#!/bin/sh
# openssl ecparam -genkey -name prime256v1 -noout -out localhost.key
openssl req -new -x509 -config ./ssl.conf -key localhost.key -sha256 -days 365 -out localhost.crt -subj="/CN=localhost"
